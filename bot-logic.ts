import { GameState, getValidMoves, makeMove, pieceValues } from './chess-logic';
import { BoardState, Piece, PieceType, PlayerColor, Position } from './types';

// Piece-Square Tables (for white)
// The board is viewed from white's perspective. Black's perspective is the same but flipped.
const pawnPST = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];

const knightPST = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
];

const bishopPST = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
];

const rookPST = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
];

const queenPST = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
];

const kingPST = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
];

const piecePST: { [key in PieceType]: number[][] } = {
    [PieceType.PAWN]: pawnPST,
    [PieceType.KNIGHT]: knightPST,
    [PieceType.BISHOP]: bishopPST,
    [PieceType.ROOK]: rookPST,
    [PieceType.QUEEN]: queenPST,
    [PieceType.KING]: kingPST,
};

const getPiecePositionalValue = (piece: Piece, row: number, col: number) => {
    if (piece.color === PlayerColor.WHITE) {
        return piecePST[piece.type][row][col];
    } else {
        return piecePST[piece.type][7 - row][col];
    }
};

const evaluateBoard = (board: BoardState): number => {
    let totalEvaluation = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece) {
                const pieceValue = pieceValues[piece.type] * 100 + getPiecePositionalValue(piece, r, c);
                totalEvaluation += piece.color === PlayerColor.WHITE ? pieceValue : -pieceValue;
            }
        }
    }
    return totalEvaluation;
};


const minimax = (state: GameState, depth: number, alpha: number, beta: number, maximizingPlayer: boolean): number => {
    if (depth === 0 || state.gameStatus.includes('wins') || state.gameStatus.includes('Draw')) {
        return evaluateBoard(state.boardState);
    }

    const player = maximizingPlayer ? PlayerColor.WHITE : PlayerColor.BLACK;
    
    let allMoves: {from: Position, to: Position}[] = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = state.boardState[r][c];
            if (piece && piece.color === player) {
                const validMoves = getValidMoves(state, { row: r, col: c });
                validMoves.forEach(to => allMoves.push({ from: { row: r, col: c }, to }));
            }
        }
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of allMoves) {
            const nextState = makeMove(state, move.from, move.to);
            const evaluation = minimax(nextState, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) {
                break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of allMoves) {
            const nextState = makeMove(state, move.from, move.to);
            const evaluation = minimax(nextState, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) {
                break;
            }
        }
        return minEval;
    }
};


export const findBestMove = (gameState: GameState, depth: number): { from: Position, to: Position } | null => {
    const botColor = gameState.currentPlayer;
    let bestMove: { from: Position, to: Position } | null = null;
    let bestValue = botColor === PlayerColor.WHITE ? -Infinity : Infinity;

    let allMoves: {from: Position, to: Position}[] = [];
     for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = gameState.boardState[r][c];
            if (piece && piece.color === botColor) {
                const validMoves = getValidMoves(gameState, { row: r, col: c });
                validMoves.forEach(to => allMoves.push({ from: { row: r, col: c }, to }));
            }
        }
    }

    if (allMoves.length === 0) return null;

    // Randomize move order to provide variety
    allMoves.sort(() => Math.random() - 0.5);

    for (const move of allMoves) {
        const nextState = makeMove(gameState, move.from, move.to);
        const boardValue = minimax(nextState, depth - 1, -Infinity, Infinity, botColor !== PlayerColor.WHITE);
        
        if (botColor === PlayerColor.WHITE) {
            if (boardValue > bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        } else {
            if (boardValue < bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        }
    }
    
    return bestMove;
};
