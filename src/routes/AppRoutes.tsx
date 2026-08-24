import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "../pages/HomePage";
import EstudiantesPage from "../pages/EstudiantesPage";
import CursosPage from "../pages/CursosPage";
import AsientosPage from "../pages/AsientosPage";
import TutoresPage from "../pages/TutoresPage";
import HistorialPage from "../pages/HistorialPage";
import ConfiguracionPage from "../pages/ConfiguracionPage";
import LoginPage from "../pages/LoginPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/home"
          element={<HomePage />}
        />

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

        <Route
          path="/historial"
          element={<HistorialPage />}
        />

        <Route
          path="/configuracion"
          element={<ConfiguracionPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;