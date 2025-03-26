import React, { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

const SplashScreen = ({ onComplete }) => {
	const [showTimer, setShowTimer] = useState(!!onComplete);

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
			height: "2px",
			backgroundColor: "#0D2B4E",
			bottom: "0",
			left: "0",
		},
		logo: {
			width: "100px",
			height: "auto",
			marginLeft: "0.2rem",
		},
	};

	useEffect(() => {
		if (onComplete) {
			const timer = setTimeout(() => {
				onComplete();
			}, 1000);

			return () => clearTimeout(timer);
		} else {
			setShowTimer(false);
		}
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
