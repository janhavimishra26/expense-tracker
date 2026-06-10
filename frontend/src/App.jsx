import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ExpenseForm from "./ExpenseForm";
import Income from "./Income";
import Expenses from "./Expenses";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", syncAuth);
    syncAuth();

    return () => window.removeEventListener("storage", syncAuth);
  }, []);
 
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/income"
          element={token ? <Income /> : <Navigate to="/" />}
        />

        <Route
          path="/expenses"
          element={token ? <Expenses /> : <Navigate to="/" />}
        />

        <Route
          path="/add-expense"
          element={token ? <ExpenseForm /> : <Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;