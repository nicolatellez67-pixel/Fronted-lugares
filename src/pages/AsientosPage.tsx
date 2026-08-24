import { useState } from "react";

import Sidebar from "../components/Sidebar";

import "./AsientosPage.css";

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

type Asignacion = {
  asiento: string;
  estudianteId: number;
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

const filas = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
];

function AsientosPage() {
  const [cursoSeleccionado, setCursoSeleccionado] =
    useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [asientoSeleccionado, setAsientoSeleccionado] =
    useState("");

  const [estudianteSeleccionado, setEstudianteSeleccionado] =
    useState("");

  const [asignaciones, setAsignaciones] = useState<
    Record<string, Asignacion[]>
  >(() => {
    const datos = localStorage.getItem("asignaciones");

    return datos ? JSON.parse(datos) : {};
  });

  const estudiantes: Estudiante[] = JSON.parse(
    localStorage.getItem("estudiantes") || "[]"
  );

  const estudiantesDelCurso = estudiantes.filter(
    (estudiante) =>
      estudiante.curso.trim().toLowerCase() ===
      cursoSeleccionado.trim().toLowerCase()
  );

  const asignacionesDelCurso =
    asignaciones[cursoSeleccionado] || [];

  const asientosLibres =
    CAPACIDAD_CURSO - asignacionesDelCurso.length;

  function obtenerEstudiante(asiento: string) {
    const asignacion = asignacionesDelCurso.find(
      (item) => item.asiento === asiento
    );

    if (!asignacion) {
      return null;
    }

    return estudiantes.find(
      (estudiante) =>
        estudiante.id === asignacion.estudianteId
    );
  }

  function abrirAsiento(asiento: string) {
    const estudiante = obtenerEstudiante(asiento);

    setAsientoSeleccionado(asiento);

    if (estudiante) {
      setEstudianteSeleccionado(
        String(estudiante.id)
      );
    } else {
      setEstudianteSeleccionado("");
    }

    setMostrarFormulario(true);
  }

  function guardarEnHistorial(
    estudiante: Estudiante,
    accion: string,
    asiento: string
  ) {
    const datos = localStorage.getItem("historial");

    const historial = datos ? JSON.parse(datos) : [];

    const nuevoRegistro = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      estudiante: `${estudiante.nombre} ${estudiante.apellido}`,
      curso: cursoSeleccionado,
      accion,
      asiento,
    };

    historial.push(nuevoRegistro);

    localStorage.setItem(
      "historial",
      JSON.stringify(historial)
    );
  }

  function guardarAsignacion() {
    if (!estudianteSeleccionado) {
      alert("Selecciona un estudiante");
      return;
    }

    const estudianteId =
      Number(estudianteSeleccionado);

    const estudianteYaTieneAsiento =
      asignacionesDelCurso.find(
        (asignacion) =>
          asignacion.estudianteId === estudianteId &&
          asignacion.asiento !== asientoSeleccionado
      );

    if (estudianteYaTieneAsiento) {
      alert(
        "Este estudiante ya tiene un asiento asignado"
      );

      return;
    }

    const asientoYaOcupado =
      obtenerEstudiante(asientoSeleccionado);

    if (
      asientoYaOcupado &&
      asientoYaOcupado.id !== estudianteId
    ) {
      alert("Este asiento ya está ocupado");

      return;
    }

    const nuevasAsignaciones =
      asignacionesDelCurso.filter(
        (asignacion) =>
          asignacion.asiento !== asientoSeleccionado
      );

    nuevasAsignaciones.push({
      asiento: asientoSeleccionado,
      estudianteId,
    });

    if (
      nuevasAsignaciones.length >
      CAPACIDAD_CURSO
    ) {
      alert(
        "El curso ya alcanzó la capacidad máxima de 35 estudiantes"
      );

      return;
    }

    const nuevasAsignacionesTotales = {
      ...asignaciones,
      [cursoSeleccionado]:
        nuevasAsignaciones,
    };

    setAsignaciones(
      nuevasAsignacionesTotales
    );

    localStorage.setItem(
      "asignaciones",
      JSON.stringify(
        nuevasAsignacionesTotales
      )
    );

    const estudiante = estudiantes.find(
      (item) => item.id === estudianteId
    );

    if (estudiante) {
      guardarEnHistorial(
        estudiante,
        "Asignación de asiento",
        asientoSeleccionado
      );
    }

    cerrarFormulario();
  }

  function liberarAsiento() {
    const asignacion =
      asignacionesDelCurso.find(
        (item) =>
          item.asiento === asientoSeleccionado
      );

    const estudiante = asignacion
      ? estudiantes.find(
          (item) =>
            item.id ===
            asignacion.estudianteId
        )
      : null;

    const nuevasAsignaciones =
      asignacionesDelCurso.filter(
        (asignacion) =>
          asignacion.asiento !==
          asientoSeleccionado
      );

    const nuevasAsignacionesTotales = {
      ...asignaciones,
      [cursoSeleccionado]:
        nuevasAsignaciones,
    };

    setAsignaciones(
      nuevasAsignacionesTotales
    );

    localStorage.setItem(
      "asignaciones",
      JSON.stringify(
        nuevasAsignacionesTotales
      )
    );

    if (estudiante) {
      guardarEnHistorial(
        estudiante,
        "Liberación de asiento",
        asientoSeleccionado
      );
    }

    cerrarFormulario();
  }

  function cerrarFormulario() {
    setMostrarFormulario(false);

    setAsientoSeleccionado("");

    setEstudianteSeleccionado("");
  }

  return (
    <div className="asientos-layout">

      <Sidebar />

      <main className="asientos-page">

        <h1>Asientos</h1>

        <p>
          Distribución de asientos de los cursos
          de secundaria.
        </p>

        <div className="selector-curso">

          <label>
            Seleccionar curso
          </label>

          <select
            value={cursoSeleccionado}
            onChange={(e) => {
              setCursoSeleccionado(
                e.target.value
              );

              cerrarFormulario();
            }}
          >

            <option value="">
              Seleccionar curso
            </option>

            {cursos.map((curso) => (
              <option
                key={curso.id}
                value={`${curso.grado} ${curso.paralelo}`}
              >
                {curso.grado}{" "}
                {curso.paralelo}
              </option>
            ))}

          </select>

        </div>


        {cursoSeleccionado && (

          <div className="aula">

            <h2>
              {cursoSeleccionado}
            </h2>

            <p>
              {asignacionesDelCurso.length}{" "}
              / {CAPACIDAD_CURSO} asientos
              ocupados
            </p>


            <div className="parte-superior">

              {/* PUERTA */}

              <div className="puerta">

                🚪

                <span>
                  Puerta
                </span>

              </div>


              {/* PIZARRA */}

              <div className="pizarra">

                PIZARRA

              </div>


              {/* PROFESOR */}

              <div className="profesor">

                👨‍🏫

                <span>
                  Profesor
                </span>

              </div>

            </div>


            {/* RESUMEN */}

            <div className="resumen-asientos">

              <div>
                <strong>
                  {asignacionesDelCurso.length}
                </strong>

                <span>
                  Ocupados
                </span>
              </div>

              <div>
                <strong>
                  {asientosLibres}
                </strong>

                <span>
                  Libres
                </span>
              </div>

              <div>
                <strong>
                  {CAPACIDAD_CURSO}
                </strong>

                <span>
                  Capacidad
                </span>
              </div>

            </div>


            {/* ASIENTOS */}

            <div className="asientos">

              {filas.map((fila) =>
                [1, 2, 3, 4, 5].map(
                  (numero) => {

                    const nombreAsiento =
                      `${fila}${numero}`;

                    const estudiante =
                      obtenerEstudiante(
                        nombreAsiento
                      );

                    return (

                      <button
                        key={nombreAsiento}
                        className={
                          estudiante
                            ? "asiento ocupado"
                            : "asiento"
                        }
                        onClick={() =>
                          abrirAsiento(
                            nombreAsiento
                          )
                        }
                      >

                        <strong>
                          {nombreAsiento}
                        </strong>

                        <span>
                          {estudiante
                            ? `${estudiante.nombre} ${estudiante.apellido}`
                            : "Libre"}
                        </span>

                      </button>

                    );
                  }
                )
              )}

            </div>

          </div>

        )}


        {/* MODAL */}

        {mostrarFormulario && (

          <div className="modal-fondo">

            <div className="formulario-asiento">

              <h2>
                Asiento{" "}
                {asientoSeleccionado}
              </h2>

              <p>
                Curso:{" "}
                {cursoSeleccionado}
              </p>


              <label>
                Estudiante
              </label>

              <select
                value={
                  estudianteSeleccionado
                }
                onChange={(e) =>
                  setEstudianteSeleccionado(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Seleccionar estudiante
                </option>

                {estudiantesDelCurso.map(
                  (estudiante) => (

                    <option
                      key={estudiante.id}
                      value={estudiante.id}
                    >
                      {estudiante.nombre}{" "}
                      {estudiante.apellido}
                    </option>

                  )
                )}

              </select>


              <div className="botones-asiento">

                <button
                  className="boton-guardar"
                  onClick={
                    guardarAsignacion
                  }
                >
                  Guardar
                </button>


                {obtenerEstudiante(
                  asientoSeleccionado
                ) && (

                  <button
                    className="boton-liberar"
                    onClick={
                      liberarAsiento
                    }
                  >
                    Liberar asiento
                  </button>

                )}


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

      </main>

    </div>
  );
}

export default AsientosPage;