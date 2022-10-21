"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
class Player {
    constructor(name, colour) {
        this.capturedPieces = [];
        this.name = name;
        this.colour = colour;
    }
    toString() {
        return (0, common_1.colourText)(this.name, this.colour);
    }
}
exports.default = Player;
