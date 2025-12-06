import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import Recommendations from "./pages/Recommendations";
import Quiz from "./pages/Quiz";
import QuizResults from "./pages/QuizResults";
import PageNotFound from "./pages/PageNotFound";
import Browse from "./pages/Browse";
import AttractionDetails from "./pages/AttractionDetails";
import Favourites from "./pages/Favourites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ScrollToTop from "./components/Scroller/ScrollToTop";
import Welcome from "./components/Auth/Welcome";
import RequireAuth from "./components/Auth/requireAuth";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/results" element={<QuizResults />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/attraction/:id" element={<AttractionDetails />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<PageNotFound />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          {" "}
          <Route path="/test" element={<Welcome />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
