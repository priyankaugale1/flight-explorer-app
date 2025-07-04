import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (user) {
      const id = setTimeout(() => {
        logout(true); // Pass true to indicate auto logout
      }, 5 * 60 * 1000); // 5 minutes
      setTimeoutId(id);
    }
    return () => clearTimeout(timeoutId);
  }, [user]);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u => u.email === email && u.password === btoa(password));
    if (found) {
      setUser(found);
      localStorage.setItem("user", JSON.stringify(found));
      return true;
    }
    return false;
  };

  const signup = (userData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find(u => u.email === userData.email);
    if (exists) return false;
    const newUser = { ...userData, password: btoa(userData.password) };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  };

  const logout = (isAuto = false) => {
    setUser(null);
    localStorage.removeItem("user");
    if (timeoutId) clearTimeout(timeoutId);

    if (isAuto) {
      toast.info("Session expired. You have been logged out automatically.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
