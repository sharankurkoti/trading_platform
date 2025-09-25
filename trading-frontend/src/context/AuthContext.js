import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ named import

export const AuthContext = createContext();

const getValidToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token); // ✅ use named function
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("authToken");
      return null;
    }
    return token;
  } catch (e) {
    localStorage.removeItem("authToken");
    return null;
  }
};

export function AuthProvider({ children }) {
  const [authToken, setToken] = useState(getValidToken());
  const isAuthenticated = !!authToken;

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("authToken", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ authToken, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
