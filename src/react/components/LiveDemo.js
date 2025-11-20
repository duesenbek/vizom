import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ErrorTracker } from '../../tracking/error-tracking.js';
import { trackEvent } from '../../tracking/analytics';
import ChartRenderer from './ChartRenderer';
async function callDeepSeek(prompt, chartType) {
    const response = await fetch('/.netlify/functions/deepseek-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, chartType })
    });
    if (!response.ok) {
        let errorMessage = 'Generation failed';
        try {
            const error = await response.json();
            errorMessage = (error === null || error === void 0 ? void 0 : error.error) || errorMessage;
        }
        catch { }
        throw new Error(errorMessage);
    }
    return response.json();
}
export default function LiveDemo() {
    const [type, setType] = useState('bar');
    const [prompt, setPrompt] = useState('Show monthly sales trend for 2024');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chartConfig, setChartConfig] = useState(null);
    const [remaining, setRemaining] = useState(null);
    async function generate() {
        if (loading || !prompt.trim())
            return;
        setLoading(true);
        setError(null);
        setChartConfig(null);
        try {
            const res = await callDeepSeek(prompt, type);
            if (!res.success || !res.chartConfig)
                throw new Error((res === null || res === void 0 ? void 0 : res.error) || 'Failed to generate');
            const cfg = JSON.parse(res.chartConfig);
            setChartConfig(cfg);
            trackEvent('demo_chart_generated', { promptLength: prompt.length, chartType: cfg?.type || type });
        }
        catch (e) {
            setError(e?.message || 'Request failed');
            try {
                ErrorTracker.trackError(e, { context: 'live-demo' });
            }
            catch { }
            if (e?.status === 429)
                setRemaining('You have reached the limit. Try again later or upgrade.');
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx("section", { id: "live-demo", className: "py-16 bg-white", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "text-center max-w-3xl mx-auto mb-10", children: [_jsx("span", { className: "inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm", children: "Try it now \u2022 No login" }), _jsx("h2", { className: "text-3xl md:text-5xl font-bold mt-4", children: "Create Your First Chart" }), _jsx("p", { className: "text-gray-600 mt-3", children: "Describe the chart you want. We handle the details." }), remaining && _jsx("p", { className: "text-xs text-amber-600 mt-2", children: remaining })] }), _jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-xl p-5", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Chart Type" }), _jsx("div", { className: "grid grid-cols-4 gap-2 mb-5", children: ['bar', 'line', 'pie', 'area'].map((t) => (_jsx("button", { onClick: () => setType(t), className: `py-2 rounded border text-sm ${type === t ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white border-gray-200 text-gray-700'}`, children: t }, t))) }), _jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Chart Description" }), _jsx("textarea", { value: prompt, onChange: e => setPrompt(e.target.value), className: "w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" }), _jsx("button", { onClick: generate, className: "mt-4 w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400", disabled: loading || !prompt.trim(), children: loading ? 'Generating…' : 'Generate Chart' }), _jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: EXAMPLE_PROMPTS.map(p => (_jsx("button", { onClick: () => setPrompt(p), className: "px-3 py-1 text-xs bg-white border rounded hover:bg-gray-50", children: p }, p))) })] }), _jsx("div", { className: "bg-gray-50 border border-gray-200 rounded-xl p-5", children: _jsxs("div", { className: "min-h-80 bg-white rounded-lg relative p-3", children: [loading && (_jsx("div", { className: "absolute inset-0 bg-white/80 flex items-center justify-center", children: _jsx("div", { className: "w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" }) })), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm", children: error })), chartConfig && !loading && (_jsx(ChartRenderer, { config: chartConfig }))] }) })] })] }) }));
}
const EXAMPLE_PROMPTS = [
    'Show monthly sales trend for 2024',
    'Compare revenue by product category',
    'Display user growth over time',
    'Show market share distribution',
];
