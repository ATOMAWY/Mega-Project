import { Link } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import { FaFileContract } from "react-icons/fa";

const TermsOfService = () => {
  const sections = [
    {
      title: "Agreement to Terms",
      content: `By accessing or using Cairo & Giza AI Travel ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.`,
    },
    {
      title: "Use of Service",
      content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
- Use the Service in any way that violates any applicable law or regulation
- Transmit any malicious code, viruses, or harmful data
- Attempt to gain unauthorized access to the Service or its related systems
- Use the Service to infringe upon the rights of others
- Use automated systems to access the Service without permission`,
    },
    {
      title: "User Accounts",
      content: `When you create an account, you must provide accurate and complete information. You are responsible for:
- Maintaining the confidentiality of your account credentials
- All activities that occur under your account
- Notifying us immediately of any unauthorized use
- Ensuring you are at least 13 years old to use the Service`,
    },
    {
      title: "Intellectual Property",
      content: `The Service and its original content, features, and functionality are owned by Cairo & Giza AI Travel and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without express written permission.`,
    },
    {
      title: "User Content",
      content: `You retain ownership of any content you submit to the Service. By submitting content, you grant us a license to use, modify, and display such content for the purpose of providing and improving our services. You represent that you have the right to grant this license.`,
    },
    {
      title: "AI Recommendations",
      content: `Our AI-powered recommendations are provided for informational purposes only. While we strive for accuracy, we do not guarantee the completeness or accuracy of recommendations. You are responsible for verifying information and making your own travel decisions.`,
    },
    {
      title: "Limitation of Liability",
      content: `To the fullest extent permitted by law, Cairo & Giza AI Travel shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.`,
    },
    {
      title: "Indemnification",
      content: `You agree to indemnify and hold harmless Cairo & Giza AI Travel from any claims, damages, losses, liabilities, and expenses arising out of your use of the Service or violation of these Terms.`,
    },
    {
      title: "Termination",
      content: `We reserve the right to terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.`,
    },
    {
      title: "Changes to Terms",
      content: `We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. Your continued use of the Service after changes constitutes acceptance of the new Terms.`,
    },
    {
      title: "Governing Law",
      content: `These Terms shall be governed by and construed in accordance with the laws of Egypt, without regard to its conflict of law provisions.`,
    },
    {
      title: "Contact Information",
      content: `If you have any questions about these Terms of Service, please contact us at:
Email: legal@cairo-giza-travel.com
Address: Cairo, Egypt`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <div className="flex-1 px-4 sm:px-6 lg:px-20 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center">
                <FaFileContract className="text-white text-3xl" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Terms of Service</h1>
            <p className="text-gray-600">
              Last Updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Terms Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Have questions about our terms? We're here to help.
            </p>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;

