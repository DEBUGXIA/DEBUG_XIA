import React from "react";

const Terms_and_con = () => {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl shadow-2xl text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Terms & Conditions
        </h1>

        <p className="text-gray-400 mb-6">
          By accessing and using DEBUGXIA, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <div className="space-y-6">

          <div>
            <h2 className="font-semibold text-xl mb-2">1. Use of Service</h2>
            <p className="text-gray-400">
              DEBUGXIA is designed for educational and development purposes. Users must use the platform responsibly and must not engage in illegal or harmful activities.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-2">2. AI-Generated Content</h2>
            <p className="text-gray-400">
              The platform uses AI to generate debugging suggestions and explanations. While we strive for accuracy, results may not always be correct or complete.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-2">3. User Responsibilities</h2>
            <p className="text-gray-400">
              Users are responsible for the code they submit. Do not upload sensitive, confidential, or copyrighted material without proper authorization.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-2">4. Service Availability</h2>
            <p className="text-gray-400">
              We do not guarantee uninterrupted access. Services may be updated, modified, or temporarily unavailable.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-2">5. Limitation of Liability</h2>
            <p className="text-gray-400">
              DEBUGXIA is not liable for any damages or losses resulting from the use of the platform or reliance on AI-generated suggestions.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-xl mb-2">6. Changes to Terms</h2>
            <p className="text-gray-400">
              These terms may be updated at any time. Continued use of the platform implies acceptance of the revised terms.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Terms_and_con

