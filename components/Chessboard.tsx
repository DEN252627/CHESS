import React from 'react';
import { BoardState, PlayerColor, Position } from '../types';
import Square from './Square';

interface ChessboardProps {
  boardState: BoardState;
  onSquareClick: (position: Position) => void;
  selectedSquare: Position | null;
  possibleMoves: Position[];
  onPieceDragStart: (position: Position) => void;
  onPieceDrop: (position: Position) => void;
  currentPlayer: PlayerColor;
  isInputDisabled: boolean;
  boardOrientation: PlayerColor;
}

const Chessboard: React.FC<ChessboardProps> = ({ 
    boardState, 
    onSquareClick, 
    selectedSquare, 
    possibleMoves, 
    onPieceDragStart, 
    onPieceDrop,
    currentPlayer,
    isInputDisabled,
    boardOrientation,
}) => {
  const isPossibleMove = (row: number, col: number) => {
    return possibleMoves.some(move => move.row === row && move.col === col);
  };
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  const fileLabels = boardOrientation === PlayerColor.WHITE ? files : [...files].reverse();
  const rankLabels = boardOrientation === PlayerColor.WHITE ? ranks : [...ranks].reverse();

  return (
    <div className="relative w-full aspect-square max-w-[calc(100vh-16rem)] sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto shadow-2xl" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
      {/* Loop over VIEW rows and columns */}
      {[...Array(8).keys()].map((viewRow) => 
        [...Array(8).keys()].map((viewCol) => {
          // Calculate the DATA row and column based on orientation
          const dataRow = boardOrientation === PlayerColor.WHITE ? viewRow : 7 - viewRow;
          const dataCol = boardOrientation === PlayerColor.WHITE ? viewCol : 7 - viewCol;
          
          const square = boardState[dataRow][dataCol];
          // Color is based on DATA coordinates
          const isLight = (dataRow + dataCol) % 2 !== 0; 
          const isSelected = !!selectedSquare && selectedSquare.row === dataRow && selectedSquare.col === dataCol;
          const currentPosition = { row: dataRow, col: dataCol };

          // Labels are based on VIEW coordinates
          const displayFile = fileLabels[viewCol];
          const displayRank = rankLabels[viewRow];
          
          const showCoords = viewCol === 0; // Always show rank on the left edge of the board
          const showFiles = viewRow === 7; // Always show file on the bottom edge of the board

          return (
            <div 
              key={`${viewRow}-${viewCol}`} 
              className="absolute" 
              // CSS positioning is based on VIEW coordinates
              style={{ 
                width: '12.5%', 
                height: '12.5%', 
                top: `${viewRow * 12.5}%`, 
                left: `${viewCol * 12.5}%` 
              }}
            >
              <Square
                squareState={square}
                isLight={isLight}
                onClick={() => onSquareClick(currentPosition)}
                isSelected={isSelected}
                isPossibleMove={isPossibleMove(dataRow, dataCol)}
                onPieceDragStart={() => onPieceDragStart(currentPosition)}
                onPieceDrop={() => onPieceDrop(currentPosition)}
                isDraggable={!isInputDisabled && square?.color === currentPlayer}
              />
              {showCoords && <span className={`absolute top-0.5 left-1 text-xs font-bold select-none ${isLight ? 'text-stone-600/80' : 'text-stone-300/80'}`}>{displayRank}</span>}
              {showFiles && <span className={`absolute bottom-0.5 right-1 text-xs font-bold select-none ${isLight ? 'text-stone-600/80' : 'text-stone-300/80'}`}>{displayFile}</span>}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Chessboard;