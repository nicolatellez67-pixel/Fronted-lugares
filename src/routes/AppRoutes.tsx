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

import ProtectedRoute from "./ProtectedRoute";

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
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/estudiantes"
          element={
            <ProtectedRoute>
              <EstudiantesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cursos"
          element={
            <ProtectedRoute>
              <CursosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/asientos"
          element={
            <ProtectedRoute>
              <AsientosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutores"
          element={
            <ProtectedRoute>
              <TutoresPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/historial"
          element={
            <ProtectedRoute>
              <HistorialPage />
            </ProtectedRoute>
          }
        />

        {/* SOLO ADMINISTRADOR */}
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute soloAdmin={true}>
              <ConfiguracionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/home" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;