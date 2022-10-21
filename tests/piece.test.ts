import { BLUE, RED } from "../colour";
import { Pawn, shareApples } from "../piece";

test('Pawn must promote when in the last row', () => {
    const red = new Pawn(RED);
    expect(red.mustPromote(0, 5)).toBe(true);
    const blue = new Pawn(BLUE);
    expect(blue.mustPromote(8, 5)).toBe(true);
});

test('Pawn promotes to PromotedPawn', () => {
    const pawn = new Pawn(RED);
    expect(pawn.promotedPiece().name).toBe('と');
});

test('apple stuff', () => {
    expect(shareApples(10, 1)).toBe(10);
    expect(shareApples(10, 3)).toBe(3);
    expect(shareApples(2, 3)).toBe(0);
    expect(shareApples(2, 0)).toBe(0);
});
