import Sidebar from "../components/Sidebar";
import { getUsuario, logout } from "../repositories/authRepository";
import { useNavigate } from "react-router-dom";

import "./ConfiguracionPage.css";

function ConfiguracionPage() {
  const navigate = useNavigate();

  const usuario = getUsuario();

  function cerrarSesion() {
    const confirmar = window.confirm(
      "¿Seguro que quieres cerrar sesión?"
    );

    if (!confirmar) {
      return;
    }

    logout();

    navigate("/");
  }

  return (
    <div className="configuracion-layout">

      <Sidebar />

      <main className="configuracion-page">

        <div className="configuracion-header">

          <h1>Configuración</h1>

          <p>
            Información y configuración de tu cuenta.
          </p>

        </div>


        <div className="configuracion-contenido">

          {/* CUENTA */}

          <div className="configuracion-card">

            <div className="configuracion-icono">
              👤
            </div>

            <div className="configuracion-info">

              <h2>Mi cuenta</h2>

              <p>
                Información del usuario actual.
              </p>

            </div>


            <div className="datos-usuario">

              <div className="dato">

                <span>Nombre</span>

                <strong>
                  {usuario?.nombre || "No disponible"}
                </strong>

              </div>


              <div className="dato">

                <span>Correo electrónico</span>

                <strong>
                  {usuario?.email || "No disponible"}
                </strong>

              </div>


              <div className="dato">

                <span>Rol</span>

                <strong>
                  {usuario?.rol || "Usuario"}
                </strong>

              </div>

            </div>

          </div>


          {/* CERRAR SESIÓN */}

          <div className="configuracion-card cerrar-card">

            <div className="configuracion-icono">
              🚪
            </div>

            <div className="configuracion-info">

              <h2>Cerrar sesión</h2>

              <p>
                Salir de tu cuenta actual.
              </p>

            </div>

            <button
              className="boton-cerrar"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ConfiguracionPage;