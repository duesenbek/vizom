export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { prompt, chartType, model = 'deepseek-chat' } = JSON.parse(event.body || '{}');

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid prompt: must be at least 3 characters' })
      };
    }

    if (prompt.length > 2000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt too long: max 2000 characters' })
      };
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      console.error('DEEPSEEK_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Service configuration error' })
      };
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a Chart.js configuration generator. Return only valid JSON configuration for Chart.js.'
          },
          {
            role: 'user',
            content: `Generate Chart.js config for: ${prompt}. Chart type: ${chartType || 'auto'}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: 'AI service error', details: errorText })
      };
    }

    const data = await response.json();
    const chartConfig = data.choices?.[0]?.message?.content;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        chartConfig,
        usage: data.usage
      })
    };
  } catch (error) {
    console.error('DeepSeek proxy error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Generation failed',
        message: error.message || 'Unknown error'
      })
    };
  }
}
