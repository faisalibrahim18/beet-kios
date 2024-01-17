import jwt_decode from "jwt-decode";

export const checkTokenExpiration = () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log("Error decoding token:", error);
    }
  }

  //   const jwt = require("jsonwebtoken");

  // // Mengatur informasi payload yang akan dimasukkan ke dalam token
  // const tokenPayload = {
  //   // Informasi lain yang mungkin Anda miliki dalam token
  //   exp: Math.pow(2, 31) - 1 // Waktu kedaluwarsa yang sangat besar (hampir tidak terbatas)
  // };

  // // Membuat token dengan payload yang sudah ditentukan
  // const token = jwt.sign(tokenPayload, 'rahasia-kunci');

  // console.log("Token payload:", tokenPayload);
  // console.log("Token:", token);
};
