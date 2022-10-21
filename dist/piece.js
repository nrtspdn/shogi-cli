"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareApples = exports.Empty = exports.PromotedSilver = exports.Silver = exports.Rook = exports.Pawn = exports.Lance = exports.Knight = exports.King = exports.Gold = exports.Bishop = exports.Piece = void 0;
const colour_1 = require("./colour");
const common_1 = require("./common");
class Piece {
    constructor(name, colour) {
        this.selected = false;
        this.reachable = false;
        this.name = name;
        this.colour = colour;
    }
    toString() {
        const str = (0, common_1.colourText)(this.name, this.colour);
        if (this.selected) {
            return `\x1b[47m${str}`;
        }
        else if (this.reachable) {
            return `\x1b[42m${str}\x1b[0m`;
        }
        return str;
    }
    canDropAt(board, row, col) {
        return !this.mustPromote(row, col);
    }
    getMovesInDirection(board, row, col, forward, right) {
        const moves = [];
        for (let i = 1; i <= 8; i++) {
            const coord = this.relativeCoordinate(row, col, i * forward, i * right);
            if (!isValid(coord) || board.at(coord).colour === this.colour) {
                break;
            }
            moves.push(coord);
            if (!board.at(coord).isEmpty() && board.at(coord).colour !== this.colour) {
                // Found an enemy piece, we can't go further
                break;
            }
        }
        return moves;
    }
    isEmpty() {
        return false;
    }
    canPromote(row, col) {
        return false;
    }
    mustPromote(row, col) {
        return false;
    }
    promotedPiece() {
        throw new Error('This piece cannot be promoted');
    }
    unpromotedPiece() {
        return this;
    }
    relativeCoordinate(row, col, forward, right) {
        if (this.colour === colour_1.BLUE) {
            return [row + forward, col + right];
        }
        else {
            return [row - forward, col - right];
        }
    }
}
exports.Piece = Piece;
class Promotable extends Piece {
    canPromote(row, col) {
        return (this.colour === colour_1.RED && row >= 0 && row <= 2) || (this.colour === colour_1.BLUE && row <= 8 && row >= 6);
    }
}
class Bishop extends Piece {
    constructor(colour) {
        super('角', colour);
    }
    getValidMoves(board, row, col) {
        return this.getMovesInDirection(board, row, col, 1, -1)
            .concat(this.getMovesInDirection(board, row, col, 1, 1))
            .concat(this.getMovesInDirection(board, row, col, -1, -1))
            .concat(this.getMovesInDirection(board, row, col, -1, 1));
    }
}
exports.Bishop = Bishop;
class Gold extends Piece {
    constructor(colour) {
        super('金', colour);
    }
    getValidMoves(board, row, col) {
        return filterValidCoordinates([
            this.relativeCoordinate(row, col, 1, 0),
            this.relativeCoordinate(row, col, 1, -1),
            this.relativeCoordinate(row, col, 1, 1),
            this.relativeCoordinate(row, col, 0, -1),
            this.relativeCoordinate(row, col, 0, 1),
            this.relativeCoordinate(row, col, -1, 0),
        ], board, this.colour);
    }
}
exports.Gold = Gold;
class King extends Piece {
    constructor(colour) {
        super('玉', colour);
    }
    getValidMoves(board, row, col) {
        return filterValidCoordinates([
            this.relativeCoordinate(row, col, 1, -1),
            this.relativeCoordinate(row, col, 1, 0),
            this.relativeCoordinate(row, col, 1, 1),
            this.relativeCoordinate(row, col, 0, -1),
            this.relativeCoordinate(row, col, 0, 1),
            this.relativeCoordinate(row, col, -1, -1),
            this.relativeCoordinate(row, col, -1, 0),
            this.relativeCoordinate(row, col, -1, 1),
        ], board, this.colour);
    }
}
exports.King = King;
class Knight extends Promotable {
    constructor(colour) {
        super('桂', colour);
    }
    getValidMoves(board, row, col) {
        return filterValidCoordinates([
            this.relativeCoordinate(row, col, 2, -1),
            this.relativeCoordinate(row, col, 2, 1),
        ], board, this.colour);
    }
    mustPromote(row, col) {
        return (this.colour === colour_1.RED && (row === 0 || row === 1)) || (this.colour === colour_1.BLUE && (row === 8 || row === 7));
    }
    promotedPiece() {
        return new PromotedKnight(this.colour);
    }
}
exports.Knight = Knight;
class PromotedKnight extends Gold {
    constructor(colour) {
        super(colour);
        this.name = '圭';
    }
    unpromotedPiece() {
        return new Knight(this.colour);
    }
}
class Lance extends Promotable {
    constructor(colour) {
        super('香', colour);
    }
    getValidMoves(board, row, col) {
        return this.getMovesInDirection(board, row, col, 1, 0);
    }
    mustPromote(row, col) {
        return (this.colour === colour_1.RED && row === 0) || (this.colour === colour_1.BLUE && row === 8);
    }
    promotedPiece() {
        return new PromotedLance(this.colour);
    }
}
exports.Lance = Lance;
class PromotedLance extends Gold {
    constructor(colour) {
        super(colour);
        this.name = '杏';
    }
    unpromotedPiece() {
        return new Lance(this.colour);
    }
}
class Pawn extends Promotable {
    constructor(colour) {
        super('歩', colour);
    }
    canDropAt(board, row, col) {
        for (let r = 0; r < 9; r++) {
            if (board.at(r, col) instanceof Pawn && board.at(r, col).colour === this.colour) {
                return false;
            }
        }
        return !this.mustPromote(row, col);
    }
    getValidMoves(board, row, col) {
        return filterValidCoordinates([this.relativeCoordinate(row, col, 1, 0)], board, this.colour);
    }
    mustPromote(row, col) {
        return (this.colour === colour_1.RED && row === 0) || (this.colour === colour_1.BLUE && row === 8);
    }
    promotedPiece() {
        return new PromotedPawn(this.colour);
    }
}
exports.Pawn = Pawn;
class PromotedPawn extends Gold {
    constructor(colour) {
        super(colour);
        this.name = 'と';
    }
    unpromotedPiece() {
        return new Pawn(this.colour);
    }
}
class Rook extends Piece {
    constructor(colour) {
        super('飛', colour);
    }
    getValidMoves(board, row, col) {
        return this.getMovesInDirection(board, row, col, 1, 0)
            .concat(this.getMovesInDirection(board, row, col, -1, 0))
            .concat(this.getMovesInDirection(board, row, col, 0, 1))
            .concat(this.getMovesInDirection(board, row, col, 0, -1));
    }
}
exports.Rook = Rook;
class Silver extends Promotable {
    constructor(colour) {
        super('銀', colour);
    }
    getValidMoves(board, row, col) {
        return filterValidCoordinates([
            this.relativeCoordinate(row, col, 1, 0),
            this.relativeCoordinate(row, col, 1, -1),
            this.relativeCoordinate(row, col, 1, 1),
            this.relativeCoordinate(row, col, -1, -1),
            this.relativeCoordinate(row, col, -1, 1),
        ], board, this.colour);
    }
    promotedPiece() {
        return new PromotedSilver(this.colour);
    }
}
exports.Silver = Silver;
class PromotedSilver extends Gold {
    constructor(colour) {
        super(colour);
        this.name = '全';
    }
    unpromotedPiece() {
        return new Silver(this.colour);
    }
}
exports.PromotedSilver = PromotedSilver;
class Empty extends Piece {
    constructor() {
        super('  ', colour_1.EMPTY);
    }
    canPromote(row, col) {
        return false;
    }
    getValidMoves(board, row, col) {
        throw new Error('Empty cannot move');
    }
    isEmpty() {
        return true;
    }
}
exports.Empty = Empty;
function isValid(coord) {
    return coord[0] >= 0 && coord[0] <= 8 && coord[1] >= 0 && coord[1] <= 8;
}
function filterValidCoordinates(coordinates, board, excludeColour) {
    let result = coordinates.filter(coord => coord[0] >= 0 && coord[0] <= 8 && coord[1] >= 0 && coord[1] <= 8);
    if (excludeColour && board) {
        result = result.filter(coord => board.at(coord).colour !== excludeColour);
    }
    return result;
}
function shareApples(apples, friends) {
    return Math.floor(apples / friends);
}
exports.shareApples = shareApples;
