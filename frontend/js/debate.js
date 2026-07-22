const room = window.OtakuArena.getRoom();

if (!room) {
  window.location.replace("./index.html");
} else {
  startDebatePage(room);
}

function startDebatePage(activeRoom) {
  let voteState = window.OtakuArena.getVote() || {
    currentVote: null,
    persuaded: 0,
    votes: { a: 0, b: 0 },
  };

  fillRoomText(activeRoom);
  renderVote();

  if (!voteState.currentVote) {
    document.querySelector("#pre-vote-modal").hidden = false;
  }

  document.querySelectorAll("[data-pre-vote]").forEach((button) => {
    button.addEventListener("click", () => {
      voteState.currentVote = button.dataset.preVote;
      voteState.votes[voteState.currentVote] += 1;
      window.OtakuArena.saveVote(voteState);
      document.querySelector("#pre-vote-modal").hidden = true;
      renderVote();
    });
  });

  document.querySelectorAll("[data-vote]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextVote = button.dataset.vote;
      if (!voteState.currentVote || nextVote === voteState.currentVote) return;
      voteState.votes[voteState.currentVote] -= 1;
      voteState.votes[nextVote] += 1;
      voteState.currentVote = nextVote;
      voteState.persuaded += 1;
      window.OtakuArena.saveVote(voteState);
      renderVote();
    });
  });

  document.querySelector("#chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#message-input");
    const text = input.value.trim();
    if (!text) return;

    const message = document.createElement("div");
    message.className = "message";
    message.innerHTML = `<span class="team-dot ${voteState.currentVote === "b" ? "red" : ""}"></span><div><strong>나</strong><p></p></div><time>방금</time>`;
    message.querySelector("p").textContent = text;
    document.querySelector("#messages").append(message);
    message.scrollIntoView({ behavior: "smooth" });
    input.value = "";
  });

  function renderVote() {
    const total = voteState.votes.a + voteState.votes.b;
    const percentA = total ? Math.round((voteState.votes.a / total) * 100) : 50;
    document.querySelector("#percent-a").textContent = `${percentA}%`;
    document.querySelector("#percent-b").textContent = `${100 - percentA}%`;
    document.querySelector("#total-votes").textContent = `${total}표`;
    document.querySelector("#persuaded-count").textContent = voteState.persuaded;
    document.querySelectorAll("[data-vote]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.vote === voteState.currentVote);
    });
  }
}

function fillRoomText(activeRoom) {
  document.querySelector("#room-topic").textContent = activeRoom.topic;
  document.querySelector("#room-description").textContent = activeRoom.description || "두 캐릭터에 대한 의견을 나눠보세요.";
  document.querySelector("#room-candidate-a").textContent = activeRoom.a;
  document.querySelector("#room-candidate-b").textContent = activeRoom.b;
  document.querySelector("#vote-name-a").textContent = activeRoom.a;
  document.querySelector("#vote-name-b").textContent = activeRoom.b;
  document.querySelector("#pre-name-a").textContent = activeRoom.a;
  document.querySelector("#pre-name-b").textContent = activeRoom.b;
  document.querySelector("#initial-a").textContent = activeRoom.a.charAt(0);
  document.querySelector("#initial-b").textContent = activeRoom.b.charAt(0);
}
