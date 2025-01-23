import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform any login logic here (e.g., authentication)
    // After successful login, navigate to the home screen
    navigate("/dashboard");
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5",
    },
    container1: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            margin: '0 auto', // Center horizontally
            marginBottom: '16px', // Space between fields
            width: '90%', // Optional: Set a width for responsiveness
            maxWidth: '400px', // Space between fields
      },
    form: {
      width: "400px",
      backgroundColor: "#FFD700",
      borderRadius: "10px",
      padding: "20px",
      textAlign: "center",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    label: {
        fontWeight: 'bold', // Example style for labels
        marginBottom: '4px', // Space between label and input
      },
      wrapper: {
        width: "90%", // Set a percentage for responsiveness
        maxWidth: "400px", // Optional: Limit the width for larger screens
        margin: "0 auto", // Centers the wrapper horizontally
      },
    input: {
      width: "100%",
    //   height: "5vh",
      padding: "10px",
    //   margin: "5px 0",
      border: "none",
      borderRadius: "15px",
    },
    button: {
      backgroundColor: "#000",
      color: "#fff",
      padding: "10px",
      width: "100%",
      border: "none",
      borderRadius: "15px",
      cursor: "pointer",
    },
    fcontainer: {
        display: 'flex',
        justifyContent: 'flex-end',
      },
    link: {
      color: "black",
      
      fontSize: "0.8rem",
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h1>Log In</h1>
        <div style={styles.container1}>
        <label style={styles.label}>Email</label>
        <input type="email" placeholder="Email" style={styles.input} />
      </div>
      <div style={styles.container1}>
        <label style={styles.label}>Password</label>
        <input type="password" placeholder="Password" style={styles.input} />
      </div>
        <p style={styles.fcontainer}>
          <a href="/forgot-password" style={styles.link}>
            Forgot password?
          </a>
        </p>
        <button style={styles.button} onClick={()=>{handleLogin()}}>Log In</button>
        <p>
          Don't have an account?{" "}
          <a href="/signup" style={styles.link}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;