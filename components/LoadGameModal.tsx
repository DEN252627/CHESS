import React, { useState, useEffect } from 'react';
import { SavedState, SavedGame, SavedGamesData } from '../App';

interface LoadGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoad: (state: SavedState) => void;
    onDelete: (folderName: string, gameName: string) => SavedGamesData;
}

const LoadGameModal: React.FC<LoadGameModalProps> = ({ isOpen, onClose, onLoad, onDelete }) => {
    const [savedData, setSavedData] = useState<SavedGamesData>({});
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const savesJSON = localStorage.getItem('chessGameSaves');
            const saves = savesJSON ? JSON.parse(savesJSON) : {};
            setSavedData(saves);
            const firstFolder = Object.keys(saves)[0];
            setSelectedFolder(firstFolder || null);
        }
    }, [isOpen]);

    const handleDelete = (folderName: string, gameName: string) => {
        const remainingSaves = onDelete(folderName, gameName);
        setSavedData(remainingSaves);
        if(remainingSaves[folderName] === undefined) {
             const firstFolder = Object.keys(remainingSaves)[0];
             setSelectedFolder(firstFolder || null);
        }
    };
    
    if (!isOpen) return null;
    
    const folders = Object.keys(savedData);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border-2 border-slate-700 p-6 rounded-lg shadow-2xl flex flex-col w-full max-w-3xl h-[70vh]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-white">Load Game</h3>
                     <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl">&times;</button>
                </div>
                
                <div className="flex-grow flex gap-4 overflow-hidden">
                    {/* Folders List */}
                    <div className="w-1/3 bg-slate-900 rounded-md p-2 overflow-y-auto">
                        {folders.length > 0 ? folders.map(folder => (
                             <button 
                                key={folder} 
                                onClick={() => setSelectedFolder(folder)}
                                className={`w-full text-left p-2 rounded-md mb-1 text-white text-lg ${selectedFolder === folder ? 'bg-amber-600' : 'hover:bg-slate-700'}`}
                             >
                                {folder}
                             </button>
                        )) : <p className="text-slate-400 p-2">No saved games.</p>}
                    </div>
                    
                    {/* Games List */}
                    <div className="w-2/3 bg-slate-900 rounded-md p-2 overflow-y-auto">
                        {selectedFolder && savedData[selectedFolder] ? savedData[selectedFolder].map((game: SavedGame) => (
                            <div key={game.name} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg mb-2">
                                <div>
                                    <p className="font-semibold text-white">{game.name}</p>
                                    <p className="text-xs text-slate-400">{new Date(game.date).toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2">
                                     <button onClick={() => onLoad(game.state)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md text-sm">Load</button>
                                     <button onClick={() => handleDelete(selectedFolder, game.name)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm">Delete</button>
                                </div>
                            </div>
                        )) : <p className="text-slate-400 p-2">Select a folder to see saved games.</p>}
                    </div>
                </div>

                <div className="mt-4 text-right">
                     <button
                        onClick={onClose}
                        className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoadGameModal;