import { WebSocket } from "ws";
import type { WebSocketServer } from "ws";
import type { WsMessage } from "./WsMessage";

export const broadcast = (
  wss: WebSocketServer,
  requester: WebSocket,
  message: WsMessage<unknown>,
  delayMs = 10,
) => {
  const raw = JSON.stringify(message);
  const clients = [...wss.clients].sort((a, b) => {
    if (a === requester) return -1;
    if (b === requester) return 1;
    return 0;
  });

  clients.forEach((client, i) => {
    setTimeout(() => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(raw);
      }
    }, i * delayMs);
  });
};