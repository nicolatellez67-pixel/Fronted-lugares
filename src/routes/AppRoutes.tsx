import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import EstudiantesPage from "../pages/EstudiantesPage";
import CursosPage from "../pages/CursosPage";
import AsientosPage from "../pages/AsientosPage";
import TutoresPage from "../pages/TutoresPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/home" element={<HomePage />} />

        <Route
          path="/estudiantes"
          element={<EstudiantesPage />}
        />

        <Route
          path="/cursos"
          element={<CursosPage />}
        />

        <Route
          path="/asientos"
          element={<AsientosPage />}
        />

        <Route
          path="/tutores"
          element={<TutoresPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;