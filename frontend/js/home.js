const room = window.OtakuArena.getRoom();
const emptyState = document.querySelector("#empty-state");
const roomList = document.querySelector("#room-list");

document.querySelector("#room-count").textContent = room ? "1개" : "0개";
emptyState.hidden = Boolean(room);

if (room) {
  const { escapeText } = window.OtakuArena;
  roomList.innerHTML = `
    <article class="room-item">
      <div>
        <h3>${escapeText(room.topic)}</h3>
        <p>${escapeText(room.a)} <strong>VS</strong> ${escapeText(room.b)}</p>
        <div class="room-meta"><span class="live-badge">LIVE</span><span>0명 참여 중</span></div>
      </div>
      <a class="button button-dark" href="./debate.html">입장하기</a>
    </article>`;
}
