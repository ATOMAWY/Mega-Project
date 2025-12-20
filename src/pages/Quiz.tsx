import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/api/store";
import { useSubmitPreferencesMutation } from "../features/preferences/preferencesApiSlice";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import {
  FaHeart,
  FaMountain,
  FaClock,
  FaUtensils,
  FaCamera,
  FaUsers,
  FaTree,
  FaHome,
  FaUmbrellaBeach,
  FaHiking,
  FaPalette,
  FaLandmark,
  FaMapMarkerAlt,
  FaCoffee,
  FaShoppingCart,
  FaHotel,
} from "react-icons/fa";
import {
  MdRestaurant,
  MdShoppingBag,
  MdMuseum,
  MdLocalMovies,
  MdPark,
} from "react-icons/md";
import { GiPalmTree } from "react-icons/gi";


type QuizAnswers = {
  travelVibe: string[]; // Multiple selections allowed
  activities: string[]; // Multiple selections allowed
  activityPreference: string | null;
  tripDuration: string | null;
  placeCategories: string[]; // Multiple selections allowed
};

// Type for API submission - ready for database
export type QuizSubmissionData = {
  travelVibe: string[];
  activities: string[];
  activityPreference: string;
  tripDuration: number; // Convert to number
  placeCategories: string[];
};

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    travelVibe: [],
    activities: [],
    activityPreference: null,
    tripDuration: null,
    placeCategories: [],
  });

  // Get user info from Redux
  const user = useSelector((state: RootState) => state.auth.user);
  
  // RTK Query mutation for submitting preferences
  const [submitPreferences, { isLoading: isSubmitting }] = useSubmitPreferencesMutation();

  const questions = [
    {
      id: "travelVibe",
      question: "What's your travel vibe or style?",
      instruction:
        "Choose all the styles that describe your perfect trip. You can select multiple options.",
      type: "options",
      allowMultiple: true, // Allow multiple selections
      options: [
        {
          value: "Romantic",
          label: "Romantic",
          icon: <FaHeart className="text-2xl" />,
        },
        {
          value: "Calm",
          label: "Calm",
          icon: <FaUmbrellaBeach className="text-2xl" />,
        },
        {
          value: "Adventure",
          label: "Adventure",
          icon: <FaMountain className="text-2xl" />,
        },
        {
          value: "Photography",
          label: "Photography",
          icon: <FaCamera className="text-2xl" />,
        },
        {
          value: "Foodie",
          label: "Foodie",
          icon: <FaUtensils className="text-2xl" />,
        },
        {
          value: "Family",
          label: "Family",
          icon: <FaUsers className="text-2xl" />,
        },
        {
          value: "Art",
          label: "Art",
          icon: <FaPalette className="text-2xl" />,
        },
        {
          value: "Historical",
          label: "Historical",
          icon: <FaLandmark className="text-2xl" />,
        },
      ],
    },
    {
      id: "activities",
      question: "Which types of activities do you enjoy the most?",
      instruction:
        "Select all the activity types you enjoy. You can select multiple options.",
      type: "options",
      allowMultiple: true, // Allow multiple selections
      options: [
        {
          value: "Dining",
          label: "Dining",
          icon: <MdRestaurant className="text-2xl" />,
        },
        {
          value: "Shopping",
          label: "Shopping",
          icon: <MdShoppingBag className="text-2xl" />,
        },
        {
          value: "Cultural",
          label: "Cultural",
          icon: <MdMuseum className="text-2xl" />,
        },
        {
          value: "Nature",
          label: "Nature",
          icon: <GiPalmTree className="text-2xl" />,
        },
        {
          value: "Entertainment",
          label: "Entertainment",
          icon: <MdLocalMovies className="text-2xl" />,
        },
      ],
    },
    {
      id: "activityPreference",
      question:
        "Do you prefer indoor activities, outdoor activities, or a mix of both?",
      instruction: "Choose your preferred activity environment.",
      type: "options",
      allowMultiple: false,
      options: [
        {
          value: "indoor",
          label: "Indoor",
          icon: <FaHome className="text-2xl" />,
        },
        {
          value: "outdoor",
          label: "Outdoor",
          icon: <FaHiking className="text-2xl" />,
        },
        { value: "mix", label: "Mix", icon: <FaTree className="text-2xl" /> },
      ],
    },
    {
      id: "tripDuration",
      question: "How many days would you like your trip to last?",
      instruction: "Select the duration of your ideal trip.",
      type: "options",
      allowMultiple: false,
      options: [
        { value: "1", label: "1 Day", icon: <FaClock className="text-2xl" /> },
        { value: "2", label: "2 Days", icon: <FaClock className="text-2xl" /> },
        { value: "3", label: "3 Days", icon: <FaClock className="text-2xl" /> },
        { value: "4", label: "4 Days", icon: <FaClock className="text-2xl" /> },
      ],
    },
    {
      id: "placeCategories",
      question: "Which types of place category do you enjoy the most?",
      instruction: "Select all the place categories you're interested in. You can select multiple options.",
      type: "options",
      allowMultiple: true,
      options: [
        {
          value: "Attraction",
          label: "Attraction",
          icon: <FaMapMarkerAlt className="text-2xl" />,
        },
        {
          value: "Restaurant",
          label: "Restaurant",
          icon: <MdRestaurant className="text-2xl" />,
        },
        {
          value: "Cafe",
          label: "Cafe",
          icon: <FaCoffee className="text-2xl" />,
        },
        {
          value: "Shopping",
          label: "Shopping",
          icon: <FaShoppingCart className="text-2xl" />,
        },
        {
          value: "Museum",
          label: "Museum",
          icon: <MdMuseum className="text-2xl" />,
        },
        {
          value: "Park",
          label: "Park",
          icon: <MdPark className="text-2xl" />,
        },
        {
          value: "Hotel",
          label: "Hotel",
          icon: <FaHotel className="text-2xl" />,
        },
      ],
    },
  ];

  const handleOptionSelect = (value: string) => {
    const questionId = questions[currentQuestion].id as keyof QuizAnswers;
    const currentQ = questions[currentQuestion];

    if (currentQ.allowMultiple) {
      // Toggle selection for multi-select questions
      const currentArray = answers[questionId] as string[];
      if (Array.isArray(currentArray)) {
        const newArray = currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value];
        setAnswers({ ...answers, [questionId]: newArray });
      }
    } else {
      // Single selection for other questions
      setAnswers({ ...answers, [questionId]: value });
    }
  };


  // Format answers for API/database submission
  const formatAnswersForSubmission = (): QuizSubmissionData | null => {
    if (
      answers.travelVibe.length === 0 ||
      answers.activities.length === 0 ||
      !answers.activityPreference ||
      !answers.tripDuration ||
      answers.placeCategories.length === 0
    ) {
      return null; // Not all questions answered
    }

    return {
      travelVibe: answers.travelVibe,
      activities: answers.activities,
      activityPreference: answers.activityPreference,
      tripDuration: parseInt(answers.tripDuration),
      placeCategories: answers.placeCategories,
    };
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed - format and prepare for submission
      const submissionData = formatAnswersForSubmission();
      if (submissionData) {
        // Check if user is logged in
        if (!user?.id) {
          alert("Please log in to submit your preferences.");
          navigate("/login");
          return;
        }

        try {
          // Map quiz answers to backend DTO format
          // activityPreference needs to be mapped: "indoor" -> "Indoor", "outdoor" -> "Outdoor"
          const weatherPref = submissionData.activityPreference === "indoor" 
            ? "Indoor" 
            : submissionData.activityPreference === "outdoor" 
            ? "Outdoor" 
            : "Indoor"; // Default to Indoor for "mix"

          // Submit to API
          await submitPreferences({
            userId: user.id,
            travelVibe: submissionData.travelVibe,
            activityKinds: submissionData.activities,
            weatherPref: weatherPref,
            placeCategories: submissionData.placeCategories,
            tripDays: submissionData.tripDuration,
            budget: null, // Optional field, not collected in quiz
          }).unwrap();

          // Store submission data in sessionStorage to pass to results page
          sessionStorage.setItem("quizResults", JSON.stringify(submissionData));

          // Navigate to results page
          navigate("/quiz/results");
        } catch (error: any) {
          console.error("Error submitting quiz:", error);
          alert(
            `Failed to submit quiz: ${error?.data?.message || "Please try again."}`
          );
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers[currentQ.id as keyof QuizAnswers];

  // Check if current question has valid answer(s)
  const isCurrentQuestionAnswered = () => {
    if (currentQ.allowMultiple) {
      const answerArray = currentAnswer as string[];
      return Array.isArray(answerArray) && answerArray.length > 0;
    }

    return currentAnswer !== null && currentAnswer !== "";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-12">
          {/* Quiz Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Smart Preference Quiz
          </h1>

          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div
                  className="bg-orange-400 h-2 sm:h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="ml-4 text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                {currentQuestion + 1}/{questions.length}
              </span>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            {currentQ.question}
          </h2>

          {/* Instruction */}
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            {currentQ.instruction}
          </p>

          {/* Options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
            {currentQ.options?.map((option) => {
              const isSelected = currentQ.allowMultiple
                ? (currentAnswer as string[]).includes(option.value)
                : currentAnswer === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`relative flex flex-col items-center justify-center p-4 sm:p-6 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200 bg-white hover:border-orange-300"
                  }`}
                >
                  {currentQ.allowMultiple && isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                  <div
                    className={`mb-2 sm:mb-3 ${
                      isSelected ? "text-orange-400" : "text-gray-600"
                    }`}
                  >
                    {option.icon}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium text-center ${
                      isSelected ? "text-orange-700" : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all ${
                currentQuestion === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered() || isSubmitting}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all ${
                !isCurrentQuestionAnswered() || isSubmitting
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-orange-400 text-white hover:bg-orange-500"
              }`}
            >
              {isSubmitting
                ? "Submitting..."
                : currentQuestion === questions.length - 1
                ? "Submit"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Quiz;
