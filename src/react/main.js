import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeAnalytics, trackPageview } from '../tracking/analytics';
// Initialize analytics respecting DNT and provider selection
(async () => {
    try {
        await initializeAnalytics();
        trackPageview();
    }
    catch { }
})();
const el = document.getElementById('root');
if (el)
    createRoot(el).render(_jsx(App, {}));
