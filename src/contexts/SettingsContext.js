import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 設定の初期値
const initialSettings = {
  gameDuration: 60,
  difficulty: 'medium',
  theme: 'light',
  soundEffects: true
};

// アクションタイプ
const ACTIONS = {
  SET_GAME_DURATION: 'SET_GAME_DURATION',
  SET_DIFFICULTY: 'SET_DIFFICULTY',
  SET_THEME: 'SET_THEME',
  TOGGLE_SOUND_EFFECTS: 'TOGGLE_SOUND_EFFECTS',
  LOAD_SETTINGS: 'LOAD_SETTINGS',
  RESET_SETTINGS: 'RESET_SETTINGS'
};

// リデューサー
function settingsReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_GAME_DURATION:
      return { ...state, gameDuration: action.payload };
    case ACTIONS.SET_DIFFICULTY:
      return { ...state, difficulty: action.payload };
    case ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };
    case ACTIONS.TOGGLE_SOUND_EFFECTS:
      return { ...state, soundEffects: !state.soundEffects };
    case ACTIONS.LOAD_SETTINGS:
      return { ...state, ...action.payload };
    case ACTIONS.RESET_SETTINGS:
      return { ...initialSettings };
    default:
      return state;
  }
}

// コンテキスト作成
const SettingsContext = createContext();

// プロバイダーコンポーネント
export function SettingsProvider({ children }) {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);

  // ローカルストレージから設定を読み込み
  useEffect(() => {
    const savedSettings = localStorage.getItem('typomaster-settings');
    if (savedSettings) {
      dispatch({
        type: ACTIONS.LOAD_SETTINGS,
        payload: JSON.parse(savedSettings)
      });
    }
  }, []);

  // 設定が変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('typomaster-settings', JSON.stringify(settings));
    
    // テーマをボディに適用
    document.body.className = settings.theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [settings]);

  // アクション関数
  const setGameDuration = (duration) => {
    dispatch({ type: ACTIONS.SET_GAME_DURATION, payload: duration });
  };

  const setDifficulty = (difficulty) => {
    dispatch({ type: ACTIONS.SET_DIFFICULTY, payload: difficulty });
  };

  const setTheme = (theme) => {
    dispatch({ type: ACTIONS.SET_THEME, payload: theme });
  };

  const toggleSoundEffects = () => {
    dispatch({ type: ACTIONS.TOGGLE_SOUND_EFFECTS });
  };

  const resetSettings = () => {
    dispatch({ type: ACTIONS.RESET_SETTINGS });
  };

  const value = {
    settings,
    setGameDuration,
    setDifficulty,
    setTheme,
    toggleSoundEffects,
    resetSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// カスタムフック
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}