import React, { useContext, useState } from "react";
import { Button } from "@mui/material";
import { RiLogoutBoxLine } from "react-icons/ri";
import "./style.css";
import { AuthContext } from "@/contexts/AuthContext";
import Admin from "./admin";
import User from "./user";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <div className="sidebar">
        {user.type === "superadmin" && <Admin />}
        {user.type === "admin" && <Admin />}
        {user.type === "investor" && <Admin />}
        {user.type === "user" && <User />}
        <ul>
          <li>
            <Button className="w-100" onClick={logout}>
              <span className="icon">
                <RiLogoutBoxLine />
              </span>
              Log Out
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
