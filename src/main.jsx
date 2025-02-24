import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthProvider from "./contexts/AuthContext";
import FloorPlanProvider from "./contexts/floorplan.context.jsx";
import SidebarProvider from "./contexts/sidebar.context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SidebarProvider>
    <AuthProvider>
      <FloorPlanProvider>
          <App />
      </FloorPlanProvider>
    </AuthProvider>
    </SidebarProvider>
  </StrictMode>
);
