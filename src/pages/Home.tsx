import { useState, useEffect } from "react";
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

  return (
    <div>
      <NavBar />
      <HomeBanner />
      <QuickAccess />
      <FindYourVibe />
      <TrendingAttractions attractions={attractions} />
      <HiddenGems attractions={attractions} />
      <Footer></Footer>
    </div>
  );
};

export default Home;
