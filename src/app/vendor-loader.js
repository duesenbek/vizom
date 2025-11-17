const bootstrapVendors = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.__vizomVendorPromise) {
    return window.__vizomVendorPromise;
  }

  window.__vizomVendorPromise = (async () => {
    try {
      const [{ default: Chart }, { default: zoomPlugin }, d3, echartsModule] = await Promise.all([
        import('https://esm.sh/chart.js@4.4.1/auto'),
        import('https://esm.sh/chartjs-plugin-zoom@2.0.1'),
        import('https://cdn.jsdelivr.net/npm/d3@7/+esm'),
        import('https://cdn.jsdelivr.net/npm/echarts@5/+esm')
      ]);

      if (!window.Chart) {
        window.Chart = Chart;
      }

      if (Chart?.register && zoomPlugin) {
        Chart.register(zoomPlugin);
      }

      if (!window.d3) {
        window.d3 = d3;
      }

      if (!window.echarts && echartsModule) {
        window.echarts = echartsModule.default || echartsModule;
      }
    } catch (error) {
      console.error('[vendor-loader] Failed to initialize chart libraries', error);
    }

    try {
      await Promise.all([
        import('../supabase-client.js'),
        import('../supabase-auth.js'),
        import('../payments/stripe-client.js')
      ]);
    } catch (error) {
      console.error('[vendor-loader] Failed to bootstrap Supabase modules', error);
    }
  })();

  return window.__vizomVendorPromise;
};

await bootstrapVendors();

export const vendorReady = window.__vizomVendorPromise;
