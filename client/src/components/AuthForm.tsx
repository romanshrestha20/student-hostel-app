import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Role, Gender } from "../types/user";
import { Button, Checkbox, Select, TextInput } from "./common";

interface AuthFormProps {
  mode: "login" | "register";
  onSuccess: (data: {
    name?: string;
    email: string;
    password: string;
    role?: Role;
    gender?: Gender;
  }) => void;
  onToggleMode: () => void;
}

const roles: Role[] = ["student", "owner", "admin"];

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSuccess,
  onToggleMode,
}) => {
  const { login, register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as Role,
    gender: "male" as Gender,
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
              <TextInput
                label="Name"
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
              <Select
                label="Gender"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </div>

            <div>
              <Select
                label="Role"
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
              </Select>
            </div>
          </>
        )}

        <div>
          <TextInput
            label="Email"
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
          <TextInput
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <div className="flex items-center mt-2">
            <Checkbox
              label="Show Password"
              name="showPassword"
              id="showPassword"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
              className="mr-2"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <Button
          id="submit"
          type="submit"
          disabled={loading}
          className={`w-full p-2 text-white rounded transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading..." : mode === "login" ? "Login" : "Register"}
        </Button>

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
