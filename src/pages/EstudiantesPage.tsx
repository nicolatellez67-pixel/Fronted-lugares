import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./EstudiantesPage.css";

type Estudiante = {
  id: number;
  nombre: string;
  apellido: string;
  curso: string;
  tutor: string;
  telefonoTutor: string;
};

const estudiantesIniciales: Estudiante[] = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    curso: "5to A",
    tutor: "Carlos Pérez",
    telefonoTutor: "70000001",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "López",
    curso: "4to B",
    tutor: "Ana López",
    telefonoTutor: "70000002",
  },
  {
    id: 3,
    nombre: "Pedro",
    apellido: "Gómez",
    curso: "6to A",
    tutor: "Laura Gómez",
    telefonoTutor: "70000003",
  },
];

function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(() => {
    const datos = localStorage.getItem("estudiantes");

    if (!datos) {
      return estudiantesIniciales;
    }

    const estudiantesGuardados = JSON.parse(datos);

    return estudiantesGuardados.map((estudiante: any) => ({
      ...estudiante,
      telefonoTutor: estudiante.telefonoTutor || "",
    }));
  });

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [editando, setEditando] =
    useState<Estudiante | null>(null);

  const [busqueda, setBusqueda] = useState("");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [curso, setCurso] = useState("");
  const [tutor, setTutor] = useState("");
  const [telefonoTutor, setTelefonoTutor] = useState("");

  function guardarEstudiante() {
    if (
      !nombre ||
      !apellido ||
      !curso ||
      !tutor ||
      !telefonoTutor
    ) {
      alert("Completa todos los campos");
      return;
    }

    if (editando) {
      const estudiantesActualizados = estudiantes.map(
        (estudiante) =>
          estudiante.id === editando.id
            ? {
                ...estudiante,
                nombre,
                apellido,
                curso,
                tutor,
                telefonoTutor,
              }
            : estudiante
      );

      setEstudiantes(estudiantesActualizados);

      localStorage.setItem(
        "estudiantes",
        JSON.stringify(estudiantesActualizados)
      );

      alert("Estudiante actualizado correctamente");
    } else {
      const nuevoEstudiante: Estudiante = {
        id: Date.now(),
        nombre,
        apellido,
        curso,
        tutor,
        telefonoTutor,
      };

      const nuevosEstudiantes = [
        ...estudiantes,
        nuevoEstudiante,
      ];

      setEstudiantes(nuevosEstudiantes);

      localStorage.setItem(
        "estudiantes",
        JSON.stringify(nuevosEstudiantes)
      );

      alert("Estudiante agregado correctamente");
    }

    limpiarFormulario();
  }

  function editarEstudiante(estudiante: Estudiante) {
    setEditando(estudiante);

    setNombre(estudiante.nombre);
    setApellido(estudiante.apellido);
    setCurso(estudiante.curso);
    setTutor(estudiante.tutor);
    setTelefonoTutor(estudiante.telefonoTutor || "");

    setMostrarFormulario(true);
  }

  function eliminarEstudiante(id: number) {
    const confirmar = confirm(
      "¿Seguro que quieres eliminar este estudiante?"
    );

    if (!confirmar) {
      return;
    }

    const nuevosEstudiantes = estudiantes.filter(
      (estudiante) => estudiante.id !== id
    );

    setEstudiantes(nuevosEstudiantes);

    localStorage.setItem(
      "estudiantes",
      JSON.stringify(nuevosEstudiantes)
    );
  }

  function limpiarFormulario() {
    setNombre("");
    setApellido("");
    setCurso("");
    setTutor("");
    setTelefonoTutor("");

    setEditando(null);
    setMostrarFormulario(false);
  }

  function quitarTildes(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const estudiantesFiltrados = estudiantes.filter(
    (estudiante) => {
      const texto = quitarTildes(busqueda.trim());

      const nombre = quitarTildes(estudiante.nombre);
      const apellido = quitarTildes(estudiante.apellido);
      const curso = quitarTildes(estudiante.curso);
      const tutor = quitarTildes(estudiante.tutor);
      const telefono = quitarTildes(
        estudiante.telefonoTutor
      );

      const nombreCompleto =
        `${nombre} ${apellido}`;

      return (
        nombre.includes(texto) ||
        apellido.includes(texto) ||
        nombreCompleto.includes(texto) ||
        curso.includes(texto) ||
        tutor.includes(texto) ||
        telefono.includes(texto)
      );
    }
  );

  return (
    <div className="estudiantes-layout">
      <Sidebar />

      <main className="estudiantes-page">
        <h1>Estudiantes</h1>

        <p>
          Gestión de estudiantes del colegio Don Bosco.
        </p>

        <button
          onClick={() => setMostrarFormulario(true)}
        >
          Agregar estudiante
        </button>

        <input
          type="text"
          placeholder="Buscar estudiante..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
        />

        {mostrarFormulario && (
          <div className="modal-fondo">
            <div className="formulario">
              <h2>
                {editando
                  ? "Editar estudiante"
                  : "Nuevo estudiante"}
              </h2>

              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) =>
                  setApellido(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Curso"
                value={curso}
                onChange={(e) =>
                  setCurso(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Tutor"
                value={tutor}
                onChange={(e) =>
                  setTutor(e.target.value)
                }
              />

              <input
                type="tel"
                placeholder="Teléfono del tutor"
                value={telefonoTutor}
                onChange={(e) =>
                  setTelefonoTutor(e.target.value)
                }
              />

              <div className="botones-formulario">
                <button
                  onClick={guardarEstudiante}
                >
                  {editando
                    ? "Actualizar"
                    : "Guardar"}
                </button>

                <button
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="tabla">
          <h2>Lista de estudiantes</h2>

          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Curso</th>
                <th>Tutor</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {estudiantesFiltrados.map(
                (estudiante) => (
                  <tr key={estudiante.id}>
                    <td>
                      {estudiante.nombre}
                    </td>

                    <td>
                      {estudiante.apellido}
                    </td>

                    <td>
                      {estudiante.curso}
                    </td>

                    <td>
                      {estudiante.tutor}
                    </td>

                    <td>
                      {estudiante.telefonoTutor ||
                        "No registrado"}
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          editarEstudiante(
                            estudiante
                          )
                        }
                      >
                        Editar
                      </button>

                      <button
                        onClick={() =>
                          eliminarEstudiante(
                            estudiante.id
                          )
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default EstudiantesPage;