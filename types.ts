
export enum PieceType {
  PAWN = 'pawn',
  ROOK = 'rook',
  KNIGHT = 'knight',
  BISHOP = 'bishop',
  QUEEN = 'queen',
  KING = 'king',
}

export enum PlayerColor {
  WHITE = 'white',
  BLACK = 'black',
}

export interface Piece {
  type: PieceType;
  color: PlayerColor;
}

export type SquareState = Piece | null;

export type BoardState = SquareState[][];

export interface Position {
  row: number;
  col: number;
}
