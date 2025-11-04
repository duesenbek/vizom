import { parseSeries } from '../core/utils.js';
import { sanitize } from '../utils/sanitizer.js';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        e.preventDefault();
        document.querySelector(id)?.scrollIntoView({behavior:'smooth'});
      }
    });
  });

  // SVG Helpers
  function gradientDef(id, from, to){
    return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}" stop-opacity="0.15"/></linearGradient></defs>`
  }

  function barChartSVG(series, {w=680,h=320,pad=36}={}){
    const max = Math.max(...series.map(s=>s.value))||1;
    const cw = w - pad*2; const ch = h - pad*2;
    const bw = cw / series.length * 0.7; const gap = cw / series.length * 0.3;
    let x = pad;
    const grad = gradientDef('g1','#3B82F6','#8B5CF6');
    let bars = '';
    series.forEach((s,i)=>{
      const bh = Math.max(2, (s.value/max)*ch);
      bars += `<g transform="translate(${x},${pad})"><rect rx="6" width="${bw}" height="0" y="${ch}" fill="url(#g1)"><animate attributeName="height" from="0" to="${bh}" dur="0.45s" fill="freeze"/><animate attributeName="y" from="${ch}" to="${ch-bh}" dur="0.45s" fill="freeze"/></rect><text x="${bw/2}" y="${ch+16}" text-anchor="middle" fill="#64748b" font-size="12">${s.label}</text></g>`;
      x += bw + gap;
    });
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" role="img" aria-label="Bar chart"><g>${grad}${bars}</g></svg>`;
  }

  function lineChartSVG(series, {w=680,h=320,pad=36}={}){
    const max = Math.max(...series.map(s=>s.value))||1;
    const cw = w - pad*2; const ch = h - pad*2;
    const step = cw / Math.max(1, series.length-1);
    const pts = series.map((s,i)=>{
      const x = pad + i*step;
      const y = pad + (1 - s.value/max)*ch;
      return `${x},${y}`;
    }).join(' ');
    const gradId = 'lg1';
    const grad = `<defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3B82F6" stop-opacity="0.5"/><stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/></linearGradient></defs>`;
    const area = `${pad},${h-pad} ${pts} ${pad+cw},${h-pad}`;
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" role="img" aria-label="Line chart">${grad}<polyline points="${pts}" fill="none" stroke="#3B82F6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><animate attributeName="stroke-dasharray" from="0,9999" to="9999,0" dur="0.6s" fill="freeze"/></polyline><polygon points="${area}" fill="url(#${gradId})"/></svg>`;
  }

  function pieChartSVG(series, {w=320,h=320}={}){
    const cx=w/2, cy=h/2, r=Math.min(w,h)/3;
    const total = series.reduce((a,b)=>a+b.value,0)||1;
    let angle=0; const colors=["#3B82F6","#8B5CF6","#06D6A0","#60A5FA","#A78BFA"];
    let paths='';
    series.forEach((s,i)=>{
      const frac=s.value/total; const a2=angle+frac*Math.PI*2;
      const x1=cx+r*Math.cos(angle), y1=cy+r*Math.sin(angle);
      const x2=cx+r*Math.cos(a2), y2=cy+r*Math.sin(a2);
      const large= frac>0.5 ? 1:0;
      const d=`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
      paths+=`<path d="${d}" fill="${colors[i%colors.length]}" opacity="0.9"><animate attributeName="opacity" from="0" to="0.9" dur="0.4s" fill="freeze"/></path>`;
      angle=a2;
    });
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" role="img" aria-label="Pie chart">${paths}</svg>`;
  }

  // HERO live demo
  const heroInput = document.getElementById('hero-input');
  const heroPreview = document.getElementById('hero-preview');
  const heroTry = document.getElementById('hero-try-btn');
  const heroOpen = document.getElementById('hero-open-generator');

  function renderHero(){
    const s = parseSeries(heroInput.value || '');
    heroPreview.innerHTML = sanitize(barChartSVG(s, {w:700,h:360}));
  }
  heroInput?.addEventListener('input', ()=>{ renderHero(); });
  heroTry?.addEventListener('click', ()=>{
    try { sessionStorage.setItem('templatePrompt', heroInput.value || ''); } catch(e){}
    window.location.href = 'generator.html';
  });
  heroOpen?.addEventListener('click', (e)=>{
    e.preventDefault();
    try { sessionStorage.setItem('templatePrompt', heroInput.value || ''); } catch(e){}
    window.location.href = 'generator.html';
  });

  // Example chips
  const examples = {
    sales: 'Monthly sales: Jan $12K, Feb $15K, Mar $18K, Apr $14K, May $19K, Jun $22K',
    traffic: 'Website traffic: Jan 1200, Feb 1500, Mar 1800, Apr 2100, May 2400, Jun 2800',
    market: 'Market share: Product A 45%, Product B 30%, Product C 25%'
  };
  document.querySelectorAll('.example-pill').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const key = btn.getAttribute('data-example');
      const val = examples[key] || '';
      if (btn.closest('section')?.querySelector('#hero-input')) {
        heroInput.value = val;
        renderHero();
      }
      const demoTA = document.getElementById('demo-text');
      if (demoTA) {
        demoTA.value = val;
        renderDemo();
      }
    });
  });

  // Visual examples static renders
  function renderExamples(){
    const s1 = parseSeries(examples.sales);
    const s2 = parseSeries(examples.traffic);
    const s3 = [
      {label:'KPI', value:1}, {label:'Pie', value:1}
    ];
    document.getElementById('ex-bar').innerHTML = sanitize(barChartSVG(s1, {w:560,h:240}));
    document.getElementById('ex-line').innerHTML = sanitize(lineChartSVG(s2, {w:560,h:240}));
    document.getElementById('ex-dash').innerHTML = sanitize(`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px;color:#0f172a;font-family:Inter,system-ui,sans-serif">
        <div style="border:1px solid #e2e8f0;border-radius:12px;padding:10px"><div style="font-size:12px;color:#64748b">Revenue</div><div style="font-weight:700;font-size:18px">$125K <span style="color:#06d6a0">↑15%</span></div></div>
        <div style="border:1px solid #e2e8f0;border-radius:12px;padding:10px"><div style="font-size:12px;color:#64748b">Customers</div><div style="font-weight:700;font-size:18px">2.4K <span style="color:#06d6a0">↑8%</span></div></div>
        <div style="grid-column: span 2;border:1px solid #e2e8f0;border-radius:12px;padding:10px">${pieChartSVG([{label:'A',value:45},{label:'B',value:30},{label:'C',value:25}],{w:520,h:180})}</div>
      </div>`);
  }

  // Interactive demo
  const demoText = document.getElementById('demo-text');
  const demoPreview = document.getElementById('demo-preview');
  function renderDemo(){
    const s = parseSeries(demoText.value || '');
    // Alternate between bar and line for variety
    if (s.length > 4) demoPreview.innerHTML = sanitize(lineChartSVG(s, {w:700,h:360}));
    else demoPreview.innerHTML = sanitize(barChartSVG(s, {w:700,h:360}));
  }
  demoText?.addEventListener('input', renderDemo);

  // Testimonials
  const testimonials = [
    { name:'Elena, Data Analyst', text:'VIZOM cut our dashboard build time from hours to minutes.', company:'FinTech Co.' },
    { name:'Marcus, Marketing Lead', text:'I paste metrics, it spits out clean, on-brand visuals.', company:'GrowthHub' },
    { name:'Aya, Researcher', text:'Finally a tool that turns messy survey data into clear charts.', company:'UniLab' },
    { name:'Jamal, BI Engineer', text:'From text to dashboards without the overhead. Game-changer.', company:'RetailX' },
    { name:'Sofia, PM', text:'Stakeholders love the speed and polish of the visuals.', company:'SaaSly' }
  ];
  let tIndex = 0;
  function renderTestimonials(){
    const wrap = document.getElementById('testimonials');
    const visible = [];
    const count = Math.min(3, testimonials.length);
    for (let i = 0; i < count; i++) visible.push(testimonials[(tIndex + i) % testimonials.length]);
    wrap.innerHTML = sanitize(visible.map(t=>`<div class="info-card"><div class="font-semibold">${t.name}</div><p class="text-muted">${t.company}</p><p>${t.text}</p></div>`).join(''));
  }

  // Init
  renderHero();
  renderExamples();
  renderDemo();
  renderTestimonials();

  // Auto-rotate testimonials
  setInterval(()=>{ tIndex = (tIndex + 1) % testimonials.length; renderTestimonials(); }, 5000);

  // PWA SW register
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(()=>{});
    });
  }

  // Sync active item in mobile bottom navigation
  (function(){
    const path = (location.pathname || '').toLowerCase();
    const links = document.querySelectorAll('.mobile-nav .nav-item');
    links.forEach(a => a.classList.remove('is-active'));
    const setActive = (href) => {
      const el = document.querySelector(`.mobile-nav a[href$="${href}"]`);
      if (el) el.classList.add('is-active');
    };
    if (path.includes('templates')) setActive('templates.html');
    else if (path.includes('generator')) setActive('generator.html');
    else setActive('index.html');
  })();
});
