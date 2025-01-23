import React from "react";

const Loader = ({ variant }) => {
  return (
    <div className={`loader-backdrop ${variant === "B" ? "isselected" : ""}`}>
      <div className="custom-loader"></div>
    </div>
  );
};

export default Loader;
