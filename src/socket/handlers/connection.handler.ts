import type { Server, Socket } from "socket.io";

import { SOCKET_EVENTS } from "../events/events";

// Socket connection wiring lives here so future room and role logic stays isolated from server bootstrap.
export function registerConnectionHandler(io: Server): void {
  io.on("connection", (socket: Socket) => {
    // TODO: attach room lifecycle, role validation, and domain event listeners.
    void socket;

    socket.on(SOCKET_EVENTS.CREATE_ROOM, () => {
      // TODO: implement room creation flow.
    });

    socket.on(SOCKET_EVENTS.JOIN_ROOM, () => {
      // TODO: implement room join flow.
    });

    socket.on(SOCKET_EVENTS.SHOW_PRODUCT, () => {
      // TODO: implement product broadcast flow.
    });

    socket.on(SOCKET_EVENTS.START_DISCOUNT, () => {
      // TODO: implement discount broadcast flow.
    });

    socket.on(SOCKET_EVENTS.SHOW_COMMENT, () => {
      // TODO: implement comment broadcast flow.
    });
  });
}
