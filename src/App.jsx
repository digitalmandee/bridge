import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Welcome from './auth/welcome';
import LoginPage from './auth/login';
// import TopNavbar from './topNavbar/page';
function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Set a timer to hide the splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    // Clean up the timer
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      {showSplash ? (
        <div style={styles.splashContainer}>
          <h1 style={styles.splashText}>
            Welcome to <span style={styles.highlight}>Bridge</span>
          </h1>
        </div>
      ) : (
        <Routes>
          {/* Define your routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      )}
      {/* <TopNavbar /> */}
    </div>
  );
};

const styles = {
  splashContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#fff",
  },
  splashText: {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
  },
  highlight: {
    color: "#FFD700",
    textDecoration: "underline",
  },
};

export default App;
