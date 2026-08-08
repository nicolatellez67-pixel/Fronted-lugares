import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../repositories/authRepository";

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
    <div>
      <h1>Iniciar sesión</h1>

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
}

export default LoginPage;