import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useStats } from '../contexts/StatsContext';
import './Result.css';

function Result() {
  const navigate = useNavigate();
  const { gameState, resetGame } = useGame();
  const { stats } = useStats();
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // ゲーム結果がない場合はホームに戻る
    if (!gameState.gameResult) {
      navigate('/');
      return;
    }

    // 新記録の場合、祝福アニメーションを表示
    const result = gameState.gameResult;
    if (result.wpm === stats.bestWpm || 
        result.accuracy === stats.bestAccuracy || 
        result.score === stats.bestScore) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [gameState.gameResult, navigate, stats]);

  if (!gameState.gameResult) {
    return null;
  }

  const result = gameState.gameResult;

  const handlePlayAgain = () => {
    resetGame();
    navigate('/game');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const formatDuration = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 
      ? `${minutes}分${remainingSeconds}秒`
      : `${remainingSeconds}秒`;
  };

  const getPerformanceLevel = (wpm) => {
    if (wpm >= 60) return { level: '上級者', color: '#28a745', message: '素晴らしいタイピング速度です！' };
    if (wpm >= 40) return { level: '中級者', color: '#ffc107', message: 'とても良いペースです！' };
    if (wpm >= 20) return { level: '初級者', color: '#17a2b8', message: '着実に上達しています！' };
    return { level: '練習中', color: '#6c757d', message: '練習を続けて頑張りましょう！' };
  };

  const getAccuracyLevel = (accuracy) => {
    if (accuracy >= 95) return { message: '非常に正確です！', color: '#28a745' };
    if (accuracy >= 85) return { message: '良い正確性です！', color: '#ffc107' };
    if (accuracy >= 75) return { message: 'まずまずの正確性です', color: '#17a2b8' };
    return { message: '正確性の向上が必要です', color: '#dc3545' };
  };

  const performance = getPerformanceLevel(result.wpm);
  const accuracyLevel = getAccuracyLevel(result.accuracy);

  const isNewRecord = {
    wpm: result.wpm === stats.bestWpm,
    accuracy: result.accuracy === stats.bestAccuracy,
    score: result.score === stats.bestScore
  };

  return (
    <div className="result">
      <div className="container">
        <h1>ゲーム結果</h1>
        
        {showCelebration && (
          <div className="celebration">
            🎉 新記録達成！ 🎉
          </div>
        )}
        
        <div className="result-content">
          {/* メインスコア */}
          <div className="main-score">
            <div className="score-circle">
              <div className="score-number">{result.score}</div>
              <div className="score-label">スコア</div>
            </div>
            <div className="performance-level">
              <span 
                className="level-badge"
                style={{ backgroundColor: performance.color }}
              >
                {performance.level}
              </span>
              <p className="level-message">{performance.message}</p>
            </div>
          </div>

          {/* 詳細統計 */}
          <div className="detailed-stats">
            <h2>詳細結果</h2>
            <div className="stats-grid">
              <div className={`stat-item ${isNewRecord.wpm ? 'new-record' : ''}`}>
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <div className="stat-value" style={{ color: performance.color }}>
                    {result.wpm}
                    {isNewRecord.wpm && <span className="record-badge">NEW!</span>}
                  </div>
                  <div className="stat-label">WPM</div>
                  <div className="stat-description">1分間の文字数</div>
                </div>
              </div>

              <div className={`stat-item ${isNewRecord.accuracy ? 'new-record' : ''}`}>
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-value" style={{ color: accuracyLevel.color }}>
                    {result.accuracy}%
                    {isNewRecord.accuracy && <span className="record-badge">NEW!</span>}
                  </div>
                  <div className="stat-label">正確性</div>
                  <div className="stat-description">{accuracyLevel.message}</div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <div className="stat-value">{formatDuration(result.duration)}</div>
                  <div className="stat-label">プレイ時間</div>
                  <div className="stat-description">実際のプレイ時間</div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-value">{result.correctChars}</div>
                  <div className="stat-label">正解文字数</div>
                  <div className="stat-description">正しく入力された文字</div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <div className="stat-value">{result.errors}</div>
                  <div className="stat-label">エラー数</div>
                  <div className="stat-description">間違った文字の数</div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-value">{result.correctChars + result.errors}</div>
                  <div className="stat-label">総入力文字数</div>
                  <div className="stat-description">入力した文字の総数</div>
                </div>
              </div>
            </div>
          </div>

          {/* 比較統計 */}
          <div className="comparison-stats">
            <h2>あなたの記録</h2>
            <div className="comparison-grid">
              <div className="comparison-item">
                <div className="comparison-label">今回</div>
                <div className="comparison-values">
                  <div>WPM: {result.wpm}</div>
                  <div>正確性: {result.accuracy}%</div>
                  <div>スコア: {result.score}</div>
                </div>
              </div>
              <div className="comparison-divider">VS</div>
              <div className="comparison-item">
                <div className="comparison-label">ベスト記録</div>
                <div className="comparison-values">
                  <div>WPM: {stats.bestWpm}</div>
                  <div>正確性: {stats.bestAccuracy}%</div>
                  <div>スコア: {stats.bestScore}</div>
                </div>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="result-actions">
            <button 
              className="action-btn primary-btn"
              onClick={handlePlayAgain}
            >
              もう一度プレイ
            </button>
            <button 
              className="action-btn secondary-btn"
              onClick={() => navigate('/stats')}
            >
              統計を見る
            </button>
            <button 
              className="action-btn secondary-btn"
              onClick={handleGoHome}
            >
              ホームに戻る
            </button>
          </div>

          {/* 励ましメッセージ */}
          <div className="encouragement">
            <h3>次回への提案</h3>
            <div className="tips">
              {result.accuracy < 85 && (
                <div className="tip">
                  <span className="tip-icon">💡</span>
                  正確性を重視して、ゆっくりと確実に入力してみましょう
                </div>
              )}
              {result.wpm < 30 && (
                <div className="tip">
                  <span className="tip-icon">🏃</span>
                  タイピング速度を向上させるため、ホームポジションを意識しましょう
                </div>
              )}
              {result.wpm >= 30 && result.accuracy >= 85 && (
                <div className="tip">
                  <span className="tip-icon">🎉</span>
                  素晴らしい成績です！より難しいレベルにチャレンジしてみませんか？
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;