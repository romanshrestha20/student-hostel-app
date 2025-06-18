// src/pages/AuthPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/user";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSuccess = async ({
    name,
    email,
    password,
    role,
  }: {
    name?: string;
    email: string;
    password: string;
    role?: Role;
  }) => {
    try {
      if (mode === "login") {
        await login(email, password);
        navigate("/dashboard");
      } else {
        await register(name || "", email, password, role);
        setMode("login");
      }
    } catch (err) {
      console.error("Auth failed:", err);
    }
  };

  return (
    <div>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      <AuthForm
        mode={mode}
        onSuccess={handleSuccess}
        onToggleMode={() => setMode(mode === "login" ? "register" : "login")}
      />
    </div>
  );
};

export default AuthPage;


