import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api';
import styles from './Login.module.scss';

interface LoginProps {
  onAuthChange: (authenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onAuthChange }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await login(username, password);
      const { role } = response.data.user;

      localStorage.setItem('role', role);
      onAuthChange(true);

      navigate('/user-info');
    } catch (error) {
      alert('Ошибка входа');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <h1>Авторизация</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Имя пользователя"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
      />
      <button type="submit">Войти</button>
    </form>
  );
};

export default Login;
