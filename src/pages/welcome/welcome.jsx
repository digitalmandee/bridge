import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import adminLogo from "@/assets/admin.png";
import branchLogo from "@/assets/branch.png";
import investerLogo from "@/assets/investor.png";
import userLogo from "@/assets/user.png";
import logopic from "@/assets/logopic.png";
import "./welcome.css";
import SplashScreen from "@/components/splashscreen";

const Welcome = () => {
	const navigate = useNavigate();
	const { branch } = useParams();

	const [isExist, setIsExist] = useState(null); // Null indicates loading state

	useEffect(() => {
		const checkBranch = async () => {
			try {
				const res = await axiosInstance.get(`branch/check?branch=${branch}`);
				setIsExist(res.data.exist);
			} catch (err) {
				console.error("Error checking branch:", err);
				setIsExist(false); // Default to non-existent if error occurs
			}
		};

		if (branch) checkBranch();
		else setIsExist(false);
	}, [branch]); // Ensure it re-runs if `branch` changes

	const handleNavigation = (path) => {
		navigate(path);
	};

	if (isExist === null) {
		return <SplashScreen />;
	}

	if (!isExist) {
		return <p>Branch does not exist</p>; // Show error if branch is invalid
	}

	return (
		<div className="wcontainer">
			<img src={logopic} alt="Logo" className="container-img" />
			<p className="subHeading">Choose Account Type</p>
			<div className="accountTypeContainer">
				{[
					{ name: "Branch Login", img: branchLogo, path: `/${branch}/branch/dashboard` },
					{ name: "Investor Login", img: investerLogo, path: `/${branch}/user/investor/dashboard` },
					{ name: "User", img: userLogo, path: `/${branch}/user/dashboard` },
				].map((account, index) => (
					<div key={index} className="account-wrapper">
						<div className="accountType" onClick={() => handleNavigation(account.path)}>
							<img src={account.img} alt={account.name} className="accountImage" />
						</div>
						<p>{account.name}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Welcome;
