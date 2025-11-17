export default function TrustSignals() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold">Trusted by professionals</h2>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 border rounded-lg">
                <p className="text-3xl font-bold">2k+</p>
                <p className="text-gray-600 text-sm">Users</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-3xl font-bold">4.9/5</p>
                <p className="text-gray-600 text-sm">Average rating</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-3xl font-bold">
                  <i className="fa-solid fa-bolt align-text-top mr-1"></i>
                  Fast
                </p>
                <p className="text-gray-600 text-sm">Powered by DeepSeek</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-gray-700 italic">“Vizom saves our team hours every week. We go from idea to chart during meetings.”</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div>
                <p className="font-medium">Alex Kim</p>
                <p className="text-sm text-gray-500">Data PM @ Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
