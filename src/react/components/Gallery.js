import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const examples = [
    { title: 'Sales by Month', type: 'Bar', colors: 'Blue' },
    { title: 'User Growth', type: 'Line', colors: 'Green' },
    { title: 'Market Share', type: 'Doughnut', colors: 'Purple' },
    { title: 'Expenses', type: 'Pie', colors: 'Indigo' },
    { title: 'Correlation', type: 'Scatter', colors: 'Cyan' },
    { title: 'Radar Profile', type: 'Radar', colors: 'Pink' },
    { title: 'Polar Area', type: 'Polar', colors: 'Amber' },
    { title: 'Bubble Mix', type: 'Bubble', colors: 'Orange' },
];
export default function Gallery() {
    return (_jsx("section", { className: "py-16 bg-white", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsx("div", { className: "flex items-end justify-between mb-8", children: _jsxs("div", { children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", children: "Example Gallery" }), _jsx("p", { className: "text-gray-600", children: "See what Vizom can generate" })] }) }), _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-5", children: examples.map((e) => (_jsxs("div", { className: "group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition", children: [_jsx("div", { className: "h-40 bg-white" }), _jsx("div", { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: e.title }), _jsxs("p", { className: "text-xs text-gray-500", children: [e.type, " \u2022 ", e.colors] })] }), _jsx("a", { href: "/generator.html", className: "text-blue-600 text-sm opacity-0 group-hover:opacity-100 transition", children: "Create similar \u2192" })] }) })] }, e.title))) })] }) }));
}
