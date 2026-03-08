import { useState, useEffect, useMemo } from 'react';
import './App.css';
import CareerChart from './components/CareerChart';

function App() {
  const [careerData, setCareerData] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load Data on Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Add a timestamp to avoid caching issues with local JSON
        const response = await fetch(`/career_data.json?v=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCareerData(data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('データの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Prepare drop-down items sorted by total points
  const playersList = useMemo(() => {
    const items = Object.keys(careerData).map((key) => {
      const p = careerData[key];
      const points = p.cumulative_points?.slice(-1)[0] || 0;
      return { id: key, name: p.name, points };
    });
    return items.filter((p) => p.points > 0).sort((a, b) => b.points - a.points);
  }, [careerData]);

  // Derived state for the currently selected player's chart data
  const chartData = useMemo(() => {
    if (!selectedPlayer || !careerData) return null;

    // Find player by exact name match
    const playerId = Object.keys(careerData).find(
      (key) => careerData[key].name === selectedPlayer
    );

    if (playerId && careerData[playerId]) {
      return careerData[playerId];
    }
    return null;
  }, [selectedPlayer, careerData]);

  return (
    <div className="app-container">
      <header className="animate-fade-in">
        <h1>B通算得点の推移</h1>
        <p>Bリーグの通算得点の推移を洗練されたグラフで可視化</p>
      </header>

      <main className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <section className="search-section glass-panel">
          <label htmlFor="player-input">選手を選択してください:</label>
          <div className="controls">
            <input
              type="text"
              id="player-input"
              list="player-list"
              className="player-input"
              placeholder={loading ? 'データをロード中...' : '選手名を入力または選択...'}
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              disabled={loading || !!error}
            />
            <datalist id="player-list">
              {playersList.map((player) => (
                <option key={player.id} value={player.name} />
              ))}
            </datalist>
          </div>
        </section>

        <section className="chart-section glass-panel" style={{ marginTop: '2rem' }}>
          {loading ? (
            <div className="loading-text animate-pulse">データを読み込み中...</div>
          ) : error ? (
            <div className="empty-state" style={{ color: '#f85149' }}>
              <p>{error}</p>
            </div>
          ) : !chartData ? (
            <div className="empty-state">
              <p>☝️ 選手を選択するとグラフが表示されます</p>
            </div>
          ) : (
            <CareerChart playerInfo={chartData} />
          )}
        </section>
      </main>

      <footer className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <p>Created by @TokyocrM &middot; Powered by React & Vite</p>
      </footer>
    </div>
  );
}

export default App;
