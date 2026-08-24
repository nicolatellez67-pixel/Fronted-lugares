import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./HomePage.css";

function HomePage() {
  const [cantidadEstudiantes, setCantidadEstudiantes] = useState(0);
  const [asientosOcupados, setAsientosOcupados] = useState(0);

  const totalCursos = 18;
  const totalAsientos = totalCursos * 35;

  useEffect(() => {
    function actualizarResumen() {
      const estudiantes = JSON.parse(
        localStorage.getItem("estudiantes") || "[]"
      );

      const asignaciones = JSON.parse(
        localStorage.getItem("asignaciones") || "{}"
      );

      let ocupados = 0;

      Object.values(asignaciones).forEach((curso) => {
        if (Array.isArray(curso)) {
          ocupados += curso.length;
        }
      });

      setCantidadEstudiantes(estudiantes.length);
      setAsientosOcupados(ocupados);
    }

    actualizarResumen();

    window.addEventListener("storage", actualizarResumen);

    return () => {
      window.removeEventListener("storage", actualizarResumen);
    };
  }, []);

  const asientosLibres = totalAsientos - asientosOcupados;

  return (
    <div className="home">
      <Sidebar />

      <main className="content">
        <div className="inicio-fondo">

          <div className="inicio-texto">
            <h1>Bienvenido al sistema</h1>

            <p>
              Sistema de asignación de asientos para estudiantes.
            </p>
          </div>

          <div className="resumen">

            <div className="resumen-card">
              <div className="icono-card">👥</div>

              <h3>Estudiantes</h3>

              <strong>{cantidadEstudiantes}</strong>

              <span>registrados</span>
            </div>

            <div className="resumen-card">
              <div className="icono-card">🎓</div>

              <h3>Cursos</h3>

              <strong>{totalCursos}</strong>

              <span>activos</span>
            </div>

            <div className="resumen-card">
              <div className="icono-card">🪑</div>

              <h3>Asientos ocupados</h3>

              <strong>{asientosOcupados}</strong>

              <span>asignados</span>
            </div>

            <div className="resumen-card">
              <div className="icono-card">🪑</div>

              <h3>Asientos libres</h3>

              <strong>{asientosLibres}</strong>

              <span>disponibles</span>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default HomePage;