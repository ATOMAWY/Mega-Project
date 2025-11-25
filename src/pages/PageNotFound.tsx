import { Link } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-2xl text-center">
          {/* 404 Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <FaExclamationTriangle className="text-white text-4xl sm:text-5xl" />
            </div>
          </div>

          {/* Error Code */}
          <h1 className="text-6xl sm:text-8xl font-bold text-gray-900 mb-4">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or the URL might be incorrect.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="px-6 py-3 bg-orange-400 text-white font-semibold rounded-lg shadow-md hover:bg-orange-500 transition-all duration-200 flex items-center gap-2"
            >
              <FaHome />
              Go to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/"
                className="text-orange-400 hover:text-orange-500 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/quiz"
                className="text-orange-400 hover:text-orange-500 font-medium transition-colors"
              >
                Quiz
              </Link>
              <Link
                to="/recommendations"
                className="text-orange-400 hover:text-orange-500 font-medium transition-colors"
              >
                Recommendations
              </Link>
              <Link
                to="/profile"
                className="text-orange-400 hover:text-orange-500 font-medium transition-colors"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PageNotFound;



