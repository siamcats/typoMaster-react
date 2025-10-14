import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useSettings } from '../contexts/SettingsContext';
import { useStats } from '../contexts/StatsContext';
import './Game.css';

function Game() {
  const navigate = useNavigate();
  const { gameState, startGame, endGame, resetGame, updateInput, updateTime, pauseGame, resumeGame } = useGame();
  const { settings } = useSettings();
  const { addGameResult } = useStats();
  const [isStarted, setIsStarted] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // ゲーム開始
  const handleStartGame = () => {
    startGame(settings.gameDuration, settings.difficulty);
    setIsStarted(true);
    inputRef.current?.focus();
  };

  // ゲーム終了
  const handleGameEnd = useCallback(() => {
    const result = endGame();
    addGameResult(result);
    navigate('/result');
  }, [endGame, addGameResult, navigate]);

  // ゲームリセット
  const handleResetGame = () => {
    resetGame(settings.gameDuration);
    setIsStarted(false);
  };

  // タイマー処理
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && gameState.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        const newTimeLeft = gameState.timeLeft - 1;
        updateTime(newTimeLeft);
        
        if (newTimeLeft <= 0) {
          handleGameEnd();
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [gameState.isPlaying, gameState.isPaused, gameState.timeLeft, updateTime, handleGameEnd]);

  // 入力処理
  const handleInputChange = (e) => {
    const input = e.target.value;
    updateInput(input);

    // テキスト完了チェック
    if (input === gameState.currentText) {
      handleGameEnd();
    }
  };

  // 一時停止/再開
  const handleTogglePause = () => {
    if (gameState.isPaused) {
      resumeGame();
      inputRef.current?.focus();
    } else {
      pauseGame();
    }
  };

  // テキスト表示の処理
  const renderText = () => {
    if (!gameState.currentText) return null;

    return gameState.currentText.split('').map((char, index) => {
      let className = 'char';
      
      if (index < gameState.userInput.length) {
        className += gameState.userInput[index] === char ? ' correct' : ' incorrect';
      } else if (index === gameState.userInput.length) {
        className += ' current';
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="game">
      <div className="container">
        <h1>タイピングゲーム</h1>
        
        {!isStarted ? (
          <div className="game-start">
            <div className="game-settings">
              <p>難易度: <strong>{settings.difficulty}</strong></p>
              <p>制限時間: <strong>{settings.gameDuration}秒</strong></p>
            </div>
            <button className="start-btn" onClick={handleStartGame}>
              ゲーム開始
            </button>
          </div>
        ) : (
          <div className="game-area">
            <div className="game-timer">
              <span className="timer-label">残り時間:</span>
              <span className="timer-value">{gameState.timeLeft}秒</span>
            </div>
            
            <div className="text-display">
              {renderText()}
            </div>

            <div className="input-area">
              <textarea
                ref={inputRef}
                value={gameState.userInput}
                onChange={handleInputChange}
                disabled={gameState.isPaused || !gameState.isPlaying}
                placeholder="ここに入力してください..."
                className="game-input"
              />
            </div>

            <div className="game-controls">
              <button 
                className="control-btn"
                onClick={handleTogglePause}
                disabled={!gameState.isPlaying}
              >
                {gameState.isPaused ? '再開' : '一時停止'}
              </button>
              <button 
                className="control-btn reset-btn"
                onClick={handleResetGame}
              >
                リセット
              </button>
            </div>

            <div className="progress-info">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(gameState.userInput.length / gameState.currentText.length) * 100}%` 
                  }}
                />
              </div>
              <p className="progress-text">
                {gameState.userInput.length} / {gameState.currentText.length} 文字
                ({gameState.correctChars} 正解, {gameState.errors} エラー)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;