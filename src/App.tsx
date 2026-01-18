import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import ProfileSetup from "./pages/ProfileSetup";
import Home from "./pages/Home";
import Experiments from "./pages/Experiments";
import Progress from "./pages/Progress";
import ExperimentDetail from "./pages/ExperimentDetail";

function App() {
  const isProfileCompleted =
    localStorage.getItem("profile_completed") === "true";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={isProfileCompleted ? "/home" : "/onboarding"}
              replace
            />
          }
        />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/experiments" element={<Experiments />} />
        <Route path="/progress" element={<Progress />} />
        <Route
          path="/experiment/:experimentId"
          element={<ExperimentDetail />}
        />
        <Route
          path="*"
          element={
            <Navigate
              to={isProfileCompleted ? "/home" : "/onboarding"}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
