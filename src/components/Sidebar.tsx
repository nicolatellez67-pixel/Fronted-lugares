import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Don Bosco</h2>

      <nav>
        <Link to="/home">
          Inicio
        </Link>

        <Link to="/estudiantes">
          Estudiantes
        </Link>

        <Link to="/cursos">
          Cursos
        </Link>

        <Link to="/asientos">
          Asientos
        </Link>

        <Link to="/tutores">
          Tutores
        </Link>

        <Link to="/reportes">
          Reportes
        </Link>

        <Link to="/configuracion">
          Configuración
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;