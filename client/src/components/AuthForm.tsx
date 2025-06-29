import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/user";

interface AuthFormProps {
  mode: "login" | "register";
  onSuccess: (data: {
    name?: string;
    email: string;
    password: string;
    role?: Role;
  }) => void;
  onToggleMode: () => void;
}

const roles: Role[] = ["student", "owner", "admin"];

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess, onToggleMode }) => {
  const { login, register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as Role,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const { name, email, password, role } = formData;

      if (mode === "login") {
        await login(email, password);
        onSuccess({ email, password });
      } else {
        await register(name, email, password, role);
        onSuccess({ name, email, password, role });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Authentication error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-bold text-center">
        {mode === "login" ? "Login" : "Register"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <>
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="role" className="block mb-1 font-medium">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <div className="flex items-center mt-2">
            <input
              id="showPassword"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="text-sm text-gray-700">
              Show password
            </label>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 text-white rounded transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading..." : mode === "login" ? "Login" : "Register"}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-blue-600 hover:underline"
          >
            {mode === "login"
              ? "Create an account"
              : "Already have an account? Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
