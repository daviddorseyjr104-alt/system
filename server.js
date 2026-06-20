require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const DIST = path.join(__dirname, 'dist');
const isProduction = fs.existsSync(DIST);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : (isProduction ? 7462 : 3456);
const ACCESS_CODE = process.env.ACCESS_CODE || '';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const getClient = (clientKey) => {
  // Server key always wins when set (deterministic for hosted deploys).
  // Fall back to a client-provided key only when no server key exists.
  const envKey = (process.env.ANTHROPIC_API_KEY || '').trim();
  const key = envKey || (clientKey || '').trim();
  if (!key) throw new Error('No API key provided');
  return new Anthropic({ apiKey: key });
};

// Access code verification
app.post('/api/verify', (req, res) => {
  if (!ACCESS_CODE) return res.json({ ok: true });
  const { code } = req.body;
  res.json({ ok: code === ACCESS_CODE });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    model: 'claude-opus-4-8',
    port: PORT,
    hasKey: !!process.env.ANTHROPIC_API_KEY,
    requiresCode: !!ACCESS_CODE,
    timestamp: new Date().toISOString(),
  });
});

// Streaming chat endpoint
app.post('/api/chat', async (req, res) => {
  const { messages, systemPrompt, model, apiKey } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const anthropic = getClient(apiKey);
    const stream = anthropic.messages.stream({
      model: model || 'claude-opus-4-8',
      max_tokens: 16000,
      system: systemPrompt || 'You are a helpful assistant for Simon Miller, a contemporary fashion brand.',
      messages: messages || [],
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Claude API error:', error.message);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

// Test API key
app.post('/api/test', async (req, res) => {
  const { apiKey } = req.body;
  try {
    const anthropic = getClient(apiKey);
    await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'hi' }],
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(401).json({ ok: false, error: err.message });
  }
});

// Serve built React app in production (single server)
if (isProduction) {
  app.use(express.static(DIST, { maxAge: '1y', immutable: true }));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.sendFile(path.join(DIST, 'index.html'));
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  const mode = isProduction ? `PRODUCTION — http://localhost:${PORT}` : `DEVELOPMENT — API on :${PORT}, UI on :7462`;
  console.log(`\n✦ Simon Miller AI Command Center`);
  console.log(`✦ ${mode}`);
  console.log(`✦ API Key: ${process.env.ANTHROPIC_API_KEY ? 'Loaded ✓' : 'Not set — enter in Settings'}`);
  console.log(`✦ Access Code: ${ACCESS_CODE ? 'Protected ✓' : 'Open (no code required)'}\n`);
});
