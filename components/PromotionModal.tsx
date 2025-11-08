import React from 'react';
import { PieceType, PlayerColor } from '../types';
import Piece from './Piece';

interface PromotionModalProps {
  color: PlayerColor;
  onPromote: (pieceType: PieceType) => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ color, onPromote }) => {
  const promotionPieces: PieceType[] = [
    PieceType.QUEEN,
    PieceType.ROOK,
    PieceType.BISHOP,
    PieceType.KNIGHT,
  ];

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 border-2 border-slate-700 p-6 rounded-lg shadow-2xl flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-6 text-white">Promote Pawn</h3>
        <div className="flex gap-4">
          {promotionPieces.map((pieceType) => (
            <button
              key={pieceType}
              onClick={() => onPromote(pieceType)}
              className="w-20 h-20 bg-[#f0d9b5] hover:bg-yellow-400/70 rounded-md p-1 transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-300"
              aria-label={`Promote to ${pieceType}`}
            >
              <Piece piece={{ type: pieceType, color }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;