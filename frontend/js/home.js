const emptyState = document.querySelector("#empty-state");
const roomList = document.querySelector("#room-list");
const roomCount = document.querySelector("#room-count");

loadRooms();

async function loadRooms() {
  roomList.innerHTML = '<p class="loading-state">토론 목록을 불러오는 중입니다.</p>';

  try {
    const rooms = await window.OtakuArenaApi.getRooms();
    roomCount.textContent = `${rooms.length}개`;
    emptyState.hidden = rooms.length > 0;
    roomList.innerHTML = rooms.map(createRoomCard).join("");
  } catch (error) {
    emptyState.hidden = true;
    roomCount.textContent = "-";
    roomList.innerHTML = `<p class="loading-state">${window.OtakuArena.escapeText(error.message)}</p>`;
  }
}

function createRoomCard(room) {
  const { escapeText } = window.OtakuArena;
  const candidateA = room.candidateA ?? room.a;
  const candidateB = room.candidateB ?? room.b;

  return `
    <article class="room-item">
      <div>
        <h3>${escapeText(room.topic)}</h3>
        <p>${escapeText(candidateA)} <strong>VS</strong> ${escapeText(candidateB)}</p>
        <div class="room-meta"><span class="live-badge">LIVE</span><span>${room.participantCount ?? 0}명 참여 중</span></div>
      </div>
      <a class="button button-dark" href="./debate.html?roomId=${encodeURIComponent(room.id)}">입장하기</a>
    </article>`;
}
