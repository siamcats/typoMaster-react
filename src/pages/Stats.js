import React, { useState } from 'react';
import { useStats } from '../contexts/StatsContext';
import './Stats.css';

function Stats() {
  const {
    stats,
    resetStats,
    getAverageWpm,
    getAverageAccuracy,
    getProgressRate
  } = useStats();
  
  const [showRecentGames, setShowRecentGames] = useState(true);

  const handleResetStats = () => {
    if (window.confirm('統計データをリセットしますか？この操作は取り消せません。')) {
      resetStats();
    }
  };

  const formatDuration = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 
      ? `${minutes}分${remainingSeconds}秒`
      : `${remainingSeconds}秒`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPerformanceColor = (value, type) => {
    if (type === 'wpm') {
      if (value >= 60) return '#28a745';
      if (value >= 40) return '#ffc107';
      return '#dc3545';
    }
    if (type === 'accuracy') {
      if (value >= 95) return '#28a745';
      if (value >= 85) return '#ffc107';
      return '#dc3545';
    }
    return '#007bff';
  };

  const progressRate = getProgressRate();

  return (
    <div className="stats">
      <div className="container">
        <h1>統計</h1>
        
        <div className="stats-content">
          {/* 全体統計 */}
          <div className="stats-section">
            <h2>全体統計</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.totalGames}</div>
                <div className="stat-label">総ゲーム数</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{formatDuration(stats.totalTime)}</div>
                <div className="stat-label">総プレイ時間</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalChars.toLocaleString()}</div>
                <div className="stat-label">総入力文字数</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalCorrectChars.toLocaleString()}</div>
                <div className="stat-label">正確な入力文字数</div>
              </div>
            </div>
          </div>

          {/* ベスト記録 */}
          <div className="stats-section">
            <h2>ベスト記録</h2>
            <div className="stats-grid">
              <div className="stat-card best-card">
                <div 
                  className="stat-number"
                  style={{ color: getPerformanceColor(stats.bestWpm, 'wpm') }}
                >
                  {stats.bestWpm}
                </div>
                <div className="stat-label">最高WPM</div>
              </div>
              <div className="stat-card best-card">
                <div 
                  className="stat-number"
                  style={{ color: getPerformanceColor(stats.bestAccuracy, 'accuracy') }}
                >
                  {stats.bestAccuracy}%
                </div>
                <div className="stat-label">最高正確性</div>
              </div>
              <div className="stat-card best-card">
                <div className="stat-number" style={{ color: '#007bff' }}>
                  {stats.bestScore}
                </div>
                <div className="stat-label">最高スコア</div>
              </div>
              <div className="stat-card best-card">
                <div className="stat-number" style={{ color: '#6f42c1' }}>
                  {stats.todayBest.score}
                </div>
                <div className="stat-label">今日のベスト</div>
              </div>
            </div>
          </div>

          {/* 平均値 */}
          <div className="stats-section">
            <h2>平均パフォーマンス</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div 
                  className="stat-number"
                  style={{ color: getPerformanceColor(getAverageWpm(), 'wpm') }}
                >
                  {getAverageWpm()}
                </div>
                <div className="stat-label">平均WPM (最新5回)</div>
              </div>
              <div className="stat-card">
                <div 
                  className="stat-number"
                  style={{ color: getPerformanceColor(getAverageAccuracy(), 'accuracy') }}
                >
                  {getAverageAccuracy()}%
                </div>
                <div className="stat-label">全体正確性</div>
              </div>
              <div className="stat-card">
                <div 
                  className="stat-number"
                  style={{ 
                    color: progressRate > 0 ? '#28a745' : progressRate < 0 ? '#dc3545' : '#6c757d'
                  }}
                >
                  {progressRate > 0 ? '+' : ''}{progressRate}%
                </div>
                <div className="stat-label">進歩率</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#17a2b8' }}>
                  {stats.totalGames > 0 ? Math.round((stats.totalErrors / stats.totalChars) * 100) : 0}%
                </div>
                <div className="stat-label">エラー率</div>
              </div>
            </div>
          </div>

          {/* 最近のゲーム */}
          <div className="stats-section">
            <div className="section-header">
              <h2>最近のゲーム</h2>
              <button 
                className="toggle-btn"
                onClick={() => setShowRecentGames(!showRecentGames)}
              >
                {showRecentGames ? '隠す' : '表示'}
              </button>
            </div>
            
            {showRecentGames && (
              <div className="recent-games">
                {stats.recentGames.length === 0 ? (
                  <p className="no-games">まだゲームをプレイしていません</p>
                ) : (
                  <div className="games-list">
                    {stats.recentGames.map((game, index) => (
                      <div key={index} className="game-record">
                        <div className="game-date">
                          {formatDate(game.timestamp)}
                        </div>
                        <div className="game-stats">
                          <div className="game-stat">
                            <span className="game-stat-label">WPM:</span>
                            <span 
                              className="game-stat-value"
                              style={{ color: getPerformanceColor(game.wpm, 'wpm') }}
                            >
                              {game.wpm}
                            </span>
                          </div>
                          <div className="game-stat">
                            <span className="game-stat-label">正確性:</span>
                            <span 
                              className="game-stat-value"
                              style={{ color: getPerformanceColor(game.accuracy, 'accuracy') }}
                            >
                              {game.accuracy}%
                            </span>
                          </div>
                          <div className="game-stat">
                            <span className="game-stat-label">スコア:</span>
                            <span className="game-stat-value">{game.score}</span>
                          </div>
                          <div className="game-stat">
                            <span className="game-stat-label">時間:</span>
                            <span className="game-stat-value">{formatDuration(game.duration)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* アクション */}
          <div className="stats-actions">
            <button 
              className="reset-btn"
              onClick={handleResetStats}
              disabled={stats.totalGames === 0}
            >
              統計をリセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;