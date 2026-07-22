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

  if (response.status === 204) {
    return null;
  }

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        `서버가 JSON이 아닌 응답을 보냈습니다. 접속 주소와 서버 상태를 확인해주세요. (${response.status})`,
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `요청을 처리하지 못했습니다. (${response.status})`,
    );
  }

  if (!responseText) {
    throw new Error(
      "서버의 응답이 비어 있습니다. 반드시 Node 서버 주소로 접속해주세요.",
    );
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
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
      throw new Error("로그인이 필요합니다.");
    }

    return request(`/rooms/${encodeURIComponent(roomId)}/votes`, {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        candidate,
      }),
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
