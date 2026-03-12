function Home() {
  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-50 via-white to-indigo-100 ">

      {/* Title Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-700 mb-3">
          Smart Blood and Vaccine Transport Monitoring System
        </h1>
        <p className="text-lg text-gray-600">
          Real-time cold-chain monitoring for safe and reliable blood transportation
        </p>
      </div>

      {/* Info Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
        
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-semibold text-indigo-700 mb-3">
            🌡 Temperature Monitoring
          </h3>
          <p className="text-gray-600">
            Continuously tracks inside & outside temperature to ensure blood
            remains within the safe range (2–6 °C).
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-semibold text-indigo-700 mb-3">
             Humidity Tracking
          </h3>
          <p className="text-gray-600">
            Monitors humidity levels inside and outside the container to
            maintain optimal storage conditions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-semibold text-indigo-700 mb-3">
            📍 Live Location
          </h3>
          <p className="text-gray-600">
            GPS-based latitude & longitude tracking helps monitor the transport
            route in real time.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-semibold text-indigo-700 mb-3">
            🚨 Alerts & Notifications
          </h3>
          <p className="text-gray-600">
            Automatic email alerts are sent whenever temperature goes outside
            the safe range.
          </p>
        </div>

      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto mb-14">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          ⚙️ How the System Works
        </h2>
        <ul className="space-y-3 text-gray-700 text-base">
          <li>📡 Sensors collect temperature, humidity & GPS data</li>
          <li>🖥 Data is sent to a Node.js backend server</li>
          <li>☁️ Data is stored securely in MongoDB Atlas</li>
          <li>📊 Dashboard displays live graphs & tables</li>
          <li>📧 Alerts are sent if cold-chain safety is violated</li>
        </ul>
      </div>

      {/* Footer Note */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
        <p className="text-gray-700 text-base">
          ✅ This system helps ensure{" "}
          <b>blood safety</b>, <b>regulatory compliance</b>, and{" "}
          <b>real-time monitoring</b> during transportation.
        </p>
      </div>

    </div>
  );
}

export default Home;
