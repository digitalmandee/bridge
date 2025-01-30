import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthProvider from "./contexts/AuthContext";
import FloorPlanProvider from "./contexts/floorplan.context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FloorPlanProvider>
        <App />
      </FloorPlanProvider>
    </AuthProvider>
  </StrictMode>
);
