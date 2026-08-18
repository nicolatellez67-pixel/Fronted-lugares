import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./TutoresPage.css";

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
  telefonoTutor: string;
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

function TutoresPage() {
  const [cursoSeleccionado, setCursoSeleccionado] =
    useState<Curso | null>(null);

  const [busqueda, setBusqueda] = useState("");

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
      <div className="tutores-layout">
        <Sidebar />

        <main className="tutores-page">
          <button
            className="boton-volver"
            onClick={() => setCursoSeleccionado(null)}
          >
            ← Volver a cursos
          </button>

          <h1>
            Tutores - {cursoSeleccionado.grado}{" "}
            {cursoSeleccionado.paralelo}
          </h1>

          <p>
            Tutores de los estudiantes del curso.
          </p>

          <div className="tabla-tutores">
            <h2>Estudiantes y tutores</h2>

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
                    <th>Estudiante</th>
                    <th>Tutor</th>
                    <th>Teléfono</th>
                  </tr>
                </thead>

                <tbody>
                  {estudiantesDelCurso.map((estudiante) => (
                    <tr key={estudiante.id}>
                      <td>
                        {estudiante.nombre}{" "}
                        {estudiante.apellido}
                      </td>

                      <td>
                        {estudiante.tutor}
                      </td>

                      <td>
                        {estudiante.telefonoTutor
                          ? estudiante.telefonoTutor
                          : "No registrado"}
                      </td>
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

  const cursosFiltrados = cursos.filter((curso) => {
    const texto = quitarTildes(busqueda.trim());

    const nombreCurso = quitarTildes(
      `${curso.grado} ${curso.paralelo}`
    );

    return nombreCurso.includes(texto);
  });

  return (
    <div className="tutores-layout">
      <Sidebar />

      <main className="tutores-page">
        <h1>Tutores</h1>

        <p>
          Consulta de tutores por curso y paralelo.
        </p>

        <input
          className="buscador-tutores"
          type="text"
          placeholder="Buscar curso..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="tabla-tutores">
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
                        Ver tutores
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

export default TutoresPage;