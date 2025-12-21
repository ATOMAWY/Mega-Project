import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/api/store";
import { 
  useGetUserPreferencesQuery,
  useSubmitPreferencesMutation,
  useUpdatePreferencesMutation,
} from "../features/preferences/preferencesApiSlice";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import {
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
} from "react-icons/fa";


type QuizAnswers = {
  travelVibe: string | null; // Single selection
  activityPreference: string | null;
  tripDuration: string | null;
};

// Type for API submission - ready for database
export type QuizSubmissionData = {
  userId: string;
  travelVibe: string;
  activityTypeIds: string[]; // UUIDs from backend
  weatherPref: string;
  tripDays: number;
};

// Activity type from backend
type ActivityType = {
  activityTypeId: string;
  name: string;
  description?: string;
};

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    travelVibe: null,
    activityPreference: null,
    tripDuration: null,
  });
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Get user info from Redux
  const user = useSelector((state: RootState) => state.auth.user);

  // Check if user has existing preferences
  const { data: existingPreferences, isLoading: isCheckingPreferences } = useGetUserPreferencesQuery(
    user?.id || "",
    { skip: !user?.id }
  );

  // RTK Query mutations for creating/updating preferences
  const [submitPreferences, { isLoading: isSubmitting }] = useSubmitPreferencesMutation();
  const [updatePreferences, { isLoading: isUpdating }] = useUpdatePreferencesMutation();

  // Fetch activity types from API on mount
  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        const API_URL = import.meta.env.VITE_API;
        const token = localStorage.getItem("accessToken");
        
        console.log("Fetching activity types from:", `${API_URL}/api/ActivityType`);
        console.log("Using token:", token ? "Present" : "Missing");
        
        const response = await fetch(`${API_URL}/api/ActivityType`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Activity types loaded successfully:", data.length, "types");
          setActivityTypes(data);
        } else {
          console.error("Failed to fetch activity types. Status:", response.status);
          console.error("Response:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching activity types:", error);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchActivityTypes();
  }, []);

  const questions = [
    {
      id: "travelVibe",
      question: "What's your travel vibe or style?",
      instruction:
        "Choose the style that best describes your perfect trip.",
      type: "options",
      allowMultiple: false, // Single selection only
      options: [
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
  ];

  const handleOptionSelect = (value: string) => {
    const questionId = questions[currentQuestion].id as keyof QuizAnswers;
    // All questions are single-select now
    setAnswers({ ...answers, [questionId]: value });
  };


  // Format answers for API/database submission
  const formatAnswersForSubmission = (): QuizSubmissionData | null => {
    if (
      !answers.travelVibe ||
      !answers.activityPreference ||
      !answers.tripDuration ||
      !user?.id
    ) {
      return null; // Not all questions answered
    }

    // Send ALL activity type IDs (backend auto-manages them)
    const activityTypeIds = activityTypes.map((at) => at.activityTypeId);
    
    // Validate that we have activity types
    if (activityTypeIds.length === 0) {
      console.error("No activity types available for submission");
      return null;
    }

    // Map activityPreference to weatherPref format
    const weatherPref = answers.activityPreference === "indoor" 
      ? "Indoor" 
      : answers.activityPreference === "outdoor" 
      ? "Outdoor" 
      : "Indoor"; // Default to Indoor for "mix"

    return {
      userId: user.id,
      travelVibe: answers.travelVibe,
      activityTypeIds,
      weatherPref,
      tripDays: parseInt(answers.tripDuration),
    };
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed - format and prepare for submission
      const submissionData = formatAnswersForSubmission();
      if (!submissionData) {
        alert("Please answer all questions before submitting. If you've answered all questions, there may be an issue loading activity types. Please refresh the page and try again.");
        return;
      }

      // Check if user is logged in
      if (!user?.id) {
        alert("Please log in to submit your preferences.");
        navigate("/login");
        return;
      }
      
      // Double-check that activity types were loaded
      if (activityTypes.length === 0) {
        alert("Failed to load activity types. Please refresh the page and try again.");
        return;
      }

      try {
        // Log submission data for debugging
        console.log("Quiz submission data:", JSON.stringify(submissionData, null, 2));
        console.log("Activity types count:", submissionData.activityTypeIds.length);
        console.log("Existing preferences:", existingPreferences);
        
        // Check if user has existing preferences - update or create
        if (existingPreferences?.profileId) {
          // Update existing preferences WITHOUT activityTypeIds
          // (backend might require separate calls to manage activities)
          console.log("Updating preferences for profileId:", existingPreferences.profileId);
          const result = await updatePreferences({
            profileId: existingPreferences.profileId,
            data: {
              travelVibe: submissionData.travelVibe,
              weatherPref: submissionData.weatherPref,
              tripDays: submissionData.tripDays,
              // NOT sending activityTypeIds - might need separate endpoint
            },
          }).unwrap();
          console.log("Update successful:", result);
        } else {
          // Create new preferences
          console.log("Creating new preferences");
          const result = await submitPreferences(submissionData).unwrap();
          console.log("Create successful:", result);
        }

        // Store submission data in sessionStorage to pass to results page
        sessionStorage.setItem("quizResults", JSON.stringify(submissionData));

        // Navigate to results page
        navigate("/quiz/results");
      } catch (error: any) {
        console.error("Error submitting quiz:", error);
        console.error("Error details:", {
          status: error?.status,
          data: error?.data,
          message: error?.message,
          originalStatus: error?.originalStatus,
        });
        
        // More detailed error message
        let errorMessage = "Please try again.";
        if (error?.status === 401) {
          errorMessage = "Your session has expired. Please log in again.";
          setTimeout(() => navigate("/login"), 2000);
        } else if (error?.status === 400) {
          errorMessage = error?.data?.message || "Invalid data submitted. Please check your answers.";
        } else if (error?.status === 500) {
          errorMessage = "Server error. Please try again in a few moments.";
        } else if (error?.data?.message) {
          errorMessage = error.data.message;
        }
        
        alert(
          `Failed to ${existingPreferences?.profileId ? "update" : "submit"} quiz: ${errorMessage}`
        );
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
    // All questions are single-select now
    return currentAnswer !== null && currentAnswer !== "";
  };

  // Show loading state while fetching activity types or checking preferences
  if (loadingActivities || isCheckingPreferences) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="spinner-orange"></div>
            <p className="mt-4 text-gray-600">Loading quiz...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
              // All questions are single-select now
              const isSelected = currentAnswer === option.value;

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
              disabled={!isCurrentQuestionAnswered() || isSubmitting || isUpdating}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all ${
                !isCurrentQuestionAnswered() || isSubmitting || isUpdating
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-orange-400 text-white hover:bg-orange-500"
              }`}
            >
              {isSubmitting || isUpdating
                ? existingPreferences?.profileId
                  ? "Updating..."
                  : "Submitting..."
                : currentQuestion === questions.length - 1
                ? existingPreferences?.profileId
                  ? "Update Preferences"
                  : "Submit"
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
