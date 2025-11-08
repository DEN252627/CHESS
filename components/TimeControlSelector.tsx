import React from 'react';

export interface TimeControl {
  initial: number; // in milliseconds
  increment: number; // in milliseconds
  label: string;
}

export const timeControls: TimeControl[] = [
  { initial: 1 * 60 * 1000, increment: 0, label: '1 min' },
  { initial: 3 * 60 * 1000, increment: 0, label: '3 min' },
  { initial: 3 * 60 * 1000, increment: 2 * 1000, label: '3 | 2' },
  { initial: 5 * 60 * 1000, increment: 0, label: '5 min' },
  { initial: 5 * 60 * 1000, increment: 3 * 1000, label: '5 | 3' },
  { initial: 10 * 60 * 1000, increment: 0, label: '10 min' },
  { initial: 10 * 60 * 1000, increment: 5 * 1000, label: '10 | 5' },
  { initial: 15 * 60 * 1000, increment: 10 * 1000, label: '15 | 10' },
  { initial: 30 * 60 * 1000, increment: 0, label: '30 min' },
];

interface TimeControlSelectorProps {
  selected: TimeControl;
  onSelect: (tc: TimeControl) => void;
}

const TimeControlSelector: React.FC<TimeControlSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">Time Control</label>
      <div className="grid grid-cols-3 gap-2">
        {timeControls.map((tc) => (
          <button
            key={tc.label}
            onClick={() => onSelect(tc)}
            className={`py-2 px-3 rounded-md text-sm font-semibold transition-colors ${
              selected.label === tc.label
                ? 'bg-amber-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {tc.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeControlSelector;
