import React, { useEffect } from "react";

const SplashScreen = ({ onComplete }) => {
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

  useEffect(() => {
    // Set a timer to notify the parent component after 1 second
    const timer = setTimeout(() => {
      onComplete();
    }, 1000);

    // Clean up the timer
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={styles.splashContainer}>
      <h1 style={styles.splashText}>
        Welcome to <span style={styles.highlight}>Bridge</span>
      </h1>
    </div>
  );
};

export default SplashScreen;
