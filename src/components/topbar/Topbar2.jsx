import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Topbar2 = () => {
  return (
    <>
      <div>
        <div className="bg-[#6E205E] shadow-md fixed w-full">
          <div className="flex">
            <Link to={"/dashboard"} className="text-xl p-3 ml-3 text-white">
              <FaArrowLeft />
            </Link>
            <div className="text-sm p-3 ml-3 text-white">
              Kaixin Vegan Bistro - Veganmart
            </div>
            <Link
              to={"/products/keranjang"}
              className="text-xl p-3 text-white fixed mr-3 right-0"
            >
              <FaShoppingCart />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar2;
