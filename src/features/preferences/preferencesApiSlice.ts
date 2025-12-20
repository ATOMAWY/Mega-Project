import { apiSlice } from "../../app/api/apiSlice";

// Type matching the backend CreatePreferenceDto
export interface CreatePreferenceDto {
  userId: string;
  travelVibe: string[];
  activityKinds: string[];
  weatherPref: string;
  placeCategories: string[];
  tripDays: number;
  budget?: number | null; // Optional field
}

export const preferencesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Submit quiz/preferences
    submitPreferences: builder.mutation<void, CreatePreferenceDto>({
      query: (preferences) => ({
        url: "/api/Preference/create",
        method: "POST",
        body: preferences,
      }),
    }),
  }),
});

export const { useSubmitPreferencesMutation } = preferencesApiSlice;

