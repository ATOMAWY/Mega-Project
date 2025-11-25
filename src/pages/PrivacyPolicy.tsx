import { Link } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import { FaShieldAlt } from "react-icons/fa";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Introduction",
      content: `Welcome to Cairo & Giza AI Travel. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.`,
    },
    {
      title: "Information We Collect",
      content: `We collect information that you provide directly to us, including:
- Personal identification information (name, email address, phone number)
- Account credentials (username, password)
- Travel preferences and quiz responses
- Favorites and saved attractions
- Communication data when you contact us`,
    },
    {
      title: "How We Use Your Information",
      content: `We use the information we collect to:
- Provide, maintain, and improve our services
- Personalize your travel recommendations based on your preferences
- Process your account registration and manage your profile
- Send you updates, newsletters, and promotional materials (with your consent)
- Respond to your inquiries and provide customer support
- Detect and prevent fraud or abuse
- Comply with legal obligations`,
    },
    {
      title: "Data Storage and Security",
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is stored securely and we use industry-standard encryption to protect sensitive information.`,
    },
    {
      title: "Sharing Your Information",
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
- With your explicit consent
- To comply with legal obligations or respond to lawful requests
- To protect our rights, privacy, safety, or property
- In connection with a business transfer or merger`,
    },
    {
      title: "Your Rights",
      content: `You have the right to:
- Access and review your personal information
- Request correction of inaccurate data
- Request deletion of your account and personal data
- Opt-out of marketing communications
- Withdraw consent at any time`,
    },
    {
      title: "Cookies and Tracking",
      content: `We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our services. You can control cookie preferences through your browser settings.`,
    },
    {
      title: "Children's Privacy",
      content: `Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.`,
    },
    {
      title: "Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.`,
    },
    {
      title: "Contact Us",
      content: `If you have any questions about this Privacy Policy or our data practices, please contact us at:
Email: privacy@cairo-giza-travel.com
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
                <FaShieldAlt className="text-white text-3xl" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Privacy Policy</h1>
            <p className="text-gray-600">
              Last Updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Policy Content */}
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
              Questions about our privacy practices? We're here to help.
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

export default PrivacyPolicy;

