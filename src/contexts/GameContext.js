import React, { createContext, useContext, useReducer } from 'react';

// ゲーム状態の初期値
const initialGameState = {
  isPlaying: false,
  isPaused: false,
  currentText: '',
  userInput: '',
  currentIndex: 0,
  correctChars: 0,
  totalChars: 0,
  errors: 0,
  wpm: 0,
  accuracy: 100,
  score: 0,
  timeLeft: 60,
  startTime: null,
  endTime: null,
  gameResult: null
};

// アクションタイプ
const ACTIONS = {
  START_GAME: 'START_GAME',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME',
  END_GAME: 'END_GAME',
  RESET_GAME: 'RESET_GAME',
  UPDATE_INPUT: 'UPDATE_INPUT',
  UPDATE_TIME: 'UPDATE_TIME',
  UPDATE_STATS: 'UPDATE_STATS',
  SET_TEXT: 'SET_TEXT'
};

// ゲームテキストサンプル
const textSamples = {
  easy: [
    'あいうえお かきくけこ さしすせそ たちつてと なにぬねの',
    'はまやらわ ひみゆりを ふむゆるん へめよれゑ ほもよろん',
    'きょうは いい てんきです みんなで そとで あそびましょう'
  ],
  medium: [
    'こんにちは みなさん きょうは とても あたたかい ひですね',
    'コンピュータと インターネットの おかげで せかいが つながっています',
    'カタカナと ひらがなを くみあわせて ぶんしょうを つくります'
  ],
  hard: [
    '今日は良い天気です。公園で桜を見てきました。春の季節が大好きです。',
    'プログラミング言語にはJavaScript、Python、Java等があります。',
    'TypeScriptはJavaScriptに型安全性を追加した言語です。'
  ]
};

// リデューサー
function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_GAME:
      return {
        ...state,
        isPlaying: true,
        isPaused: false,
        startTime: Date.now(),
        timeLeft: action.payload.duration
      };
      
    case ACTIONS.PAUSE_GAME:
      return {
        ...state,
        isPaused: true
      };
      
    case ACTIONS.RESUME_GAME:
      return {
        ...state,
        isPaused: false
      };
      
    case ACTIONS.END_GAME:
      return {
        ...state,
        isPlaying: false,
        isPaused: false,
        endTime: Date.now(),
        gameResult: action.payload
      };
      
    case ACTIONS.RESET_GAME:
      return {
        ...initialGameState,
        timeLeft: action.payload?.duration || 60
      };
      
    case ACTIONS.UPDATE_INPUT:
      return {
        ...state,
        userInput: action.payload.input,
        currentIndex: action.payload.currentIndex,
        correctChars: action.payload.correctChars,
        errors: action.payload.errors,
        totalChars: action.payload.totalChars
      };
      
    case ACTIONS.UPDATE_TIME:
      return {
        ...state,
        timeLeft: action.payload
      };
      
    case ACTIONS.UPDATE_STATS:
      return {
        ...state,
        wpm: action.payload.wpm,
        accuracy: action.payload.accuracy,
        score: action.payload.score
      };
      
    case ACTIONS.SET_TEXT:
      return {
        ...state,
        currentText: action.payload
      };
      
    default:
      return state;
  }
}

// コンテキスト作成
const GameContext = createContext();

// プロバイダーコンポーネント
export function GameProvider({ children }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  // ランダムなテキストを取得
  const getRandomText = (difficulty) => {
    const texts = textSamples[difficulty] || textSamples.medium;
    return texts[Math.floor(Math.random() * texts.length)];
  };

  // ゲーム開始
  const startGame = (duration, difficulty) => {
    const text = getRandomText(difficulty);
    dispatch({ type: ACTIONS.SET_TEXT, payload: text });
    dispatch({ type: ACTIONS.START_GAME, payload: { duration } });
  };

  // ゲーム終了
  const endGame = () => {
    const result = {
      wpm: gameState.wpm,
      accuracy: gameState.accuracy,
      score: gameState.score,
      correctChars: gameState.correctChars,
      errors: gameState.errors,
      duration: Date.now() - gameState.startTime
    };
    dispatch({ type: ACTIONS.END_GAME, payload: result });
    return result;
  };

  // ゲームリセット
  const resetGame = (duration = 60) => {
    dispatch({ type: ACTIONS.RESET_GAME, payload: { duration } });
  };

  // 入力処理
  const updateInput = (input) => {
    const currentIndex = input.length;
    let correctChars = 0;
    let errors = 0;

    for (let i = 0; i < input.length; i++) {
      if (i < gameState.currentText.length && input[i] === gameState.currentText[i]) {
        correctChars++;
      } else {
        errors++;
      }
    }

    dispatch({
      type: ACTIONS.UPDATE_INPUT,
      payload: {
        input,
        currentIndex,
        correctChars,
        errors,
        totalChars: input.length
      }
    });

    // 統計更新
    updateStats(correctChars, errors, input.length);
  };

  // 統計更新
  const updateStats = (correctChars, errors, totalChars) => {
    const timeElapsed = gameState.startTime ? (Date.now() - gameState.startTime) / 1000 / 60 : 0;
    const wpm = timeElapsed > 0 ? Math.round((correctChars / 5) / timeElapsed) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    const score = Math.round(wpm * (accuracy / 100));

    dispatch({
      type: ACTIONS.UPDATE_STATS,
      payload: { wpm, accuracy, score }
    });
  };

  // 時間更新
  const updateTime = (timeLeft) => {
    dispatch({ type: ACTIONS.UPDATE_TIME, payload: timeLeft });
  };

  // ゲーム一時停止/再開
  const pauseGame = () => {
    dispatch({ type: ACTIONS.PAUSE_GAME });
  };

  const resumeGame = () => {
    dispatch({ type: ACTIONS.RESUME_GAME });
  };

  const value = {
    gameState,
    startGame,
    endGame,
    resetGame,
    updateInput,
    updateTime,
    pauseGame,
    resumeGame,
    getRandomText
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// カスタムフック
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}