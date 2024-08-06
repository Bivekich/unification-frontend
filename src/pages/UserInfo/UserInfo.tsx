import React from "react";

const UserInfo: React.FC = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Информация о пользователе</h1>
      <p className="lead">Имя пользователя: {username}</p>
      <p className="lead">Роль: {role}</p>
      <button className="btn btn-danger" onClick={handleLogout}>
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default UserInfo;
