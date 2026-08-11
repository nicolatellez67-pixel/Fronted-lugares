import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import EstudiantesPage from "../pages/EstudiantesPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/estudiantes" element={<EstudiantesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;