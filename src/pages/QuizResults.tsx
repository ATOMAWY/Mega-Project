import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/api/store";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import type { QuizSubmissionData } from "./Quiz";
import { useGenerateRecommendationsMutation } from "../features/recommendations/recommendationsApiSlice";

const QuizResults = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [quizData, setQuizData] = useState<QuizSubmissionData | null>(null);
  const [recommendationCount, setRecommendationCount] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [generateRecommendations] = useGenerateRecommendationsMutation();

  useEffect(() => {
    // Retrieve quiz results from sessionStorage
    const storedData = sessionStorage.getItem("quizResults");
    if (storedData) {
      try {
        setQuizData(JSON.parse(storedData));
      } catch (error) {
        console.error("Error parsing quiz data:", error);
        navigate("/quiz");
      }
    } else {
      // If no quiz data, redirect to quiz
      navigate("/quiz");
    }
  }, [navigate]);
  
  // Generate ML recommendations after quiz completion
  useEffect(() => {
    const generateMLRecommendations = async () => {
      if (!user?.id || !quizData || isGenerating) return;
      
      setIsGenerating(true);
      try {
        console.log("Generating ML recommendations for user:", user.id);
        const result = await generateRecommendations({ userId: user.id }).unwrap();
        console.log("ML Recommendations generated:", result);
        
        // Store recommendations in sessionStorage for the Recommendations page
        sessionStorage.setItem("mlRecommendations", JSON.stringify(result.recommendations));
        setRecommendationCount(result.count);
      } catch (error: any) {
        console.error("Error generating ML recommendations:", error);
        // Don't block the user if ML fails - they can still browse all places
        setRecommendationCount(0);
      } finally {
        setIsGenerating(false);
      }
    };
    
    generateMLRecommendations();
  }, [user?.id, quizData, generateRecommendations]);

  if (!quizData) {
    return null; // Will redirect in useEffect
  }

  const recommendations = {
    matchedAttractions: recommendationCount,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <FaCheckCircle className="text-white text-4xl sm:text-5xl" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-3">
            Perfect Match Found!
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 text-center mb-8 sm:mb-10">
            We've analyzed your preferences and created a personalized Cairo
            experience just for you.
          </p>

          {/* Travel Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center">
                <FaMapMarkerAlt className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Your Travel Profile
                </h2>
                <p className="text-sm text-gray-500">
                  Curated recommendations ready
                </p>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 ">
                <span className="text-base text-gray-700">
                  Matched Attractions
                </span>
                <span className="text-lg font-semibold text-orange-400">
                  {recommendations.matchedAttractions} places
                </span>
              </div>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => navigate("/recommendations")}
              disabled={isGenerating}
              className={`w-full sm:w-auto px-8 py-3 font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 transition-all ${
                isGenerating
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-orange-400 text-white hover:bg-orange-500"
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="spinner-orange-sm"></div>
                  Generating Recommendations...
                </>
              ) : (
                <>
                  View Your Recommendations
                  <span className="text-xl">→</span>
                </>
              )}
            </button>

            {/* Retake Quiz Link */}
            <button
              onClick={() => {
                sessionStorage.removeItem("quizResults");
                sessionStorage.removeItem("mlRecommendations");
                navigate("/quiz");
              }}
              className="text-orange-400 hover:text-orange-500 font-medium transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuizResults;
