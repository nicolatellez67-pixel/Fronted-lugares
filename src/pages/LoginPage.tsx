import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../repositories/authRepository";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  async function handleLogin() {
    setError("");

    if (!email || !password) {
      setError("Completa tu correo y contraseña.");
      return;
    }

    setCargando(true);

    const user = await login(email, password);

    if (user) {
      localStorage.setItem(
        "usuarioActual",
        JSON.stringify(user)
      );

      navigate("/home");
    } else {
      setError("Correo o contraseña incorrectos.");
      setCargando(false);
    }
  }

  return (
    <div className="login-page">

      <div className="login-box">

        <div className="login-header">

          <img
            src="/escudo-don-bosco.png"
            alt="Escudo Don Bosco"
            className="login-logo"
          />

          <h1>DON BOSCO</h1>

          <p>Sistema de asignación de asientos</p>

        </div>

        <div className="login-form">

          <h2>Bienvenido</h2>

          <p className="login-subtitulo">
            Inicia sesión para continuar
          </p>

          <label>Correo electrónico</label>

          <div className="input-contenedor">

            <span>✉</span>

            <input
              type="email"
              placeholder="Ingrese su correo"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />

          </div>

          <label>Contraseña</label>

          <div className="input-contenedor">

            <span>🔒</span>

            <input
              type={
                mostrarPassword
                  ? "text"
                  : "password"
              }
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />

            <button
              type="button"
              className="boton-mostrar"
              onClick={() =>
                setMostrarPassword(!mostrarPassword)
              }
            >
              {mostrarPassword ? "Ocultar" : "Ver"}
            </button>

          </div>

          {error && (
            <div className="mensaje-error">
              ⚠ {error}
            </div>
          )}

          <button
            className="boton-ingresar"
            onClick={handleLogin}
            disabled={cargando}
          >
            {cargando
              ? "Ingresando..."
              : "INGRESAR"}
          </button>

        </div>

        <div className="login-footer">
          Sistema de asignación de asientos
        </div>

      </div>

    </div>
  );
}

export default LoginPage;