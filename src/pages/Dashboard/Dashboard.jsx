import Topbar from "../../components/topbar/Topbar";
import BottomBar from "../../components/bottombar/BottomBar";
import Dashboard1 from "../../components/Dashboard/Dashboard";
import Dash from "../../components/Dashboard/Dash";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkTokenExpiration } from "../../utils/token";

const Dashboard = () => {
  const navigate = useNavigate();
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
  return (
    <>
      {/* <Topbar/> */}
      <div className="">
        <Dash />
      </div>
      {/* <BottomBar/> */}
    </>
  );
};

export default Dashboard;