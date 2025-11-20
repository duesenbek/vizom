import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const steps = [
    { n: 1, title: 'Describe your chart', text: 'Tell Vizom what you want in plain English.' },
    { n: 2, title: 'Review and tweak', text: 'Preview instantly and adjust as needed.' },
    { n: 3, title: 'Export & share', text: 'Download PNG or embed HTML wherever you need.' },
];
export default function QuickStart() {
    return (_jsx("section", { className: "py-16 bg-gray-50", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "text-center max-w-2xl mx-auto mb-10", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", children: "Quick start in 3 steps" }), _jsx("p", { className: "text-gray-600", children: "From idea to chart in under a minute." })] }), _jsx("div", { className: "grid md:grid-cols-3 gap-5", children: steps.map(s => (_jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-200 text-center", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-blue-100 text-blue-700 mx-auto mb-3 flex items-center justify-center font-bold", children: s.n }), _jsx("h3", { className: "font-semibold mb-1", children: s.title }), _jsx("p", { className: "text-gray-600 text-sm", children: s.text })] }, s.n))) }), _jsx("div", { className: "text-center mt-8", children: _jsx("a", { href: "#live-demo", className: "px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700", children: "Get started" }) })] }) }));
}
