// src/pages/Register.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Role } from '../types/user';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
    role: Role;
  }>({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <label htmlFor="role" className="block font-medium">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="student">Student</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
