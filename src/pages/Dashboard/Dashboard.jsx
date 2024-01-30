import Dash from "../../components/Dashboard/Dash";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkTokenExpiration } from "../../utils/token";
import Topbar2 from "../../components/topbar/Topbar2";
import Swal from "sweetalert2";

const Dashboard = () => {
  const navigate = useNavigate();

  // cek expired token
  useEffect(() => {
    checkTokenExpiration();
    const token = localStorage.getItem("token");
    if (!token) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "warning",
        text: "Anda harus Login Terlebih dahulu!",
      });
      navigate("/");
    }
  });
  // close cek expired token

  return (
    <>
      <Topbar2 />
      <div className="sm:mb-[210px] md:mb-[160px] lg:mb-[250px] mb-[70px]">
        <Dash />
      </div>
    </>
  );
};

export default Dashboard;
