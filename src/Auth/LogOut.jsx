import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogOut = () => {
      localStorage.removeItem("cart");
      localStorage.removeItem("user");
      localStorage.removeItem("logo");
      localStorage.removeItem("queueNumber");
      localStorage.removeItem("token");
    };
    handleLogOut();
    const Toast = Swal.mixin({
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: "success",
      text: "Anda Berhasil Logout.",
    });
    navigate("/");
  }, []);

  return <div></div>;
};

export default LogOut;
