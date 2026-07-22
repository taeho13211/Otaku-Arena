const roomId = new URLSearchParams(window.location.search).get("roomId");
let room = null;
let currentVote = null;

if (!roomId) {
  window.location.replace("./index.html");
} else {
  loadRoom();
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

document.querySelector("#chat-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#message-input");
  const text = input.value.trim();
  if (!text) return;
  const message = document.createElement("div");
  message.className = "message";
  message.innerHTML = `<span class="team-dot ${currentVote === "b" ? "red" : ""}"></span><div><strong>나</strong><p></p></div><time>방금</time>`;
  message.querySelector("p").textContent = text;
  document.querySelector("#messages").append(message);
  message.scrollIntoView({ behavior: "smooth" });
  input.value = "";
});
