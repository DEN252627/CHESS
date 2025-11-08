import React from 'react';

interface TimerDisplayProps {
  timeInMillis: number;
  isActive: boolean;
}

const formatTime = (timeInMillis: number): string => {
    if (timeInMillis < 0) timeInMillis = 0;
    
    const totalSeconds = Math.floor(timeInMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (totalSeconds < 20 && minutes === 0) {
        const tenths = Math.floor((timeInMillis % 1000) / 100);
        return `${seconds.toString()}.${tenths}`;
    }

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeInMillis, isActive }) => {
  const activeClasses = isActive ? 'bg-green-600/90 text-white' : 'bg-black/20 text-slate-300';
  
  return (
    <div className={`py-1 px-4 rounded-md font-mono text-3xl text-center transition-colors duration-300 ${activeClasses}`}>
      {formatTime(timeInMillis)}
    </div>
  );
};

export default TimerDisplay;