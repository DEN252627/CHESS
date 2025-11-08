import { BoardState, Piece, PieceType, PlayerColor, Position, SquareState } from './types';

export type CastlingRights = {
    [PlayerColor.WHITE]: { kingSide: boolean; queenSide: boolean };
    [PlayerColor.BLACK]: { kingSide: boolean; queenSide: boolean };
};

export interface GameState {
    boardState: BoardState;
    currentPlayer: PlayerColor;
    castlingRights: CastlingRights;
    enPassantTarget: Position | null;
    moveHistory: string[];
    positionHistory: string[];
    gameStatus: string;
    capturedPieces: { [key in PlayerColor]: Piece[] };
    drawOfferFrom: PlayerColor | null;
}

export const pieceValues: { [key in PieceType]: number } = {
  [PieceType.QUEEN]: 9,
  [PieceType.ROOK]: 5,
  [PieceType.BISHOP]: 3,
  [PieceType.KNIGHT]: 3,
  [PieceType.PAWN]: 1,
  [PieceType.KING]: 0,
};

const boardToFen = (board: BoardState): string => {
    return board.map(row => {
        let empty = 0;
        let fenRow = '';
        row.forEach(square => {
            if (square === null) {
                empty++;
            } else {
                if (empty > 0) { fenRow += empty; empty = 0; }
                let pieceChar = '';
                switch(square.type) {
                    case PieceType.PAWN: pieceChar = 'p'; break;
                    case PieceType.ROOK: pieceChar = 'r'; break;
                    case PieceType.KNIGHT: pieceChar = 'n'; break;
                    case PieceType.BISHOP: pieceChar = 'b'; break;
                    case PieceType.QUEEN: pieceChar = 'q'; break;
                    case PieceType.KING: pieceChar = 'k'; break;
                }
                fenRow += square.color === PlayerColor.WHITE ? pieceChar.toUpperCase() : pieceChar;
            }
        });
        if (empty > 0) { fenRow += empty; }
        return fenRow;
    }).join('/');
};

const createInitialBoard = (): BoardState => {
    const board: BoardState = Array(8).fill(null).map(() => Array(8).fill(null));
    const placePiece = (pos: Position, piece: Piece) => { board[pos.row][pos.col] = piece; };
    for (let i = 0; i < 8; i++) {
        placePiece({ row: 1, col: i }, { type: PieceType.PAWN, color: PlayerColor.BLACK });
        placePiece({ row: 6, col: i }, { type: PieceType.PAWN, color: PlayerColor.WHITE });
    }
    placePiece({ row: 0, col: 0 }, { type: PieceType.ROOK, color: PlayerColor.BLACK });
    placePiece({ row: 0, col: 7 }, { type: PieceType.ROOK, color: PlayerColor.BLACK });
    placePiece({ row: 7, col: 0 }, { type: PieceType.ROOK, color: PlayerColor.WHITE });
    placePiece({ row: 7, col: 7 }, { type: PieceType.ROOK, color: PlayerColor.WHITE });
    placePiece({ row: 0, col: 1 }, { type: PieceType.KNIGHT, color: PlayerColor.BLACK });
    placePiece({ row: 0, col: 6 }, { type: PieceType.KNIGHT, color: PlayerColor.BLACK });
    placePiece({ row: 7, col: 1 }, { type: PieceType.KNIGHT, color: PlayerColor.WHITE });
    placePiece({ row: 7, col: 6 }, { type: PieceType.KNIGHT, color: PlayerColor.WHITE });
    placePiece({ row: 0, col: 2 }, { type: PieceType.BISHOP, color: PlayerColor.BLACK });
    placePiece({ row: 0, col: 5 }, { type: PieceType.BISHOP, color: PlayerColor.BLACK });
    placePiece({ row: 7, col: 2 }, { type: PieceType.BISHOP, color: PlayerColor.WHITE });
    placePiece({ row: 7, col: 5 }, { type: PieceType.BISHOP, color: PlayerColor.WHITE });
    placePiece({ row: 0, col: 3 }, { type: PieceType.QUEEN, color: PlayerColor.BLACK });
    placePiece({ row: 0, col: 4 }, { type: PieceType.KING, color: PlayerColor.BLACK });

    placePiece({ row: 7, col: 3 }, { type: PieceType.QUEEN, color: PlayerColor.WHITE });
    placePiece({ row: 7, col: 4 }, { type: PieceType.KING, color: PlayerColor.WHITE });

    return board;
};

export const createInitialGameState = (): GameState => {
    const initialBoard = createInitialBoard();
    const initialPlayer = PlayerColor.WHITE;
    const initialCastlingRights = {
        [PlayerColor.WHITE]: { kingSide: true, queenSide: true },
        [PlayerColor.BLACK]: { kingSide: true, queenSide: true },
    };
    return {
        boardState: initialBoard,
        currentPlayer: initialPlayer,
        castlingRights: initialCastlingRights,
        enPassantTarget: null,
        moveHistory: [],
        positionHistory: [getPositionKey(initialBoard, initialPlayer, initialCastlingRights, null)],
        gameStatus: "White's Turn",
        capturedPieces: { [PlayerColor.WHITE]: [], [PlayerColor.BLACK]: [] },
        drawOfferFrom: null,
    };
};

const getPositionKey = (board: BoardState, player: PlayerColor, castling: CastlingRights, enPassantTarget: Position | null): string => {
    const enPassantString = enPassantTarget ? `${enPassantTarget.row},${enPassantTarget.col}` : 'null';
    return boardToFen(board) + ':' + player + ':' + JSON.stringify(castling) + ':' + enPassantString;
};

const findKing = (kingColor: PlayerColor, board: BoardState): Position | null => {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.type === PieceType.KING && piece.color === kingColor) {
                return { row: r, col: c };
            }
        }
    }
    return null;
};

const isSquareAttacked = (position: Position, attackerColor: PlayerColor, board: BoardState): boolean => {
    const isValid = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
    const pawnDir = attackerColor === PlayerColor.WHITE ? 1 : -1;
    const pawnAttackSquares = [{ row: position.row + pawnDir, col: position.col - 1 }, { row: position.row + pawnDir, col: position.col + 1 }];
    for (const sq of pawnAttackSquares) {
        if (isValid(sq.row, sq.col)) {
            const piece = board[sq.row][sq.col];
            if (piece && piece.type === PieceType.PAWN && piece.color === attackerColor) return true;
        }
    }
    const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    for (const [dr, dc] of knightMoves) {
        const r = position.row + dr; const c = position.col + dc;
        if (isValid(r, c)) {
            const piece = board[r][c];
            if (piece && piece.type === PieceType.KNIGHT && piece.color === attackerColor) return true;
        }
    }
    const kingMoves = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    for (const [dr, dc] of kingMoves) {
        const r = position.row + dr; const c = position.col + dc;
        if (isValid(r, c)) {
            const piece = board[r][c];
            if (piece && piece.type === PieceType.KING && piece.color === attackerColor) return true;
        }
    }
    const checkSliding = (directions: number[][], validAttackers: PieceType[]) => {
        for (const [dr, dc] of directions) {
            let r = position.row + dr; let c = position.col + dc;
            while (isValid(r, c)) {
                const piece = board[r][c];
                if (piece) {
                    if (piece.color === attackerColor && (validAttackers.includes(piece.type) || piece.type === PieceType.QUEEN)) return true;
                    break;
                }
                r += dr; c += dc;
            }
        }
        return false;
    }
    if (checkSliding([[-1, 0], [1, 0], [0, -1], [0, 1]], [PieceType.ROOK])) return true;
    if (checkSliding([[-1, -1], [-1, 1], [1, -1], [1, 1]], [PieceType.BISHOP])) return true;
    return false;
};

const isKingInCheck = (kingColor: PlayerColor, board: BoardState): boolean => {
    const kingPos = findKing(kingColor, board);
    if (!kingPos) return false;
    const opponentColor = kingColor === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE;
    return isSquareAttacked(kingPos, opponentColor, board);
};

const getPiecePseudoLegalMoves = (piece: Piece, position: Position, board: BoardState, enPassantTarget: Position | null, castlingRights: CastlingRights): Position[] => {
    const moves: Position[] = [];
    const { row, col } = position;
    const { type, color } = piece;
    const isValid = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
    const addMoveIfValid = (r: number, c: number) => { if (isValid(r, c)) { const target = board[r][c]; if (!target || target.color !== color) { moves.push({ row: r, col: c }); } } };
    const addSlidingMoves = (directions: number[][]) => {
        directions.forEach(([dr, dc]) => {
            let r = row + dr; let c = col + dc;
            while (isValid(r, c)) {
                const target = board[r][c];
                if (!target) { moves.push({ row: r, col: c }); r += dr; c += dc; }
                else { if (target.color !== color) { moves.push({ row: r, col: c }); } break; }
            }
        });
    };
    switch (type) {
        case PieceType.PAWN:
            const dir = color === PlayerColor.WHITE ? -1 : 1;
            const startRow = color === PlayerColor.WHITE ? 6 : 1;
            if (isValid(row + dir, col) && !board[row + dir][col]) {
                moves.push({ row: row + dir, col });
                if (row === startRow && !board[row + 2 * dir][col]) { moves.push({ row: row + 2 * dir, col }); }
            }
            [-1, 1].forEach(dCol => {
                const targetRow = row + dir; const targetCol = col + dCol;
                if (isValid(targetRow, targetCol)) {
                    const captureTarget = board[targetRow][targetCol];
                    if (captureTarget && captureTarget.color !== color) { moves.push({ row: targetRow, col: targetCol }); }
                    else if (enPassantTarget && targetRow === enPassantTarget.row && targetCol === enPassantTarget.col) { moves.push({ row: targetRow, col: targetCol }); }
                }
            });
            break;
        case PieceType.KNIGHT:
            const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
            knightMoves.forEach(([dr, dc]) => addMoveIfValid(row + dr, col + dc));
            break;
        case PieceType.KING:
             const kingMoves = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
             kingMoves.forEach(([dr, dc]) => addMoveIfValid(row + dr, col + dc));
             if (!isKingInCheck(color, board)) {
                const rights = castlingRights[color];
                const oppColor = color === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE;
                if (rights.kingSide && !board[row][col+1] && !board[row][col+2] && !isSquareAttacked({row, col: col+1}, oppColor, board) && !isSquareAttacked({row, col: col+2}, oppColor, board)) { moves.push({row, col: col+2}); }
                if (rights.queenSide && !board[row][col-1] && !board[row][col-2] && !board[row][col-3] && !isSquareAttacked({row, col: col-1}, oppColor, board) && !isSquareAttacked({row, col: col-2}, oppColor, board)) { moves.push({row, col: col-2}); }
             }
             break;
        case PieceType.ROOK: addSlidingMoves([[-1, 0], [1, 0], [0, -1], [0, 1]]); break;
        case PieceType.BISHOP: addSlidingMoves([[-1, -1], [-1, 1], [1, -1], [1, 1]]); break;
        case PieceType.QUEEN: addSlidingMoves([[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]); break;
    }
    return moves;
};

export const getValidMoves = (state: GameState, position: Position): Position[] => {
    const piece = state.boardState[position.row][position.col];
    if (!piece) return [];
    const pseudoLegalMoves = getPiecePseudoLegalMoves(piece, position, state.boardState, state.enPassantTarget, state.castlingRights);
    return pseudoLegalMoves.filter(move => {
        const newBoard = state.boardState.map(r => [...r]);
        if (piece.type === PieceType.KING && Math.abs(position.col - move.col) === 2) {
            const rookCol = move.col > position.col ? 7 : 0;
            const rookDestCol = move.col > position.col ? 5 : 3;
            newBoard[move.row][rookDestCol] = newBoard[position.row][rookCol];
            newBoard[position.row][rookCol] = null;
        }
        newBoard[move.row][move.col] = newBoard[position.row][position.col];
        newBoard[position.row][position.col] = null;
        if (piece.type === PieceType.PAWN && state.enPassantTarget && move.row === state.enPassantTarget.row && move.col === state.enPassantTarget.col) {
            newBoard[position.row][move.col] = null;
        }
        return !isKingInCheck(piece.color, newBoard);
    });
};

const playerHasValidMoves = (player: PlayerColor, state: GameState): boolean => {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = state.boardState[r][c];
            if (piece && piece.color === player) {
                if (getValidMoves(state, { row: r, col: c }).length > 0) return true;
            }
        }
    }
    return false;
};

const checkForInsufficientMaterial = (board: BoardState): boolean => {
    const pieces: { piece: Piece, pos: Position }[] = [];
    for (let r = 0; r < 8; r++) { for (let c = 0; c < 8; c++) { if (board[r][c]) { pieces.push({ piece: board[r][c]!, pos: { row: r, col: c } }); } } }
    if (pieces.some(p => p.piece.type === PieceType.PAWN || p.piece.type === PieceType.ROOK || p.piece.type === PieceType.QUEEN)) return false;
    const whitePieces = pieces.filter(p => p.piece.color === PlayerColor.WHITE && p.piece.type !== PieceType.KING);
    const blackPieces = pieces.filter(p => p.piece.color === PlayerColor.BLACK && p.piece.type !== PieceType.KING);
    const totalMinorPieces = whitePieces.length + blackPieces.length;
    if (totalMinorPieces <= 1) return true;
    if (totalMinorPieces === 2 && whitePieces.length === 1 && blackPieces.length === 1 && whitePieces[0].piece.type === PieceType.BISHOP && blackPieces[0].piece.type === PieceType.BISHOP) {
        const whiteBishopSquareColor = (whitePieces[0].pos.row + whitePieces[0].pos.col) % 2;
        const blackBishopSquareColor = (blackPieces[0].pos.row + blackPieces[0].pos.col) % 2;
        if (whiteBishopSquareColor === blackBishopSquareColor) return true;
    }
    return false;
};

const posToAlgebraic = (pos: Position): string => {
    const file = String.fromCharCode('a'.charCodeAt(0) + pos.col);
    const rank = 8 - pos.row;
    return `${file}${rank}`;
};

const moveToSAN = (from: Position, to: Position, piece: Piece, isCapture: boolean, isCheck: boolean, isCheckmate: boolean, promotionPiece: PieceType | null): string => {
    const pieceNotation: { [key in PieceType]?: string } = { [PieceType.KNIGHT]: 'N', [PieceType.BISHOP]: 'B', [PieceType.ROOK]: 'R', [PieceType.QUEEN]: 'Q', [PieceType.KING]: 'K' };
    if (piece.type === PieceType.KING && Math.abs(from.col - to.col) === 2) return to.col > from.col ? 'O-O' : 'O-O-O';
    let san = pieceNotation[piece.type] || '';
    if (piece.type === PieceType.PAWN && isCapture) san += String.fromCharCode('a'.charCodeAt(0) + from.col);
    if (isCapture) san += 'x';
    san += posToAlgebraic(to);
    if (promotionPiece) san += `=${pieceNotation[promotionPiece] || 'Q'}`;
    if (isCheckmate) san += '#'; else if (isCheck) san += '+';
    return san;
};

export const makeMove = (currentState: GameState, from: Position, to: Position, promotionPiece: PieceType | null = null): GameState => {
    const newState: GameState = JSON.parse(JSON.stringify(currentState));
    const piece = newState.boardState[from.row][from.col];
    if (!piece) return currentState;

    newState.drawOfferFrom = null; // A move implicitly rejects a draw offer

    let capturedPiece: Piece | null = null;
    if (piece.type === PieceType.PAWN && newState.enPassantTarget && to.row === newState.enPassantTarget.row && to.col === newState.enPassantTarget.col) {
        capturedPiece = newState.boardState[from.row][to.col];
    } else {
        capturedPiece = newState.boardState[to.row][to.col];
    }
    
    if (capturedPiece) {
        newState.capturedPieces[newState.currentPlayer].push(capturedPiece);
    }
    const isCapture = capturedPiece !== null;
    if (piece.type === PieceType.PAWN && newState.enPassantTarget && to.row === newState.enPassantTarget.row && to.col === newState.enPassantTarget.col) {
        newState.boardState[from.row][to.col] = null;
    }
    const finalPiece = promotionPiece ? { type: promotionPiece, color: piece.color } : piece;
    newState.boardState[to.row][to.col] = finalPiece;
    newState.boardState[from.row][from.col] = null;
    if (piece.type === PieceType.KING && Math.abs(from.col - to.col) === 2) {
        if (to.col > from.col) { newState.boardState[from.row][from.col+1] = newState.boardState[from.row][7]; newState.boardState[from.row][7] = null; }
        else { newState.boardState[from.row][from.col-1] = newState.boardState[from.row][0]; newState.boardState[from.row][0] = null; }
    }
    
    newState.enPassantTarget = (piece.type === PieceType.PAWN && Math.abs(from.row - to.row) === 2) ? { row: (from.row + to.row) / 2, col: from.col } : null;
    
    if (piece.type === PieceType.KING) newState.castlingRights[piece.color] = { kingSide: false, queenSide: false };
    if (piece.type === PieceType.ROOK) {
        if (from.col === 0 && from.row === (piece.color === PlayerColor.WHITE ? 7 : 0)) newState.castlingRights[piece.color].queenSide = false;
        if (from.col === 7 && from.row === (piece.color === PlayerColor.WHITE ? 7 : 0)) newState.castlingRights[piece.color].kingSide = false;
    }
    
    const nextPlayer = newState.currentPlayer === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE;
    newState.currentPlayer = nextPlayer;

    let newGameStatus = '';
    let isCheck = false;
    let isCheckmate = false;

    const newPositionKey = getPositionKey(newState.boardState, newState.currentPlayer, newState.castlingRights, newState.enPassantTarget);
    newState.positionHistory.push(newPositionKey);
    const positionCounts = newState.positionHistory.reduce((acc: { [key: string]: number }, pos) => { acc[pos] = (acc[pos] || 0) + 1; return acc; }, {});

    if (checkForInsufficientMaterial(newState.boardState)) {
        newGameStatus = 'Draw by Insufficient Material';
    } else if (positionCounts[newPositionKey] >= 3) {
        newGameStatus = 'Draw by Repetition';
    } else {
        const hasMoves = playerHasValidMoves(nextPlayer, newState);
        isCheck = isKingInCheck(nextPlayer, newState.boardState);
        if (!hasMoves) {
            if (isCheck) {
                const winner = piece.color.charAt(0).toUpperCase() + piece.color.slice(1);
                newGameStatus = `${winner} wins by Checkmate!`;
                isCheckmate = true;
            } else {
                newGameStatus = 'Draw by Stalemate';
            }
        } else {
            newGameStatus = `${nextPlayer.charAt(0).toUpperCase() + nextPlayer.slice(1)}'s Turn${isCheck ? ' (Check!)' : ''}`;
        }
    }
    newState.gameStatus = newGameStatus;
    const san = moveToSAN(from, to, piece, isCapture, isCheck, isCheckmate, promotionPiece);
    newState.moveHistory.push(san);
    
    return newState;
};
