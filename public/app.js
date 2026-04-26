const { useEffect, useState } = React;

const getSignal = (probability, trend) => {
  if (probability > 60 && trend === 'up') return 'Bullish';
  if (probability < 40 && trend === 'down') return 'Bearish';
  return 'Neutral';
};

const getProbabilityClass = (probability) => {
  if (probability > 60) return 'high';
  if (probability < 40) return 'low';
  return 'mid';
};

const formatVolume = (value) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);

function App() {
  const [markets, setMarkets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch('/markets');
        if (!response.ok) {
          throw new Error('Failed to load market data');
        }
        const data = await response.json();
        setMarkets(data);
      } catch (err) {
        setError(err.message || 'Unexpected error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  return (
    <div className="page">
      <header className="header">
        <h1>PredictEdge Dashboard</h1>
        <p>Prediction market probabilities and directional signals.</p>
      </header>

      {isLoading && <p className="status">Loading markets...</p>}
      {error && <p className="status error">{error}</p>}

      <main className="grid">
        {!isLoading && !error &&
          markets.map((market) => {
            const signal = getSignal(market.probability, market.trend);
            const probabilityClass = getProbabilityClass(market.probability);
            return (
              <article key={market.id} className="card">
                <h2>{market.title}</h2>

                <p className={`probability ${probabilityClass}`}>{market.probability}%</p>

                <div className="row">
                  <span>Volume</span>
                  <strong>${formatVolume(market.volume)}</strong>
                </div>

                <div className="row">
                  <span>Trend</span>
                  <strong className={market.trend === 'up' ? 'trend up' : 'trend down'}>
                    {market.trend === 'up' ? '↑ Up' : '↓ Down'}
                  </strong>
                </div>

                <div className="row signal-row">
                  <span>Signal</span>
                  <strong>{signal}</strong>
                </div>
              </article>
            );
          })}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
