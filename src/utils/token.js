import jwt_decode from "jwt-decode";

export const checkTokenExpiration = () => {
  const token = localStorage.getItem("token");

  //   console.log(token, "anj");
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
};