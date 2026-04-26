const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const markets = [
  {
    id: 1,
    title: 'Will BTC close above $80k this week?',
    probability: 67,
    volume: 1245000,
    trend: 'up',
    history: [52, 55, 58, 60, 62, 64, 67],
    headlines: [
      'ETF inflows accelerate as crypto demand rises',
      'Institutional desks report strong bitcoin accumulation',
      'Macro risk appetite improves across digital assets'
    ]
  },
  {
    id: 2,
    title: 'Will the Fed cut rates in June?',
    probability: 38,
    volume: 865000,
    trend: 'down',
    history: [49, 47, 46, 44, 42, 40, 38],
    headlines: [
      'Sticky inflation pressures keep policymakers cautious',
      'Labor market resilience weakens case for immediate cuts',
      'Officials warn against premature easing'
    ]
  },
  {
    id: 3,
    title: 'Will S&P 500 hit a new high this month?',
    probability: 54,
    volume: 642300,
    trend: 'up',
    history: [47, 48, 50, 51, 52, 53, 54],
    headlines: [
      'Mega-cap earnings beat expectations',
      'Analysts lift year-end targets after strong guidance',
      'Broader participation improves market breadth'
    ]
  },
  {
    id: 4,
    title: 'Will inflation print below 3% next release?',
    probability: 33,
    volume: 511900,
    trend: 'down',
    history: [45, 43, 41, 39, 36, 35, 33],
    headlines: [
      'Energy rebound threatens near-term disinflation trend',
      'Services prices remain elevated in latest surveys',
      'Economists trim odds of a cooler CPI surprise'
    ]
  },
  {
    id: 5,
    title: 'Will ETH outperform BTC this quarter?',
    probability: 61,
    volume: 729100,
    trend: 'up',
    history: [49, 50, 53, 55, 57, 59, 61],
    headlines: [
      'Developers highlight successful scaling upgrades',
      'On-chain activity rises as DeFi volumes recover',
      'Options markets show improving upside positioning for ETH'
    ]
  }
];

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function serveStaticFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }

    const extension = path.extname(filePath);
    const contentType = mimeTypes[extension] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/markets' && req.method === 'GET') {
    sendJson(res, 200, markets);
    return;
  }

  const safePath = req.url === '/' ? '/index.html' : req.url;
  const requestedPath = path.normalize(safePath).replace(/^\/+/, '');
  const fullPath = path.join(__dirname, 'public', requestedPath);

  if (!fullPath.startsWith(path.join(__dirname, 'public'))) {
    sendJson(res, 400, { error: 'Invalid path' });
    return;
  }

  if (path.extname(fullPath)) {
    serveStaticFile(res, fullPath);
    return;
  }

  serveStaticFile(res, path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`PredictEdge running at http://localhost:${PORT}`);
});
