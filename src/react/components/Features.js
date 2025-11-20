import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const features = [
    { title: 'AI-Powered', desc: 'Natural language to chart. No config, no hassle.', iconClass: 'fa-solid fa-robot' },
    { title: 'Beautiful by default', desc: 'Designer-grade styles and palettes.', iconClass: 'fa-solid fa-palette' },
    { title: 'Export anywhere', desc: 'PNG, HTML embed, and more.', iconClass: 'fa-solid fa-arrow-up-from-bracket' },
    { title: 'Fast & Accurate', desc: 'Optimized parsing and rendering pipeline.', iconClass: 'fa-solid fa-bolt' },
];
export default function Features() {
    return (_jsx("section", { className: "py-16 bg-gray-50", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "text-center max-w-3xl mx-auto mb-10", children: [_jsx("h2", { className: "text-3xl md:text-5xl font-bold", children: "Everything you need" }), _jsx("p", { className: "text-gray-600 mt-3", children: "Create stunning charts without fighting complex tools." })] }), _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-5", children: features.map((f) => (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [_jsx("div", { className: "text-3xl mb-3", children: _jsx("i", { className: f.iconClass }) }), _jsx("h3", { className: "font-semibold text-lg mb-1", children: f.title }), _jsx("p", { className: "text-gray-600 text-sm", children: f.desc })] }, f.title))) })] }) }));
}
