import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./EstudiantesPage.css";

type Estudiante = {
  id: number;
  nombre: string;
  apellido: string;
  curso: string;
  tutor: string;
};

function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(() => {
    const datos = localStorage.getItem("estudiantes");
    return datos ? JSON.parse(datos) : [];
  });

  const [busqueda, setBusqueda] = useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [estudianteEditando, setEstudianteEditando] =
    useState<Estudiante | null>(null);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [curso, setCurso] = useState("");
  const [tutor, setTutor] = useState("");

  function abrirFormulario() {
    setEstudianteEditando(null);

    setNombre("");
    setApellido("");
    setCurso("");
    setTutor("");

    setMostrarFormulario(true);
  }

  function editarEstudiante(estudiante: Estudiante) {
    setEstudianteEditando(estudiante);

    setNombre(estudiante.nombre);
    setApellido(estudiante.apellido);
    setCurso(estudiante.curso);
    setTutor(estudiante.tutor);

    setMostrarFormulario(true);
  }

  function guardarEstudiante() {
    if (!nombre || !apellido || !curso || !tutor) {
      alert("Completa todos los campos");
      return;
    }

    if (estudianteEditando) {
      const actualizados = estudiantes.map((estudiante) =>
        estudiante.id === estudianteEditando.id
          ? {
              ...estudiante,
              nombre,
              apellido,
              curso,
              tutor,
            }
          : estudiante
      );

      setEstudiantes(actualizados);

      localStorage.setItem(
        "estudiantes",
        JSON.stringify(actualizados)
      );
    } else {
      const nuevoEstudiante: Estudiante = {
        id: Date.now(),
        nombre,
        apellido,
        curso,
        tutor,
      };

      const nuevos = [...estudiantes, nuevoEstudiante];

      setEstudiantes(nuevos);

      localStorage.setItem(
        "estudiantes",
        JSON.stringify(nuevos)
      );
    }

    cerrarFormulario();
  }

  function eliminarEstudiante(id: number) {
    const confirmar = window.confirm(
      "¿Quieres eliminar este estudiante?"
    );

    if (!confirmar) {
      return;
    }

    const nuevos = estudiantes.filter(
      (estudiante) => estudiante.id !== id
    );

    setEstudiantes(nuevos);

    localStorage.setItem(
      "estudiantes",
      JSON.stringify(nuevos)
    );
  }

  function cerrarFormulario() {
    setMostrarFormulario(false);

    setEstudianteEditando(null);

    setNombre("");
    setApellido("");
    setCurso("");
    setTutor("");
  }

  function quitarTildes(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const estudiantesFiltrados = estudiantes.filter(
    (estudiante) => {
      const texto = quitarTildes(busqueda);

      const nombreCompleto = quitarTildes(
        `${estudiante.nombre} ${estudiante.apellido}`
      );

      return (
        nombreCompleto.includes(texto) ||
        quitarTildes(estudiante.curso).includes(texto) ||
        quitarTildes(estudiante.tutor).includes(texto)
      );
    }
  );

  return (
    <div className="estudiantes-layout">
      <Sidebar />

      <main className="estudiantes-page">

        <div className="estudiantes-header">

          <div>
            <h1>Estudiantes</h1>

            <p>
              Gestión de estudiantes del colegio Don Bosco.
            </p>
          </div>

          <button
            className="boton-nuevo"
            onClick={abrirFormulario}
          >
            + Nuevo estudiante
          </button>

        </div>

        <div className="estudiantes-barra">

          <input
            className="buscador-estudiantes"
            type="text"
            placeholder="Buscar estudiante, curso o tutor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <div className="cantidad-estudiantes">
            {estudiantes.length} estudiantes
          </div>

        </div>

        <div className="tabla-estudiantes">

          <table>

            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Curso</th>
                <th>Tutor</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {estudiantesFiltrados.length === 0 ? (

                <tr>
                  <td
                    colSpan={5}
                    className="sin-estudiantes"
                  >
                    No hay estudiantes registrados.
                  </td>
                </tr>

              ) : (

                estudiantesFiltrados.map((estudiante) => (

                  <tr key={estudiante.id}>

                    <td>{estudiante.nombre}</td>

                    <td>{estudiante.apellido}</td>

                    <td>
                      <span className="curso-badge">
                        {estudiante.curso}
                      </span>
                    </td>

                    <td>{estudiante.tutor}</td>

                    <td>

                      <div className="acciones">

                        <button
                          className="boton-editar"
                          onClick={() =>
                            editarEstudiante(estudiante)
                          }
                        >
                          Editar
                        </button>

                        <button
                          className="boton-eliminar"
                          onClick={() =>
                            eliminarEstudiante(estudiante.id)
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </main>

      {mostrarFormulario && (

        <div className="modal-fondo">

          <div className="formulario-estudiante">

            <h2>
              {estudianteEditando
                ? "Editar estudiante"
                : "Nuevo estudiante"}
            </h2>

            <label>Nombre</label>

            <input
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              placeholder="Nombre"
            />

            <label>Apellido</label>

            <input
              type="text"
              value={apellido}
              onChange={(e) =>
                setApellido(e.target.value)
              }
              placeholder="Apellido"
            />

            <label>Curso</label>

            <input
              type="text"
              value={curso}
              onChange={(e) =>
                setCurso(e.target.value)
              }
              placeholder="Ej. 1ro A"
            />

            <label>Tutor</label>

            <input
              type="text"
              value={tutor}
              onChange={(e) =>
                setTutor(e.target.value)
              }
              placeholder="Nombre del tutor"
            />

            <div className="botones-formulario">

              <button
                className="boton-guardar"
                onClick={guardarEstudiante}
              >
                Guardar
              </button>

              <button
                className="boton-cancelar"
                onClick={cerrarFormulario}
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