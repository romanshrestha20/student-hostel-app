import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  fetchCurrentUser,
} from '../api/authApi';
import type { User, Role } from '../types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: Role) => Promise<void>;
  logout: () => void;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: try to fetch current user (if token exists)
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.warn('Auto-login failed', err);
        logoutApi();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await loginApi({ email, password });
    setUser(user);
  };

  const register = async (name: string, email: string, password: string, role?: Role) => {
    const { user } = await registerApi({ name, email, password, role });
    setUser(user);
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};