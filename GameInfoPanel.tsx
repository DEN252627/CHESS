import React from 'react';
import { GameState } from './chess-logic';
import { PlayerColor } from './types';
import MoveHistory from './components/MoveHistory';
import PlayerInfo from './PlayerInfo';
import { GameSettings } from './App';

interface GameInfoPanelProps {
    gameState: GameState;
    timers: { [key in PlayerColor]: number };
    settings: GameSettings;
    onNewGame: () => void;
    onResign: () => void;
    onOfferDraw: () => void;
    onSaveGame: () => void;
    onLoadGame: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const GameInfoPanel: React.FC<GameInfoPanelProps> = ({ 
    gameState, 
    timers,
    settings,
    onNewGame,
    onResign,
    onOfferDraw,
    onSaveGame,
    onLoadGame,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
}) => {
    const { moveHistory, gameStatus } = gameState;
    const isGameOver = gameStatus.includes('wins') || gameStatus.includes('Draw');

    return (
        <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 h-full flex flex-col p-4 w-full">
            <div className="text-center p-2 bg-slate-900 rounded-md">
                <p className={`font-semibold text-lg ${isGameOver ? 'text-amber-400' : 'text-slate-300'}`}>
                    {gameStatus}
                </p>
            </div>
            
            <MoveHistory moves={moveHistory} />

            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-700">
                <button onClick={onUndo} disabled={!canUndo || isGameOver} className="bg-slate-700 hover:bg-slate-600 rounded-md p-2 font-semibold transition-colors disabled:bg-slate-600/50 disabled:cursor-not-allowed">Undo</button>
                <button onClick={onRedo} disabled={!canRedo || isGameOver} className="bg-slate-700 hover:bg-slate-600 rounded-md p-2 font-semibold transition-colors disabled:bg-slate-600/50 disabled:cursor-not-allowed">Redo</button>
                <button onClick={onNewGame} className="bg-slate-700 hover:bg-slate-600 rounded-md p-2 font-semibold transition-colors">New Game</button>
                <button onClick={onResign} disabled={isGameOver} className="bg-red-800 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-md p-2 font-semibold transition-colors">Resign</button>
                <button onClick={onOfferDraw} disabled={isGameOver} className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-md p-2 font-semibold transition-colors">Offer Draw</button>
                <button onClick={onSaveGame} className="bg-blue-700 hover:bg-blue-600 rounded-md p-2 font-semibold transition-colors">Save Game</button>
            </div>
             <div className="grid grid-cols-1 gap-2 mt-2">
                 <button onClick={onLoadGame} className="bg-green-700 hover:bg-green-600 rounded-md p-2 font-semibold transition-colors">Load Game</button>
             </div>
        </div>
    );
};

export default GameInfoPanel;