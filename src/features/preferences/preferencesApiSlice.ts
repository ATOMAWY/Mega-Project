import { apiSlice } from "../../app/api/apiSlice";

// Type matching the backend CreatePreferenceDto
export interface CreatePreferenceDto {
  userId: string;
  travelVibe: string; // Single selection
  activityTypeIds: string[]; // Array of UUIDs
  weatherPref: string;
  tripDays: number;
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

