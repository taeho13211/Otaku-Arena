const API_BASE_URL = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "요청을 처리하지 못했습니다.");
  }

  return data;
}

window.OtakuArenaApi = {
  async getRooms() {
    const data = await request("/rooms");
    return data.rooms ?? data;
  },

  createRoom(room) {
    return request("/rooms", {
      method: "POST",
      body: JSON.stringify(room),
    });
  },

  getRoom(roomId) {
    return request(`/rooms/${encodeURIComponent(roomId)}`);
  },

  vote(roomId, candidate) {
    return request(`/rooms/${encodeURIComponent(roomId)}/votes`, {
      method: "POST",
      body: JSON.stringify({ candidate }),
    });
  },

  login(credentials) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  signup(account) {
    return request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(account),
    });
  },
};
