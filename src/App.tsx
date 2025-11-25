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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/results" element={<QuizResults />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/attraction/:id" element={<AttractionDetails />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
