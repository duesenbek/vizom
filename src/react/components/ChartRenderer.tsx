import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

type Props = {
  config: any; // Chart.js configuration
};

export default function ChartRenderer({ config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !config) return;

    // Destroy previous instance
    try { chartRef.current?.destroy(); } catch {}

    // Ensure minimal config shape
    const safeConfig = {
      type: config.type || 'bar',
      data: config.data || { labels: [], datasets: [] },
      options: { responsive: true, maintainAspectRatio: false, ...(config.options || {}) }
    } as any;

    chartRef.current = new Chart(ctx, safeConfig);

    return () => {
      try { chartRef.current?.destroy(); } catch {}
      chartRef.current = null;
    };
  }, [config]);

  return (
    <div style={{ width: '100%', height: 320 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
