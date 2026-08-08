import users from "../data/users.json";

export function login(email: string, password: string) {
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  return user;
}