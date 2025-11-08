import React, { useState } from 'react';
import { SquareState } from '../types';
import Piece from './Piece';

interface SquareProps {
  squareState: SquareState;
  isLight: boolean;
  onClick: () => void;
  isSelected: boolean;
  isPossibleMove: boolean;
  onPieceDragStart: () => void;
  onPieceDrop: () => void;
  isDraggable: boolean;
}

const Square: React.FC<SquareProps> = ({ 
  squareState, 
  isLight, 
  onClick, 
  isSelected, 
  isPossibleMove, 
  onPieceDragStart, 
  onPieceDrop,
  isDraggable
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const bgColor = isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]';
  const selectedClasses = isSelected ? 'bg-yellow-400/70' : '';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isPossibleMove) {
      onPieceDrop();
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const dragImage = document.createElement('div');
    dragImage.innerHTML = e.currentTarget.innerHTML;
    dragImage.style.width = `${e.currentTarget.offsetWidth}px`;
    dragImage.style.height = `${e.currentTarget.offsetHeight}px`;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, e.currentTarget.offsetWidth / 2, e.currentTarget.offsetHeight / 2);
    setTimeout(() => document.body.removeChild(dragImage), 0);
    e.dataTransfer.effectAllowed = 'move';
    onPieceDragStart();
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center relative ${bgColor} cursor-pointer`}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`absolute inset-0 transition-colors duration-100 ${selectedClasses}`}></div>
      {squareState && (
        <div
          draggable={isDraggable}
          onDragStart={handleDragStart}
          className={`w-[85%] h-[85%] relative z-10 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
          <Piece piece={squareState} />
        </div>
      )}
      {isPossibleMove && (
        <div className="absolute w-full h-full flex items-center justify-center pointer-events-none z-20">
            <div 
              className={`transition-all duration-100 ${isDragOver ? 'w-full h-full bg-green-500/50' : 'w-1/3 h-1/3 bg-black/20 rounded-full'}`}
            />
        </div>
      )}
    </div>
  );
};

export default Square;