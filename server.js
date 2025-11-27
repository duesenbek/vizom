/**
 * VIZOM Backend Server
 * Secure API proxy for DeepSeek API calls
 * SECURITY: API key is stored server-side and never exposed to client
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com", "https://esm.sh", "https://cdn.jsdelivr.net", "https://plausible.io", "https://analytics.umami.is", "https://www.googletagmanager.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.deepseek.com", "https://*.supabase.co", "wss://*.supabase.co", "https://esm.sh", "https://plausible.io", "https://analytics.umami.is"],
      frameAncestors: ["'none'"]
    }
  }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);

// Validate API key exists (warn but don't exit for development/testing)
if (!process.env.DEEPSEEK_API_KEY) {
  console.warn('WARNING: DEEPSEEK_API_KEY not set. AI generation will not work.');
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * POST /api/generate
 * Generate visualization using DeepSeek API
 * SECURITY: API key is kept server-side
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, chartType } = req.body;

    // Input validation
    if (!prompt || typeof prompt !== 'string' || prompt.length > 5000) {
      return res.status(400).json({ error: 'Invalid prompt' });
    }

    if (!chartType || typeof chartType !== 'string') {
      return res.status(400).json({ error: 'Invalid chart type' });
    }

    // Call DeepSeek API with server-side key and timeout
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 30000);
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Chart.js developer. Your task is to generate a Chart.js configuration object in JSON format. Respond with ONLY the JavaScript object, no markdown, no explanations. For dashboards, provide a JSON object with \'layout\' and \'charts\' keys as requested in the user prompt.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      }),
      signal: controller.signal
    }).finally(() => clearTimeout(id));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API error:', errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || 'Failed to generate visualization'
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'No content received from API' });
    }

    // Return sanitized response
    res.json({
      html: content,
      success: true
    });

  } catch (error) {
    const msg = error?.name === 'AbortError' ? 'Upstream request timed out' : (error.message || 'Internal server error');
    console.error('Generation error:', error);
    res.status(500).json({ error: msg });
  }
});

/**
 * POST /api/parse
 * Parse messy data using DeepSeek API
 * SECURITY: API key is kept server-side
 */
app.post('/api/parse', async (req, res) => {
  try {
    const { text } = req.body;

    // Input validation
    if (!text || typeof text !== 'string' || text.length > 5000) {
      return res.status(400).json({ error: 'Invalid input text' });
    }

    const analysisPrompt = `You are a data analysis expert. Analyze this messy data and convert it to structured JSON.

Data to analyze:
${text}

Instructions:
1. Identify the data type (chart data, table data, or mixed)
2. Extract all numbers, labels, and relationships
3. Determine the best visualization type (bar, line, pie, table, dashboard)
4. Structure the data appropriately

Return ONLY valid JSON in this exact format:
{
  "type": "bar|line|pie|table|dashboard",
  "title": "Descriptive title",
  "data": {
    "labels": ["label1", "label2", ...],
    "values": [value1, value2, ...],
    "datasets": [{"name": "Series 1", "data": [...]}]
  },
  "columns": ["col1", "col2", ...],
  "rows": [[val1, val2, ...], ...]
}

Be smart about detecting patterns, separators, and data relationships.`;

    // Call DeepSeek API with server-side key and timeout
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 30000);
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a data parsing expert. Always return valid JSON only, no markdown or explanations.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
      signal: controller.signal
    }).finally(() => clearTimeout(id));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API error:', errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || 'Failed to parse data'
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'No content received from API' });
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(400).json({ error: 'Could not parse JSON from response' });
    }

    try {
      const parsedData = JSON.parse(jsonMatch[0]);
      res.json(parsedData);
    } catch (parseError) {
      return res.status(400).json({ error: 'Invalid JSON in response' });
    }

  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`VIZOM Backend Server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  POST /api/generate - Generate visualization`);
  console.log(`  POST /api/parse - Parse messy data`);
  console.log(`  GET /api/health - Health check`);
});

export default app;
