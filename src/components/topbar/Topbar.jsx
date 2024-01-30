import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import Lg from "../../assets/logo.png";
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
        <nav className="bg-white  fixed w-full  z-50 max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[90px]">
            <div className="flex">
              <div className="mt-[35px]">
                <Link to={"/dashboard"} className=" text-[#091F4B]">
                  <FaArrowLeft size={30} />
                </Link>
              </div>
              {loading ? (
                <div className="w-full lg:pl-0 pl-10 text-white font-semibold pt-3 mt-3 text-center"></div>
              ) : (
                <>
                  {products && products.length > 0 ? (
                    <div className="w-full lg:pl-0 pl-10  text-white font-semibold pt-3 mt-2  md:mt-2.5 lg:mt-3 text-center">
                      <div key={products[0].id}>
                        {/* <div>{products[0].Business.name}</div> */}
                      </div>
                    </div>
                  ) : detail ? (
                    <div className="w-full lg:pl-0 pl-10 text-white font-semibold pt-3 mt-2 md:mt-2.5 lg:mt-3 text-center">
                      <div key={detail?.id}>
                        {/* <div>{detail?.Business?.name}</div> */}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full lg:pl-0 pl-10 text-white font-semibold pt-3 mt-2.5 md:mt-2.5 lg:mt-3 text-center">
                      {/* Profile */}
                    </div>
                  )}
                </>
              )}

              <div className="flex">
                <div className="lg:text-xl text-xl mr-[60px] mt-4 lg:mt-4 xs:mt-4 sm:mt-4 md:mt-4">
                  <div className="relative text-left bottom-3">
                    <Link
                      to={"/products/keranjang"}
                      className="text-[#091F4B] px-4 py-2 rounded-md focus:outline-none hover:text-gray-200"
                    >
                      <FaShoppingCart size={30} />
                      {cart.length > 0 && (
                        <span className="absolute top-5 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
                          {cart.length}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>

                <div className="lg:mt-4 mt-[14px] md:mt-4 sm:mt-4 text-white">
                  {" "}
                  <Link to={"/dashboard"} on>
                    <img
                      src={Lg}
                      className="bg-transparent  w-[190px] xs:w-[90px] sm:w-[90px] md:w-[90px] lg:w-[70px]"
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
