import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { useStats } from '../contexts/StatsContext';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { stats } = useStats();

  const features = [
    { icon: '🎯', title: '3つの難易度', description: '初心者から上級者まで対応' },
    { icon: '📊', title: 'リアルタイム統計', description: 'WPM、正確性を即座に表示' },
    { icon: '💾', title: '進捗保存', description: 'あなたの成長を記録' },
    { icon: '🎨', title: 'カスタマイズ', description: 'テーマや設定を自由に変更' }
  ];

  const difficultyInfo = {
    easy: { name: '簡単', description: 'ひらがなのみ', color: '#4ade80' },
    medium: { name: '普通', description: 'ひらがな + カタカナ', color: '#fbbf24' },
    hard: { name: '難しい', description: '漢字 + 英数字', color: '#f87171' }
  };

  const currentDifficultyInfo = difficultyInfo[settings.difficulty];

  return (
    <div className="home">
      <div className="container">
        {/* ヒーロセクション */}
        <section className="hero">
          <h1 className="hero-title">
            TypoMaster
            <span className="title-subtitle">楽しく学べるタイピング練習</span>
          </h1>
          
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.totalGames}</div>
              <div className="stat-label">プレイ回数</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.bestWpm}</div>
              <div className="stat-label">最高WPM</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.bestAccuracy}%</div>
              <div className="stat-label">最高正確性</div>
            </div>
          </div>

          <div className="current-settings">
            <div className="setting-item">
              <span className="setting-label">制限時間:</span>
              <span className="setting-value">{settings.gameDuration}秒</span>
            </div>
            <div className="setting-item">
              <span className="setting-label">難易度:</span>
              <span 
                className="setting-value difficulty-badge"
                style={{ backgroundColor: currentDifficultyInfo.color }}
              >
                {currentDifficultyInfo.name}
              </span>
            </div>
          </div>

          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/game')}
            >
              <span className="btn-icon">🚀</span>
              ゲームを始める
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/settings')}
            >
              <span className="btn-icon">⚙️</span>
              設定を変更
            </button>
          </div>
        </section>

        {/* 機能紹介 */}
        <section className="features">
          <h2 className="section-title">主な機能</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 今日のベスト */}
        {stats.todayBest.score > 0 && (
          <section className="today-best">
            <h2 className="section-title">今日のベスト</h2>
            <div className="best-stats">
              <div className="best-stat">
                <div className="best-value">{stats.todayBest.wpm}</div>
                <div className="best-label">WPM</div>
              </div>
              <div className="best-stat">
                <div className="best-value">{stats.todayBest.accuracy}%</div>
                <div className="best-label">正確性</div>
              </div>
              <div className="best-stat">
                <div className="best-value">{stats.todayBest.score}</div>
                <div className="best-label">スコア</div>
              </div>
            </div>
          </section>
        )}

        {/* キーボードショートカット */}
        <section className="shortcuts">
          <h2 className="section-title">キーボードショートカット</h2>
          <div className="shortcuts-grid">
            <div className="shortcut-item">
              <kbd>Space</kbd>
              <span>ゲーム開始</span>
            </div>
            <div className="shortcut-item">
              <kbd>Esc</kbd>
              <span>リセット / ホームに戻る</span>
            </div>
            <div className="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>K</kbd>
              <span>設定画面を開く</span>
            </div>
            <div className="shortcut-item">
              <kbd>Ctrl</kbd> + <kbd>H</kbd>
              <span>ホーム画面に戻る</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;