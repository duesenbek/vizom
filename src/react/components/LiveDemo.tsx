import { useState } from 'react';
import { EnhancedDeepSeekClient } from '../../core/deepseek-complete';
import { ErrorTracker } from '../../tracking/error-tracking.js';
import { trackEvent } from '../../tracking/analytics';
import ChartRenderer from './ChartRenderer';

export default function LiveDemo() {
  const [type, setType] = useState<'bar'|'line'|'pie'|'area'>('bar');
  const [prompt, setPrompt] = useState('Show monthly sales trend for 2024');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartConfig, setChartConfig] = useState<any | null>(null);
  const [remaining, setRemaining] = useState<string | null>(null);

  const client = new EnhancedDeepSeekClient({
    apiKey: (import.meta as any).env?.VITE_DEEPSEEK_API_KEY || '',
    baseURL: (import.meta as any).env?.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
    model: (import.meta as any).env?.VITE_DEEPSEEK_MODEL || 'deepseek-chat',
    timeout: Number((import.meta as any).env?.VITE_DEEPSEEK_TIMEOUT) || 30000,
    enableCaching: true,
    enableUserFeedback: false
  });

  async function generate() {
    if (loading || !prompt.trim()) return;
    setLoading(true);
    setError(null);
    setChartConfig(null);
    try {
      const res = await client.generateChart({ prompt, options: { enableCache: true, estimatedDuration: 8000 } });
      if (!res.success || !res.data) throw new Error(res.error?.message || 'Failed to generate');
      const cfg = res.data.config ?? res.data;
      setChartConfig(cfg);
      trackEvent('demo_chart_generated', { promptLength: prompt.length, chartType: cfg?.type || type });
    } catch (e: any) {
      setError(e?.message || 'Request failed');
      try { ErrorTracker.trackError(e, { context: 'live-demo' }); } catch {}
      if (e?.status === 429) setRemaining('You have reached the limit. Try again later or upgrade.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="live-demo" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Try it now • No login</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4">Create Your First Chart</h2>
          <p className="text-gray-600 mt-3">Describe the chart you want. We handle the details.</p>
          {remaining && <p className="text-xs text-amber-600 mt-2">{remaining}</p>}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {['bar','line','pie','area'].map((t) => (
                <button key={t} onClick={() => setType(t as any)} className={`py-2 rounded border text-sm ${type===t? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white border-gray-200 text-gray-700'}`}>{t}</button>
              ))}
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">Chart Description</label>
            <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

            <button onClick={generate} className="mt-4 w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400" disabled={loading || !prompt.trim()}>
              {loading ? 'Generating…' : 'Generate Chart'}
            </button>

            {/* Prefilled examples */}
            <div className="mt-4 flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map(p => (
                <button key={p} onClick={() => setPrompt(p)} className="px-3 py-1 text-xs bg-white border rounded hover:bg-gray-50">{p}</button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="min-h-80 bg-white rounded-lg relative p-3">
              {loading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              )}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
              )}
              {chartConfig && !loading && (
                <ChartRenderer config={chartConfig} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const EXAMPLE_PROMPTS = [
  'Show monthly sales trend for 2024',
  'Compare revenue by product category',
  'Display user growth over time',
  'Show market share distribution',
];
