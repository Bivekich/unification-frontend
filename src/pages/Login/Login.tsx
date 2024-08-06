import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api";

interface LoginProps {
  onAuthChange: (authenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onAuthChange }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await login(username, password);
      const { role } = response.data.user;

      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      onAuthChange(true);

      navigate("/user-info");
    } catch (error) {
      alert("Ошибка входа");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
          <h1 className="mb-4 text-center">Авторизация</h1>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Имя пользователя
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
