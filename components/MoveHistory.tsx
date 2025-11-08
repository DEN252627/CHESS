import React, { useRef, useEffect } from 'react';

interface MoveHistoryProps {
  moves: string[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves]);

  const movePairs: { moveNumber: number; white: string; black?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: i / 2 + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <div className="flex flex-col mt-4 bg-slate-700/50 rounded-lg">
      <h3 className="font-bold text-lg text-amber-300 mb-2 p-3 border-b border-slate-600 flex-shrink-0">Move History</h3>
      <div ref={scrollRef} className="overflow-y-auto p-3 text-sm font-mono h-56">
        {movePairs.length === 0 ? (
          <p className="text-slate-400">No moves yet.</p>
        ) : (
          <table className="w-full text-left">
            <tbody>
              {movePairs.map(({ moveNumber, white, black }) => (
                <tr key={moveNumber} className="border-b border-slate-800/50 last:border-b-0">
                  <td className="py-1.5 pr-2 text-slate-400 text-right w-8">{moveNumber}.</td>
                  <td className="py-1.5 px-2 font-semibold text-slate-200">{white}</td>
                  <td className="py-1.5 px-2 font-semibold text-slate-200">{black || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MoveHistory;