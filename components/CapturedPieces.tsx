import React from 'react';
import { Piece as PieceProps, PieceType } from '../types';
import Piece from './Piece';

interface CapturedPiecesProps {
  pieces: PieceProps[];
  advantage: number;
}

const pieceOrder: { [key in PieceType]: number } = {
  [PieceType.QUEEN]: 1,
  [PieceType.ROOK]: 2,
  [PieceType.BISHOP]: 3,
  [PieceType.KNIGHT]: 4,
  [PieceType.PAWN]: 5,
  [PieceType.KING]: 6,
};

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ pieces, advantage }) => {
    const sortedPieces = [...pieces].sort((a, b) => pieceOrder[a.type] - pieceOrder[b.type]);
    
    return (
        <div className="h-6 flex items-center gap-2">
            <div className="flex items-center">
                {sortedPieces.map((piece, index) => (
                    <div key={index} className="w-4 h-4 -ml-1">
                        <Piece piece={piece} />
                    </div>
                ))}
            </div>
            {advantage > 0 && (
                <span className="text-sm text-green-400 font-semibold">
                    +{advantage}
                </span>
            )}
        </div>
    );
};

export default CapturedPieces;