import React from "react";

const Navigation = ({ onClick, direction }) => {
  return (
    <>
      {" "}
      <button
        onClick={onClick}
        className="swiper-button-prev text-amber-800 mt-1  bg-gray-500 rounded-full"
      ></button>
      <button
        onClick={onClick}
        className="swiper-button-next text-amber-800 mt-1  bg-gray-500 rounded-full"
      ></button>
    </>
  );
};

export default Navigation;
