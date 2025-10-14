import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import './Settings.css';

function Settings() {
  const {
    settings,
    setGameDuration,
    setDifficulty,
    setTheme,
    toggleSoundEffects,
    resetSettings
  } = useSettings();

  const handleDurationChange = (e) => {
    setGameDuration(parseInt(e.target.value));
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleResetSettings = () => {
    if (window.confirm('設定をリセットしますか？')) {
      resetSettings();
    }
  };

  return (
    <div className="settings">
      <div className="container">
        <h1>設定</h1>
        
        <div className="settings-content">
          <div className="settings-section">
            <h2>ゲーム設定</h2>
            
            <div className="setting-item">
              <label htmlFor="duration">制限時間</label>
              <select
                id="duration"
                value={settings.gameDuration}
                onChange={handleDurationChange}
                className="setting-select"
              >
                <option value={30}>30秒</option>
                <option value={60}>1分</option>
                <option value={120}>2分</option>
                <option value={300}>5分</option>
              </select>
            </div>

            <div className="setting-item">
              <label htmlFor="difficulty">難易度</label>
              <select
                id="difficulty"
                value={settings.difficulty}
                onChange={handleDifficultyChange}
                className="setting-select"
              >
                <option value="easy">初級（ひらがな）</option>
                <option value="medium">中級（ひらがな + カタカナ）</option>
                <option value="hard">上級（漢字混じり）</option>
              </select>
            </div>

            <div className="difficulty-info">
              <h3>難易度について</h3>
              <div className="difficulty-examples">
                <div className="difficulty-example">
                  <strong>初級:</strong> あいうえお かきくけこ さしすせそ
                </div>
                <div className="difficulty-example">
                  <strong>中級:</strong> コンピュータと インターネット
                </div>
                <div className="difficulty-example">
                  <strong>上級:</strong> TypeScriptはJavaScriptに型安全性を追加した言語です。
                </div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>表示設定</h2>
            
            <div className="setting-item">
              <label htmlFor="theme">テーマ</label>
              <select
                id="theme"
                value={settings.theme}
                onChange={handleThemeChange}
                className="setting-select"
              >
                <option value="light">ライト</option>
                <option value="dark">ダーク</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h2>音響設定</h2>
            
            <div className="setting-item checkbox-item">
              <label htmlFor="soundEffects" className="checkbox-label">
                <input
                  type="checkbox"
                  id="soundEffects"
                  checked={settings.soundEffects}
                  onChange={toggleSoundEffects}
                  className="setting-checkbox"
                />
                <span className="checkmark"></span>
                効果音を有効にする
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h2>現在の設定</h2>
            <div className="current-settings">
              <div className="current-setting">
                <span className="setting-name">制限時間:</span>
                <span className="setting-value">{settings.gameDuration}秒</span>
              </div>
              <div className="current-setting">
                <span className="setting-name">難易度:</span>
                <span className="setting-value">
                  {settings.difficulty === 'easy' && '初級'}
                  {settings.difficulty === 'medium' && '中級'}
                  {settings.difficulty === 'hard' && '上級'}
                </span>
              </div>
              <div className="current-setting">
                <span className="setting-name">テーマ:</span>
                <span className="setting-value">
                  {settings.theme === 'light' ? 'ライト' : 'ダーク'}
                </span>
              </div>
              <div className="current-setting">
                <span className="setting-name">効果音:</span>
                <span className="setting-value">
                  {settings.soundEffects ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button
              className="reset-btn"
              onClick={handleResetSettings}
            >
              設定をリセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;