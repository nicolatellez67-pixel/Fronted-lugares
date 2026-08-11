import "./EstudiantesPage.css";

function EstudiantesPage() {
  return (
    <div className="estudiantes-page">
      <h1>Estudiantes</h1>

      <p>Gestión de estudiantes del colegio Don Bosco.</p>

      <button>Agregar estudiante</button>

      <div className="tabla">
        <h2>Lista de estudiantes</h2>

        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Curso</th>
              <th>Tutor</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Juan</td>
              <td>Pérez</td>
              <td>5to A</td>
              <td>Carlos Pérez</td>
              <td>
                <button>Editar</button>
                <button>Eliminar</button>
              </td>
            </tr>

            <tr>
              <td>María</td>
              <td>López</td>
              <td>4to B</td>
              <td>Ana López</td>
              <td>
                <button>Editar</button>
                <button>Eliminar</button>
              </td>
            </tr>

            <tr>
              <td>Pedro</td>
              <td>Gómez</td>
              <td>6to A</td>
              <td>Laura Gómez</td>
              <td>
                <button>Editar</button>
                <button>Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EstudiantesPage;