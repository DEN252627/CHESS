
import React from 'react';
import { Piece as PieceProps, PieceType, PlayerColor } from '../types';
import { KingIcon, QueenIcon, RookIcon, BishopIcon, KnightIcon, PawnIcon } from './icons';

interface Props {
  piece: PieceProps;
}

const Piece: React.FC<Props> = ({ piece }) => {
  const { type, color } = piece;
  const commonClassName = "w-full h-full stroke-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]";
  const playerColor = color === PlayerColor.WHITE ? 'white' : 'black';

  switch (type) {
    case PieceType.KING:
      return <KingIcon color={playerColor} className={commonClassName} />;
    case PieceType.QUEEN:
      return <QueenIcon color={playerColor} className={commonClassName} />;
    case PieceType.ROOK:
      return <RookIcon color={playerColor} className={commonClassName} />;
    case PieceType.BISHOP:
      return <BishopIcon color={playerColor} className={commonClassName} />;
    case PieceType.KNIGHT:
      return <KnightIcon color={playerColor} className={commonClassName} />;
    case PieceType.PAWN:
      return <PawnIcon color={playerColor} className={commonClassName} />;
    default:
      return null;
  }
};

export default Piece;
