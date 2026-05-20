import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store for reports
  // In a real app, this would be a database
  const reports = [
    {
      id: '1',
      streamName: 'Kali River Spring',
      clarity: 5,
      flow: 'High',
      pollution: 'None',
      lat: 14.85,
      lng: 74.15,
      reporter: 'Forest Guard',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      comments: 'Crystal clear water today.'
    },
    {
      id: '2',
      streamName: 'Netravati Tributary',
      clarity: 2,
      flow: 'Low',
      pollution: 'Agricultural runoff',
      lat: 12.87,
      lng: 74.88,
      reporter: 'Local Farmer',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      comments: 'Water looks very turbid after recent rains upstream.'
    }
  ];

  // API Routes
  app.get('/api/reports', (req, res) => {
    res.json(reports);
  });

  app.post('/api/reports', (req, res) => {
    const newReport = {
      ...req.body,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString()
    };
    reports.push(newReport);
    res.status(201).json(newReport);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
