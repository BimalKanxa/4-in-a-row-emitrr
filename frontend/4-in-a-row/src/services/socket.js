let socket;

export function connectSocket(onMessage) {
  socket = new WebSocket(import.meta.env.VITE_WS_URL);

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  socket.onerror = (err) => {
    console.error("WebSocket error", err);
  };
}

export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}
