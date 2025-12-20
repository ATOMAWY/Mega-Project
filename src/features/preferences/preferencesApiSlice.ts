import { apiSlice } from "../../app/api/apiSlice";

// Type matching the backend CreatePreferenceDto
export interface CreatePreferenceDto {
  userId: string;
  travelVibe: string; // Single selection
  activityTypeIds: string[]; // Array of UUIDs
  weatherPref: string;
  tripDays: number;
}

// Type matching the backend UpdatePreferenceDto
export interface UpdatePreferenceDto {
  travelVibe?: string;
  weatherPref?: string;
  tripDays?: number;
  activityTypeIds?: string[];
}

// Type for the preference profile response
export interface PreferenceProfile {
  profileId: string;
  userId: string;
  travelVibe: string;
  placeCategories: string;
  weatherPref: string;
  tripDays: number;
  lastQuizTakenAt: string;
  activityTypes?: Array<{
    activityTypeId: string;
    name: string;
    description?: string;
  }>;
}

export const preferencesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's existing preferences
    getUserPreferences: builder.query<PreferenceProfile, string>({
      query: (userId) => `/api/Preference/user/${userId}`,
    }),
    
    // Create new preferences
    submitPreferences: builder.mutation<void, CreatePreferenceDto>({
      query: (preferences) => ({
        url: "/api/Preference/create",
        method: "POST",
        body: preferences,
      }),
      invalidatesTags: ["Preferences"],
    }),
    
    // Update existing preferences
    updatePreferences: builder.mutation<void, { profileId: string; data: UpdatePreferenceDto }>({
      query: ({ profileId, data }) => ({
        url: `/api/Preference/update/${profileId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Preferences"],
    }),
  }),
});

export const { 
  useGetUserPreferencesQuery,
  useSubmitPreferencesMutation,
  useUpdatePreferencesMutation,
} = preferencesApiSlice;

