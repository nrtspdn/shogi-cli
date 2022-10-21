"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colour_1 = require("./colour");
const piece_1 = require("./piece");
const player_1 = __importDefault(require("./player"));
class Board {
    constructor() {
        this.gameOver = false;
        this.red = new player_1.default('Red', colour_1.RED);
        this.blue = new player_1.default('Blue', colour_1.BLUE);
        this.currentPlayer = this.blue;
        this.pieces = [];
        for (let y = 0; y < 9; y++) {
            this.pieces[y] = [];
            for (let x = 0; x < 9; x++) {
                if (y === 2) {
                    this.pieces[y][x] = new piece_1.Pawn(colour_1.BLUE);
                }
                else if (y === 6) {
                    this.pieces[y][x] = new piece_1.Pawn(colour_1.RED);
                }
                else {
                    this.pieces[y][x] = new piece_1.Empty();
                }
            }
        }
        this.pieces[0] = [new piece_1.Lance(colour_1.BLUE), new piece_1.Knight(colour_1.BLUE), new piece_1.Silver(colour_1.BLUE), new piece_1.Gold(colour_1.BLUE), new piece_1.King(colour_1.BLUE), new piece_1.Gold(colour_1.BLUE), new piece_1.Silver(colour_1.BLUE), new piece_1.Knight(colour_1.BLUE), new piece_1.Lance(colour_1.BLUE)];
        this.pieces[1][1] = new piece_1.Bishop(colour_1.BLUE);
        this.pieces[1][7] = new piece_1.Rook(colour_1.BLUE);
        this.pieces[7][1] = new piece_1.Rook(colour_1.RED);
        this.pieces[7][7] = new piece_1.Bishop(colour_1.RED);
        this.pieces[8] = [new piece_1.Lance(colour_1.RED), new piece_1.Knight(colour_1.RED), new piece_1.Silver(colour_1.RED), new piece_1.Gold(colour_1.RED), new piece_1.King(colour_1.RED), new piece_1.Gold(colour_1.RED), new piece_1.Silver(colour_1.RED), new piece_1.Knight(colour_1.RED), new piece_1.Lance(colour_1.RED)];
    }
    at(arg1, arg2) {
        let row, col;
        if (arg2 !== undefined) {
            row = arg1;
            col = arg2;
        }
        else {
            [row, col] = arg1;
        }
        if (col === 9) { // Captured piece
            return this.currentPlayer.capturedPieces[row];
        }
        return this.pieces[row][col];
    }
    getValidMoves(row, col) {
        const target = this.at(row, col);
        if (col === 9) { // Captured piece
            const moves = [];
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (this.pieces[r][c].isEmpty() && target.canDropAt(this, r, c)) {
                        moves.push([r, c]);
                    }
                }
            }
            return moves;
        }
        return target.getValidMoves(this, row, col);
    }
    movePiece(srcRow, srcCol, dstRow, dstCol) {
        const source = this.at(srcRow, srcCol);
        const target = this.pieces[dstRow][dstCol];
        if (!target.isEmpty()) {
            target.colour = this.currentPlayer.colour;
            this.currentPlayer.capturedPieces.push(target.unpromotedPiece());
            if (target instanceof piece_1.King) {
                this.gameOver = true;
            }
        }
        this.pieces[dstRow][dstCol] = source;
        if (srcCol === 9) { // Captured piece
            this.currentPlayer.capturedPieces.splice(srcRow, 1); // Remove captured piece from list
        }
        else {
            this.pieces[srcRow][srcCol] = new piece_1.Empty();
        }
    }
    mustPromote(row, col) {
        return this.pieces[row][col].mustPromote(row, col);
    }
    print() {
        console.log('    A    B    C    D    E    F    G    H    I');
        let top = '  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┐';
        if (this.red.capturedPieces.length) {
            top += '   Captured pieces: ' + this.red.capturedPieces.join(' ');
        }
        console.log(top);
        const rows = [];
        for (let row = 8; row >= 0; row--) {
            let line = (row + 1) + ' │ ' + this.pieces[row].join(' │ ') + ' │';
            if (row === 0 && this.currentPlayer === this.blue && this.blue.capturedPieces.length) {
                line += '                   ';
                for (let i = 0; i < this.blue.capturedPieces.length; i++) {
                    line += ` X${i + 1}`;
                }
            }
            if (row === 8 && this.currentPlayer === this.red && this.red.capturedPieces.length) {
                line += '                   ';
                for (let i = 0; i < this.red.capturedPieces.length; i++) {
                    line += ` X${i + 1}`;
                }
            }
            rows.push(line);
        }
        console.log(rows.join('\n  ├────┼────┼────┼────┼────┼────┼────┼────┼────┤\n'));
        let bottom = '  └────┴────┴────┴────┴────┴────┴────┴────┴────┘';
        if (this.blue.capturedPieces.length) {
            bottom += '   Captured pieces: ' + this.blue.capturedPieces.join(' ');
        }
        console.log(bottom);
    }
    promote(row, col) {
        if (!this.pieces[row][col].canPromote(row, col)) {
            throw new Error('This piece cannot be promoted');
        }
        this.pieces[row][col] = this.pieces[row][col].promotedPiece();
    }
    nextPlayer() {
        if (this.currentPlayer === this.blue) {
            this.currentPlayer = this.red;
        }
        else {
            this.currentPlayer = this.blue;
        }
    }
}
exports.default = Board;
