"use strict";
// Shared socket and room types define the realtime contract without introducing business logic.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantRole = void 0;
const events_1 = require("../socket/events/events");
var ParticipantRole;
(function (ParticipantRole) {
    ParticipantRole["RECORDER"] = "RECORDER";
    ParticipantRole["OPERATOR"] = "OPERATOR";
    ParticipantRole["COMMENTER"] = "COMMENTER";
})(ParticipantRole || (exports.ParticipantRole = ParticipantRole = {}));
