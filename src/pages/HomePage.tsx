import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./HomePage.css";

type Estudiante = {
  id: number;
  nombre: string;
  apellido: string;
  curso: string;
  tutor: string;
  telefonoTutor: string;
};

type Asignacion = {
  asiento: string;
  estudianteId: number;
  asignacionId?: number;
};

type Reporte = {
  id: number;
  estudianteId: number;
  estudiante: string;
  curso: string;
  asiento?: string;
  asignacionId?: number;
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

const CAPACIDAD_POR_CURSO = 35;

function obtenerEstudiantes(): Estudiante[] {
  try {
    const datos = JSON.parse(
      localStorage.getItem("estudiantes") || "[]"
    );

    return datos.map((estudiante: any) => ({
      ...estudiante,
      telefonoTutor:
        estudiante.telefonoTutor ||
        estudiante.telefono ||
        "",
    }));
  } catch {
    return [];
  }
}

function obtenerAsignaciones(): Record<string, Asignacion[]> {
  try {
    return JSON.parse(
      localStorage.getItem("asignaciones") || "{}"
    );
  } catch {
    return {};
  }
}

function obtenerReportes(): Reporte[] {
  try {
    return JSON.parse(
      localStorage.getItem("reportes") || "[]"
    );
  } catch {
    return [];
  }
}

function HomePage() {
  const [cantidadEstudiantes, setCantidadEstudiantes] =
    useState(0);

  const [asientosOcupados, setAsientosOcupados] =
    useState(0);

  const [actualizacion, setActualizacion] =
    useState(0);

  /* MODALES */
  const [mostrarEstudiante, setMostrarEstudiante] =
    useState(false);

  const [mostrarReporte, setMostrarReporte] =
    useState(false);

  const [mostrarGestionAsientos, setMostrarGestionAsientos] =
    useState(false);

  const [mostrarEstadoCursos, setMostrarEstadoCursos] =
    useState(false);

  /* FORMULARIO ESTUDIANTE */
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [curso, setCurso] = useState("");
  const [tutor, setTutor] = useState("");
  const [telefono, setTelefono] = useState("");

  /* FORMULARIO REPORTE */
  const [cursoReporte, setCursoReporte] =
    useState("");

  const [estudianteReporte, setEstudianteReporte] =
    useState("");

  const [observacion, setObservacion] =
    useState("");

  /* GESTIONAR ASIENTOS */
  const [cursoGestionAsientos, setCursoGestionAsientos] =
    useState("");

  const totalCursos = cursos.length;

  const totalAsientos =
    totalCursos * CAPACIDAD_POR_CURSO;

  function actualizarResumen() {
    const estudiantes = obtenerEstudiantes();
    const asignaciones = obtenerAsignaciones();

    let ocupados = 0;

    Object.values(asignaciones).forEach(
      (cursoAsignado) => {
        if (Array.isArray(cursoAsignado)) {
          ocupados += cursoAsignado.length;
        }
      }
    );

    setCantidadEstudiantes(estudiantes.length);
    setAsientosOcupados(ocupados);
    setActualizacion((valor) => valor + 1);
  }

  useEffect(() => {
    actualizarResumen();

    window.addEventListener(
      "storage",
      actualizarResumen
    );

    window.addEventListener(
      "asignacionesActualizadas",
      actualizarResumen
    );

    window.addEventListener(
      "estudiantesActualizados",
      actualizarResumen
    );

    window.addEventListener(
      "reportesActualizados",
      actualizarResumen
    );

    return () => {
      window.removeEventListener(
        "storage",
        actualizarResumen
      );

      window.removeEventListener(
        "asignacionesActualizadas",
        actualizarResumen
      );

      window.removeEventListener(
        "estudiantesActualizados",
        actualizarResumen
      );

      window.removeEventListener(
        "reportesActualizados",
        actualizarResumen
      );
    };
  }, []);

  const asientosLibres = Math.max(
    0,
    totalAsientos - asientosOcupados
  );

  const estudiantes = obtenerEstudiantes();
  const asignaciones = obtenerAsignaciones();

  /* ==========================================
     ESTUDIANTES PARA REPORTAR
     ========================================== */

  const estudiantesDelCurso =
    cursoReporte
      ? estudiantes.filter(
          (estudiante) =>
            estudiante.curso.trim().toLowerCase() ===
            cursoReporte.trim().toLowerCase()
        )
      : [];

  const asignacionesDelCursoReporte =
    cursoReporte
      ? asignaciones[cursoReporte] || []
      : [];

  const estudiantesAsignadosDelCurso =
    estudiantesDelCurso.filter(
      (estudiante) =>
        asignacionesDelCursoReporte.some(
          (asignacion) =>
            asignacion.estudianteId ===
            estudiante.id
        )
    );

  /* ==========================================
     ESTADO DE LOS CURSOS
     ========================================== */

  const cursosEstado = cursos.map(
    (nombreCurso) => {
      const asignacionesCurso =
        asignaciones[nombreCurso] || [];

      const ocupados =
        asignacionesCurso.length;

      const libres =
        CAPACIDAD_POR_CURSO - ocupados;

      const porcentaje =
        Math.round(
          (ocupados / CAPACIDAD_POR_CURSO) * 100
        );

      return {
        nombreCurso,
        ocupados,
        libres: Math.max(0, libres),
        porcentaje: Math.min(
          porcentaje,
          100
        ),
      };
    }
  );

  const cursosMostrados =
    cursosEstado.slice(0, 6);

  /* ==========================================
     GESTIONAR ASIENTOS
     ========================================== */

  const asignacionesGestion =
    cursoGestionAsientos
      ? asignaciones[cursoGestionAsientos] || []
      : [];

  const ocupadosGestion =
    asignacionesGestion.length;

  const libresGestion =
    Math.max(
      0,
      CAPACIDAD_POR_CURSO -
        ocupadosGestion
    );

  const estudiantesGestion =
    cursoGestionAsientos
      ? estudiantes.filter(
          (estudiante) =>
            estudiante.curso
              .trim()
              .toLowerCase() ===
            cursoGestionAsientos
              .trim()
              .toLowerCase()
        )
      : [];

  /* ==========================================
     REGISTRAR ESTUDIANTE
     ========================================== */

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
      alert("Escribe el nombre del estudiante");
      return;
    }

    if (!apellido.trim()) {
      alert("Escribe el apellido del estudiante");
      return;
    }

    if (!curso) {
      alert("Selecciona un curso");
      return;
    }

    if (!tutor.trim()) {
      alert("Escribe el tutor del estudiante");
      return;
    }

    if (!telefono.trim()) {
      alert("Escribe el teléfono del tutor");
      return;
    }

    const estudiantesActuales =
      obtenerEstudiantes();

    const nuevoEstudiante: Estudiante = {
      id: Date.now(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      curso,
      tutor: tutor.trim(),
      telefonoTutor: telefono.trim(),
    };

    const nuevosEstudiantes = [
      ...estudiantesActuales,
      nuevoEstudiante,
    ];

    localStorage.setItem(
      "estudiantes",
      JSON.stringify(nuevosEstudiantes)
    );

    setCantidadEstudiantes(
      nuevosEstudiantes.length
    );

    window.dispatchEvent(
      new Event("estudiantesActualizados")
    );

    alert(
      "Estudiante registrado correctamente"
    );

    cerrarFormularioEstudiante();
  }

  /* ==========================================
     REPORTAR ESTUDIANTE
     ========================================== */

  function abrirFormularioReporte() {
    setCursoReporte("");
    setEstudianteReporte("");
    setObservacion("");

    setMostrarReporte(true);
  }

  function cerrarFormularioReporte() {
    setMostrarReporte(false);
    setCursoReporte("");
    setEstudianteReporte("");
    setObservacion("");
  }

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
      alert("No se encontró el estudiante");
      return;
    }

    const asignacionesActuales =
      obtenerAsignaciones();

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

    if (!asignacion) {
      alert(
        "Este estudiante no tiene un asiento asignado"
      );
      return;
    }

    let usuario: any = null;

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
      usuario?.nombre || "Usuario";

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

    const reportes =
      obtenerReportes();

    const nuevoReporte: Reporte = {
      id: Date.now(),
      estudianteId: estudiante.id,
      estudiante:
        `${estudiante.nombre} ${estudiante.apellido}`,
      curso: cursoReporte,
      asiento: asignacion.asiento,
      asignacionId:
        asignacion.asignacionId,
      fecha,
      hora,
      profesor,
      observacion:
        observacion.trim(),
    };

    reportes.push(nuevoReporte);

    localStorage.setItem(
      "reportes",
      JSON.stringify(reportes)
    );

    window.dispatchEvent(
      new Event("reportesActualizados")
    );

    alert(
      "Reporte registrado correctamente"
    );

    cerrarFormularioReporte();
  }

  /* ==========================================
     GESTIONAR ASIENTOS
     ========================================== */

  function abrirGestionAsientos() {
    setCursoGestionAsientos("");
    setMostrarGestionAsientos(true);
  }

  function cerrarGestionAsientos() {
    setMostrarGestionAsientos(false);
    setCursoGestionAsientos("");
  }

  function verAsientosDelCurso() {
    if (!cursoGestionAsientos) {
      alert("Selecciona un curso");
      return;
    }

    window.location.href =
      `/asientos?curso=${encodeURIComponent(
        cursoGestionAsientos
      )}`;
  }

  /* ==========================================
     ESTADO DE CURSOS
     ========================================== */

  function abrirEstadoCursos() {
    setMostrarEstadoCursos(true);
  }

  function cerrarEstadoCursos() {
    setMostrarEstadoCursos(false);
  }

  return (
    <div className="home">

      <Sidebar />

      <main className="content">

        <div className="inicio-fondo">

          {/* ================================
              ENCABEZADO
              ================================= */}

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


          {/* ================================
              RESUMEN
              ================================= */}

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


          {/* ================================
              PARTE INFERIOR
              ================================= */}

          <div className="inicio-inferior">


            {/* ================================
                ACCIONES RÁPIDAS
                ================================= */}

            <section className="panel-acciones">

              <div className="panel-titulo">

                <h2>
                  ⚡ Acciones rápidas
                </h2>

              </div>


              {/* REGISTRAR */}

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


              {/* GESTIONAR ASIENTOS */}

              <button
                className="accion asiento"
                onClick={
                  abrirGestionAsientos
                }
              >

                <div className="accion-icono">
                  🪑
                </div>

                <div className="accion-texto">

                  <strong>
                    Gestionar asientos
                  </strong>

                  <span>
                    Consultar y administrar
                    los lugares de un curso
                  </span>

                </div>

                <b>›</b>

              </button>


              {/* REPORTAR */}

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
                    Registrar un cambio de lugar
                    no autorizado
                  </span>

                </div>

                <b>›</b>

              </button>

            </section>


            {/* ================================
                ESTADO CURSOS
                ================================= */}

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


              {cursosMostrados.map(
                (cursoItem) => {

                  const porcentaje =
                    cursoItem.porcentaje;

                  const claseBarra =
                    porcentaje <= 10
                      ? "barra roja"
                      : porcentaje <= 60
                      ? "barra amarilla"
                      : "barra verde";

                  return (

                    <div
                      className="curso-fila"
                      key={
                        cursoItem.nombreCurso
                      }
                    >

                      <strong>
                        {
                          cursoItem.nombreCurso
                        }
                      </strong>

                      <div className="barra-contenedor">

                        <div
                          className={
                            claseBarra
                          }
                          style={{
                            width:
                              `${porcentaje}%`,
                          }}
                        />

                      </div>

                      <strong>
                        {porcentaje}%
                      </strong>

                      <span>
                        {
                          cursoItem.ocupados
                        }{" "}
                        / 35
                      </span>

                    </div>

                  );
                }
              )}


              <button
                className="ver-cursos"
                onClick={
                  abrirEstadoCursos
                }
              >
                Ver todos los cursos →
              </button>

            </section>

          </div>


          {/* ================================
              INFORMACIÓN
              ================================= */}

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

              <span>👥</span>

              <div>

                <small>
                  Estudiantes registrados
                </small>

                <strong>
                  {cantidadEstudiantes}
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


      {/* =====================================================
          MODAL REGISTRAR ESTUDIANTE
          ===================================================== */}

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
                        value={cursoItem}
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
                  type="tel"
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


      {/* =====================================================
          MODAL REPORTAR
          ===================================================== */}

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

                  setEstudianteReporte("");

                }}
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

            </div>


            <div className="campo">

              <label>
                Estudiante
              </label>

              <select
                value={estudianteReporte}
                onChange={(e) =>
                  setEstudianteReporte(
                    e.target.value
                  )
                }
                disabled={!cursoReporte}
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
                      key={estudiante.id}
                      value={
                        estudiante.id
                      }
                    >

                      {estudiante.nombre}{" "}
                      {estudiante.apellido}

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

                  {(() => {

                    try {

                      return (
                        JSON.parse(
                          localStorage.getItem(
                            "usuarioActual"
                          ) ||
                          '{"nombre":"Usuario"}'
                        ).nombre ||
                        "Usuario"
                      );

                    } catch {

                      return "Usuario";

                    }

                  })()}

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


      {/* =====================================================
          MODAL GESTIONAR ASIENTOS
          ===================================================== */}

      {mostrarGestionAsientos && (

        <div className="home-modal-fondo">

          <div className="home-modal modal-gestion-asientos">

            <div className="modal-titulo">

              <div>

                <h2>
                  🪑 Gestionar asientos
                </h2>

                <p>
                  Consulta la ocupación de un curso
                  y administra sus asientos.
                </p>

              </div>

              <button
                className="cerrar-modal"
                onClick={
                  cerrarGestionAsientos
                }
              >
                ×
              </button>

            </div>


            <div className="campo">

              <label>
                Seleccionar curso
              </label>

              <select
                value={
                  cursoGestionAsientos
                }
                onChange={(e) =>
                  setCursoGestionAsientos(
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

            </div>


            {cursoGestionAsientos && (

              <div className="gestion-resumen">

                <div className="gestion-dato">

                  <span className="gestion-icono azul">
                    👥
                  </span>

                  <div>

                    <small>
                      Estudiantes
                    </small>

                    <strong>
                      {estudiantesGestion.length}
                    </strong>

                  </div>

                </div>


                <div className="gestion-dato">

                  <span className="gestion-icono amarillo">
                    🪑
                  </span>

                  <div>

                    <small>
                      Ocupados
                    </small>

                    <strong>
                      {ocupadosGestion}
                    </strong>

                  </div>

                </div>


                <div className="gestion-dato">

                  <span className="gestion-icono verde">
                    ✓
                  </span>

                  <div>

                    <small>
                      Libres
                    </small>

                    <strong>
                      {libresGestion}
                    </strong>

                  </div>

                </div>

              </div>

            )}


            {!cursoGestionAsientos && (

              <div className="gestion-vacio">
                🪑
                <p>
                  Selecciona un curso para
                  consultar sus asientos.
                </p>
              </div>

            )}


            {cursoGestionAsientos && (

              <div className="gestion-info">

                <strong>
                  {cursoGestionAsientos}
                </strong>

                <span>
                  {ocupadosGestion} de{" "}
                  {CAPACIDAD_POR_CURSO} asientos
                  ocupados
                </span>

              </div>

            )}


            <div className="modal-botones">

              <button
                className="boton-cancelar-home"
                onClick={
                  cerrarGestionAsientos
                }
              >
                Cancelar
              </button>

              <button
                className="boton-guardar-home"
                onClick={
                  verAsientosDelCurso
                }
                disabled={
                  !cursoGestionAsientos
                }
              >
                Ver asientos
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          MODAL ESTADO DE TODOS LOS CURSOS
          ===================================================== */}

      {mostrarEstadoCursos && (

        <div className="home-modal-fondo">

          <div className="home-modal modal-estado-cursos">

            <div className="modal-titulo">

              <div>

                <h2>
                  📊 Estado de los cursos
                </h2>

                <p>
                  Ocupación actual de todos
                  los cursos.
                </p>

              </div>

              <button
                className="cerrar-modal"
                onClick={
                  cerrarEstadoCursos
                }
              >
                ×
              </button>

            </div>


            <div className="estado-cursos-lista">

              {cursosEstado.map(
                (cursoItem) => {

                  const porcentaje =
                    cursoItem.porcentaje;

                  const claseBarra =
                    porcentaje <= 10
                      ? "barra roja"
                      : porcentaje <= 60
                      ? "barra amarilla"
                      : "barra verde";

                  return (

                    <div
                      className="estado-curso-item"
                      key={
                        cursoItem.nombreCurso
                      }
                    >

                      <div className="estado-curso-cabecera">

                        <strong>
                          {
                            cursoItem.nombreCurso
                          }
                        </strong>

                        <span>
                          {
                            cursoItem.ocupados
                          } / 35
                        </span>

                      </div>


                      <div className="estado-curso-barra">

                        <div className="barra-contenedor">

                          <div
                            className={
                              claseBarra
                            }
                            style={{
                              width:
                                `${porcentaje}%`,
                            }}
                          />

                        </div>

                        <strong>
                          {porcentaje}%
                        </strong>

                      </div>


                      <div className="estado-curso-pie">

                        <span>
                          🪑{" "}
                          {
                            cursoItem.ocupados
                          } ocupados
                        </span>

                        <span>
                          🟢{" "}
                          {
                            cursoItem.libres
                          } libres
                        </span>

                      </div>

                    </div>

                  );

                }
              )}

            </div>


            <div className="modal-botones">

              <button
                className="boton-cancelar-home"
                onClick={
                  cerrarEstadoCursos
                }
              >
                Cerrar
              </button>

            </div>

          </div>

        </div>

      )}


      <span
        style={{
          display: "none",
        }}
      >
        {actualizacion}
      </span>

    </div>
  );
}

export default HomePage;