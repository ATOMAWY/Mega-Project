import { CiFilter } from "react-icons/ci";

type FilterState = {
  budget: number;
  selectedMoods: string[];
  selectedActivityTypes: string[];
  minRating: number;
};

type Props = {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  onApply?: () => void;
};

const moodOptions = [
  "Adventurous",
  "Relaxing",
  "Cultural",
  "Romantic",
  "Family-Friendly",
  "Historical",
];

const activityOptions = [
  "Historical Sites",
  "Museums",
  "Shopping",
  "Food Tours",
  "Outdoor Activities",
  "Nightlife",
  "Art & Culture",
];

const FilterRecommendations = ({ filters, onChange, onReset, onApply }: Props) => {
  const toggleMood = (mood: string) => {
    const exists = filters.selectedMoods.includes(mood);
    const selectedMoods = exists
      ? filters.selectedMoods.filter((m) => m !== mood)
      : [...filters.selectedMoods, mood];
    onChange({ ...filters, selectedMoods });
  };

  const toggleActivity = (activity: string) => {
    const exists = filters.selectedActivityTypes.includes(activity);
    const selectedActivityTypes = exists
      ? filters.selectedActivityTypes.filter((a) => a !== activity)
      : [...filters.selectedActivityTypes, activity];
    onChange({ ...filters, selectedActivityTypes });
  };

  return (
    <div className="flex align-middle justify-center w-full">
      <div className="border p-5 rounded-xl items-center w-full max-w-full">
        <div className="flex text-2xl gap-3 align-middle items-center mb-3">
          <CiFilter className="text-orange-500 font-extrabold text-3xl" />
          <h2>Filter Recommendations</h2>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-col gap-5">
          <div className="flex flex-col md:flex-row md:gap-5 lg:flex-col lg:gap-0">
            <div>
              <h2 className="text-xl font-bold mb-3">Mood</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => toggleMood(mood)}
                    className={`btn rounded-full text-md w-full justify-start ${
                      filters.selectedMoods.includes(mood)
                        ? "bg-orange-400 text-white hover:bg-orange-500"
                        : ""
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
            <div className="my-5">
              <h2 className="text-xl font-bold mb-3 ">Budget</h2>
              <input
                type="range"
                min={0}
                max={50000}
                value={filters.budget}
                onChange={(e) => {
                  const budget = Math.round(Number(e.target.value) / 100) * 100;
                  onChange({ ...filters, budget });
                }}
                className="range range-xs [--range-shdw:orange]"
              />
              <p className="text-gray-500">
                Budget Level:{" "}
                <span className="font-bold">
                  {filters.budget.toLocaleString("en-US")} EGP
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-5 lg:flex-col lg:gap-0">
            <div className="my-5">
              <h2 className="text-xl font-bold mb-3">Activity Type</h2>
              <div className="form-control flex-col gap-1">
                {activityOptions.map((activity) => (
                  <label key={activity} className="flex gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox [--chkbg:orange]"
                      checked={filters.selectedActivityTypes.includes(activity)}
                      onChange={() => toggleActivity(activity)}
                    />
                    <span className="items-start">{activity}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="my-5">
              <h2 className="text-xl font-bold mb-3">Minimum Rating</h2>
              <div className="flex">
                <div className="flex w-full">
                  <select
                    className="select select-bordered w-full"
                    value={filters.minRating.toString()}
                    onChange={(e) =>
                      onChange({ ...filters, minRating: Number(e.target.value) })
                    }
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 my-5">
          <button
            type="button"
            className="btn bg-orange-400 align-middle justify-center text-white text-xl"
            onClick={onApply}
          >
            Apply Filters
          </button>
          <button
            type="button"
            className="btn bg-white align-middle justify-center text-black text-xl"
            onClick={onReset}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterRecommendations;
