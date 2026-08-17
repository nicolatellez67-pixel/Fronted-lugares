import users from "../data/users.json";

export function login(email: string, password: string) {
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    localStorage.setItem("usuario", JSON.stringify(user));
    return user;
  }

  return null;
}

export function logout() {
  localStorage.removeItem("usuario");
}

export function getUsuario() {
  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
    return null;
  }

  return JSON.parse(usuario);
}