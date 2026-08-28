import { useEffect, useState } from "react";
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
  telefonoTutor?: string;
  telefono?: string;
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

function obtenerCursoInicial() {
  const parametros = new URLSearchParams(
    window.location.search
  );

  return parametros.get("curso") || "";
}

function AsientosPage() {
  const [cursoSeleccionado, setCursoSeleccionado] =
    useState(obtenerCursoInicial);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [asientoSeleccionado, setAsientoSeleccionado] =
    useState("");

  const [estudianteSeleccionado, setEstudianteSeleccionado] =
    useState("");

  const [reportes, setReportes] = useState<Reporte[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("reportes") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [mostrarReporte, setMostrarReporte] =
    useState(false);

  const [cursoReporte, setCursoReporte] =
    useState("");

  const [estudianteReporte, setEstudianteReporte] =
    useState("");

  const [observacion, setObservacion] =
    useState("");

  const [asignaciones, setAsignaciones] =
    useState<Record<string, Asignacion[]>>(() => {
      try {
        const datos = localStorage.getItem("asignaciones");

        return datos ? JSON.parse(datos) : {};
      } catch {
        return {};
      }
    });

  const estudiantes: Estudiante[] = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("estudiantes") || "[]"
      );
    } catch {
      return [];
    }
  })();

  /*
   * =========================
   * ACTUALIZAR REPORTES
   * =========================
   */

  useEffect(() => {
    function actualizarReportes() {
      try {
        const datos = JSON.parse(
          localStorage.getItem("reportes") || "[]"
        );

        setReportes(datos);
      } catch {
        setReportes([]);
      }
    }

    actualizarReportes();

    window.addEventListener(
      "reportesActualizados",
      actualizarReportes
    );

    window.addEventListener(
      "storage",
      actualizarReportes
    );

    return () => {
      window.removeEventListener(
        "reportesActualizados",
        actualizarReportes
      );

      window.removeEventListener(
        "storage",
        actualizarReportes
      );
    };
  }, []);

  /*
   * =========================
   * ACTUALIZAR ASIGNACIONES
   * =========================
   */

  useEffect(() => {
    function actualizarAsignaciones() {
      try {
        const datos = JSON.parse(
          localStorage.getItem("asignaciones") || "{}"
        );

        setAsignaciones(datos);
      } catch {
        setAsignaciones({});
      }
    }

    actualizarAsignaciones();

    window.addEventListener(
      "asignacionesActualizadas",
      actualizarAsignaciones
    );

    window.addEventListener(
      "storage",
      actualizarAsignaciones
    );

    return () => {
      window.removeEventListener(
        "asignacionesActualizadas",
        actualizarAsignaciones
      );

      window.removeEventListener(
        "storage",
        actualizarAsignaciones
      );
    };
  }, []);

  /*
   * =========================
   * DATOS DEL CURSO
   * =========================
   */

  const estudiantesDelCurso =
    estudiantes.filter(
      (estudiante) =>
        estudiante.curso.trim().toLowerCase() ===
        cursoSeleccionado.trim().toLowerCase()
    );

  const asignacionesDelCurso =
    asignaciones[cursoSeleccionado] || [];

  /*
   * =========================
   * OBTENER ESTUDIANTE
   * =========================
   */

  function obtenerEstudiante(
    asiento: string
  ) {
    const asignacion =
      asignacionesDelCurso.find(
        (item) =>
          item.asiento === asiento
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

  /*
   * =========================
   * OBTENER ASIGNACION
   * =========================
   */

  function obtenerAsignacion(
    asiento: string
  ) {
    return asignacionesDelCurso.find(
      (item) =>
        item.asiento === asiento
    );
  }

  /*
   * =========================
   * REPORTES DE UN ASIENTO
   * =========================
   */

  function obtenerReportesDelAsiento(
    asiento: string
  ) {
    const asignacion =
      obtenerAsignacion(asiento);

    if (!asignacion) {
      return [];
    }

    return reportes.filter(
      (reporte) =>
        reporte.asignacionId ===
        asignacion.asignacionId
    );
  }

  /*
   * =========================
   * ABRIR ASIENTO
   * =========================
   */

  function abrirAsiento(
    asiento: string
  ) {
    const estudiante =
      obtenerEstudiante(asiento);

    setAsientoSeleccionado(
      asiento
    );

    if (estudiante) {
      setEstudianteSeleccionado(
        String(estudiante.id)
      );
    } else {
      setEstudianteSeleccionado("");
    }

    setMostrarFormulario(true);
  }

  /*
   * =========================
   * HISTORIAL
   * =========================
   */

  function guardarEnHistorial(
    estudiante: Estudiante,
    accion: string,
    asiento: string
  ) {
    let historial: any[] = [];

    try {
      const datos =
        localStorage.getItem(
          "historial"
        );

      historial = datos
        ? JSON.parse(datos)
        : [];
    } catch {
      historial = [];
    }

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
      JSON.stringify(historial)
    );
  }

  /*
   * =========================
   * GUARDAR ASIGNACION
   * =========================
   */

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

    if (
      estudianteYaTieneAsiento
    ) {
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

    const asignacionAnterior =
      asignacionesDelCurso.find(
        (asignacion) =>
          asignacion.asiento ===
          asientoSeleccionado
      );

    const nuevasAsignaciones =
      asignacionesDelCurso.filter(
        (asignacion) =>
          asignacion.asiento !==
          asientoSeleccionado
      );

    /*
     * Si el mismo estudiante
     * conserva el mismo asiento,
     * mantenemos su asignacionId.
     *
     * Si cambia de lugar, se genera
     * un nuevo asignacionId.
     */

    let nuevoAsignacionId =
      Date.now();

    if (
      asignacionAnterior &&
      asignacionAnterior.estudianteId ===
        estudianteId
    ) {
      nuevoAsignacionId =
        asignacionAnterior.asignacionId;
    }

    nuevasAsignaciones.push({
      asiento:
        asientoSeleccionado,

      estudianteId,

      asignacionId:
        nuevoAsignacionId,
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

    window.dispatchEvent(
      new Event(
        "asignacionesActualizadas"
      )
    );

    cerrarFormulario();
  }

  /*
   * =========================
   * LIBERAR ASIENTO
   * =========================
   */

  function liberarAsiento() {
    const asignacion =
      asignacionesDelCurso.find(
        (item) =>
          item.asiento ===
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

    window.dispatchEvent(
      new Event(
        "asignacionesActualizadas"
      )
    );

    cerrarFormulario();
  }

  /*
   * =========================
   * CERRAR MODAL ASIENTO
   * =========================
   */

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

  /*
   * =========================
   * ABRIR REPORTE
   * =========================
   */

  function abrirReporte() {
    setCursoReporte(
      cursoSeleccionado
    );

    setEstudianteReporte(
      ""
    );

    setObservacion(
      ""
    );

    setMostrarReporte(
      true
    );
  }

  /*
   * =========================
   * CERRAR REPORTE
   * =========================
   */

  function cerrarReporte() {
    setMostrarReporte(
      false
    );

    setCursoReporte(
      ""
    );

    setEstudianteReporte(
      ""
    );

    setObservacion(
      ""
    );
  }

  /*
   * =========================
   * ESTUDIANTES PARA REPORTAR
   * =========================
   */

  const estudiantesAsignadosDelCurso =
    estudiantes.filter(
      (estudiante) =>
        estudiante.curso
          .trim()
          .toLowerCase() ===
          cursoReporte
            .trim()
            .toLowerCase() &&
        (
          asignaciones[
            cursoReporte
          ] || []
        ).some(
          (asignacion) =>
            asignacion.estudianteId ===
            estudiante.id
        )
    );

  /*
   * =========================
   * GUARDAR REPORTE
   * =========================
   */

  function guardarReporte() {
    if (!cursoReporte) {
      alert(
        "Selecciona un curso"
      );

      return;
    }

    if (!estudianteReporte) {
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
            estudianteReporte
          )
      );

    if (!estudiante) {
      alert(
        "No se encontró el estudiante"
      );

      return;
    }

    let asignacionesActuales:
      Record<
        string,
        Asignacion[]
      > = {};

    try {
      asignacionesActuales =
        JSON.parse(
          localStorage.getItem(
            "asignaciones"
          ) || "{}"
        );
    } catch {
      asignacionesActuales =
        {};
    }

    const asignacionesCurso =
      asignacionesActuales[
        cursoReporte
      ] || [];

    const asignacion =
      asignacionesCurso.find(
        (item) =>
          item.estudianteId ===
          estudiante.id
      );

    /*
     * NO SE PUEDE REPORTAR
     * A UN ESTUDIANTE SIN ASIENTO
     */

    if (!asignacion) {
      alert(
        "Este estudiante no tiene un asiento asignado"
      );

      return;
    }

    let usuario: any =
      null;

    try {
      usuario = JSON.parse(
        localStorage.getItem(
          "usuarioActual"
        ) || "null"
      );
    } catch {
      usuario = null;
    }

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

    let reportesActuales:
      Reporte[] = [];

    try {
      reportesActuales =
        JSON.parse(
          localStorage.getItem(
            "reportes"
          ) || "[]"
        );
    } catch {
      reportesActuales =
        [];
    }

    const nuevoReporte:
      Reporte = {
        id: Date.now(),

        estudianteId:
          estudiante.id,

        estudiante:
          `${estudiante.nombre} ${estudiante.apellido}`,

        curso:
          cursoReporte,

        asiento:
          asignacion.asiento,

        /*
         * MUY IMPORTANTE:
         * El reporte queda ligado
         * al asiento actual mediante
         * el asignacionId.
         */

        asignacionId:
          asignacion.asignacionId,

        fecha,

        hora,

        profesor,

        observacion:
          observacion.trim(),
      };

    const nuevosReportes =
      [
        ...reportesActuales,
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

    window.dispatchEvent(
      new Event(
        "reportesActualizados"
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
          Distribución de asientos de los
          cursos de secundaria.
        </p>

        {/* =========================
            SELECTOR DE CURSO
            ========================= */}

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
                  value={
                    `${curso.grado} ${curso.paralelo}`
                  }
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

            {/* =========================
                ENCABEZADO
                ========================= */}

            <div className="encabezado-aula">

              <div>
                <h2>
                  {cursoSeleccionado}
                </h2>

                <p>
                  {
                    asignacionesDelCurso.length
                  }{" "}
                  / {CAPACIDAD_CURSO}{" "}
                  asientos ocupados
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

            {/* =========================
                PARTE SUPERIOR
                ========================= */}

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
                🪑

                <span>
                  Profesor
                </span>
              </div>

            </div>

            {/* =========================
                ASIENTOS
                ========================= */}

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

                          {/* =========================
                              PUNTO ROJO
                              ========================= */}

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

              {/* =========================
                  BOTONES
                  ========================= */}

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
            MODAL REPORTAR ESTUDIANTE
            ========================= */}

        {mostrarReporte && (

          <div className="modal-fondo">

            <div className="formulario-asiento modal-reporte-asiento">

              <div className="modal-titulo-reporte">

                <div>

                  <h2>
                    ⚠️ Reportar estudiante
                  </h2>

                  <p>
                    Registra un reporte de comportamiento
                  </p>

                </div>

                <button
                  className="cerrar-modal-reporte"
                  onClick={
                    cerrarReporte
                  }
                >
                  ×
                </button>

              </div>

              {/* CURSO */}

              <label>
                Curso
              </label>

              <select
                value={
                  cursoReporte
                }
                onChange={(e) => {

                  setCursoReporte(
                    e.target.value
                  );

                  setEstudianteReporte(
                    ""
                  );

                }}
              >

                <option value="">
                  Seleccionar curso
                </option>

                {cursos.map(
                  (curso) => (

                    <option
                      key={
                        curso.id
                      }
                      value={
                        `${curso.grado} ${curso.paralelo}`
                      }
                    >
                      {curso.grado}{" "}
                      {curso.paralelo}
                    </option>

                  )
                )}

              </select>

              {/* ESTUDIANTE */}

              <label>
                Estudiante
              </label>

              <select
                value={
                  estudianteReporte
                }
                onChange={(e) =>
                  setEstudianteReporte(
                    e.target.value
                  )
                }
                disabled={
                  !cursoReporte
                }
              >

                <option value="">

                  {!cursoReporte
                    ? "Primero selecciona un curso"
                    : estudiantesAsignadosDelCurso.length ===
                        0
                    ? "No hay estudiantes con asiento"
                    : "Seleccionar estudiante"}

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

              {/* OBSERVACION */}

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
                placeholder="Escribe el motivo del reporte..."
                rows={5}
              />

              {/* INFORMACION */}

              <div className="modal-info-reporte">

                <span>
                  👨‍🏫
                </span>

                <div>

                  <strong>
                    Profesor:{" "}
                    {(() => {

                      try {

                        const usuario =
                          JSON.parse(
                            localStorage.getItem(
                              "usuarioActual"
                            ) ||
                              '{"nombre":"Usuario"}'
                          );

                        return (
                          usuario?.nombre ||
                          "Usuario"
                        );

                      } catch {

                        return "Usuario";

                      }

                    })()}
                  </strong>

                  <small>
                    La fecha y hora se registrarán automáticamente.
                  </small>

                </div>

              </div>

              {/* BOTONES */}

              <div className="modal-botones-reporte">

                <button
                  className="boton-cancelar"
                  onClick={
                    cerrarReporte
                  }
                >
                  Cancelar
                </button>

                <button
                  className="boton-reporte-home"
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

              </div>

            </div>

          </div>

        )}

      </main>
    </div>
  );
}

export default AsientosPage;