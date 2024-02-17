import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = () => {
      localStorage.clear();
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
    };
    logout();
  }, []);

  return <div></div>;
};

export default LogOut;
