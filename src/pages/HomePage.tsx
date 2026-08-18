import Sidebar from "../components/Sidebar";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home">
      <Sidebar />

      <main className="content">
        <h1>Bienvenido al sistema</h1>

        <p>
          Sistema de asignación de asientos para estudiantes.
        </p>

        <div className="cards">
          <div className="card">
            <h3>Estudiantes</h3>
            <p>Gestionar estudiantes</p>
          </div>

          <div className="card">
            <h3>Cursos</h3>
            <p>Consultar cursos</p>
          </div>

          <div className="card">
            <h3>Asientos</h3>
            <p>Gestionar asientos</p>
          </div>

          <div className="card">
            <h3>Asignaciones</h3>
            <p>Gestionar asignaciones</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;