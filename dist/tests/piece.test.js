"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colour_1 = require("../colour");
const piece_1 = require("../piece");
test('Pawn must promote when in the last row', () => {
    const red = new piece_1.Pawn(colour_1.RED);
    expect(red.mustPromote(0, 5)).toBe(true);
    const blue = new piece_1.Pawn(colour_1.BLUE);
    expect(blue.mustPromote(8, 5)).toBe(true);
});
test('Pawn promotes to PromotedPawn', () => {
    const pawn = new piece_1.Pawn(colour_1.RED);
    expect(pawn.promotedPiece().name).toBe('と');
});
test('apple stuff', () => {
    expect((0, piece_1.shareApples)(10, 1)).toBe(10);
    expect((0, piece_1.shareApples)(10, 3)).toBe(3);
    expect((0, piece_1.shareApples)(2, 3)).toBe(0);
    expect((0, piece_1.shareApples)(2, 0)).toBe(0);
});
