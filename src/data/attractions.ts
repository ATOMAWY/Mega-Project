export const attractions = [
  {
    id: 1,
    photo:
      "https://images.globalhighlights.com/allpicture/2021/06/bdd9119e11ef437389da5b13_cut_600x550_241_1747667654.jpg",
    title: "Pyramids of Giza",
    description:
      "The iconic ancient pyramids located on the Giza Plateau, built over 4,500 years ago.",
    rating: 4.9,
    className: "attraction-pyramids",
    level: "Moderate",
    distance: "20 km",
    isFavorite: true,
    category: "Historical",
    // Approximate values used for filtering – will later come from the API
    price: 1500,
    distanceKm: 20,
    moods: ["Adventurous", "Historical", "Cultural"],
    activityTypes: ["Historical Sites", "Outdoor Activities"],
  },
  {
    id: 2,
    photo:
      "https://www.cleopatraegypttours.com/wp-content/uploads/2018/08/Karnak-Temple-Facts.jpg",
    title: "Karnak Temple",
    description:
      "A vast complex of chapels and pylons dedicated mainly to the god Amun-Ra in Luxor.",
    rating: 4.8,
    className: "attraction-karnak",
    level: "Low",
    distance: "2 km",
    isFavorite: false,
    category: "Historical",
    price: 800,
    distanceKm: 2,
    moods: ["Cultural", "Historical"],
    activityTypes: ["Historical Sites"],
  },
  {
    id: 3,
    photo:
      "https://holiday-golightly.com/wp-content/uploads/2017/10/20070602-dsc_0089-lightroom-1024x685.jpg",
    title: "Abu Simbel",
    description:
      "Two temples carved into rock by Ramses II, famous for their massive statues and relocation.",
    rating: 4.7,
    className: "attraction-abu-simbel",
    level: "High",
    distance: "280 km",
    isFavorite: false,
    category: "Historical",
    price: 4000,
    distanceKm: 280,
    moods: ["Adventurous", "Cultural"],
    activityTypes: ["Historical Sites", "Outdoor Activities"],
  },
  {
    id: 4,
    photo:
      "https://herasianadventures.com/wp-content/uploads/2025/06/best-things-to-do-in-Siwa-Oasis-egypt-4.jpg",
    title: "Siwa Oasis",
    description:
      "A remote, serene oasis known for natural springs, salt lakes, and the ancient Shali Fortress.",
    rating: 4.6,
    className: "attraction-siwa",
    level: "Low",
    distance: "560 km",
    isFavorite: true,
    category: "Natural",
    price: 2500,
    distanceKm: 560,
    moods: ["Relaxing", "Romantic", "Family-Friendly"],
    activityTypes: ["Outdoor Activities"],
  },
  {
    id: 5,
    photo:
      "https://static.dezeen.com/uploads/2025/10/grand-egyptian-museum-heneghan-peng-architects-cultural-egypt-giza-architecture_dezeen_2364_hero.jpg",
    title: "Grand Egyptian Museum",
    description:
      "A museum in Cairo housing thousands of ancient artifacts, including Tutankhamun's treasures.",
    rating: 4.5,
    className: "attraction-gem",
    level: "Free",
    distance: "5 km",
    isFavorite: false,
    category: "Museum",
    price: 500,
    distanceKm: 5,
    moods: ["Cultural", "Family-Friendly"],
    activityTypes: ["Museums", "Art & Culture"],
  },
];
