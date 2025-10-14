import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 統計データの初期値
const initialStats = {
  totalGames: 0,
  totalTime: 0,
  totalChars: 0,
  totalCorrectChars: 0,
  totalErrors: 0,
  bestWpm: 0,
  bestAccuracy: 0,
  bestScore: 0,
  todayBest: {
    wpm: 0,
    accuracy: 0,
    score: 0,
    date: new Date().toDateString()
  },
  recentGames: []
};

// アクションタイプ
const ACTIONS = {
  ADD_GAME_RESULT: 'ADD_GAME_RESULT',
  LOAD_STATS: 'LOAD_STATS',
  RESET_STATS: 'RESET_STATS',
  UPDATE_TODAY_BEST: 'UPDATE_TODAY_BEST'
};

// リデューサー
function statsReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_GAME_RESULT: {
      const result = action.payload;
      const newStats = {
        ...state,
        totalGames: state.totalGames + 1,
        totalTime: state.totalTime + result.duration,
        totalChars: state.totalChars + result.correctChars + result.errors,
        totalCorrectChars: state.totalCorrectChars + result.correctChars,
        totalErrors: state.totalErrors + result.errors,
        bestWpm: Math.max(state.bestWpm, result.wpm),
        bestAccuracy: Math.max(state.bestAccuracy, result.accuracy),
        bestScore: Math.max(state.bestScore, result.score),
        recentGames: [
          {
            ...result,
            timestamp: new Date().toISOString(),
            date: new Date().toDateString()
          },
          ...state.recentGames.slice(0, 9) // 最新10件まで保持
        ]
      };

      // 今日のベスト更新チェック
      const today = new Date().toDateString();
      if (state.todayBest.date !== today || result.score > state.todayBest.score) {
        newStats.todayBest = {
          wpm: result.wpm,
          accuracy: result.accuracy,
          score: result.score,
          date: today
        };
      }

      return newStats;
    }

    case ACTIONS.LOAD_STATS:
      return { ...state, ...action.payload };

    case ACTIONS.RESET_STATS:
      return { ...initialStats };

    case ACTIONS.UPDATE_TODAY_BEST: {
      const today = new Date().toDateString();
      if (state.todayBest.date !== today) {
        return {
          ...state,
          todayBest: {
            wpm: 0,
            accuracy: 0,
            score: 0,
            date: today
          }
        };
      }
      return state;
    }

    default:
      return state;
  }
}

// コンテキスト作成
const StatsContext = createContext();

// プロバイダーコンポーネント
export function StatsProvider({ children }) {
  const [stats, dispatch] = useReducer(statsReducer, initialStats);

  // ローカルストレージから統計を読み込み
  useEffect(() => {
    const savedStats = localStorage.getItem('typomaster-stats');
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      dispatch({ type: ACTIONS.LOAD_STATS, payload: parsedStats });
      
      // 日付が変わっている場合、今日のベストをリセット
      const today = new Date().toDateString();
      if (parsedStats.todayBest?.date !== today) {
        dispatch({ type: ACTIONS.UPDATE_TODAY_BEST });
      }
    }
  }, []);

  // 統計が変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('typomaster-stats', JSON.stringify(stats));
  }, [stats]);

  // ゲーム結果を追加
  const addGameResult = (result) => {
    dispatch({ type: ACTIONS.ADD_GAME_RESULT, payload: result });
  };

  // 統計リセット
  const resetStats = () => {
    dispatch({ type: ACTIONS.RESET_STATS });
  };

  // 平均値計算
  const getAverageWpm = () => {
    return stats.totalGames > 0 
      ? Math.round(stats.recentGames.slice(0, 5).reduce((sum, game) => sum + game.wpm, 0) / Math.min(stats.recentGames.length, 5))
      : 0;
  };

  const getAverageAccuracy = () => {
    return stats.totalGames > 0
      ? Math.round((stats.totalCorrectChars / stats.totalChars) * 100)
      : 100;
  };

  // 進歩率計算
  const getProgressRate = () => {
    if (stats.recentGames.length < 2) return 0;
    
    const recent5 = stats.recentGames.slice(0, 5);
    const previous5 = stats.recentGames.slice(5, 10);
    
    if (previous5.length === 0) return 0;
    
    const recentAvg = recent5.reduce((sum, game) => sum + game.wpm, 0) / recent5.length;
    const previousAvg = previous5.reduce((sum, game) => sum + game.wpm, 0) / previous5.length;
    
    return Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
  };

  const value = {
    stats,
    addGameResult,
    resetStats,
    getAverageWpm,
    getAverageAccuracy,
    getProgressRate
  };

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
}

// カスタムフック
export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}