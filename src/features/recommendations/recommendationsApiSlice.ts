import { apiSlice } from "../../app/api/apiSlice";

// Type for ML recommendation from backend
export interface MLRecommendation {
  PlaceId: number; // Integer ID from ML model
  Name: string;
  Category: string;
  "Photo URL": string;
  Final_Score: number;
}

// Type for the generate recommendations response
export interface GenerateRecommendationsResponse {
  message: string;
  count: number;
  recommendations: MLRecommendation[];
}

// Type for generating recommendations request
export interface GenerateRecommendationsRequest {
  userId: string;
}

export const recommendationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Generate ML recommendations for a user
    generateRecommendations: builder.mutation<GenerateRecommendationsResponse, GenerateRecommendationsRequest>({
      query: (request) => ({
        url: "/api/ml-recommendations/generate",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Preferences"],
    }),
  }),
});

export const {
  useGenerateRecommendationsMutation,
} = recommendationsApiSlice;

