import Profile1 from "../../components/Account/Profile";
import Topbar from "../../components/topbar/Topbar";
import BottomBar from "../../components/bottombar/BottomBar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { checkTokenExpiration } from "../../utils/token";

const Profile = () => {
 
  return (
    <>
      <Topbar />
      <div className="pt-14">
        <Profile1 />
      </div>
      <BottomBar />
    </>
  );
};

export default Profile;
