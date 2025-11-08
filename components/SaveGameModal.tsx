import React, { useState, useEffect } from 'react';
import { SavedGamesData } from '../App';

interface SaveGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (gameName: string, folderName: string) => void;
}

const SaveGameModal: React.FC<SaveGameModalProps> = ({ isOpen, onClose, onSave }) => {
    const [gameName, setGameName] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('Default');
    const [newFolderName, setNewFolderName] = useState('');
    const [existingFolders, setExistingFolders] = useState<string[]>(['Default']);
    const CREATE_NEW_FOLDER_OPT = '--create-new--';

    useEffect(() => {
        if (isOpen) {
            const savesJSON = localStorage.getItem('chessGameSaves');
            const saves: SavedGamesData = savesJSON ? JSON.parse(savesJSON) : {};
            const folders = Object.keys(saves);
            if (folders.length === 0) {
                 setExistingFolders(['Default']);
            } else {
                 setExistingFolders(folders);
            }
            setGameName(`Game - ${new Date().toLocaleString()}`);
            setSelectedFolder('Default');
            setNewFolderName('');
        }
    }, [isOpen]);

    const handleSave = () => {
        if (!gameName.trim()) {
            alert('Please enter a game name.');
            return;
        }
        
        let finalFolderName = selectedFolder;
        if (selectedFolder === CREATE_NEW_FOLDER_OPT) {
            if (!newFolderName.trim()) {
                alert('Please enter a new folder name.');
                return;
            }
            finalFolderName = newFolderName.trim();
        }
        onSave(gameName.trim(), finalFolderName);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-lg shadow-2xl flex flex-col w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-white text-center">Save Game</h3>
                
                <div className="mb-4">
                    <label htmlFor="gameName" className="block text-sm font-medium text-slate-300 mb-2">Game Name</label>
                    <input
                        type="text"
                        id="gameName"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="folderSelect" className="block text-sm font-medium text-slate-300 mb-2">Folder</label>
                    <select
                        id="folderSelect"
                        value={selectedFolder}
                        onChange={(e) => setSelectedFolder(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        {existingFolders.map(folder => <option key={folder} value={folder}>{folder}</option>)}
                        <option value={CREATE_NEW_FOLDER_OPT}>Create New Folder...</option>
                    </select>
                </div>
                
                {selectedFolder === CREATE_NEW_FOLDER_OPT && (
                    <div className="mb-6">
                        <label htmlFor="newFolderName" className="block text-sm font-medium text-slate-300 mb-2">New Folder Name</label>
                        <input
                            type="text"
                            id="newFolderName"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Enter new folder name"
                            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                )}
                
                <div className="flex gap-4 w-full">
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed"
                        disabled={!gameName.trim() || (selectedFolder === CREATE_NEW_FOLDER_OPT && !newFolderName.trim())}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveGameModal;