import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setRole] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_BASE_API + "user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "application/json" },
        });
        setUser(response.data);
        setRole(response.data.role);
        setPermissions(response.data.permissions);
      } catch {
        setUser(null);
        setRole("");
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post(import.meta.env.VITE_BASE_API + "logout", {}, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "application/json" } });
      setUser(null);
      setRole("");
      setPermissions([]);
      localStorage.removeItem("token");
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return <AuthContext.Provider value={{ user, userRole, permissions, loading, setUser, setRole, setPermissions, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
