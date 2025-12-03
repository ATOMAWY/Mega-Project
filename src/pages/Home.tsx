import { useState, useEffect, useMemo } from "react";
import NavBar from "./../components/NavBar/NavBar";
import HomeBanner from "./../components/HomeBanner/HomeBanner";
import QuickAccess from "./../components/Quick Access/QuickAccess";
import FindYourVibe from "../components/FindYourVibe/FindYourVibe";
import TrendingAttractions from "../components/TrendingAttractions/TrendingAttractions";
import HiddenGems from "../components/HiddenGems/HiddenGems";
import Footer from "../components/Footer/Footer";
import { fetchAttractions, type Attraction } from "../data/attractions";

const Home = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);

  useEffect(() => {
    // Load attractions asynchronously after component mounts
    fetchAttractions().then(setAttractions);
  }, []);

  // Separate attractions into Trending and Hidden Gems
  const { trendingAttractions, hiddenGems } = useMemo(() => {
    if (attractions.length === 0) {
      return { trendingAttractions: [], hiddenGems: [] };
    }

    // Create a copy and sort by rating and visitorsPerYear for trending
    const sortedForTrending = [...attractions].sort((a, b) => {
      // First sort by rating (higher is better)
      const ratingDiff = (b.rating || 0) - (a.rating || 0);
      if (ratingDiff !== 0) return ratingDiff;

      // Then by visitorsPerYear if available (higher is better)
      const visitorsA = a.raw?.visitorsPerYear as number | undefined;
      const visitorsB = b.raw?.visitorsPerYear as number | undefined;
      if (visitorsA && visitorsB) {
        return visitorsB - visitorsA;
      }
      if (visitorsA) return -1;
      if (visitorsB) return 1;

      return 0;
    });

    // Take top 50% for trending (higher rated, more popular)
    const trendingCount = Math.max(8, Math.ceil(sortedForTrending.length * 0.5));
    const trending = sortedForTrending.slice(0, trendingCount);
    const trendingIds = new Set(trending.map((a) => a.id));

    // For hidden gems, take the rest (lower rated, less popular) and sort differently
    // Prioritize places with lower ratings or unique characteristics
    // But filter out anything with rating less than 4.0
    const hidden = attractions
      .filter((a) => !trendingIds.has(a.id) && (a.rating || 0) >= 4.0)
      .sort((a, b) => {
        // Sort by rating ascending (lower rated first, but all >= 4.0) for hidden gems
        const ratingDiff = (a.rating || 0) - (b.rating || 0);
        if (ratingDiff !== 0) return ratingDiff;

        // Then by visitorsPerYear ascending (less visited first)
        const visitorsA = a.raw?.visitorsPerYear as number | undefined;
        const visitorsB = b.raw?.visitorsPerYear as number | undefined;
        if (visitorsA && visitorsB) {
          return visitorsA - visitorsB;
        }
        if (visitorsA) return 1;
        if (visitorsB) return -1;

        return 0;
      })
      .slice(0, Math.max(8, Math.ceil(attractions.length * 0.5)));

    return {
      trendingAttractions: trending,
      hiddenGems: hidden,
    };
  }, [attractions]);

  return (
    <div>
      <NavBar />
      <HomeBanner />
      <QuickAccess />
      <FindYourVibe />
      <TrendingAttractions attractions={trendingAttractions} />
      <HiddenGems attractions={hiddenGems} />
      <Footer></Footer>
    </div>
  );
};

export default Home;
