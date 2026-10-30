import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { getUsuario, logout } from "../repositories/authRepository";
import "./Sidebar.css";

function Sidebar() {
  const usuario = getUsuario();
  const esAdmin = usuario?.rol === "ADMIN";

  const [menuAbierto, setMenuAbierto] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const posicionGuardada = sessionStorage.getItem("sidebarScroll");

    if (sidebarRef.current && posicionGuardada) {
      sidebarRef.current.scrollTop = Number(posicionGuardada);
    }
  }, []);

  function guardarPosicion() {
    if (sidebarRef.current) {
      sessionStorage.setItem(
        "sidebarScroll",
        String(sidebarRef.current.scrollTop)
      );
    }

    setMenuAbierto(false);
  }

  function cerrarSesion() {
    logout();
    window.location.href = "/login";
  }

  return (
    <>
      {/* BARRA SUPERIOR PARA CELULARES */}
      <div className="mobile-topbar">
        <div className="mobile-brand">
          <img
            src="/escudo-don-bosco.png"
            alt="Escudo Don Bosco"
          />
          <span>DON BOSCO</span>
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
        >
          {menuAbierto ? "✕" : "☰"}
        </button>
      </div>

      {/* FONDO OSCURO */}
      {menuAbierto && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        className={`sidebar ${menuAbierto ? "abierto" : ""}`}
      >
        <div className="sidebar-header">
          <img
            src="/escudo-don-bosco.png"
            alt="Escudo Don Bosco"
            className="sidebar-logo"
          />

          <div className="sidebar-titulo">
            <h2>DON BOSCO</h2>
            <span>Gestión de Asientos</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/home" onClick={guardarPosicion}>
            <span className="sidebar-icon">⌂</span>
            <span>Inicio</span>
          </NavLink>

          <NavLink to="/estudiantes" onClick={guardarPosicion}>
            <span className="sidebar-icon">♙</span>
            <span>Estudiantes</span>
          </NavLink>

          <NavLink to="/cursos" onClick={guardarPosicion}>
            <span className="sidebar-icon">▤</span>
            <span>Cursos</span>
          </NavLink>

          <NavLink to="/asientos" onClick={guardarPosicion}>
            <span className="sidebar-icon">▦</span>
            <span>Asientos</span>
          </NavLink>

          <NavLink to="/tutores" onClick={guardarPosicion}>
            <span className="sidebar-icon">♧</span>
            <span>Tutores</span>
          </NavLink>

          <NavLink to="/historial" onClick={guardarPosicion}>
            <span className="sidebar-icon">◷</span>
            <span>Historial</span>
          </NavLink>

          {esAdmin && (
            <NavLink
              to="/configuracion"
              onClick={guardarPosicion}
            >
              <span className="sidebar-icon">⚙</span>
              <span>Configuración</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-usuario">
          <div className="usuario-avatar">
            {usuario?.nombre?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="usuario-info">
            <strong>{usuario?.nombre || "Usuario"}</strong>
            <span>{usuario?.rol || "Usuario"}</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <button onClick={cerrarSesion}>
            <span className="sidebar-icon">⇥</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;