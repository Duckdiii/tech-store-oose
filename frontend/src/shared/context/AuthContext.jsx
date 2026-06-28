import { createContext, useContext, useState } from 'react';
import { authApi } from '../../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ts_user') || 'null'); }
    catch { return null; }
  });

  const login = async (email, password) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem('ts_token', data.accessToken);
    const userData = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setUser(userData);
    localStorage.setItem('ts_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ts_token');
    localStorage.removeItem('ts_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
