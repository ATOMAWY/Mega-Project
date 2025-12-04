import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { GoLightBulb } from "react-icons/go";
import { FaList } from "react-icons/fa6";
import { FaCalendarAlt, FaRegHeart, FaCog } from "react-icons/fa";

const options = [
  {
    title: "Smart Preference Quiz",
    desc: "Tailor your recommendations with a quick quiz.",
    icon: <GoLightBulb />,
    path: "/quiz",
    isFunctional: true,
  },
  {
    title: "Recommendation Feed",
    desc: "Explore attractions curated just for you.",
    icon: <FaList />,
    path: "/recommendations",
    isFunctional: true,
  },
  {
    title: "Smart Mini Trip Planner",
    desc: "Build your perfect itinerary day by day.",
    icon: <FaCalendarAlt />,
    path: "/trip-planner",
    isFunctional: true,
  },
  {
    title: "Settings",
    desc: "Manage your account preferences and settings.",
    icon: <FaCog />,
    path: "/settings",
    isFunctional: true,
  },
  {
    title: "Favorites & Wishlist",
    desc: "Save the places you love and want to visit.",
    icon: <FaRegHeart />,
    path: "/favourites",
    isFunctional: true,
  },
  {
    title: "Explore Destinations",
    desc: "Browse all the amazing sights of Cairo & Giza.",
    icon: <CiLocationOn />,
    path: "/browse",
    isFunctional: true,
  },
];

const QuickAccess = () => {
  return (
    <div className="flex align-middle justify-center flex-col p-16 w-full">
      <h2 className="text-xl font-bold mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {options.map((item, idx) => {
          const CardContent = (
            <div className="flex flex-col gap-3">
              <div className="text-2xl text-orange-400 group-hover:text-orange-500 transition-colors">
                {item.icon}
              </div>
              <div>
                <div className="font-bold group-hover:text-orange-500 transition-colors">
                  {item.title}
                </div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            </div>
          );

          if (item.isFunctional && item.path) {
            return (
              <Link
                key={idx}
                to={item.path}
                className="bg-white rounded-lg shadow flex flex-col items-left p-5 max-w-1/3 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                {CardContent}
              </Link>
            );
          } else {
            return (
              <div
                key={idx}
                className="bg-white rounded-lg shadow flex flex-col items-left p-5 max-w-1/3 opacity-75"
              >
                {CardContent}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default QuickAccess;
