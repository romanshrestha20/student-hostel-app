import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<h1>Welcome to the Hostel Management System</h1>}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
