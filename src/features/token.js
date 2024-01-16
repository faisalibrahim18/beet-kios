import jwt from "jsonwebtoken";

const checkAndRemoveExpiredToken = () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decodedToken = jwt.verify(token, "secret");
      const tokenExpiration = decodedToken.exp;

      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime >= tokenExpiration) {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log("Error decoding token:", error);
    }
  }
};

export default checkAndRemoveExpiredToken;
