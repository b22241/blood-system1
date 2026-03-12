function Contact() {
  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-700 mb-3">
          📞 Contact Us
        </h1>
        <p className="text-lg text-gray-600">
          Get in touch regarding the Blood Transport Monitoring System
        </p>
      </div>

      {/* Contact Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Developer Card */}
        <div className="group bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">
            👤 Project Developer
          </h3>
          <p className="text-gray-700"><b>Name:</b> xxxxx</p>
          <p className="text-gray-700"><b>Program:</b> B.Tech (Electrical Engineering)</p>
          <p className="text-gray-700"><b>Institution:</b> IIT Mandi</p>
        </div>

        {/* Email Card */}
        <div className="group bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">
            📧 Email
          </h3>
          <p className="text-gray-700">
            <b>Primary:</b>{" "}
            <a
              href="mailto:suman@example.com"
              className="text-gray-500 hover:underline"
            >
              suman@example.com
            </a>
          </p>
          <p className="text-gray-700 mt-2">
            <b>Support:</b>{" "}
            <a
              href="mailto:support@bloodsystem.com"
              className="text-gray-500 hover:underline"
            >
              support@bloodsystem.com
            </a>
          </p>
        </div>

        {/* Location Card */}
        <div className="group bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">
            📍 Location
          </h3>
          <p className="text-gray-700">IIT Mandi</p>
          <p className="text-gray-700">Mandi,Himachal Pradesh, India</p>
        </div>

      </div>

      {/* Footer Note */}
      <div className="text-center mt-14 text-gray-500 text-sm">
        © {new Date().getFullYear()} Blood Transport Monitoring System
      </div>
    </div>
  );
}

export default Contact;
