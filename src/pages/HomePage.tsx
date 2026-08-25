import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./HomePage.css";

type Estudiante = {
  id: number;
  nombre: string;
  apellido: string;
  curso: string;
  tutor: string;
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

function HomePage() {
  const [cantidadEstudiantes, setCantidadEstudiantes] = useState(0);
  const [asientosOcupados, setAsientosOcupados] = useState(0);

  const [mostrarEstudiante, setMostrarEstudiante] =
    useState(false);

  const [mostrarReporte, setMostrarReporte] =
    useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [curso, setCurso] = useState("");
  const [tutor, setTutor] = useState("");
  const [telefono, setTelefono] = useState("");

  const [cursoReporte, setCursoReporte] =
    useState("");

  const [estudianteReporte, setEstudianteReporte] =
    useState("");

  const [observacion, setObservacion] =
    useState("");

  const totalCursos = 18;
  const totalAsientos = totalCursos * 35;

  const estudiantes: Estudiante[] = JSON.parse(
    localStorage.getItem("estudiantes") || "[]"
  );

  /*
   * =========================
   * ASIGNACIONES ACTUALES
   * =========================
   */

  const asignaciones: Record<
    string,
    Asignacion[]
  > = JSON.parse(
    localStorage.getItem("asignaciones") || "{}"
  );

  /*
   * =========================
   * ESTUDIANTES DEL CURSO
   * =========================
   */

  const estudiantesDelCurso =
    cursoReporte
      ? estudiantes.filter(
          (estudiante) =>
            estudiante.curso
              .trim()
              .toLowerCase() ===
            cursoReporte.trim().toLowerCase()
        )
      : [];

  /*
   * =========================
   * SOLO ESTUDIANTES CON ASIENTO
   * =========================
   */

  const asignacionesDelCurso =
    cursoReporte
      ? asignaciones[cursoReporte] || []
      : [];

  const estudiantesAsignadosDelCurso =
    estudiantesDelCurso.filter((estudiante) =>
      asignacionesDelCurso.some(
        (asignacion) =>
          asignacion.estudianteId ===
          estudiante.id
      )
    );

  /*
   * =========================
   * RESUMEN
   * =========================
   */

  useEffect(() => {
    function actualizarResumen() {
      const estudiantesGuardados =
        JSON.parse(
          localStorage.getItem(
            "estudiantes"
          ) || "[]"
        );

      const asignacionesGuardadas =
        JSON.parse(
          localStorage.getItem(
            "asignaciones"
          ) || "{}"
        );

      let ocupados = 0;

      Object.values(
        asignacionesGuardadas
      ).forEach((curso) => {
        if (Array.isArray(curso)) {
          ocupados += curso.length;
        }
      });

      setCantidadEstudiantes(
        estudiantesGuardados.length
      );

      setAsientosOcupados(ocupados);
    }

    actualizarResumen();

    window.addEventListener(
      "storage",
      actualizarResumen
    );

    return () => {
      window.removeEventListener(
        "storage",
        actualizarResumen
      );
    };
  }, []);

  const asientosLibres =
    totalAsientos - asientosOcupados;

  /*
   * =========================
   * REGISTRAR ESTUDIANTE
   * =========================
   */

  function abrirFormularioEstudiante() {
    setNombre("");
    setApellido("");
    setCurso("");
    setTutor("");
    setTelefono("");

    setMostrarEstudiante(true);
  }

  function cerrarFormularioEstudiante() {
    setMostrarEstudiante(false);
  }

  function guardarEstudiante() {
    if (!nombre.trim()) {
      alert(
        "Escribe el nombre del estudiante"
      );
      return;
    }

    if (!apellido.trim()) {
      alert(
        "Escribe el apellido del estudiante"
      );
      return;
    }

    if (!curso) {
      alert("Selecciona un curso");
      return;
    }

    if (!tutor.trim()) {
      alert(
        "Escribe el tutor del estudiante"
      );
      return;
    }

    const estudiantesActuales:
      Estudiante[] = JSON.parse(
        localStorage.getItem(
          "estudiantes"
        ) || "[]"
      );

    const nuevoEstudiante:
      Estudiante = {
        id: Date.now(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        curso,
        tutor: tutor.trim(),
        telefono: telefono.trim(),
      };

    estudiantesActuales.push(
      nuevoEstudiante
    );

    localStorage.setItem(
      "estudiantes",
      JSON.stringify(
        estudiantesActuales
      )
    );

    setCantidadEstudiantes(
      estudiantesActuales.length
    );

    alert(
      "Estudiante registrado correctamente"
    );

    cerrarFormularioEstudiante();
  }

  /*
   * =========================
   * ABRIR REPORTE
   * =========================
   */

  function abrirFormularioReporte() {
    setCursoReporte("");
    setEstudianteReporte("");
    setObservacion("");

    setMostrarReporte(true);
  }

  /*
   * =========================
   * CERRAR REPORTE
   * =========================
   */

  function cerrarFormularioReporte() {
    setMostrarReporte(false);

    setCursoReporte("");
    setEstudianteReporte("");
    setObservacion("");
  }

  /*
   * =========================
   * GUARDAR REPORTE
   * =========================
   */

  function guardarReporte() {
    if (!cursoReporte) {
      alert("Selecciona un curso");
      return;
    }

    if (!estudianteReporte) {
      alert("Selecciona un estudiante");
      return;
    }

    if (!observacion.trim()) {
      alert("Escribe una observación");
      return;
    }

    const estudiante =
      estudiantes.find(
        (item) =>
          item.id ===
          Number(estudianteReporte)
      );

    if (!estudiante) {
      alert(
        "No se encontró el estudiante"
      );
      return;
    }

    /*
     * Buscar las asignaciones actuales
     * directamente desde localStorage
     */

    const asignacionesActuales:
      Record<string, Asignacion[]> =
      JSON.parse(
        localStorage.getItem(
          "asignaciones"
        ) || "{}"
      );

    const asignacionesDelCursoActual =
      asignacionesActuales[
        cursoReporte
      ] || [];

    /*
     * Buscar el asiento actual
     * del estudiante
     */

    const asignacion =
      asignacionesDelCursoActual.find(
        (item) =>
          item.estudianteId ===
          estudiante.id
      );

    /*
     * IMPORTANTE:
     * No se puede reportar a alguien
     * que no tenga asiento.
     */

    if (!asignacion) {
      alert(
        "Este estudiante no tiene un asiento asignado"
      );
      return;
    }

    /*
     * =========================
     * PROFESOR
     * =========================
     */

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
      usuario?.nombre || "Usuario";

    /*
     * =========================
     * FECHA Y HORA
     * =========================
     */

    const ahora = new Date();

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

    /*
     * =========================
     * REPORTES EXISTENTES
     * =========================
     */

    const reportes:
      Reporte[] = JSON.parse(
        localStorage.getItem(
          "reportes"
        ) || "[]"
      );

    /*
     * =========================
     * NUEVO REPORTE
     * =========================
     */

    const nuevoReporte:
      Reporte = {
        id: Date.now(),

        estudianteId:
          estudiante.id,

        estudiante:
          `${estudiante.nombre} ${estudiante.apellido}`,

        curso:
          cursoReporte,

        /*
         * GUARDAMOS EL ASIENTO
         * Y LA ASIGNACIÓN ACTUAL
         */

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

    reportes.push(
      nuevoReporte
    );

    localStorage.setItem(
      "reportes",
      JSON.stringify(reportes)
    );

    alert(
      "Reporte registrado correctamente"
    );

    cerrarFormularioReporte();
  }

  return (
    <div className="home">
      <Sidebar />

      <main className="content">
        <div className="inicio-fondo">

          {/* ENCABEZADO */}

          <div className="inicio-header">

            <div className="inicio-texto">

              <h1>
                ¡Bienvenido, Nicolas! 👋
              </h1>

              <p>
                Panel de control del Sistema
                de Asignación de Asientos
              </p>

              <span>
                Colegio{" "}
                <strong>
                  Don Bosco
                </strong>{" "}
                · Nivel Secundario
              </span>

            </div>

            <div className="fecha-hora">

              <span>📅</span>

              <div>

                <strong>
                  {new Date().toLocaleDateString()}
                </strong>

                <small>
                  {new Date().toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </small>

              </div>

            </div>

          </div>

          {/* RESUMEN */}

          <div className="resumen">

            <div className="resumen-card azul">

              <div className="icono-card">
                👥
              </div>

              <div>

                <h3>
                  Estudiantes
                </h3>

                <strong>
                  {cantidadEstudiantes}
                </strong>

                <span>
                  registrados
                </span>

              </div>

            </div>

            <div className="resumen-card verde">

              <div className="icono-card">
                🎓
              </div>

              <div>

                <h3>
                  Cursos
                </h3>

                <strong>
                  {totalCursos}
                </strong>

                <span>
                  activos
                </span>

              </div>

            </div>

            <div className="resumen-card amarillo">

              <div className="icono-card">
                🪑
              </div>

              <div>

                <h3>
                  Asientos ocupados
                </h3>

                <strong>
                  {asientosOcupados}
                </strong>

                <span>
                  asignados
                </span>

              </div>

            </div>

            <div className="resumen-card verde">

              <div className="icono-card">
                🪑
              </div>

              <div>

                <h3>
                  Asientos libres
                </h3>

                <strong>
                  {asientosLibres}
                </strong>

                <span>
                  disponibles
                </span>

              </div>

            </div>

          </div>

          {/* CONTENIDO INFERIOR */}

          <div className="inicio-inferior">

            {/* ACCIONES RAPIDAS */}

            <section className="panel-acciones">

              <div className="panel-titulo">
                <h2>
                  ⚡ Acciones rápidas
                </h2>
              </div>

              <button
                className="accion registrar"
                onClick={
                  abrirFormularioEstudiante
                }
              >

                <div className="accion-icono">
                  👤
                </div>

                <div className="accion-texto">

                  <strong>
                    Registrar estudiante
                  </strong>

                  <span>
                    Agregar un nuevo estudiante
                    al sistema
                  </span>

                </div>

                <b>›</b>

              </button>

              <button
                className="accion asiento"
                onClick={() => {
                  window.location.href =
                    "/asientos";
                }}
              >

                <div className="accion-icono">
                  🪑
                </div>

                <div className="accion-texto">

                  <strong>
                    Gestionar asientos
                  </strong>

                  <span>
                    Asignar o cambiar el lugar
                    de un estudiante
                  </span>

                </div>

                <b>›</b>

              </button>

              <button
                className="accion reporte"
                onClick={
                  abrirFormularioReporte
                }
              >

                <div className="accion-icono">
                  ⚠️
                </div>

                <div className="accion-texto">

                  <strong>
                    Reportar estudiante
                  </strong>

                  <span>
                    Registrar un reporte
                    de comportamiento
                  </span>

                </div>

                <b>›</b>

              </button>

            </section>

            {/* ESTADO DE LOS CURSOS */}

            <section className="panel-cursos">

              <div className="panel-titulo">

                <h2>
                  📊 Estado de los cursos
                </h2>

              </div>

              <div className="curso-estado">

                <span>
                  Curso
                </span>

                <span>
                  Ocupación
                </span>

                <span>
                  Asientos
                </span>

              </div>

              {[
                "6to A",
                "6to B",
                "5to A",
                "6to C",
                "5to B",
              ].map(
                (
                  nombreCurso,
                  index
                ) => {

                  const valores = [
                    [91, 32],
                    [77, 27],
                    [57, 20],
                    [3, 1],
                    [66, 23],
                  ];

                  const porcentaje =
                    valores[index][0];

                  const ocupados =
                    valores[index][1];

                  return (
                    <div
                      className="curso-fila"
                      key={
                        nombreCurso
                      }
                    >

                      <strong>
                        {nombreCurso}
                      </strong>

                      <div className="barra-contenedor">

                        <div
                          className={
                            porcentaje <=
                            10
                              ? "barra roja"
                              : porcentaje <=
                                60
                              ? "barra amarilla"
                              : "barra verde"
                          }
                          style={{
                            width: `${porcentaje}%`,
                          }}
                        />

                      </div>

                      <strong>
                        {porcentaje}%
                      </strong>

                      <span>
                        {ocupados} / 35
                      </span>

                    </div>
                  );
                }
              )}

              <button
                className="ver-cursos"
                onClick={() => {
                  window.location.href =
                    "/cursos";
                }}
              >
                Ver todos los cursos →
              </button>

            </section>

          </div>

          {/* INFORMACION */}

          <div className="informacion-sistema">

            <div>

              <span>🏫</span>

              <div>

                <small>
                  Institución
                </small>

                <strong>
                  Don Bosco
                </strong>

                <em>
                  Nivel Secundario
                </em>

              </div>

            </div>

            <div>

              <span>🪑</span>

              <div>

                <small>
                  Capacidad total
                </small>

                <strong>
                  {totalAsientos}
                </strong>

                <em>
                  asientos disponibles
                </em>

              </div>

            </div>

            <div>

              <span>👤</span>

              <div>

                <small>
                  Usuarios activos
                </small>

                <strong>
                  2
                </strong>

                <em>
                  en el sistema
                </em>

              </div>

            </div>

            <div>

              <span>🕐</span>

              <div>

                <small>
                  Última actualización
                </small>

                <strong>
                  Ahora
                </strong>

                <em>
                  Información actualizada
                </em>

              </div>

            </div>

          </div>

        </div>
      </main>

      {/* ========================= */}
      {/* MODAL REGISTRAR ESTUDIANTE */}
      {/* ========================= */}

      {mostrarEstudiante && (

        <div className="home-modal-fondo">

          <div className="home-modal">

            <div className="modal-titulo">

              <div>

                <h2>
                  👤 Registrar estudiante
                </h2>

                <p>
                  Agrega un nuevo estudiante
                  al sistema
                </p>

              </div>

              <button
                className="cerrar-modal"
                onClick={
                  cerrarFormularioEstudiante
                }
              >
                ×
              </button>

            </div>

            <div className="form-grid">

              <div className="campo">

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
                  placeholder="Nombre del estudiante"
                />

              </div>

              <div className="campo">

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
                  placeholder="Apellido del estudiante"
                />

              </div>

              <div className="campo">

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
                        value={
                          cursoItem
                        }
                      >
                        {cursoItem}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="campo">

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

              </div>

              <div className="campo campo-completo">

                <label>
                  Teléfono
                </label>

                <input
                  type="text"
                  value={telefono}
                  onChange={(e) =>
                    setTelefono(
                      e.target.value
                    )
                  }
                  placeholder="Número de teléfono"
                />

              </div>

            </div>

            <div className="modal-botones">

              <button
                className="boton-cancelar-home"
                onClick={
                  cerrarFormularioEstudiante
                }
              >
                Cancelar
              </button>

              <button
                className="boton-guardar-home"
                onClick={
                  guardarEstudiante
                }
              >
                Registrar estudiante
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ========================= */}
      {/* MODAL REPORTAR ESTUDIANTE */}
      {/* ========================= */}

      {mostrarReporte && (

        <div className="home-modal-fondo">

          <div className="home-modal modal-reporte">

            <div className="modal-titulo">

              <div>

                <h2>
                  ⚠️ Reportar estudiante
                </h2>

                <p>
                  Registra un cambio de lugar
                  no autorizado
                </p>

              </div>

              <button
                className="cerrar-modal"
                onClick={
                  cerrarFormularioReporte
                }
              >
                ×
              </button>

            </div>

            <div className="campo">

              <label>
                Curso
              </label>

              <select
                value={cursoReporte}
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
                  (cursoItem) => (

                    <option
                      key={cursoItem}
                      value={
                        cursoItem
                      }
                    >
                      {cursoItem}
                    </option>

                  )
                )}

              </select>

            </div>

            <div className="campo">

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

            </div>

            <div className="campo">

              <label>
                Observación
              </label>

              <textarea
                value={observacion}
                onChange={(e) =>
                  setObservacion(
                    e.target.value
                  )
                }
                placeholder="Escribe la observación..."
                rows={5}
              />

            </div>

            <div className="modal-info-reporte">

              <span>
                👨‍🏫
              </span>

              <div>

                <strong>
                  Profesor:{" "}
                  {JSON.parse(
                    localStorage.getItem(
                      "usuarioActual"
                    ) ||
                      '{"nombre":"Usuario"}'
                  ).nombre}
                </strong>

                <small>
                  La fecha y hora se registrarán
                  automáticamente.
                </small>

              </div>

            </div>

            <div className="modal-botones">

              <button
                className="boton-cancelar-home"
                onClick={
                  cerrarFormularioReporte
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

    </div>
  );
}

export default HomePage;