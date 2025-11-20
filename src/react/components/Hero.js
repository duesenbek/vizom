import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
export default function Hero() {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        runDemo('Monthly sales data for Q1 2024');
        return () => chartRef.current?.destroy();
    }, []);
    const runDemo = async (prompt) => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx)
            return;
        chartRef.current?.destroy();
        const data = getDemoData(prompt);
        chartRef.current = new Chart(ctx, {
            type: data.type,
            data: data.chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                animation: { duration: 800 }
            }
        });
        setLoading(false);
    };
    return (_jsx("section", { className: "relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: _jsx("div", { className: "container mx-auto px-4 pt-16 pb-20", children: _jsxs("div", { className: "grid lg:grid-cols-2 gap-10 items-center", children: [_jsxs("div", { className: "space-y-7", children: [_jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700", children: "Powered by DeepSeek \u2022 No credit card" }), _jsxs("h1", { className: "text-4xl md:text-6xl font-bold text-gray-900 leading-tight", children: ["Create Beautiful ", _jsx("span", { className: "text-blue-600", children: "Charts" }), " in Seconds"] }), _jsx("p", { className: "text-lg md:text-xl text-gray-600 max-w-xl", children: "Describe your data in plain English. Vizom turns ideas into stunning, interactive charts\u2014fast." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsx("a", { href: "#live-demo", className: "px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-center", children: "Try it now" }), _jsx("button", { onClick: () => runDemo('Market share distribution'), className: "px-6 py-3 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50", children: "Watch demo" })] }), _jsxs("div", { className: "flex items-center gap-6 text-gray-600", children: [_jsx("div", { className: "text-sm", children: "2,000+ users" }), _jsx("div", { className: "text-sm", children: "4.9/5 rating" })] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 h-96 relative", children: [loading && (_jsx("div", { className: "absolute inset-0 bg-white/80 flex items-center justify-center", children: _jsx("div", { className: "w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" }) })), _jsx("canvas", { ref: canvasRef, className: "w-full h-full" }), _jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2", children: [_jsx("button", { onClick: () => runDemo('Monthly sales data for Q1 2024'), className: "text-xs px-2 py-1 rounded bg-blue-50 text-blue-700", children: "Sales" }), _jsx("button", { onClick: () => runDemo('User growth over 6 months'), className: "text-xs px-2 py-1 rounded bg-green-50 text-green-700", children: "Growth" }), _jsx("button", { onClick: () => runDemo('Market share distribution'), className: "text-xs px-2 py-1 rounded bg-purple-50 text-purple-700", children: "Market" })] })] })] }) }) }));
}
function getDemoData(prompt) {
    if (prompt.includes('sales')) {
        return {
            type: 'bar',
            chartData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                        label: 'Sales ($k)',
                        data: [65, 78, 90, 81, 95, 110],
                        backgroundColor: 'rgba(59,130,246,0.8)',
                        borderColor: 'rgba(59,130,246,1)'
                    }]
            }
        };
    }
    if (prompt.includes('growth')) {
        return {
            type: 'line',
            chartData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                        label: 'Users',
                        data: [1000, 1500, 2300, 3200, 4100, 5200],
                        borderColor: 'rgba(34,197,94,1)',
                        backgroundColor: 'rgba(34,197,94,0.15)',
                        fill: true,
                        tension: 0.4
                    }]
            }
        };
    }
    return {
        type: 'doughnut',
        chartData: {
            labels: ['A', 'B', 'C', 'D'],
            datasets: [{
                    data: [35, 25, 20, 20],
                    backgroundColor: ['#9333EA', '#3B82F6', '#22C55E', '#F59E0B']
                }]
        }
    };
}
