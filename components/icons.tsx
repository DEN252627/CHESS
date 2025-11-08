import React from 'react';

interface PieceIconProps {
  color: 'white' | 'black';
  className?: string;
}

const PieceGWrapper: React.FC<{ color: 'white' | 'black', children: React.ReactNode }> = ({ color, children }) => (
    <g 
        fill={color === 'white' ? '#fff' : '#212121'} 
        stroke={color === 'white' ? '#212121' : '#ccc'} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        {children}
    </g>
);

export const KingIcon: React.FC<PieceIconProps> = ({ color, className }) => (
  <svg viewBox="0 0 45 45" className={className}>
    <PieceGWrapper color={color}>
      <path d="M22.5 11.63V6M20 8h5" strokeLinecap="butt" stroke={color === 'white' ? '#212121' : '#ccc'} fill="none"/>
      <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1.5 0-3 0m0 10.5s-4.5-7.5-3-10.5c0 0 1.5 0 3 0" fill={color === 'white' ? '#fff' : '#212121'} stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M12.5 37c5.5-2.5 14.5-2.5 20 0v-7s-1-4-10-4-10 4-10 4v7z" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M12.5 30c5.5-2.5 14.5-2.5 20 0" fill="none" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M11.5 37c5.5-2.5 16.5-2.5 22 0" fill="none" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M11.5 39.5c5.5-2.5 16.5-2.5 22 0" fill="none" stroke={color === 'white' ? '#212121' : '#ccc'}/>
    </PieceGWrapper>
  </svg>
);

export const QueenIcon: React.FC<PieceIconProps> = ({ color, className }) => (
  <svg viewBox="0 0 45 45" className={className}>
    <PieceGWrapper color={color}>
      <path d="M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm12.5 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm12.5 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM8.5 25.5s1.5-6.5 5.5-6.5h17c4 0 5.5 6.5 5.5 6.5" fill="none" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M8.5 25.5s2.5-3 14-3 14 3 14 3" fill="none" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M12 38.5c4-2 17-2 21 0v-9c-4-2-17-2-21 0v9z" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M11.5 38.5c4-2 18-2 22 0" fill="none" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M11.5 40c4-2 18-2 22 0" fill="none" stroke={color === 'white' ? '#212121' : '#ccc'}/>
    </PieceGWrapper>
  </svg>
);

export const RookIcon: React.FC<PieceIconProps> = ({ color, className }) => (
  <svg viewBox="0 0 45 45" className={className}>
    <PieceGWrapper color={color}>
      <path d="M9 39h27v-3H9v3zM12.5 36v-4h20v4h-20zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M34 14l-3 3H14l-3-3" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M31 17v12.5H14V17z" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M14 17h17" fill="none" stroke={color === 'white' ? '#212121' : '#ccc'}/>
    </PieceGWrapper>
  </svg>
);

export const BishopIcon: React.FC<PieceIconProps> = ({ color, className }) => (
  <svg viewBox="0 0 45 45" className={className}>
    <PieceGWrapper color={color}>
      <path d="M9 36c3.39-.96 10.11.43 13.5-2 3.39 2.43 10.11 1.04 13.5 2z" fill="none" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M15 32c2.5 2.5 15 2.5 17.5 0l-1.5-1.5s-2.5 1.5-7.5-1.5-7.5-1.5-7.5-1.5l-1 1.5z" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M22.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M22.5 28.82c0-2.5 2.5-5 2.5-5 0-7.5-5-15-5-15s-5 7.5-5 15c0 0 2.5 2.5 2.5 5z" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M12.5 38.5c5.5-2.5 14.5-2.5 20 0" fill="none" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M12.5 41c5.5-2.5 14.5-2.5 20 0" fill="none" stroke={color === 'white' ? '#212121' : '#ccc'}/>
    </PieceGWrapper>
  </svg>
);

export const KnightIcon: React.FC<PieceIconProps> = ({ color, className }) => (
  <svg viewBox="0 0 45 45" className={className}>
    <PieceGWrapper color={color}>
      <path d="M22 10c10.5 1 16.5 8 16 29H15c-2.5 0-4-2.5-4-4 0-1.5 1-2.5 2-3l1-1c1-1 1-2 0-3l-1-1c-1-1 0-2.5 1-3.5l1-1c1-1 1-2 0-3l-1-1c-1-1-1.5-2.5 0-4l1-1c1-1 1-2.5 0-4-1-1.5-1-2.5-1-3.5 0-1 0-3 1.5-5C19 5 22.5 6 22 10z" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M9.5 24.5s2-2 4-2.5 4 1 4 2.5-1.5 2-1.5 2.5c0 1 1 1.5 1 2.5 0 .5-1.5 1-1.5 1.5 0 .5.5 1 1.5 1 1 0 1 .5 1 1s-.5 1-1 1-1 1-1 1.5-2 1-2 1.5" strokeLinecap="butt" fill="none" stroke={color === 'white' ? '#212121' : '#ccc'}/>
    </PieceGWrapper>
  </svg>
);

export const PawnIcon: React.FC<PieceIconProps> = ({ color, className }) => (
  <svg viewBox="0 0 45 45" className={className}>
    <PieceGWrapper color={color}>
      <path d="M22.5 9.5c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5-4.5-2-4.5-4.5 2-4.5 4.5-4.5z" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M22.5 25c-2.5 0-4.5-2-4.5-4.5V19h9v1.5c0 2.5-2 4.5-4.5 4.5z" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M15 39.5h15v-3H15v3z" stroke={color === 'white' ? '#212121' : '#ccc'}/>
      <path d="M18 36.5h9v-4c0-1.5-1-2.5-2.5-2.5h-4C19 30 18 31 18 32.5v4z" stroke={color === 'white' ? '#212121' : '#ccc'}/>
    </PieceGWrapper>
  </svg>
);