import React from "react";

const Privacy_Policy = () => {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl shadow-2xl text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Privacy Policy
        </h1>

        <p className="text-gray-400 mb-6">
          Your privacy is important to us. This policy explains how DEBUGXIA collects, uses, and protects your data.
        </p>

        <div className="space-y-6">

          <div>
            <h2 className="font-semibold text-xl mb-2">1. Information We Collect</h2>
            <p className="text-gray-400">
              We may collect code snippets, error logs, usage data, and developer activity to improve debugging and analytics features.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-2">2. How We Use Data</h2>
            <p className="text-gray-400">
              Data is used to analyze errors, provide AI suggestions, improve system performance, and display personalized insights.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-2">3. Data Storage</h2>
            <p className="text-gray-400">
              Data is securely stored using databases like PostgreSQL or Firebase with appropriate security measures.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-2">4. Data Sharing</h2>
            <p className="text-gray-400">
              We do not sell or share user data with third parties. Data is only used internally for system improvement.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-2">5. User Control</h2>
            <p className="text-gray-400">
              Users can control what data they share and should avoid submitting sensitive or confidential information.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-2">6. Security</h2>
            <p className="text-gray-400">
              We implement standard security practices, but no system can guarantee complete security.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-2">7. Updates to Policy</h2>
            <p className="text-gray-400">
              This policy may be updated periodically. Continued use of the platform indicates acceptance of the changes.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Privacy_Policy

