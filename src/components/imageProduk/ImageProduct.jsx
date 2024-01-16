import React, { useEffect, useState } from "react";
import axios from "axios";

const ImageProduct = () => {
  const [imageData, setImageData] = useState([]);
  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/api/v1/product/beetstore`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data.data);
        setImageData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchImageData();
  }, []);
  if (!imageData) {
    return (
      <div>
        <h1 className=" mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </h1>
      </div>
    );
  }
  const firstLetter = imageData.map((i) => (
    <div key={i.id}>
      <div>{i.name}</div>
    </div>
  )) ? imageData.map((i) => (
    <div key={i.id}>
      <div>{i.name.charAt(0).toUpperCase()}</div>
    </div>
  )):"";
  //   const firstLetter = imageData.name
  //     ? imageData.name.charAt(0).toUpperCase()
  //     : "";
//   console.log("data", firstLetter);

  //   const circleStyle = {
  //     backgroundColor: stringToColor(imageData.id),
  //     color: "#ffffff",
  //   };

  //   function stringToColor(str) {
  //     let hash = 0;
  //     for (let i = 0; i < str.length; i++) {
  //       hash = str.charCodeAt(i) + ((hash << 5) - hash);
  //     }

  //     const color = "#" + (hash & 0x00ffffff).toString(16).toUpperCase();
  //     return color.padEnd(7, "0");
  //   }

  return <div> {firstLetter}</div>;
};

export default ImageProduct;
