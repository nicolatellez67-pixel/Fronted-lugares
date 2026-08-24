import { useState } from "react";

import Sidebar from "../components/Sidebar";

import "./HistorialPage.css";

type RegistroHistorial = {
  id: number;
  fecha: string;
  estudiante: string;
  curso: string;
  accion: string;
  asiento: string;
};

function HistorialPage() {
  const [busqueda, setBusqueda] = useState("");

  const datos = localStorage.getItem("historial");

  const historial: RegistroHistorial[] = datos
    ? JSON.parse(datos)
    : [];

  const historialFiltrado = historial.filter((registro) => {
    const texto = busqueda.toLowerCase().trim();

    return (
      registro.estudiante.toLowerCase().includes(texto) ||
      registro.curso.toLowerCase().includes(texto) ||
      registro.asiento.toLowerCase().includes(texto)
    );
  });

  function limpiarHistorial() {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar todo el historial?"
    );

    if (!confirmar) {
      return;
    }

    localStorage.removeItem("historial");

    window.location.reload();
  }

  return (
    <div className="historial-layout">

      <Sidebar />

      <main className="historial-page">

        <div className="historial-header">

          <div>
            <h1>Historial</h1>

            <p>
              Registro de asignaciones y liberaciones
              de asientos.
            </p>
          </div>

          <div className="cantidad-historial">

            <strong>
              {historial.length}
            </strong>

            <span>
              registros
            </span>

          </div>

        </div>


        <div className="historial-controles">

          <div className="buscador-historial">

            <span>🔎</span>

            <input
              type="text"
              placeholder="Buscar estudiante, curso o asiento..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
            />

          </div>


          {historial.length > 0 && (

            <button
              className="boton-limpiar"
              onClick={limpiarHistorial}
            >
              Limpiar historial
            </button>

          )}

        </div>


        <div className="tabla-historial">

          <div className="tabla-titulo">

            <h2>
              Actividad reciente
            </h2>

            <span>
              {historialFiltrado.length} resultados
            </span>

          </div>


          {historialFiltrado.length === 0 ? (

            <div className="historial-vacio">

              <div>📋</div>

              <h3>
                No hay registros
              </h3>

              <p>
                Las asignaciones y liberaciones
                aparecerán aquí.
              </p>

            </div>

          ) : (

            <table>

              <thead>

                <tr>
                  <th>Fecha</th>
                  <th>Estudiante</th>
                  <th>Curso</th>
                  <th>Asiento</th>
                  <th>Acción</th>
                </tr>

              </thead>

              <tbody>

                {[...historialFiltrado]
                  .reverse()
                  .map((registro) => (

                    <tr key={registro.id}>

                      <td>
                        {registro.fecha}
                      </td>

                      <td>
                        <strong>
                          {registro.estudiante}
                        </strong>
                      </td>

                      <td>
                        {registro.curso}
                      </td>

                      <td>
                        <span className="asiento-historial">
                          {registro.asiento}
                        </span>
                      </td>

                      <td>

                        <span
                          className={
                            registro.accion ===
                            "Asignación de asiento"
                              ? "accion asignacion"
                              : "accion liberacion"
                          }
                        >
                          {registro.accion ===
                          "Asignación de asiento"
                            ? "Asignado"
                            : "Liberado"}
                        </span>

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

export default HistorialPage;