import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const role = localStorage.getItem("role");

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <strong className="navbar-brand">Объединение</strong>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/user-info">
                Информация о пользователе
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/transfers">
                Переводы
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cash">
                Касса
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/finances">
                Финансы
              </Link>
            </li>
            {role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Админ Панель
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
