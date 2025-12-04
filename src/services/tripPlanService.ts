import type { Attraction } from "../data/attractions";

// These types mirror the important parts of TripPlan / TripDay / TripSlot
// from the backend swagger.json while keeping them convenient for the UI.
export type TripSlotType = "Morning" | "Afternoon" | "Evening" | "Optional";

export type TripSlot = {
  tripSlotId: string;
  slotType: TripSlotType;
  placeId: string;
  alternatePlaceId?: string | null;
  notes?: string | null;
  perPersonCost?: number | null;
  // Optional enrichment with frontend attraction data when available
  place?: Attraction;
};

export type TripDay = {
  tripDayId: string;
  dayNumber: number;
  date?: string | null;
  estimatedDayCost?: number | null;
  slots: TripSlot[];
};

export type TripPlan = {
  tripPlanId: string;
  title: string;
  startDate?: string | null;
  tripDays: TripDay[];
  estimatedCostPerPersonPerDay?: number | null;
};

// TODO: Wire this to the real TripPlan API:
// - GET /api/TripPlane/user/{userId}
// - GET /api/TripPlane/day/{tripId}
// - GET /api/TripDay/trip/{tripId}
// For now we expose a small hook-style function that returns mock data.

const MOCK_TRIP_PLAN: TripPlan = {
  tripPlanId: "demo-trip-plan",
  title: "Smart Mini Trip Planner",
  estimatedCostPerPersonPerDay: 150,
  tripDays: [
    {
      tripDayId: "day-1",
      dayNumber: 1,
      estimatedDayCost: 250,
      date: null,
      slots: [
        {
          tripSlotId: "slot-1-morning-main",
          slotType: "Morning",
          placeId: "00000000-0000-0000-0000-000000000001",
          perPersonCost: 150,
          notes: "Ideal start for first-time visitors.",
        },
      ],
    },
    {
      tripDayId: "day-2",
      dayNumber: 2,
      estimatedDayCost: 250,
      date: null,
      slots: [],
    },
    {
      tripDayId: "day-3",
      dayNumber: 3,
      estimatedDayCost: 250,
      date: null,
      slots: [],
    },
  ],
};

export const fetchTripPlanForUser = async (): Promise<TripPlan | null> => {
  // In a future iteration this will:
  // - read the authenticated user id from the auth context/service
  // - call the TripPlan endpoints
  // - map raw API models to TripPlan/TripDay/TripSlot
  // For now we just resolve mock data so the page can render.
  return MOCK_TRIP_PLAN;
};


