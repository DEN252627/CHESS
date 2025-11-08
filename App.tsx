import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlayerColor, Position, PieceType } from './types';
import { GameState, createInitialGameState, getValidMoves, makeMove } from './chess-logic';
import { findBestMove } from './bot-logic';
import Chessboard from './components/Chessboard';
import GameSetup from './GameSetup';
import PromotionModal from './components/PromotionModal';
import { TimeControl } from './components/TimeControlSelector';
import GameInfoPanel from './GameInfoPanel';
import ConfirmationModal from './components/ConfirmationModal';
import SaveGameModal from './components/SaveGameModal';
import LoadGameModal from './components/LoadGameModal';
import PlayerInfo from './PlayerInfo';

export interface GameSettings {
  gameMode: 'pvp' | 'pve';
  playerColor: PlayerColor;
  botDifficulty: number;
  timeControl: TimeControl;
}

export type GameTurn = {
    gameState: GameState;
    timers: { [key in PlayerColor]: number };
};

export interface SavedState {
    turnHistory: GameTurn[];
    currentIndex: number;
    settings: GameSettings;
}

export interface SavedGame {
  name: string;
  date: string;
  state: SavedState;
}

export interface SavedGamesData {
  [folderName: string]: SavedGame[];
}

type PromotionData = { from: Position; to: Position } | null;

const App: React.FC = () => {
    const [settings, setSettings] = useState<GameSettings | null>(null);
    const [gameTurnHistory, setGameTurnHistory] = useState<GameTurn[]>([]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
    const [promotionMove, setPromotionMove] = useState<PromotionData>(null);
    const [showResignConfirm, setShowResignConfirm] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    
    const currentTurn = gameTurnHistory[historyIndex];
    const currentGameState = currentTurn?.gameState;
    const currentTimers = currentTurn?.timers;

    const isGameOver = currentGameState?.gameStatus.includes('wins') || currentGameState?.gameStatus.includes('Draw');
    
    // Timer Logic
    useEffect(() => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
        if (settings && !isGameOver && currentGameState) {
            timerIntervalRef.current = setInterval(() => {
                setGameTurnHistory(prevHistory => {
                    const newHistory = [...prevHistory];
                    const lastTurn = { ...newHistory[historyIndex] };
                    const newTimers = { ...lastTurn.timers };

                    if (newTimers[currentGameState.currentPlayer] > 0) {
                        newTimers[currentGameState.currentPlayer] -= 100;
                        if (newTimers[currentGameState.currentPlayer] <= 0) {
                            clearInterval(timerIntervalRef.current!);
                            const winner = currentGameState.currentPlayer === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE;
                            const newGameState = { ...currentGameState, gameStatus: `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins on time.` };
                            lastTurn.gameState = newGameState;
                        }
                    }
                    lastTurn.timers = newTimers;
                    newHistory[historyIndex] = lastTurn;
                    return newHistory;
                });
            }, 100);
        }
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, [settings, currentGameState?.currentPlayer, isGameOver, historyIndex]);
    
    const isBotTurn = settings?.gameMode === 'pve' && currentGameState?.currentPlayer !== settings?.playerColor && !isGameOver;

    // Bot move logic
    useEffect(() => {
        if (isBotTurn) {
            const botMoveTimeout = setTimeout(() => {
                const bestMove = findBestMove(currentGameState, settings!.botDifficulty);
                if (bestMove) {
                    performMove(bestMove.from, bestMove.to);
                }
            }, 500);
            return () => clearTimeout(botMoveTimeout);
        }
    }, [isBotTurn, currentGameState, settings]);


    const handleGameStart = (gameSettings: GameSettings) => {
        setSettings(gameSettings);
        const initialTimers = {
            [PlayerColor.WHITE]: gameSettings.timeControl.initial,
            [PlayerColor.BLACK]: gameSettings.timeControl.initial,
        };
        setGameTurnHistory([{ gameState: createInitialGameState(), timers: initialTimers }]);
        setHistoryIndex(0);
        setSelectedSquare(null);
        setPromotionMove(null);
    };

    const isInputDisabled = () => {
        if (!currentGameState || isGameOver) return true;
        if (settings?.gameMode === 'pve' && currentGameState.currentPlayer !== settings.playerColor) return true;
        return false;
    };
    
    const performMove = useCallback((from: Position, to: Position, promotionPiece: PieceType | null = null) => {
        if (!currentGameState || !settings) return;

        const timeIncrement = settings.timeControl.increment || 0;
        const newTimers = { ...currentTimers };
        newTimers[currentGameState.currentPlayer] += timeIncrement;

        const newState = makeMove(currentGameState, from, to, promotionPiece);
        
        const newTurn: GameTurn = { gameState: newState, timers: newTimers };

        setGameTurnHistory(prev => [...prev.slice(0, historyIndex + 1), newTurn]);
        setHistoryIndex(prev => prev + 1);
        setSelectedSquare(null);
        setPromotionMove(null);
    }, [currentGameState, currentTimers, historyIndex, settings]);

    const handleSquareClick = (position: Position) => {
        if (isInputDisabled() || !currentGameState) return;

        if (selectedSquare) {
            const pieceAtSelection = currentGameState.boardState[selectedSquare.row][selectedSquare.col];
            if (pieceAtSelection && pieceAtSelection.color === currentGameState.currentPlayer) {
                const validMoves = getValidMoves(currentGameState, selectedSquare);
                const isMoveValid = validMoves.some(m => m.row === position.row && m.col === position.col);
                if (isMoveValid) {
                    const piece = currentGameState.boardState[selectedSquare.row][selectedSquare.col];
                    const isPawn = piece?.type === PieceType.PAWN;
                    const promotionRow = piece?.color === PlayerColor.WHITE ? 0 : 7;
                    if (isPawn && position.row === promotionRow) {
                        setPromotionMove({ from: selectedSquare, to: position });
                        return;
                    }
                    performMove(selectedSquare, position);
                } else {
                     const targetPiece = currentGameState.boardState[position.row][position.col];
                     if(targetPiece && targetPiece.color === currentGameState.currentPlayer) {
                        setSelectedSquare(position);
                     } else {
                        setSelectedSquare(null);
                     }
                }
            } else {
                setSelectedSquare(position);
            }
        } else {
            const piece = currentGameState.boardState[position.row][position.col];
            if (piece && piece.color === currentGameState.currentPlayer) {
                setSelectedSquare(position);
            }
        }
    };
    
    const handlePieceDragStart = (position: Position) => {
        if (!isInputDisabled()) {
            setSelectedSquare(position);
        }
    };

    const handlePieceDrop = (position: Position) => {
        if (selectedSquare) {
            handleSquareClick(position);
        }
    };

    const handlePromote = (pieceType: PieceType) => {
        if (promotionMove) {
            performMove(promotionMove.from, promotionMove.to, pieceType);
        }
    };

    const handleNewGame = () => {
      setSettings(null);
      setGameTurnHistory([]);
      setHistoryIndex(0);
    };
    
    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setSelectedSquare(null);
        }
    };

    const handleRedo = () => {
        if (historyIndex < gameTurnHistory.length - 1) {
            setHistoryIndex(prev => prev + 1);
            setSelectedSquare(null);
        }
    };

    const handleResign = () => {
        if (!currentGameState) return;
        setShowResignConfirm(false);
        const winner = currentGameState.currentPlayer === PlayerColor.WHITE ? 'Black' : 'White';
        const newGameState = { ...currentGameState, gameStatus: `${winner} wins by resignation.` };
        const newTurn = { gameState: newGameState, timers: currentTimers };
        setGameTurnHistory(prev => [...prev.slice(0, historyIndex + 1), newTurn]);
        setHistoryIndex(prev => prev + 1);
    };

    const handleOfferDraw = () => {
        if (!currentGameState) return;

        if (currentGameState.drawOfferFrom && currentGameState.drawOfferFrom !== currentGameState.currentPlayer) {
            // Accept draw
            const newGameState = { ...currentGameState, gameStatus: `Draw by agreement.` };
            const newTurn = { gameState: newGameState, timers: currentTimers };
            setGameTurnHistory(prev => [...prev.slice(0, historyIndex + 1), newTurn]);
            setHistoryIndex(prev => prev + 1);
        } else {
            // Offer draw
            setGameTurnHistory(prev => {
                const newHistory = [...prev];
                const lastTurn = { ...newHistory[historyIndex] };
                const newGameState = { ...lastTurn.gameState, drawOfferFrom: currentGameState.currentPlayer };
                lastTurn.gameState = newGameState;
                newHistory[historyIndex] = lastTurn;
                return newHistory;
            });
        }
    };

    const saveGame = (gameName: string, folderName: string) => {
        if (!settings) return;
        const savesJSON = localStorage.getItem('chessGameSaves');
        const saves: SavedGamesData = savesJSON ? JSON.parse(savesJSON) : {};
        if (!saves[folderName]) {
            saves[folderName] = [];
        }

        const stateToSave: SavedState = {
            turnHistory: gameTurnHistory,
            currentIndex: historyIndex,
            settings: settings,
        };

        const newSave: SavedGame = {
            name: gameName,
            date: new Date().toISOString(),
            state: stateToSave
        };

        const existingGameIndex = saves[folderName].findIndex(g => g.name === gameName);
        if(existingGameIndex > -1) {
            saves[folderName][existingGameIndex] = newSave;
        } else {
            saves[folderName].push(newSave);
        }

        localStorage.setItem('chessGameSaves', JSON.stringify(saves));
        setShowSaveModal(false);
    };

    const loadGame = (stateToLoad: SavedState) => {
        setSettings(stateToLoad.settings);
        setGameTurnHistory(stateToLoad.turnHistory);
        setHistoryIndex(stateToLoad.currentIndex);
        setShowLoadModal(false);
    };

    const deleteGame = (folderName: string, gameName: string): SavedGamesData => {
         const savesJSON = localStorage.getItem('chessGameSaves');
         const saves: SavedGamesData = savesJSON ? JSON.parse(savesJSON) : {};
         if (saves[folderName]) {
             saves[folderName] = saves[folderName].filter(game => game.name !== gameName);
             if (saves[folderName].length === 0) {
                 delete saves[folderName];
             }
         }
         localStorage.setItem('chessGameSaves', JSON.stringify(saves));
         return saves;
    };
    
    if (!settings || !currentGameState) {
        return (
            <main className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
                <GameSetup onGameStart={handleGameStart} />
            </main>
        );
    }

    const possibleMoves = selectedSquare ? getValidMoves(currentGameState, selectedSquare) : [];

    const boardOrientation = settings.gameMode === 'pve' ? settings.playerColor : PlayerColor.WHITE;

    return (
        <main className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-7xl flex flex-col md:flex-row gap-4">
                <div className="flex-grow flex flex-col gap-4">
                    <PlayerInfo 
                        color={PlayerColor.BLACK}
                        timer={currentTimers.black}
                        capturedPieces={currentGameState.capturedPieces.white}
                        isActive={currentGameState.currentPlayer === PlayerColor.BLACK && !isGameOver}
                    />
                    <div className="w-full flex justify-center">
                        <Chessboard
                            boardState={currentGameState.boardState}
                            onSquareClick={handleSquareClick}
                            selectedSquare={selectedSquare}
                            possibleMoves={possibleMoves}
                            onPieceDragStart={handlePieceDragStart}
                            onPieceDrop={handlePieceDrop}
                            currentPlayer={currentGameState.currentPlayer}
                            isInputDisabled={isInputDisabled()}
                            boardOrientation={boardOrientation}
                        />
                    </div>
                    <PlayerInfo 
                        color={PlayerColor.WHITE}
                        timer={currentTimers.white}
                        capturedPieces={currentGameState.capturedPieces.black}
                        isActive={currentGameState.currentPlayer === PlayerColor.WHITE && !isGameOver}
                    />
                </div>
                <div className="w-full md:w-[24rem] lg:w-[26rem] flex-shrink-0">
                    <GameInfoPanel
                        gameState={currentGameState}
                        timers={currentTimers}
                        settings={settings}
                        onNewGame={handleNewGame}
                        onResign={() => setShowResignConfirm(true)}
                        onOfferDraw={handleOfferDraw}
                        onSaveGame={() => setShowSaveModal(true)}
                        onLoadGame={() => setShowLoadModal(true)}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={historyIndex > 0}
                        canRedo={historyIndex < gameTurnHistory.length - 1}
                    />
                </div>
            </div>
            {promotionMove && (
                <PromotionModal
                    color={currentGameState.boardState[promotionMove.from.row][promotionMove.from.col]!.color}
                    onPromote={handlePromote}
                />
            )}
            {showResignConfirm && (
                <ConfirmationModal
                    message="Are you sure you want to resign?"
                    onConfirm={handleResign}
                    onCancel={() => setShowResignConfirm(false)}
                />
            )}
             {currentGameState.drawOfferFrom && currentGameState.drawOfferFrom !== currentGameState.currentPlayer && (
                <ConfirmationModal
                    message="Your opponent offers a draw. Do you accept?"
                    onConfirm={() => handleOfferDraw()}
                    onCancel={() => { /* Reject draw logic */ }}
                />
            )}
            <SaveGameModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onSave={saveGame}
            />
            <LoadGameModal
                isOpen={showLoadModal}
                onClose={() => setShowLoadModal(false)}
                onLoad={loadGame}
                onDelete={deleteGame}
            />
        </main>
    );
};

export default App;