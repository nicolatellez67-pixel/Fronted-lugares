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

  const cursosFiltrados = cursos.filter((curso) => {
    const texto = quitarTildes(busqueda.trim());

    const nombreCurso = quitarTildes(
      `${curso.grado} ${curso.paralelo}`
    );

    return nombreCurso.includes(texto);
  });

  function obtenerEstudiantesDelCurso(curso: Curso) {
    return estudiantes.filter((estudiante) => {
      return (
        quitarTildes(estudiante.curso) ===
        quitarTildes(`${curso.grado} ${curso.paralelo}`)
      );
    });
  }

  if (cursoSeleccionado) {
    const estudiantesDelCurso =
      obtenerEstudiantesDelCurso(cursoSeleccionado);

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

          <h1>
            {cursoSeleccionado.grado}{" "}
            {cursoSeleccionado.paralelo}
          </h1>

          <p>
            Curso de secundaria
          </p>

          <div className="resumen-curso">
            <h2>
              {estudiantesDelCurso.length} estudiantes
            </h2>
          </div>

          <div className="tabla-cursos">
            <h2>Estudiantes del curso</h2>

            {estudiantesDelCurso.length === 0 ? (
              <div className="sin-estudiantes">
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

  return (
    <div className="cursos-layout">
      <Sidebar />

      <main className="cursos-page">
        <h1>Cursos</h1>

        <p>
          Cursos de secundaria del colegio Don Bosco.
        </p>

        <input
          className="buscador-cursos"
          type="text"
          placeholder="Buscar curso..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="tabla-cursos">
          <h2>Lista de cursos</h2>

          <table>
            <thead>
              <tr>
                <th>Grado</th>
                <th>Paralelo</th>
                <th>Estudiantes</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {cursosFiltrados.map((curso) => {
                const cantidad =
                  obtenerEstudiantesDelCurso(curso).length;

                return (
                  <tr key={curso.id}>
                    <td>{curso.grado}</td>

                    <td>{curso.paralelo}</td>

                    <td>{cantidad}</td>

                    <td>
                      <button
                        className="boton-ver"
                        onClick={() =>
                          setCursoSeleccionado(curso)
                        }
                      >
                        Ver curso
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