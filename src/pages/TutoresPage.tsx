import { useEffect, useState } from "react";
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

  const [estudiantes, setEstudiantes] =
    useState<Estudiante[]>(() => {
      const datos =
        localStorage.getItem("estudiantes");

      return datos ? JSON.parse(datos) : [];
    });

  useEffect(() => {
    function actualizarEstudiantes() {
      const datos =
        localStorage.getItem("estudiantes");

      setEstudiantes(
        datos ? JSON.parse(datos) : []
      );
    }

    window.addEventListener(
      "estudiantesActualizados",
      actualizarEstudiantes
    );

    return () => {
      window.removeEventListener(
        "estudiantesActualizados",
        actualizarEstudiantes
      );
    };
  }, []);

  function quitarTildes(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function obtenerEstudiantesDelCurso(
    curso: Curso
  ) {
    const nombreCurso = quitarTildes(
      `${curso.grado} ${curso.paralelo}`
    ).trim();

    return estudiantes.filter((estudiante) => {
      const cursoEstudiante = quitarTildes(
        estudiante.curso
      ).trim();

      return cursoEstudiante === nombreCurso;
    });
  }

  if (cursoSeleccionado) {
    const estudiantesDelCurso =
      obtenerEstudiantesDelCurso(
        cursoSeleccionado
      );

    return (
      <div className="tutores-layout">
        <Sidebar />

        <main className="tutores-page">
          <button
            className="boton-volver"
            onClick={() =>
              setCursoSeleccionado(null)
            }
          >
            ← Volver a cursos
          </button>

          <div className="tutores-header">
            <div>
              <h1>
                Tutores -{" "}
                {cursoSeleccionado.grado}{" "}
                {cursoSeleccionado.paralelo}
              </h1>

              <p>
                Información de los tutores de los
                estudiantes del curso.
              </p>
            </div>

            <div className="cantidad-estudiantes">
              <strong>
                {estudiantesDelCurso.length}
              </strong>

              <span>estudiantes</span>
            </div>
          </div>

          <div className="tabla-tutores">
            <div className="tabla-titulo">
              <h2>
                Estudiantes y tutores
              </h2>

              <span>
                {estudiantesDelCurso.length}{" "}
                registrados
              </span>
            </div>

            {estudiantesDelCurso.length === 0 ? (
              <div className="sin-estudiantes">
                <div>👥</div>

                <p>
                  No hay estudiantes registrados
                  en este curso.
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
                  {estudiantesDelCurso.map(
                    (estudiante) => (
                      <tr key={estudiante.id}>
                        <td>
                          <strong>
                            {estudiante.nombre}{" "}
                            {estudiante.apellido}
                          </strong>
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
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    );
  }

  const cursosFiltrados = cursos.filter(
    (curso) => {
      const texto =
        quitarTildes(busqueda.trim());

      const nombreCurso =
        quitarTildes(
          `${curso.grado} ${curso.paralelo}`
        );

      return nombreCurso.includes(texto);
    }
  );

  return (
    <div className="tutores-layout">
      <Sidebar />

      <main className="tutores-page">
        <div className="tutores-header">
          <div>
            <h1>Tutores</h1>

            <p>
              Consulta de tutores por curso y
              paralelo.
            </p>
          </div>

          <div className="cantidad-estudiantes">
            <strong>{cursos.length}</strong>

            <span>cursos</span>
          </div>
        </div>

        <div className="buscador-contenedor">
          <span>🔎</span>

          <input
            className="buscador-tutores"
            type="text"
            placeholder="Buscar curso..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
          />
        </div>

        <div className="tabla-tutores">
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
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {cursosFiltrados.map((curso) => {
                const cantidad =
                  obtenerEstudiantesDelCurso(
                    curso
                  ).length;

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

                    <td>{cantidad}</td>

                    <td>
                      <button
                        className="boton-ver"
                        onClick={() =>
                          setCursoSeleccionado(
                            curso
                          )
                        }
                      >
                        Ver tutores →
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