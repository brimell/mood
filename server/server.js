import rateLimit from 'express-rate-limit';
import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import https from 'https';
import fs from 'fs';
import api from './api/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

config(); // Load .env file contents into process.env

const app = express();

// HTTPS server setup
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'fullchain.pem')),
};
const server = https.createServer(httpsOptions, app);

app.use(
  rateLimit({
    windowMs: 30000,
    max: 500,
    message: 'You exceeded the rate limit.',
    headers: true,
  })
);

app.use(cors());
app.use(express.json());

// Define API routes
app.use('/api', api);

// Serve static files from the 'dist' directory
app.use(express.static(path.resolve(__dirname, '../dist')));

// Catch-all route for non-API routes
app.get('*', (req, res) => {
  // Skip serving 'index.html' for '/api' requests
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).send('Not found');
  } else {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
  }
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
