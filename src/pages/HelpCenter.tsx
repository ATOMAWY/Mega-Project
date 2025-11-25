import { Link } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import { FaQuestionCircle, FaSearch, FaBook, FaComments } from "react-icons/fa";

const HelpCenter = () => {
  const faqCategories = [
    {
      title: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click on the 'Register' button in the navigation bar or footer. Fill in your details including name, email, and password, then submit the form.",
        },
        {
          q: "How does the AI recommendation system work?",
          a: "Our AI analyzes your preferences from the travel quiz you complete. Based on your answers about interests, budget, and travel style, we suggest personalized attractions in Cairo and Giza.",
        },
        {
          q: "Is the service free?",
          a: "Yes! Creating an account and getting AI-powered recommendations is completely free. We're here to help you discover the best of Cairo and Giza.",
        },
      ],
    },
    {
      title: "Using the Platform",
      questions: [
        {
          q: "How do I save attractions to my favorites?",
          a: "When viewing an attraction, click the heart icon to add it to your favorites. You can access all your saved attractions from the 'Favourites' page in the navigation menu.",
        },
        {
          q: "Can I retake the travel quiz?",
          a: "Yes, you can retake the quiz anytime from the 'Quiz' page. Your new results will update your recommendations.",
        },
        {
          q: "How do I filter recommendations?",
          a: "On the Recommendations page, use the filter sidebar to refine results by category, budget, rating, or distance. You can also sort results using the dropdown menu.",
        },
      ],
    },
    {
      title: "Account & Settings",
      questions: [
        {
          q: "How do I update my profile information?",
          a: "Go to your Profile page from the navigation menu. Click 'Edit Profile' to update your name, email, or other personal information.",
        },
        {
          q: "I forgot my password. How do I reset it?",
          a: "On the Login page, click 'Forgot password?' and enter your email address. You'll receive instructions to reset your password.",
        },
        {
          q: "How do I delete my account?",
          a: "Go to Settings, scroll to the Account section, and click 'Delete Account'. Please note this action cannot be undone.",
        },
      ],
    },
  ];

  const quickLinks = [
    { icon: FaSearch, title: "Search Attractions", description: "Browse our collection of Cairo & Giza attractions", path: "/browse" },
    { icon: FaBook, title: "Travel Guide", description: "Learn about Egyptian history and culture", path: "/" },
    { icon: FaComments, title: "Contact Support", description: "Get help from our support team", path: "/contact" },
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
                <FaQuestionCircle className="text-white text-3xl" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Help Center</h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions and learn how to make the most of your travel planning
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={index}
                  to={link.path}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-orange-400 transition-all cursor-pointer block"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-orange-400 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{link.title}</h3>
                  <p className="text-gray-600 text-sm">{link.description}</p>
                </Link>
              );
            })}
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                  {category.title}
                </h2>
                <div className="space-y-6">
                  {category.questions.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.q}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still Need Help Section */}
          <div className="mt-12 bg-orange-50 rounded-lg border border-orange-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Still Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help.
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

export default HelpCenter;

