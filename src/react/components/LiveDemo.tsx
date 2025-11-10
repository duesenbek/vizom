import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export default function LiveDemo() {
  const [type, setType] = useState<'bar'|'line'|'pie'|'area'>('bar');
  const [prompt, setPrompt] = useState('Create a bar chart showing monthly sales data for Q1 2024');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => () => chartRef.current?.destroy(), []);

  const generate = async () => {
    if (loading) return;
    setLoading(true);
    setReady(false);
    await simulateProgress();
    renderChart();
    setLoading(false);
    setReady(true);
  };

  const simulateProgress = async () => new Promise(r => setTimeout(r, 1200));

  const renderChart = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    chartRef.current?.destroy();

    const data = getData(type, prompt);
    chartRef.current = new Chart(ctx, {
      type: data.type as any,
      data: data.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: data.title }
        }
      }
    });
  };

  return (
    <section id="live-demo" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">Try it now • No login</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4">Create Your First Chart</h2>
          <p className="text-gray-600 mt-3">Describe the chart you want. We handle the details.</p>
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

            <button onClick={generate} className="mt-4 w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400" disabled={loading}>
              {loading ? 'Generating…' : 'Generate Chart'}
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="h-80 bg-white rounded-lg relative">
              {loading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              )}
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>

            {ready && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                <button onClick={() => download('png')} className="py-2 rounded border bg-white border-gray-200">PNG</button>
                <button disabled className="py-2 rounded border bg-white border-gray-200 opacity-60 cursor-not-allowed">SVG</button>
                <button disabled className="py-2 rounded border bg-white border-gray-200 opacity-60 cursor-not-allowed">PDF</button>
                <button onClick={() => download('html')} className="py-2 rounded border bg-white border-gray-200">HTML</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  function download(kind: 'png'|'html') {
    if (!chartRef.current) return;
    const link = document.createElement('a');
    if (kind==='png') {
      link.download = 'chart.png';
      link.href = chartRef.current.toBase64Image();
      link.click();
    } else {
      const html = `<!doctype html><html><head><title>Chart</title><script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"><\/script></head><body><canvas id="c" width="800" height="400"></canvas><script>console.log('Vizom chart');<\/script></body></html>`;
      const blob = new Blob([html], { type: 'text/html' });
      link.download = 'chart.html';
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  }
}

function getData(type: string, prompt: string) {
  if (prompt.toLowerCase().includes('sales')) {
    return { type: 'bar', title: 'Monthly Sales', data: { labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets: [{ label: 'Sales', data: [65,78,90,81,95,110], backgroundColor: 'rgba(59,130,246,0.8)' }] } };
  }
  if (prompt.toLowerCase().includes('growth')) {
    return { type: 'line', title: 'User Growth', data: { labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets: [{ label: 'Users', data: [1000,1500,2300,3200,4100,5200], borderColor: '#22C55E', backgroundColor: 'rgba(34,197,94,.12)', fill: true, tension: .4 }] } };
  }
  return { type, title: 'Generated Chart', data: { labels: ['A','B','C','D'], datasets: [{ label: 'Values', data: [12,19,3,5], backgroundColor: '#3B82F6' }] } };
}
