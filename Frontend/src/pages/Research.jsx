function Research() {
  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-3">
           Research Work
        </h1>
        <p className="text-lg text-gray-600">
          Study and implementation of a real-time blood transport monitoring system
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">

        {/* Section */}
        <Section title="🧠 Problem Statements">
          <p>
            Blood and blood components must be transported under strict
            temperature-controlled conditions (2–6 °C). Any deviation from this
            range can compromise blood quality, leading to wastage and potential
            health risks. Existing transport systems often lack real-time
            monitoring, alerts, and traceability.
          </p>
        </Section>

        <Section title="🎯 Objectives">
          <ul className="list-disc pl-6 space-y-2">
            <li>Monitor temperature and humidity during blood transportation</li>
            <li>Ensure cold-chain compliance in real time</li>
            <li>Provide live data visualization through a web dashboard</li>
            <li>Generate alerts when safety thresholds are violated</li>
            <li>Log and analyze historical transport data</li>
          </ul>
        </Section>

        <Section title="🔬 Methodology">
          <ol className="list-decimal pl-6 space-y-2">
            <li>Sensors measure temperature, humidity, and GPS location</li>
            <li>Data transmitted wirelessly using ESP32 / NodeMCU</li>
            <li>Backend (Node.js + Express) validates incoming data</li>
            <li>Secure storage using MongoDB Atlas</li>
            <li>Dashboard visualizes live and historical data</li>
            <li>Alerts triggered on unsafe temperature conditions</li>
          </ol>
        </Section>

        <Section title="🧪 Technologies & Tools Used">
          <ul className="space-y-2">
            <li><b>Hardware:</b> ESP32 / NodeMCU, Temp & Humidity Sensors</li>
            <li><b>Backend:</b> Node.js, Express.js</li>
            <li><b>Database:</b> MongoDB Atlas</li>
            <li><b>Frontend:</b> React.js, Chart.js</li>
            <li><b>Communication:</b> HTTP REST APIs</li>
            <li><b>Alerts:</b> Email via Nodemailer</li>
          </ul>
        </Section>

        <Section title="📊 Observations & Results">
          <p>
            The system successfully monitors environmental conditions in real
            time. Temperature deviations are immediately detected and reported
            through alerts. Historical data visualization helps analyze transport
            patterns and identify risk zones.
          </p>
        </Section>

        <Section title="🌍 Applications & Future Scope">
          <ul className="list-disc pl-6 space-y-2">
            <li>Blood banks and hospitals</li>
            <li>Organ and vaccine transportation</li>
            <li>Cold-chain pharmaceutical logistics</li>
            <li>Mobile app integration</li>
            <li>SMS alerts & AI-based predictive analysis</li>
          </ul>
        </Section>

      </div>

      <div className="text-center mt-14 text-sm text-gray-500">
        © {new Date().getFullYear()} Blood Transport Monitoring System
      </div>
    </div>
  );
}

/* Reusable Section Component */
function Section({ title, children }) {
  return (
    <section className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
        {title}
      </h2>
      <div className="text-gray-700 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default Research;
