import NavBar from "./../components/NavBar/NavBar";
import HomeBanner from "./../components/HomeBanner/HomeBanner";
import QuickAccess from "./../components/Quick Access/QuickAccess";
import FindYourVibe from "../components/FindYourVibe/FindYourVibe";
import TrendingAttractions from "../components/TrendingAttractions/TrendingAttractions";
import HiddenGems from "../components/HiddenGems/HiddenGems";
import Footer from "../components/Footer/Footer";

const Home = () => {
  return (
    <>
      <NavBar />
      <HomeBanner />
      <QuickAccess />
      <FindYourVibe />
      {/* <Card
        photo="https://www.visit-gem.com/storage/informations/1752589691_1737030068_DSC00437-min.jpeg"
        rating={4}
        title="Grand Egyptian Museum"
        description="Great experience, highly recommended"
      /> */}
      <TrendingAttractions />
      <HiddenGems />
      <Footer></Footer>
    </>
  );
};

export default Home;
