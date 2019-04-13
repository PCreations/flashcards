"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerFactory = (data = {}) => (Object.assign({ ofId(anId) {
        return PlayerFactory({ id: anId });
    } }, data));
exports.Player = PlayerFactory();
//# sourceMappingURL=player.js.map