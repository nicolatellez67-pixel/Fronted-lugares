import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  getUsuario,
  logout,
} from "../repositories/authRepository";
import "./Sidebar.css";

function Sidebar() {
  const usuario = getUsuario();

  const nombre = usuario?.nombre || "Usuario";

  let funcion = "Maestro";

  if (usuario?.rol === "ADMIN") {
    funcion = "Administrador";
  }

  if (usuario?.rol === "DOCENTE") {
    funcion = "Maestro";
  }

  if (usuario?.rol === "TUTOR") {
    funcion = "Maestro";
  }

  const menuRef = useRef<HTMLElement | null>(null);

  // Recuperar posición del menú
  useEffect(() => {
    const posicionGuardada =
      sessionStorage.getItem("sidebarScroll");

    if (menuRef.current && posicionGuardada) {
      requestAnimationFrame(() => {
        if (menuRef.current) {
          menuRef.current.scrollTop =
            Number(posicionGuardada);
        }
      });
    }
  }, []);

  // Guardar posición del menú
  function guardarPosicion() {
    if (menuRef.current) {
      sessionStorage.setItem(
        "sidebarScroll",
        String(menuRef.current.scrollTop)
      );
    }
  }

  // Cerrar sesión
  function cerrarSesion() {
    logout();
    window.location.href = "/login";
  }

  return (
    <aside className="sidebar">

      {/* ENCABEZADO */}
      <div className="sidebar-header">

        <div className="logo-don-bosco">
          <img
            src="/escudo-don-bosco.png"
            alt="Escudo Don Bosco"
          />
        </div>

        <h2>DON BOSCO</h2>

        <p>
          Sistema de asignación
          <br />
          de asientos
        </p>

      </div>


      {/* MENÚ */}
      <nav
        className="sidebar-nav"
        ref={menuRef}
        onScroll={guardarPosicion}
      >

        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
          onClick={guardarPosicion}
        >
          <span className="icono">⌂</span>
          <span>Inicio</span>
        </NavLink>


        <NavLink
          to="/estudiantes"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
          onClick={guardarPosicion}
        >
          <span className="icono">♙</span>
          <span>Estudiantes</span>
        </NavLink>


        <NavLink
          to="/cursos"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
          onClick={guardarPosicion}
        >
          <span className="icono">◇</span>
          <span>Cursos</span>
        </NavLink>


        <NavLink
          to="/asientos"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
          onClick={guardarPosicion}
        >
          <span className="icono">□</span>
          <span>Asientos</span>
        </NavLink>


        <NavLink
          to="/tutores"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
          onClick={guardarPosicion}
        >
          <span className="icono">♙</span>
          <span>Tutores</span>
        </NavLink>


        <NavLink
          to="/historial"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
          onClick={guardarPosicion}
        >
          <span className="icono">◷</span>
          <span>Historial</span>
        </NavLink>


        {/* CONFIGURACIÓN SOLO PARA ADMIN */}
        {usuario?.rol === "ADMIN" && (
          <NavLink
            to="/configuracion"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
            onClick={guardarPosicion}
          >
            <span className="icono">⚙</span>
            <span>Configuración</span>
          </NavLink>
        )}

      </nav>


      {/* USUARIO */}
      <div className="usuario-sidebar">

        <div className="usuario-logo">
          <img
            src="/escudo-don-bosco.png"
            alt="Escudo Don Bosco"
          />
        </div>

        <div className="usuario-datos">
          <strong>{nombre}</strong>

          <span>{funcion}</span>
        </div>

      </div>


      {/* CERRAR SESIÓN */}
      <button
        className="boton-cerrar-sesion"
        onClick={cerrarSesion}
      >
        🚪 Cerrar sesión
      </button>

    </aside>
  );
}

export default Sidebar;