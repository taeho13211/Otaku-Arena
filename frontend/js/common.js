const ROOM_KEY = "otakuArenaRoom";
const VOTE_KEY = "otakuArenaVote";

window.OtakuArena = {
  getRoom() {
    return JSON.parse(localStorage.getItem(ROOM_KEY) || "null");
  },
  saveRoom(room) {
    localStorage.setItem(ROOM_KEY, JSON.stringify(room));
    localStorage.removeItem(VOTE_KEY);
  },
  getVote() {
    return JSON.parse(localStorage.getItem(VOTE_KEY) || "null");
  },
  saveVote(vote) {
    localStorage.setItem(VOTE_KEY, JSON.stringify(vote));
  },
  escapeText(value) {
    const span = document.createElement("span");
    span.textContent = value;
    return span.innerHTML;
  },
};
