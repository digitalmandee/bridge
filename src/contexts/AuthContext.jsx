import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setRole] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "application/json" },
        });
        setUser(response.data);
        setRole(response.data.role);
        setPermissions(response.data.permissions);
      } catch {
        setUser(null);
        setRole('');
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await axios.post("http://localhost:8000/api/logout", {}, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    setUser(null);
    setRole("");
    setPermissions([]);
    localStorage.removeItem("token");
  };

  return <AuthContext.Provider value={{ user, userRole, permissions, loading, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
