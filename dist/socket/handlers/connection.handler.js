"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConnectionHandler = registerConnectionHandler;
const events_1 = require("../events/events");
// Socket connection wiring lives here so future room and role logic stays isolated from server bootstrap.
function registerConnectionHandler(io) {
    io.on("connection", (socket) => {
        // TODO: attach room lifecycle, role validation, and domain event listeners.
        void socket;
        socket.on(events_1.SOCKET_EVENTS.CREATE_ROOM, () => {
            // TODO: implement room creation flow.
        });
        socket.on(events_1.SOCKET_EVENTS.JOIN_ROOM, () => {
            // TODO: implement room join flow.
        });
        socket.on(events_1.SOCKET_EVENTS.SHOW_PRODUCT, () => {
            // TODO: implement product broadcast flow.
        });
        socket.on(events_1.SOCKET_EVENTS.START_DISCOUNT, () => {
            // TODO: implement discount broadcast flow.
        });
        socket.on(events_1.SOCKET_EVENTS.SHOW_COMMENT, () => {
            // TODO: implement comment broadcast flow.
        });
    });
}
