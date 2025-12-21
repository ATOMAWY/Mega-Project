import { apiSlice } from "../../app/api/apiSlice";

// ML-generated trip plan types (what we get from AI)
export type MLTripPlace = {
  PlaceId: number;
  Name: string;
  Category: string;
  "Photo URL": string;
  Final_Score: number;
  Latitude: number;
  Longitude: number;
  Rating: number;
  "Review Count": number;
  Norm_Popularity: number;
  cluster: number | null;
};

export type GenerateTripPlansResponse = {
  message: string;
  totalPlans: number;
  plans: {
    [key: string]: MLTripPlace[]; // "Plan 1", "Plan 2", etc.
  };
};

// Backend trip plan structure (for saving/loading trips)
export type TripSlot = {
  tripSlotId: string;
  tripDayId: string;
  slotType: "Morning" | "Afternoon" | "Evening" | "Optional";
  placeId: string; // UUID
  alternatePlaceId?: string;
  notes?: string;
};

export type TripDay = {
  tripDayId: string;
  tripPlanId: string;
  dayNumber: number;
  date?: string;
  tripSlots: TripSlot[];
};

export type TripPlan = {
  tripPlanId: string;
  userId: string;
  title: string;
  startDate?: string;
  tripDays: number;
  alignmentScore?: number;
  scoreBreakdownJson?: string;
  parentPlanId?: string;
  variationNumber?: number;
  tripDaysCollection: TripDay[];
};

// DTOs for creating trips
export type TripPlanCreateDto = {
  userId: string;
  title: string;
  startDate?: string;
  tripDays: number;
  alignmentScore?: number;
  scoreBreakdownJson?: string;
  parentPlanId?: string;
  variationNumber?: number;
};

export type TripDayCreateDto = {
  tripPlanId: string;
  dayNumber: number;
  date?: string;
};

export type TripSlotCreateDto = {
  slotType: "Morning" | "Afternoon" | "Evening" | "Optional";
  placeId: string;
  alternatePlaceId?: string;
  notes?: string;
};

export const tripPlannerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Generate AI trip plans
    generateTripPlans: builder.mutation<GenerateTripPlansResponse, { userId: string }>({
      query: ({ userId }) => ({
        url: "/api/ml-recommendations/plans/generate",
        method: "POST",
        body: { userId },
      }),
    }),

    // Get all user's saved trips
    getUserTrips: builder.query<TripPlan[], string>({
      query: (userId) => `/api/TripPlane/user/${userId}`,
      providesTags: ["TripPlans"],
    }),

    // Get specific trip by ID
    getTripById: builder.query<TripPlan, string>({
      query: (tripId) => `/api/TripPlane/${tripId}`,
      providesTags: (_result, _error, tripId) => [{ type: "TripPlans", id: tripId }],
    }),

    // Create a new trip
    createTrip: builder.mutation<{ tripPlanId: string }, TripPlanCreateDto>({
      query: (tripPlan) => ({
        url: "/api/TripPlane/create",
        method: "POST",
        body: tripPlan,
      }),
      invalidatesTags: ["TripPlans"],
    }),

    // Delete a trip
    deleteTrip: builder.mutation<void, string>({
      query: (tripId) => ({
        url: `/api/TripPlane/${tripId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TripPlans"],
    }),

    // Add a day to a trip
    addTripDay: builder.mutation<{ tripDayId: string }, { tripId: string; dayData: TripDayCreateDto }>({
      query: ({ tripId, dayData }) => ({
        url: `/api/TripDay/trip/${tripId}`,
        method: "POST",
        body: dayData,
      }),
      invalidatesTags: (_result, _error, { tripId }) => [{ type: "TripPlans", id: tripId }],
    }),

    // Get all days for a trip
    getTripDays: builder.query<TripDay[], string>({
      query: (tripId) => `/api/TripDay/${tripId}`,
    }),

    // Add a slot to a day
    addTripSlot: builder.mutation<{ tripSlotId: string }, { dayId: string; slotData: TripSlotCreateDto }>({
      query: ({ dayId, slotData }) => ({
        url: `/api/TripSlot/day/${dayId}`,
        method: "POST",
        body: slotData,
      }),
    }),

    // Get all slots for a day
    getTripSlots: builder.query<TripSlot[], string>({
      query: (dayId) => `/api/TripSlot/day/${dayId}`,
    }),

    // Delete a slot
    deleteTripSlot: builder.mutation<void, string>({
      query: (slotId) => ({
        url: `/api/TripSlot/${slotId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGenerateTripPlansMutation,
  useGetUserTripsQuery,
  useGetTripByIdQuery,
  useCreateTripMutation,
  useDeleteTripMutation,
  useAddTripDayMutation,
  useGetTripDaysQuery,
  useAddTripSlotMutation,
  useGetTripSlotsQuery,
  useDeleteTripSlotMutation,
} = tripPlannerApiSlice;

