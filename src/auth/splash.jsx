import React, { useEffect } from "react";
import logo from '../assets/logo.png'
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
      position: "relative",
      display: "inline-block",
    },
    underline: {
      position: "absolute",
      width: "100%",
      height: "2px", // Adjust height as needed
      backgroundColor: "#0D2B4E", // Color of the underline
      bottom: "0",
      left: "0",
    },
    logo: {
      width: "100px", // Adjust the width as needed
      height: "auto",
      marginLeft: "0.2rem", // Space between text and logo
    },
  };

  useEffect(() => {
    // Set a timer to notify the parent component after 1 second
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    // Clean up the timer
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={styles.splashContainer}>
      <div style={styles.splashText}>
        Welcome to <img src={logo} alt="Logo" style={styles.logo} />
        <div style={styles.underline}></div>
      </div>
    </div>
  );
};

export default SplashScreen;