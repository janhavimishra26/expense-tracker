import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ExpenseForm from "./ExpenseForm";
import Income from "./Income";
import Expenses from "./Expenses";

function App() {
  const isAuth = () => localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={isAuth() ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/income"
          element={isAuth() ? <Income /> : <Navigate to="/" />}
        />

        <Route
          path="/expenses"
          element={isAuth() ? <Expenses /> : <Navigate to="/" />}
        />

        <Route
          path="/add-expense"
          element={isAuth() ? <ExpenseForm /> : <Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;