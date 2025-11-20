import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
export default function ChartRenderer({ config }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx || !config)
            return;
        // Destroy previous instance
        try {
            chartRef.current?.destroy();
        }
        catch { }
        // Ensure minimal config shape
        const safeConfig = {
            type: config.type || 'bar',
            data: config.data || { labels: [], datasets: [] },
            options: { responsive: true, maintainAspectRatio: false, ...(config.options || {}) }
        };
        chartRef.current = new Chart(ctx, safeConfig);
        return () => {
            try {
                chartRef.current?.destroy();
            }
            catch { }
            chartRef.current = null;
        };
    }, [config]);
    return (_jsx("div", { style: { width: '100%', height: 320 }, children: _jsx("canvas", { ref: canvasRef }) }));
}
