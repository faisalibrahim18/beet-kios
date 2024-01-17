import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import Lg from "../../assets/lg_robo.jfif";
import Lg1 from "../../assets/logo.png";

const Topbar2 = () => {
  return (
    <>
      <div>
        <div className="bg-white shadow fixed z-50 bg-opacity-85 w-full flex justify-between ">
          <div className="">
            <img src={Lg} alt="" className="w-[130px] m-2" />
          </div>
          <div className="">
            <img src={Lg1} alt="" className="w-[60px] m-2" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar2;
