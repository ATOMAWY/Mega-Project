import { useEffect, useMemo, useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import {
  fetchTripPlanForUser,
  type TripPlan,
  type TripDay,
  type TripSlot,
} from "../services/tripPlanService";

const TripPlanner = () => {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  useEffect(() => {
    // In the future this will load the authenticated user's latest trip plan
    fetchTripPlanForUser().then((plan) => {
      setTripPlan(plan);
      setActiveDayIndex(0);
    });
  }, []);

  const decoratedTripDays: (TripDay & {
    shortLabel: string;
    themeTitle: string;
    uiSlots: (TripSlot & {
      placeName: string;
      placeDescription: string;
      durationMinutes?: number;
      distanceLabel?: string;
    })[];
  })[] = useMemo(() => {
    if (!tripPlan) return [];

    return tripPlan.tripDays.map((day) => {
      const shortLabelMap: Record<number, string> = {
        1: "Day 1: Ancient Wonders",
        2: "Day 2: Historic Cairo & Markets",
        3: "Day 3: Coptic Cairo & Local Flavors",
      };

      const themeTitleMap: Record<number, string> = {
        1: "Morning Adventure: The Pyramids of Giza",
        2: "Old Cairo & Local Markets",
        3: "Coptic Cairo & Nile Dinner Cruise",
      };

      const shortLabel = shortLabelMap[day.dayNumber] ?? `Day ${day.dayNumber}`;
      const themeTitle =
        themeTitleMap[day.dayNumber] ?? `Day ${day.dayNumber} Highlights`;

      const uiSlots = day.slots.map((slot) => ({
        ...slot,
        placeName: slot.place?.title ?? "Giza Pyramids & Sphinx",
        placeDescription:
          slot.place?.description ??
          "Explore the last standing wonder of the ancient world. Marvel at the Great Pyramid of Khufu, the Pyramid of Khafre, and the Pyramid of Menkaure, guarded by the iconic Sphinx.",
        durationMinutes: slot.place?.avgVisitDurationMinutes ?? 180,
        distanceLabel: slot.place?.distance ?? "30 mins travel",
      }));

      return {
        ...day,
        shortLabel,
        themeTitle,
        uiSlots,
      };
    });
  }, [tripPlan]);

  const activeDay = decoratedTripDays[activeDayIndex];

  const costSummary = useMemo(() => {
    if (!tripPlan || !activeDay) {
      return {
        costPerDay: 0,
        costPerPersonPerDay: 0,
        totalGroupCost: 0,
      };
    }

    const costPerPersonPerDay = tripPlan.estimatedCostPerPersonPerDay ?? 0;
    const costPerDay = activeDay?.estimatedDayCost ?? costPerPersonPerDay;
    const totalGroupCost = costPerDay * 3; // Placeholder: assume 3 travellers

    return {
      costPerDay,
      costPerPersonPerDay,
      totalGroupCost,
    };
  }, [activeDay]);

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col bg-base-100">
      <NavBar />

      <main className="flex-1 mx-4 sm:mx-6 lg:mx-20 py-8 space-y-8">
        {/* Page Heading */}

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Smart Mini Trip Planner
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-2xl">
          Crafting your perfect journey through Cairo and Giza. Explore your
          personalized itinerary, designed to match your unique preferences.
        </p>

        {/* Cost Summary */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Estimated Trip Costs
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Overview of your travel budget based on your current plan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Cost Per Day
              </p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                ${costSummary.costPerDay.toFixed(0)}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Cost Per Person
              </p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                ${costSummary.costPerPersonPerDay.toFixed(0)}
              </p>
            </div>

            <div className="rounded-lg border border-orange-100 bg-orange-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Total Group Cost
              </p>
              <p className="mt-1 text-xl font-extrabold text-orange-400">
                ${costSummary.totalGroupCost.toFixed(0)}
              </p>
            </div>
          </div>
        </section>

        {/* Day Tabs */}
        <section className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 px-2 py-2 sm:px-3">
            <div className="flex flex-wrap gap-2">
              {decoratedTripDays.map((day, index) => {
                const isActive = index === activeDayIndex;
                return (
                  <button
                    key={day.tripDayId}
                    className={`btn btn-sm sm:btn-md rounded-full text-xs sm:text-sm font-medium normal-case px-3 sm:px-4 ${
                      isActive
                        ? "bg-orange-400 border-orange-400 text-white hover:bg-orange-500 hover:border-orange-500"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveDayIndex(index)}
                  >
                    {day.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Day Content */}
          {activeDay && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                  {activeDay.themeTitle}
                </h2>
              </div>

              {/* Morning / Afternoon / Evening sections as simple accordions */}
              <div className="space-y-2">
                {/* Morning */}
                <details
                  open
                  className="group border border-gray-200 bg-white rounded-xl"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
                    <span className="text-sm font-medium text-gray-900">
                      Morning Adventure: The Pyramids of Giza
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="border-t border-gray-200 px-4 py-4 sm:px-5 sm:py-5">
                    {activeDay.uiSlots
                      .filter((slot) => slot.slotType === "Morning")
                      .map((slot) => (
                        <article
                          key={slot.tripSlotId}
                          className="flex flex-col sm:flex-row gap-4"
                        >
                          <div className="sm:w-56 h-40 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            {/* Placeholder image block – later can use place photo from Places API */}
                            <div className="w-full h-full bg-cover bg-center bg-[url('/src/media/sphinx.jpg')]"></div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              {slot.placeName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {slot.placeDescription}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                              {slot.durationMinutes && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 border border-gray-200">
                                  <span className="h-2 w-2 rounded-full bg-orange-400" />
                                  {Math.round(slot.durationMinutes / 60)} hours
                                </span>
                              )}
                              {slot.distanceLabel && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 border border-gray-200">
                                  <span className="h-2 w-2 rounded-full bg-gray-300" />
                                  {slot.distanceLabel}
                                </span>
                              )}
                              <button className="btn btn-xs btn-outline border-orange-300 text-orange-400 hover:border-orange-400 hover:bg-orange-50">
                                Suggest Dining
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                  </div>
                </details>

                {/* Afternoon */}
                <details className="group border border-gray-200 bg-white rounded-xl">
                  <summary className="flex cursor-pointer items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
                    <span className="text-sm font-medium text-gray-900">
                      Afternoon Exploration: Egyptian Museum
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                </details>

                {/* Evening */}
                <details className="group border border-gray-200 bg-white rounded-xl">
                  <summary className="flex cursor-pointer items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
                    <span className="text-sm font-medium text-gray-900">
                      Evening Delights: Nile Dinner Cruise
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                </details>
              </div>
            </section>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TripPlanner;
