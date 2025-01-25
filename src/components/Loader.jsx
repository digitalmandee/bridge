import React from "react";

const Loader = ({ variant }) => {
  return (
    <div className={`loader-backdrop ${variant === "B" ? "isselected" : variant === "C" ? "issmall" : "" }`}>
      <div className="custom-loader"></div>
    </div>
  );
};

export default Loader;
