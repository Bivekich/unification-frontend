import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import UserInfo from "./pages/UserInfo/UserInfo";
import Transfers from "./pages/Transfers/Transfers";
import Finances from "./pages/Finances/Finances";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import Navbar from "./pages/Navbar/Navbar";
import Cash from "./pages/Cash/Cash";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAuthenticated(!!role);
  }, []);

  const handleAuthChange = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {isAuthenticated && <Navbar />}
        <div className="container mt-4 flex-fill">
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
