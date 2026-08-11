import "./HomePage.css";

function HomePage() {
  return (
    <div className="home">
      <aside className="sidebar">
        <h2>Don Bosco</h2>

        <nav>
          <a>Inicio</a>
          <a href="/estudiantes">Estudiantes</a>
          <a>Cursos</a>
          <a>Aulas</a>
          <a>Asientos</a>
          <a>Asignaciones</a>
          <a>Tutores</a>
          <a>Reportes</a>
          <a>Configuración</a>
        </nav>
      </aside>

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
            <p>Gestionar cursos</p>
          </div>

          <div className="card">
            <h3>Aulas</h3>
            <p>Gestionar aulas</p>
          </div>

          <div className="card">
            <h3>Asientos</h3>
            <p>Gestionar asientos</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;