import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./CursosPage.css";

type Curso = {
  id: number;
  grado: string;
  paralelo: string;
};

type Estudiante = {
  id: number;
  nombre: string;
  apellido: string;
  curso: string;
  tutor: string;
};

const CAPACIDAD_CURSO = 35;

const cursos: Curso[] = [
  { id: 1, grado: "1ro", paralelo: "A" },
  { id: 2, grado: "1ro", paralelo: "B" },
  { id: 3, grado: "1ro", paralelo: "C" },
  { id: 4, grado: "2do", paralelo: "A" },
  { id: 5, grado: "2do", paralelo: "B" },
  { id: 6, grado: "2do", paralelo: "C" },
  { id: 7, grado: "3ro", paralelo: "A" },
  { id: 8, grado: "3ro", paralelo: "B" },
  { id: 9, grado: "3ro", paralelo: "C" },
  { id: 10, grado: "4to", paralelo: "A" },
  { id: 11, grado: "4to", paralelo: "B" },
  { id: 12, grado: "4to", paralelo: "C" },
  { id: 13, grado: "5to", paralelo: "A" },
  { id: 14, grado: "5to", paralelo: "B" },
  { id: 15, grado: "5to", paralelo: "C" },
  { id: 16, grado: "6to", paralelo: "A" },
  { id: 17, grado: "6to", paralelo: "B" },
  { id: 18, grado: "6to", paralelo: "C" },
];

function CursosPage() {
  const [busqueda, setBusqueda] = useState("");

  const [cursoSeleccionado, setCursoSeleccionado] =
    useState<Curso | null>(null);

  const estudiantes: Estudiante[] = JSON.parse(
    localStorage.getItem("estudiantes") || "[]"
  );

  function quitarTildes(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function obtenerEstudiantesDelCurso(curso: Curso) {
    return estudiantes.filter(
      (estudiante) =>
        quitarTildes(estudiante.curso) ===
        quitarTildes(`${curso.grado} ${curso.paralelo}`)
    );
  }

  const cursosFiltrados = cursos.filter((curso) => {
    const texto = quitarTildes(busqueda.trim());

    const nombreCurso = quitarTildes(
      `${curso.grado} ${curso.paralelo}`
    );

    return nombreCurso.includes(texto);
  });

  /*
   * VISTA DEL CURSO
   */

  if (cursoSeleccionado) {
    const estudiantesDelCurso =
      obtenerEstudiantesDelCurso(cursoSeleccionado);

    const cantidad = estudiantesDelCurso.length;

    const asientosLibres = CAPACIDAD_CURSO - cantidad;

    return (
      <div className="cursos-layout">
        <Sidebar />

        <main className="cursos-page">

          <button
            className="boton-volver"
            onClick={() => setCursoSeleccionado(null)}
          >
            ← Volver a cursos
          </button>

          <div className="curso-header">

            <div>
              <h1>
                {cursoSeleccionado.grado}{" "}
                {cursoSeleccionado.paralelo}
              </h1>

              <p>
                Curso de secundaria · Colegio Don Bosco
              </p>
            </div>

          </div>

          <div className="resumen-curso">

            <div className="resumen-curso-card">
              <span>👥</span>
              <p>Estudiantes</p>
              <strong>{cantidad}</strong>
            </div>

            <div className="resumen-curso-card">
              <span>🎓</span>
              <p>Capacidad</p>
              <strong>{CAPACIDAD_CURSO}</strong>
            </div>

            <div className="resumen-curso-card">
              <span>🪑</span>
              <p>Asientos libres</p>
              <strong>{asientosLibres}</strong>
            </div>

          </div>

          <div className="tabla-cursos">

            <div className="tabla-titulo">
              <h2>Estudiantes del curso</h2>

              <span>
                {cantidad} / {CAPACIDAD_CURSO}
              </span>
            </div>

            {estudiantesDelCurso.length === 0 ? (

              <div className="sin-estudiantes">
                <div>👥</div>

                <p>
                  No hay estudiantes registrados en este curso.
                </p>
              </div>

            ) : (

              <table>

                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Tutor</th>
                  </tr>
                </thead>

                <tbody>

                  {estudiantesDelCurso.map((estudiante) => (

                    <tr key={estudiante.id}>

                      <td>{estudiante.nombre}</td>

                      <td>{estudiante.apellido}</td>

                      <td>{estudiante.tutor}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        </main>
      </div>
    );
  }

  /*
   * LISTA DE CURSOS
   */

  return (
    <div className="cursos-layout">

      <Sidebar />

      <main className="cursos-page">

        <div className="cursos-header">

          <div>
            <h1>Cursos</h1>

            <p>
              Cursos de secundaria del colegio Don Bosco.
            </p>
          </div>

          <div className="total-cursos">
            <strong>{cursos.length}</strong>
            <span>cursos</span>
          </div>

        </div>

        <div className="buscador-contenedor">

          <span>🔎</span>

          <input
            className="buscador-cursos"
            type="text"
            placeholder="Buscar curso..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

        </div>

        <div className="tabla-cursos">

          <div className="tabla-titulo">
            <h2>Lista de cursos</h2>

            <span>
              {cursosFiltrados.length} resultados
            </span>
          </div>

          <table>

            <thead>
              <tr>
                <th>Grado</th>
                <th>Paralelo</th>
                <th>Estudiantes</th>
                <th>Capacidad</th>
                <th>Libres</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>

              {cursosFiltrados.map((curso) => {

                const cantidad =
                  obtenerEstudiantesDelCurso(curso).length;

                const libres =
                  CAPACIDAD_CURSO - cantidad;

                return (
                  <tr key={curso.id}>

                    <td>
                      <strong>
                        {curso.grado}
                      </strong>
                    </td>

                    <td>
                      <span className="paralelo">
                        {curso.paralelo}
                      </span>
                    </td>

                    <td>
                      {cantidad}
                    </td>

                    <td>
                      {CAPACIDAD_CURSO}
                    </td>

                    <td>
                      <span
                        className={
                          libres === 0
                            ? "libres lleno"
                            : "libres"
                        }
                      >
                        {libres}
                      </span>
                    </td>

                    <td>

                      <button
                        className="boton-ver"
                        onClick={() =>
                          setCursoSeleccionado(curso)
                        }
                      >
                        Ver curso →
                      </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </main>
    </div>
  );
}

export default CursosPage;