const { useEffect, useMemo, useState } = React;

const POSITIVE_WORDS = [
  'accelerate', 'strong', 'improves', 'beat', 'lift', 'recover', 'successful', 'upside', 'rises', 'accumulation'
];
const NEGATIVE_WORDS = [
  'sticky', 'cautious', 'warn', 'premature', 'threatens', 'elevated', 'trim', 'weakens', 'risk', 'pressures'
];

const getSignal = (probability, trend) => {
  if (probability > 60 && trend === 'up') return 'Bullish';
  if (probability < 40 && trend === 'down') return 'Bearish';
  return 'Neutral';
};

const formatVolume = (value) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);

const calculateConfidenceScore = (volume, maxVolume) => {
  if (!maxVolume) return 0;
  const normalized = Math.min(volume / maxVolume, 1);
  return Math.round(normalized * 100);
};

const buildLinePoints = (history, width = 240, height = 72) => {
  if (!history || history.length === 0) return '';
  const xStep = width / Math.max(history.length - 1, 1);

  return history
    .map((value, index) => {
      const x = index * xStep;
      const y = height - (value / 100) * height;
      return `${x},${y}`;
    })
    .join(' ');
};


const getProbabilityAlert = (history = [], latestProbability) => {
  if (!history.length) return null;

  const previous = history.length > 1 ? history[history.length - 2] : history[0];
  const change = latestProbability - previous;

  if (Math.abs(change) <= 5) return null;

  return {
    change,
    direction: change > 0 ? 'up' : 'down'
  };
};

const analyzeNewsSentiment = (headlines = []) => {
  const score = headlines.reduce((acc, headline) => {
    const words = headline.toLowerCase().split(/[^a-z]+/).filter(Boolean);
    return (
      acc +
      words.reduce((inner, word) => {
        if (POSITIVE_WORDS.includes(word)) return inner + 1;
        if (NEGATIVE_WORDS.includes(word)) return inner - 1;
        return inner;
      }, 0)
    );
  }, 0);

  return score >= 0 ? 'Positive' : 'Negative';
};

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

  const maxVolume = useMemo(() => {
    if (!markets.length) return 0;
    return Math.max(...markets.map((market) => market.volume));
  }, [markets]);

  return (
    <div className="terminal-shell">
      <header className="terminal-header">
        <div>
          <h1>PredictEdge Terminal</h1>
          <p>Prediction market analytics and momentum signals</p>
        </div>
        <span className="market-count">{markets.length} markets</span>
      </header>

      {isLoading && <p className="status">Loading markets...</p>}
      {error && <p className="status error">{error}</p>}

      <main className="terminal-grid">
        {!isLoading && !error &&
          markets.map((market) => {
            const signal = getSignal(market.probability, market.trend);
            const confidenceScore = calculateConfidenceScore(market.volume, maxVolume);
            const linePoints = buildLinePoints(market.history);
            const signalClass = signal.toLowerCase();
            const sentiment = analyzeNewsSentiment(market.headlines);
            const sentimentClass = sentiment.toLowerCase();
            const probabilityAlert = getProbabilityAlert(market.history, market.probability);

            return (
              <article key={market.id} className="terminal-card">
                <div className="row between">
                  <h2>{market.title}</h2>
                  <span className={`signal-chip ${signalClass}`}>{signal}</span>
                </div>

                {probabilityAlert && (
                  <div className={`probability-alert ${probabilityAlert.direction}`}>
                    Alert: probability moved {probabilityAlert.change > 0 ? '+' : ''}
                    {probabilityAlert.change.toFixed(1)}% vs previous interval
                  </div>
                )}

                <div className="chart-wrap">
                  <svg viewBox="0 0 240 72" role="img" aria-label={`${market.title} probability chart`}>
                    <polyline className={`line ${signalClass}`} fill="none" points={linePoints} />
                  </svg>
                </div>

                <div className="metrics">
                  <div>
                    <span className="label">Probability</span>
                    <strong>{market.probability}%</strong>
                  </div>
                  <div>
                    <span className="label">Volume</span>
                    <strong>${formatVolume(market.volume)}</strong>
                  </div>
                  <div>
                    <span className="label">Trend</span>
                    <strong className={market.trend === 'up' ? 'up' : 'down'}>
                      {market.trend === 'up' ? '↑ Up' : '↓ Down'}
                    </strong>
                  </div>
                </div>

                <div className="confidence-row">
                  <span className="label">Confidence Score</span>
                  <strong>{confidenceScore}/100</strong>
                </div>
                <div className="confidence-bar" aria-hidden="true">
                  <div style={{ width: `${confidenceScore}%` }} className={`confidence-fill ${signalClass}`} />
                </div>

                <div className="news-block">
                  <div className="row between">
                    <span className="label">News Sentiment</span>
                    <span className={`sentiment-tag ${sentimentClass}`}>{sentiment}</span>
                  </div>
                  <ul>
                    {(market.headlines || []).slice(0, 2).map((headline, index) => (
                      <li key={`${market.id}-${index}`}>{headline}</li>
                    ))}
                  </ul>
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
