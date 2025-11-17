const features = [
  { title: 'AI-Powered', desc: 'Natural language to chart. No config, no hassle.', iconClass: 'fa-solid fa-robot' },
  { title: 'Beautiful by default', desc: 'Designer-grade styles and palettes.', iconClass: 'fa-solid fa-palette' },
  { title: 'Export anywhere', desc: 'PNG, HTML embed, and more.', iconClass: 'fa-solid fa-arrow-up-from-bracket' },
  { title: 'Fast & Accurate', desc: 'Optimized parsing and rendering pipeline.', iconClass: 'fa-solid fa-bolt' },
];

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-5xl font-bold">Everything you need</h2>
          <p className="text-gray-600 mt-3">Create stunning charts without fighting complex tools.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-3xl mb-3">
                <i className={f.iconClass}></i>
              </div>
              <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
