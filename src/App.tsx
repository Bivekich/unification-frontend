import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import UserInfo from './components/UserInfo/UserInfo';
import Transfers from './components/Transfers/Transfers';
import Finances from './components/Finances/Finances';
import AdminPanel from './components/AdminPanel/AdminPanel';
import Navbar from './components/Navbar/Navbar';
import Cash from './components/Cash/Cash';
import styles from './App.module.scss';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsAuthenticated(!!role);
  }, []);

  const handleAuthChange = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
  };

  return (
    <Router>
      <div className={styles.app}>
        {isAuthenticated && <Navbar />}
        <div className={styles.mainContent}>
          <Routes>
            <Route
              path="/"
              element={<Login onAuthChange={handleAuthChange} />}
            />
            <Route path="/user-info" element={<UserInfo />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/cash" element={<Cash />} />
            <Route path="/finances" element={<Finances />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
