import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import Lg from "../../assets/lgo_r.png";
import "animate.css/animate.min.css"; // Impor animate.css

const Topbar = ({ cart, detail, products, loading }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    Swal.fire({
      icon: "success",
      text: "Anda Berhasil Logout.",
      showConfirmButton: false,
      timer: 1500, // Menampilkan alert selama 1,5 detik
      customClass: {
        title: "text-sm", // Mengatur ukuran teks judul menjadi lebih kecil
      },
    });
    navigate("/");
  };

  return (
    <>
      <div>
        <nav className="bg-white fixed w-full  z-50 max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:h-[80px] lg:h-[80px] sm:h-[80px]  h-[55px]">
            <div className="flex justify-between">
              <div className="md:mt-[30px] lg:mt-[30px] sm:mt-[30] mt-[17px]">
                <Link
                  to={"/dashboard"}
                  className=" text-[#091F4B] md:text-3xl text-2xl"
                >
                  <FaArrowLeft />
                </Link>
              </div>

              <div className="flex ">
                <div className="lg:text-xl text-xl mr-[20px] mt-0.5 lg:mt-4 xs:mt-4 sm:mt-4 md:mt-4">
                  <div className="relative bottom-3">
                    <Link
                      to={"/products/keranjang"}
                      className="text-[#091F4B] px-4 py-2 rounded-md focus:outline-none hover:text-gray-200"
                    >
                      <div className="md:text-3xl lg:text-3xl sm:text-3xl text-2xl">
                        <FaShoppingCart />
                      </div>

                      {cart.length > 0 && (
                        <span className="absolute top-5 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
                          {cart.length}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>

                <div className="lg:mt-2 mt-[5px] md:mt-2 sm:mt-2 text-white">
                  {" "}
                  <Link to={"/dashboard"} on>
                    <img
                      src={Lg}
                      className="bg-transparent lg:mt-2 md:mt-2  mt-2  w-[75px] md:w-[100px] sm:w-[120px] lg:w-[130px]"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Topbar;
