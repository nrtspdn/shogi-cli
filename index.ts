import readline from 'readline-sync';
import Board from './board';
import { Piece } from './piece';

const board = new Board();

while (true) {
    console.clear();
    board.print();

    const [srcRow, srcCol] = selectPiece();
    const source = board.at(srcRow, srcCol);
    source.selected = true;
    const moves = board.getValidMoves(srcRow, srcCol);
    for (let move of moves) {
        board.at(move).reachable = true;
    }

    console.clear();
    board.print();
    const [dstRow, dstCol, promote] = selectDestination(source);

    for (let move of moves) {
        board.at(move).reachable = false;
    }

    board.movePiece(srcRow, srcCol, dstRow, dstCol);
    board.at(dstRow, dstCol).selected = false;

    if (promote || board.mustPromote(dstRow, dstCol)) {
        board.promote(dstRow, dstCol);
    }

    console.clear();
    board.print();
    if (board.gameOver) {
        console.log(`${board.currentPlayer} WINS`);
        break;
    }

    board.nextPlayer();
}

function selectPiece(): [number, number] {
    while (true) {
        const [row, col] = askForCoordinate(`${board.currentPlayer}, pick a piece to move (e.g.: 1A): `);
        if (col === 9) { // Captured piece
            return [row, col];
        }

        if (board.at(row, col).isEmpty()) {
            console.log("There's nothing there!");
            continue;
        }

        if (board.at(row, col).colour !== board.currentPlayer.colour) {
            console.log("That's not yours!");
            continue;
        }

        const moves = board.getValidMoves(row, col);
        if (!moves.length) {
            console.log("That piece can't move!");
            continue;
        }

        return [row, col];
    }
}

function selectDestination(piece: Piece): [number, number, boolean] {
    while (true) {
        const [row, col, promote] = askForCoordinate('Where do you want to move (e.g.: 1A)? ');
        if (!board.at(row, col).reachable) {
            console.log('Invalid choice');
            continue;
        }

        if (promote && !piece.canPromote(row, col)) {
            console.log('Invalid promotion');
            continue;
        }

        return [row, col, promote];
    }
}

function askForCoordinate(prompt: string): [number, number, boolean] {
    while (true) {
        const answer = readline.question(prompt);
        if (answer.length < 2 || (answer.length === 3 && answer[2].toLowerCase() != 'p') || answer.length > 3) {
            console.log('Invalid choice');
            continue;
        }

        let row, col;
        if (answer[0] >= '1' && answer[0] <= '9') {
            row = Number(answer[0]) - 1;
            col = 'ABCDEFGHIX'.indexOf(answer[1].toUpperCase());
        } else {
            row = Number(answer[1]) - 1;
            col = 'ABCDEFGHIX'.indexOf(answer[0].toUpperCase());
        }

        if (col === 9 && row >= 0 && row < board.currentPlayer.capturedPieces.length) { // Selecting a captured piece
            return [row, col, false];
        }

        if (row < 0 || row > 8 || col < 0 || col > 8) {
            console.log('Invalid choice');
            continue;
        }

        const promote = answer.length === 3 && answer[2].toLowerCase() === 'p';
        return [row, col, promote];
    }
}
