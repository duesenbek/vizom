import React from 'react';

const steps = [
  { n: 1, title: 'Describe your chart', text: 'Tell Vizom what you want in plain English.' },
  { n: 2, title: 'Review and tweak', text: 'Preview instantly and adjust as needed.' },
  { n: 3, title: 'Export & share', text: 'Download PNG or embed HTML wherever you need.' },
];

export default function QuickStart() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Quick start in 3 steps</h2>
          <p className="text-gray-600">From idea to chart in under a minute.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map(s => (
            <div key={s.n} className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 mx-auto mb-3 flex items-center justify-center font-bold">{s.n}</div>
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p className="text-gray-600 text-sm">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="#live-demo" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Get started</a>
        </div>
      </div>
    </section>
  );
}
