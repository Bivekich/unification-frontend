import React from 'react';
import styles from './UserInfo.module.scss';

const UserInfo: React.FC = () => {
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Информация о пользователе</h1>
      <p className={styles.role}>Роль: {role}</p>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default UserInfo;
