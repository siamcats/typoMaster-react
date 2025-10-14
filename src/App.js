import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { StatsProvider } from './contexts/StatsContext';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import Game from './pages/Game';
import Settings from './pages/Settings';
import Stats from './pages/Stats';
import Result from './pages/Result';
import './App.css';

function App() {
  return (
    <SettingsProvider>
      <StatsProvider>
        <GameProvider>
          <Router>
            <div className="App">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="/result" element={<Result />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/stats" element={<Stats />} />
                </Routes>
              </main>
            </div>
          </Router>
        </GameProvider>
      </StatsProvider>
    </SettingsProvider>
  );
}

export default App;
