const roomId = new URLSearchParams(window.location.search).get("roomId");
const currentUser = getCurrentUser();
const chatForm = document.querySelector("#chat-form");
const messageInput = document.querySelector("#message-input");
const messages = document.querySelector("#messages");
const chatStatus = document.querySelector("#chat-status");
let room = null;
let currentVote = null;
let socket = null;

if (!roomId) {
  window.location.replace("./index.html");
} else {
  loadRoom();
  connectChat();
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser"));
  } catch {
    return null;
  }
}

function connectChat() {
  if (typeof io !== "function") {
    setChatStatus("연결 실패", "error");
    setChatEnabled(false, "채팅 모듈을 불러오지 못했습니다.");
    return;
  }

  socket = io();

  socket.on("connect", () => {
    socket.emit("join-room", roomId);
    setChatStatus("연결됨", "connected");
    setChatEnabled(Boolean(currentUser));

    if (!currentUser) {
      appendSystemMessage("채팅을 이용하려면 로그인해주세요.");
    }
  });

  socket.on("receive-message", (message) => {
    appendChatMessage(message);
  });

  socket.on("chat-error", (error) => {
    appendSystemMessage(error?.message || "메시지를 보내지 못했습니다.", true);
  });

  socket.on("disconnect", () => {
    setChatStatus("재연결 중", "waiting");
    setChatEnabled(false, "서버에 다시 연결하는 중입니다.");
  });

  socket.on("connect_error", () => {
    setChatStatus("연결 실패", "error");
    setChatEnabled(false, "채팅 서버에 연결할 수 없습니다.");
  });
}

function setChatStatus(text, state) {
  chatStatus.textContent = text;
  chatStatus.dataset.state = state;
}

function setChatEnabled(enabled, placeholder = "의견을 입력하세요") {
  messageInput.disabled = !enabled;
  chatForm.querySelector('button[type="submit"]').disabled = !enabled;
  messageInput.placeholder = enabled
    ? "의견을 입력하세요"
    : currentUser
      ? placeholder
      : "로그인 후 채팅할 수 있습니다.";
}

async function loadRoom() {
  try {
    room = await window.OtakuArenaApi.getRoom(roomId);
    currentVote = room.currentVote ?? null;
    fillRoomText();
    renderVote(room);
    document.querySelector("#pre-vote-modal").hidden = Boolean(currentVote);
  } catch (error) {
    document.querySelector("#room-topic").textContent = "토론방을 불러오지 못했습니다.";
    document.querySelector("#room-description").textContent = error.message;
  }
}

document.querySelectorAll("[data-pre-vote]").forEach((button) => {
  button.addEventListener("click", async () => {
    const succeeded = await submitVote(button.dataset.preVote);
    if (succeeded) document.querySelector("#pre-vote-modal").hidden = true;
  });
});

document.querySelectorAll("[data-vote]").forEach((button) => {
  button.addEventListener("click", () => submitVote(button.dataset.vote));
});

async function submitVote(candidate) {
  if (!room || candidate === currentVote) return;
  const voteError = document.querySelector("#vote-error");
  voteError.textContent = "";

  try {
    const result = await window.OtakuArenaApi.vote(roomId, candidate);
    currentVote = result.currentVote ?? candidate;
    room = { ...room, ...result };
    renderVote(room);
    return true;
  } catch (error) {
    voteError.textContent = error.message;
    return false;
  }
}

function fillRoomText() {
  const candidateA = room.candidateA ?? room.a;
  const candidateB = room.candidateB ?? room.b;
  document.querySelector("#room-topic").textContent = room.topic;
  document.querySelector("#room-description").textContent = room.description || "두 캐릭터에 대한 의견을 나눠보세요.";
  document.querySelector("#room-candidate-a").textContent = candidateA;
  document.querySelector("#room-candidate-b").textContent = candidateB;
  document.querySelector("#vote-name-a").textContent = candidateA;
  document.querySelector("#vote-name-b").textContent = candidateB;
  document.querySelector("#pre-name-a").textContent = candidateA;
  document.querySelector("#pre-name-b").textContent = candidateB;
  document.querySelector("#initial-a").textContent = candidateA.charAt(0);
  document.querySelector("#initial-b").textContent = candidateB.charAt(0);
}

function renderVote(data) {
  const votesA = data.votes?.a ?? data.voteCountA ?? 0;
  const votesB = data.votes?.b ?? data.voteCountB ?? 0;
  const total = votesA + votesB;
  const percentA = total ? Math.round((votesA / total) * 100) : 50;
  document.querySelector("#percent-a").textContent = `${percentA}%`;
  document.querySelector("#percent-b").textContent = `${100 - percentA}%`;
  document.querySelector("#total-votes").textContent = `${total}표`;
  document.querySelector("#persuaded-count").textContent = data.persuadedCount ?? 0;
  document.querySelectorAll("[data-vote]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.vote === currentVote);
  });
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();

  if (!currentUser) {
    appendSystemMessage("채팅을 이용하려면 로그인해주세요.", true);
    return;
  }

  if (!socket?.connected) {
    appendSystemMessage("채팅 서버에 연결하는 중입니다.", true);
    return;
  }

  if (!text) return;

  socket.emit("send-message", {
    roomId,
    userId: currentUser.id,
    nickname: currentUser.nickname,
    text,
  });

  messageInput.value = "";
});

function appendChatMessage(chatMessage) {
  const isMine = String(chatMessage.userId) === String(currentUser?.id);
  const message = document.createElement("div");
  const teamClass = isMine
    ? currentVote === "b"
      ? "red"
      : ""
    : "neutral";

  message.className = `message${isMine ? " is-mine" : ""}`;

  const teamDot = document.createElement("span");
  teamDot.className = `team-dot ${teamClass}`.trim();

  const content = document.createElement("div");
  const author = document.createElement("strong");
  const text = document.createElement("p");
  author.textContent = isMine ? "나" : chatMessage.nickname;
  text.textContent = chatMessage.text;
  content.append(author, text);

  const time = document.createElement("time");
  time.dateTime = chatMessage.createdAt;
  time.textContent = formatMessageTime(chatMessage.createdAt);

  message.append(teamDot, content, time);
  messages.append(message);
  message.scrollIntoView({ behavior: "smooth", block: "end" });
}

function appendSystemMessage(text, isError = false) {
  const notice = document.createElement("div");
  notice.className = `system-message${isError ? " is-error" : ""}`;
  notice.textContent = text;
  messages.append(notice);
  notice.scrollIntoView({ behavior: "smooth", block: "end" });
}

function formatMessageTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "방금";

  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
