import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../repositories/authRepository";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin() {
    const user = login(email, password);

    if (user) {
      alert("Bienvenido " + user.name);
      navigate("/home");
    } else {
      alert("Correo o contraseña incorrectos");
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <h1>Bienvenido</h1>
          <p>Sistema de asignación de asientos</p>
        </div>

        <div className="login-form">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="Ingrese su correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>
            INGRESAR
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;