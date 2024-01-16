import React from "react";
import Lg from "../../assets/logo.png";

const LoadingScreen = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <img
        src={Lg}
        alt="Loading Logo"
        className="w-20 h-24 absolute mb-10  animate-pulse"
      />
      <div className="loader animate-spin rounded-full mb-3  border-t-4 border-[#091F4B] h-32 w-32"></div>
      <p className="text-gray-600 font-semibold animate-pulse">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
