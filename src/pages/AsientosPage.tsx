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
  asignacionId: number;
};

type Reporte = {
  id: number;
  estudianteId: number;
  estudiante: string;
  curso: string;
  asiento: string;
  asignacionId: number;
  fecha: string;
  hora: string;
  profesor: string;
  observacion: string;
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

  // =========================
  // REPORTES
  // =========================

  const [mostrarReporte, setMostrarReporte] =
    useState(false);

  const [estudianteReportado, setEstudianteReportado] =
    useState("");

  const [observacion, setObservacion] =
    useState("");

  const [reportes, setReportes] =
    useState<Reporte[]>(() => {

      const datos =
        localStorage.getItem(
          "reportes"
        );

      return datos
        ? JSON.parse(datos)
        : [];
    });

  // =========================
  // ASIGNACIONES
  // =========================

  const [asignaciones, setAsignaciones] =
    useState<
      Record<string, Asignacion[]>
    >(() => {

      const datos =
        localStorage.getItem(
          "asignaciones"
        );

      if (!datos) {
        return {};
      }

      const asignacionesGuardadas =
        JSON.parse(datos);

      const asignacionesCorregidas:
        Record<
          string,
          Asignacion[]
        > = {};

      Object.keys(
        asignacionesGuardadas
      ).forEach((curso) => {

        asignacionesCorregidas[
          curso
        ] =
          asignacionesGuardadas[
            curso
          ].map(
            (
              asignacion: Partial<Asignacion>
            ) => ({

              ...asignacion,

              asignacionId:
                asignacion.asignacionId ||
                Date.now() +
                  Math.floor(
                    Math.random() *
                      1000000
                  ),

            })
          );

      });

      localStorage.setItem(
        "asignaciones",
        JSON.stringify(
          asignacionesCorregidas
        )
      );

      return asignacionesCorregidas;
    });

  const estudiantes: Estudiante[] =
    JSON.parse(
      localStorage.getItem(
        "estudiantes"
      ) || "[]"
    );

  // =========================
  // ESTUDIANTES DEL CURSO
  // =========================

  const estudiantesDelCurso =
    estudiantes.filter(
      (estudiante) =>
        estudiante.curso
          .trim()
          .toLowerCase() ===
        cursoSeleccionado
          .trim()
          .toLowerCase()
    );

  const asignacionesDelCurso =
    asignaciones[
      cursoSeleccionado
    ] || [];

  const asientosLibres =
    CAPACIDAD_CURSO -
    asignacionesDelCurso.length;

  // =========================
  // ESTUDIANTES CON ASIENTO
  // =========================

  const estudiantesAsignadosDelCurso =
    estudiantesDelCurso.filter(
      (estudiante) =>
        asignacionesDelCurso.some(
          (asignacion) =>
            asignacion.estudianteId ===
            estudiante.id
        )
    );

  // =========================
  // OBTENER ASIGNACIÓN
  // =========================

  function obtenerAsignacion(
    asiento: string
  ) {
    return asignacionesDelCurso.find(
      (item) =>
        item.asiento ===
        asiento
    );
  }

  // =========================
  // OBTENER ESTUDIANTE
  // =========================

  function obtenerEstudiante(
    asiento: string
  ) {

    const asignacion =
      obtenerAsignacion(
        asiento
      );

    if (!asignacion) {
      return null;
    }

    return estudiantes.find(
      (estudiante) =>
        estudiante.id ===
        asignacion.estudianteId
    );
  }

  // =========================
  // REPORTES DEL ASIENTO
  // =========================

  function obtenerReportesDelAsiento(
    asiento: string
  ) {

    const asignacion =
      obtenerAsignacion(
        asiento
      );

    if (!asignacion) {
      return [];
    }

    return reportes.filter(
      (reporte) =>
        reporte.curso ===
          cursoSeleccionado &&
        reporte.asignacionId ===
          asignacion.asignacionId
    );
  }

  // =========================
  // ABRIR ASIENTO
  // =========================

  function abrirAsiento(
    asiento: string
  ) {

    const estudiante =
      obtenerEstudiante(
        asiento
      );

    setAsientoSeleccionado(
      asiento
    );

    if (estudiante) {

      setEstudianteSeleccionado(
        String(
          estudiante.id
        )
      );

    } else {

      setEstudianteSeleccionado(
        ""
      );

    }

    setMostrarFormulario(
      true
    );
  }

  // =========================
  // HISTORIAL
  // =========================

  function guardarEnHistorial(
    estudiante: Estudiante,
    accion: string,
    asiento: string
  ) {

    const datos =
      localStorage.getItem(
        "historial"
      );

    const historial =
      datos
        ? JSON.parse(datos)
        : [];

    const nuevoRegistro = {

      id: Date.now(),

      fecha:
        new Date().toLocaleString(),

      estudiante:
        `${estudiante.nombre} ${estudiante.apellido}`,

      curso:
        cursoSeleccionado,

      accion,

      asiento,

    };

    historial.push(
      nuevoRegistro
    );

    localStorage.setItem(
      "historial",
      JSON.stringify(
        historial
      )
    );
  }

  // =========================
  // GUARDAR ASIGNACIÓN
  // =========================

  function guardarAsignacion() {

    if (!estudianteSeleccionado) {

      alert(
        "Selecciona un estudiante"
      );

      return;
    }

    const estudianteId =
      Number(
        estudianteSeleccionado
      );

    const estudianteYaTieneAsiento =
      asignacionesDelCurso.find(
        (asignacion) =>
          asignacion.estudianteId ===
            estudianteId &&
          asignacion.asiento !==
            asientoSeleccionado
      );

    if (estudianteYaTieneAsiento) {

      alert(
        "Este estudiante ya tiene un asiento asignado"
      );

      return;
    }

    const asientoYaOcupado =
      obtenerEstudiante(
        asientoSeleccionado
      );

    if (
      asientoYaOcupado &&
      asientoYaOcupado.id !==
        estudianteId
    ) {

      alert(
        "Este asiento ya está ocupado"
      );

      return;
    }

    const asignacionActual =
      obtenerAsignacion(
        asientoSeleccionado
      );

    const nuevasAsignaciones =
      asignacionesDelCurso.filter(
        (asignacion) =>
          asignacion.asiento !==
          asientoSeleccionado
      );

    /*
     * Si es la misma persona
     * en el mismo asiento,
     * conserva su asignacionId.
     *
     * Si es una nueva asignación,
     * recibe un nuevo ID.
     */

    const nuevaAsignacion:
      Asignacion = {

      asiento:
        asientoSeleccionado,

      estudianteId,

      asignacionId:
        asignacionActual &&
        asignacionActual.estudianteId ===
          estudianteId
          ? asignacionActual.asignacionId
          : Date.now() +
            Math.floor(
              Math.random() *
                1000000
            ),
    };

    nuevasAsignaciones.push(
      nuevaAsignacion
    );

    if (
      nuevasAsignaciones.length >
      CAPACIDAD_CURSO
    ) {

      alert(
        "El curso ya alcanzó la capacidad máxima de 35 estudiantes"
      );

      return;
    }

    const nuevasAsignacionesTotales =
      {
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

    const estudiante =
      estudiantes.find(
        (item) =>
          item.id ===
          estudianteId
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

  // =========================
  // LIBERAR ASIENTO
  // =========================

  function liberarAsiento() {

    const asignacion =
      obtenerAsignacion(
        asientoSeleccionado
      );

    const estudiante =
      asignacion
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

    const nuevasAsignacionesTotales =
      {
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

  // =========================
  // CERRAR FORMULARIO
  // =========================

  function cerrarFormulario() {

    setMostrarFormulario(
      false
    );

    setAsientoSeleccionado(
      ""
    );

    setEstudianteSeleccionado(
      ""
    );
  }

  // =========================
  // ABRIR REPORTE
  // =========================

  function abrirReporte() {

    setEstudianteReportado(
      ""
    );

    setObservacion("");

    setMostrarReporte(
      true
    );
  }

  // =========================
  // CERRAR REPORTE
  // =========================

  function cerrarReporte() {

    setMostrarReporte(
      false
    );

    setEstudianteReportado(
      ""
    );

    setObservacion("");
  }

  // =========================
  // GUARDAR REPORTE
  // =========================

  function guardarReporte() {

    if (!estudianteReportado) {

      alert(
        "Selecciona un estudiante"
      );

      return;
    }

    if (!observacion.trim()) {

      alert(
        "Escribe una observación"
      );

      return;
    }

    const estudiante =
      estudiantes.find(
        (item) =>
          item.id ===
          Number(
            estudianteReportado
          )
      );

    if (!estudiante) {

      alert(
        "No se encontró el estudiante"
      );

      return;
    }

    /*
     * Buscar su asiento actual
     */

    const asignacion =
      asignacionesDelCurso.find(
        (item) =>
          item.estudianteId ===
          estudiante.id
      );

    /*
     * Seguridad:
     * no se puede reportar
     * a alguien sin asiento.
     */

    if (!asignacion) {

      alert(
        "Este estudiante no tiene un asiento asignado"
      );

      return;
    }

    const usuarioGuardado =
      localStorage.getItem(
        "usuarioActual"
      );

    const usuario =
      usuarioGuardado
        ? JSON.parse(
            usuarioGuardado
          )
        : null;

    const profesor =
      usuario?.nombre ||
      "Usuario";

    const ahora =
      new Date();

    const fecha =
      ahora.toLocaleDateString();

    const hora =
      ahora.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    const nuevoReporte:
      Reporte = {

      id: Date.now(),

      estudianteId:
        estudiante.id,

      estudiante:
        `${estudiante.nombre} ${estudiante.apellido}`,

      curso:
        cursoSeleccionado,

      asiento:
        asignacion.asiento,

      asignacionId:
        asignacion.asignacionId,

      fecha,

      hora,

      profesor,

      observacion:
        observacion.trim(),
    };

    const nuevosReportes = [
      ...reportes,
      nuevoReporte,
    ];

    setReportes(
      nuevosReportes
    );

    localStorage.setItem(
      "reportes",
      JSON.stringify(
        nuevosReportes
      )
    );

    alert(
      "Reporte registrado correctamente"
    );

    cerrarReporte();
  }

  return (
    <div className="asientos-layout">

      <Sidebar />

      <main className="asientos-page">

        <h1>
          Asientos
        </h1>

        <p>
          Distribución de asientos de
          los cursos de secundaria.
        </p>

        <div className="selector-curso">

          <label>
            Seleccionar curso
          </label>

          <select
            value={
              cursoSeleccionado
            }
            onChange={(e) => {

              setCursoSeleccionado(
                e.target.value
              );

              cerrarFormulario();

              cerrarReporte();

            }}
          >

            <option value="">
              Seleccionar curso
            </option>

            {cursos.map(
              (curso) => (

                <option
                  key={curso.id}
                  value={`${curso.grado} ${curso.paralelo}`}
                >
                  {curso.grado}{" "}
                  {curso.paralelo}
                </option>

              )
            )}

          </select>

        </div>

        {cursoSeleccionado && (

          <div className="aula">

            <div className="encabezado-aula">

              <div>

                <h2>
                  {cursoSeleccionado}
                </h2>

                <p>
                  {
                    asignacionesDelCurso.length
                  }{" "}
                  /{" "}
                  {CAPACIDAD_CURSO}
                  {" "}asientos ocupados
                </p>

              </div>

              <button
                className="boton-reportar"
                onClick={
                  abrirReporte
                }
              >
                ⚠️ Reportar estudiante
              </button>

              <div className="leyenda-reporte">
                🔴 Estudiante reportado
              </div>

            </div>

            <div className="parte-superior">

              <div className="puerta">

                🚪

                <span>
                  Puerta
                </span>

              </div>

              <div className="pizarra">
                PIZARRA
              </div>

              <div className="profesor">

                👨‍🏫

                <span>
                  Profesor
                </span>

              </div>

            </div>

            <div className="resumen-asientos">

              <div>

                <strong>
                  {
                    asignacionesDelCurso.length
                  }
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

            <div className="asientos">

              {filas.map(
                (fila) =>
                  [1, 2, 3, 4, 5].map(
                    (numero) => {

                      const nombreAsiento =
                        `${fila}${numero}`;

                      const estudiante =
                        obtenerEstudiante(
                          nombreAsiento
                        );

                      const reportesDelAsiento =
                        obtenerReportesDelAsiento(
                          nombreAsiento
                        );

                      const cantidadReportes =
                        reportesDelAsiento.length;

                      return (

                        <button
                          key={
                            nombreAsiento
                          }
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
                            {
                              nombreAsiento
                            }
                          </strong>

                          <span>
                            {estudiante
                              ? `${estudiante.nombre} ${estudiante.apellido}`
                              : "Libre"}
                          </span>

                          {cantidadReportes >
                            0 && (

                            <span className="indicador-reporte">

                              <span className="punto-rojo">
                                ●
                              </span>

                              {cantidadReportes >
                                1 && (

                                <span className="numero-reportes">
                                  {
                                    cantidadReportes
                                  }
                                </span>

                              )}

                            </span>

                          )}

                        </button>

                      );
                    }
                  )
              )}

            </div>

          </div>

        )}

        {/* =========================
            MODAL ASIENTO
        ========================= */}

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
                      key={
                        estudiante.id
                      }
                      value={
                        estudiante.id
                      }
                    >
                      {
                        estudiante.nombre
                      }{" "}
                      {
                        estudiante.apellido
                      }
                    </option>

                  )
                )}

              </select>

              {/* =========================
                  REPORTES DEL ASIENTO
              ========================= */}

              {obtenerReportesDelAsiento(
                asientoSeleccionado
              ).length > 0 && (

                <div className="reportes-asiento">

                  <h3>
                    🔴 Reportes de este asiento
                  </h3>

                  {obtenerReportesDelAsiento(
                    asientoSeleccionado
                  ).map(
                    (reporte) => (

                      <div
                        className="reporte-item"
                        key={
                          reporte.id
                        }
                      >

                        <div className="reporte-cabecera">

                          <strong>
                            {
                              reporte.fecha
                            }
                          </strong>

                          <span>
                            {
                              reporte.hora
                            }
                          </span>

                        </div>

                        <p>

                          <strong>
                            Profesor:
                          </strong>{" "}

                          {
                            reporte.profesor
                          }

                        </p>

                        <p>

                          <strong>
                            Observación:
                          </strong>{" "}

                          {
                            reporte.observacion
                          }

                        </p>

                      </div>

                    )
                  )}

                </div>

              )}

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

        {/* =========================
            MODAL REPORTE
        ========================= */}

        {mostrarReporte && (

          <div className="modal-fondo">

            <div className="formulario-asiento">

              <h2>
                ⚠️ Reportar estudiante
              </h2>

              <p>
                Curso:{" "}
                <strong>
                  {cursoSeleccionado}
                </strong>
              </p>

              <label>
                Estudiante
              </label>

              <select
                value={
                  estudianteReportado
                }
                onChange={(e) =>
                  setEstudianteReportado(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Seleccionar estudiante
                </option>

                {estudiantesAsignadosDelCurso.map(
                  (estudiante) => (

                    <option
                      key={
                        estudiante.id
                      }
                      value={
                        estudiante.id
                      }
                    >
                      {
                        estudiante.nombre
                      }{" "}
                      {
                        estudiante.apellido
                      }
                    </option>

                  )
                )}

              </select>

              {estudiantesAsignadosDelCurso.length ===
                0 && (

                <p className="sin-estudiantes-reporte">
                  No hay estudiantes con
                  asiento asignado en este curso.
                </p>

              )}

              <label>
                Fecha
              </label>

              <input
                type="text"
                value={
                  new Date().toLocaleDateString()
                }
                readOnly
              />

              <label>
                Hora
              </label>

              <input
                type="text"
                value={
                  new Date().toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                }
                readOnly
              />

              <label>
                Profesor
              </label>

              <input
                type="text"
                value={
                  JSON.parse(
                    localStorage.getItem(
                      "usuarioActual"
                    ) || "{}"
                  )?.nombre ||
                  "Usuario"
                }
                readOnly
              />

              <label>
                Observación
              </label>

              <textarea
                value={
                  observacion
                }
                onChange={(e) =>
                  setObservacion(
                    e.target.value
                  )
                }
                placeholder="Escriba la observación..."
                rows={4}
              />

              <div className="botones-asiento">

                <button
                  className="boton-guardar"
                  onClick={
                    guardarReporte
                  }
                  disabled={
                    estudiantesAsignadosDelCurso.length ===
                    0
                  }
                >
                  Registrar reporte
                </button>

                <button
                  className="boton-cancelar"
                  onClick={
                    cerrarReporte
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