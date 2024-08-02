import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
  const role = localStorage.getItem('role');

  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link to="/user-info">Информация о пользователе</Link>
        </li>
        <li>
          <Link to="/transfers">Переводы</Link>
        </li>
        <li>
          <Link to="/finances">Финансы</Link>
        </li>
        {role === 'admin' && (
          <li>
            <Link to="/admin">Админ Панель</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
