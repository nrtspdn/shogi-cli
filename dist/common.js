"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colourText = void 0;
function colourText(text, colour) {
    return `\x1b[${colour.value}m${text}\x1b[0m`;
}
exports.colourText = colourText;
