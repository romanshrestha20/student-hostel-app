// src/api/authApi.ts
import { api } from './api';
import type { User, Role, Gender } from '../types/user';

/* ────────────────────────────────────────────────────────────────────────── */
/* Types                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: Role; // defaults to "student"
  gender?: Gender; // defaults to "male"

}

/* ────────────────────────────────────────────────────────────────────────── */
/* Helper: attach / remove JWT on axios instance                             */
/* ────────────────────────────────────────────────────────────────────────── */
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

/* ────────────────────────────────────────────────────────────────────────── */
/* Auth calls                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * POST /auth/login
 */
export const login = async ({ email, password }: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/login', { email, password });
  setAuthToken(res.data.token);
  return res.data;
};

/**
 * POST /auth/register
 */
export const register = async ({
  name,
  email,
  password,
  role = 'student',
  gender = 'male',
}: RegisterPayload): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/register', {
    name,
    email,
    password,
    role,
    gender,
  });
  setAuthToken(res.data.token);
  return res.data;
};

/**
 * Simple logout helper
 */
export const logout = () => {
  setAuthToken(null);
};


