import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { getUsuario } from "../repositories/authRepository";
import "./EstudiantesPage.css";

type Estudiante = {
  id: number;
  nombre: string;
  apellido: string;
  curso: string;
  tutor: string;
  telefonoTutor: string;
};

const cursos = [
  "1ro A",
  "1ro B",
  "1ro C",
  "2do A",
  "2do B",
  "2do C",
  "3ro A",
  "3ro B",
  "3ro C",
  "4to A",
  "4to B",
  "4to C",
  "5to A",
  "5to B",
  "5to C",
  "6to A",
  "6to B",
  "6to C",
];

function cargarEstudiantes(): Estudiante[] {
  try {
    const datos = JSON.parse(
      localStorage.getItem("estudiantes") || "[]"
    );

    return datos.map((estudiante: any) => ({
      id: estudiante.id,
      nombre: estudiante.nombre || "",
      apellido: estudiante.apellido || "",
      curso: estudiante.curso || "",
      tutor: estudiante.tutor || "",
      telefonoTutor:
        estudiante.telefonoTutor ||
        estudiante.telefono ||
        "",
    }));
  } catch {
    return [];
  }
}

function EstudiantesPage() {
  const usuario = getUsuario();
  const esAdmin = usuario?.rol === "ADMIN";

  const [estudiantes, setEstudiantes] =
    useState<Estudiante[]>(
      cargarEstudiantes
    );

  const [busqueda, setBusqueda] =
    useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [estudianteEditando, setEstudianteEditando] =
    useState<Estudiante | null>(null);

  const [nombre, setNombre] =
    useState("");

  const [apellido, setApellido] =
    useState("");

  const [curso, setCurso] =
    useState("");

  const [tutor, setTutor] =
    useState("");

  const [telefonoTutor, setTelefonoTutor] =
    useState("");

  function abrirFormulario() {
    if (!esAdmin) {
      return;
    }

    setEstudianteEditando(null);

    setNombre("");
    setApellido("");
    setCurso("");
    setTutor("");
    setTelefonoTutor("");

    setMostrarFormulario(true);
  }

  function editarEstudiante(
    estudiante: Estudiante
  ) {
    if (!esAdmin) {
      return;
    }

    setEstudianteEditando(estudiante);

    setNombre(estudiante.nombre);
    setApellido(estudiante.apellido);
    setCurso(estudiante.curso);
    setTutor(estudiante.tutor);
    setTelefonoTutor(
      estudiante.telefonoTutor || ""
    );

    setMostrarFormulario(true);
  }

  function guardarEstudiante() {
    if (!esAdmin) {
      return;
    }

    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !curso ||
      !tutor.trim() ||
      !telefonoTutor.trim()
    ) {
      alert(
        "Completa todos los campos"
      );

      return;
    }

    if (estudianteEditando) {
      const actualizados =
        estudiantes.map(
          (estudiante) =>
            estudiante.id ===
            estudianteEditando.id
              ? {
                  ...estudiante,
                  nombre:
                    nombre.trim(),
                  apellido:
                    apellido.trim(),
                  curso,
                  tutor:
                    tutor.trim(),
                  telefonoTutor:
                    telefonoTutor.trim(),
                }
              : estudiante
        );

      setEstudiantes(actualizados);

      localStorage.setItem(
        "estudiantes",
        JSON.stringify(actualizados)
      );
    } else {
      const nuevoEstudiante:
        Estudiante = {
          id: Date.now(),
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          curso,
          tutor: tutor.trim(),
          telefonoTutor:
            telefonoTutor.trim(),
        };

      const nuevos = [
        ...estudiantes,
        nuevoEstudiante,
      ];

      setEstudiantes(nuevos);

      localStorage.setItem(
        "estudiantes",
        JSON.stringify(nuevos)
      );
    }

    window.dispatchEvent(
      new Event("estudiantesActualizados")
    );

    cerrarFormulario();
  }

  function eliminarEstudiante(
    id: number
  ) {
    if (!esAdmin) {
      return;
    }

    const confirmar =
      window.confirm(
        "¿Quieres eliminar este estudiante?"
      );

    if (!confirmar) {
      return;
    }

    const nuevos =
      estudiantes.filter(
        (estudiante) =>
          estudiante.id !== id
      );

    setEstudiantes(nuevos);

    localStorage.setItem(
      "estudiantes",
      JSON.stringify(nuevos)
    );

    window.dispatchEvent(
      new Event("estudiantesActualizados")
    );
  }

  function cerrarFormulario() {
    setMostrarFormulario(false);

    setEstudianteEditando(null);

    setNombre("");
    setApellido("");
    setCurso("");
    setTutor("");
    setTelefonoTutor("");
  }

  function quitarTildes(
    texto: string
  ) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );
  }

  const estudiantesFiltrados =
    estudiantes.filter(
      (estudiante) => {
        const texto =
          quitarTildes(busqueda);

        const nombreCompleto =
          quitarTildes(
            `${estudiante.nombre} ${estudiante.apellido}`
          );

        return (
          nombreCompleto.includes(
            texto
          ) ||
          quitarTildes(
            estudiante.curso
          ).includes(texto) ||
          quitarTildes(
            estudiante.tutor
          ).includes(texto) ||
          estudiante.telefonoTutor
            .toLowerCase()
            .includes(texto)
        );
      }
    );

  return (
    <div className="estudiantes-layout">

      <Sidebar />

      <main className="estudiantes-page">

        <div className="estudiantes-header">

          <div>
            <h1>
              Estudiantes
            </h1>

            <p>
              Gestión de estudiantes
              del colegio Don Bosco.
            </p>
          </div>

          {esAdmin && (
            <button
              className="boton-nuevo"
              onClick={
                abrirFormulario
              }
            >
              + Nuevo estudiante
            </button>
          )}

        </div>

        <div className="estudiantes-barra">

          <input
            className="buscador-estudiantes"
            type="text"
            placeholder="Buscar estudiante, curso, tutor o teléfono..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(
                e.target.value
              )
            }
          />

          <div className="cantidad-estudiantes">
            {estudiantes.length}{" "}
            estudiantes
          </div>

        </div>

        <div className="tabla-estudiantes">

          <table>

            <thead>
              <tr>
                <th>
                  Nombre
                </th>

                <th>
                  Apellido
                </th>

                <th>
                  Curso
                </th>

                <th>
                  Tutor
                </th>

                <th>
                  Teléfono
                </th>

                {esAdmin && (
                  <th>
                    Acciones
                  </th>
                )}
              </tr>
            </thead>

            <tbody>

              {estudiantesFiltrados.length ===
              0 ? (

                <tr>
                  <td
                    colSpan={
                      esAdmin ? 6 : 5
                    }
                    className="sin-estudiantes"
                  >
                    No hay estudiantes
                    registrados.
                  </td>
                </tr>

              ) : (

                estudiantesFiltrados.map(
                  (estudiante) => (

                    <tr
                      key={
                        estudiante.id
                      }
                    >

                      <td>
                        {
                          estudiante.nombre
                        }
                      </td>

                      <td>
                        {
                          estudiante.apellido
                        }
                      </td>

                      <td>
                        <span className="curso-badge">
                          {
                            estudiante.curso
                          }
                        </span>
                      </td>

                      <td>
                        {
                          estudiante.tutor
                        }
                      </td>

                      <td>
                        {estudiante.telefonoTutor
                          ? estudiante.telefonoTutor
                          : "No registrado"}
                      </td>

                      {esAdmin && (
                        <td>

                          <div className="acciones">

                            <button
                              className="boton-editar"
                              onClick={() =>
                                editarEstudiante(
                                  estudiante
                                )
                              }
                            >
                              Editar
                            </button>

                            <button
                              className="boton-eliminar"
                              onClick={() =>
                                eliminarEstudiante(
                                  estudiante.id
                                )
                              }
                            >
                              Eliminar
                            </button>

                          </div>

                        </td>
                      )}

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </main>

      {mostrarFormulario &&
        esAdmin && (

          <div className="modal-fondo">

            <div className="formulario-estudiante">

              <h2>
                {estudianteEditando
                  ? "Editar estudiante"
                  : "Nuevo estudiante"}
              </h2>

              <label>
                Nombre
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(e) =>
                  setNombre(
                    e.target.value
                  )
                }
                placeholder="Nombre"
              />

              <label>
                Apellido
              </label>

              <input
                type="text"
                value={apellido}
                onChange={(e) =>
                  setApellido(
                    e.target.value
                  )
                }
                placeholder="Apellido"
              />

              <label>
                Curso
              </label>

              <select
                value={curso}
                onChange={(e) =>
                  setCurso(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Seleccionar curso
                </option>

                {cursos.map(
                  (cursoItem) => (
                    <option
                      key={cursoItem}
                      value={cursoItem}
                    >
                      {cursoItem}
                    </option>
                  )
                )}
              </select>

              <label>
                Tutor
              </label>

              <input
                type="text"
                value={tutor}
                onChange={(e) =>
                  setTutor(
                    e.target.value
                  )
                }
                placeholder="Nombre del tutor"
              />

              <label>
                Teléfono del tutor
              </label>

              <input
                type="tel"
                value={telefonoTutor}
                onChange={(e) =>
                  setTelefonoTutor(
                    e.target.value
                  )
                }
                placeholder="Ej. 70000000"
              />

              <div className="botones-formulario">

                <button
                  className="boton-guardar"
                  onClick={
                    guardarEstudiante
                  }
                >
                  Guardar
                </button>

                <button
                  className="boton-cancelar"
                  onClick={
                    cerrarFormulario
                  }
                >
                  Cancelar
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}

export default EstudiantesPage;