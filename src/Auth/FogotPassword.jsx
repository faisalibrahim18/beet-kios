import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import Bg from "../assets/bg.png";
import User1 from "../assets/user.png";
import { ForgotPasswordUser, reset } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const FogotPassword = () => {
  const [email, setEmail] = useState("");
  const [isMdScreen, setIsMdScreen  ] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // Fungsi ini akan dijalankan saat komponen pertama kali dimuat
    function handleResize() {
      const screenWidth = window.innerWidth;
      // Periksa lebar layar saat ini dan sesuaikan dengan ukuran yang diinginkan
      setIsMdScreen(
        screenWidth <= 768 ||
          (screenWidth >= 820 && screenWidth <= 834) ||
          (screenWidth >= 800 && screenWidth <= 884)
      );
    }

    // Panggil fungsi handleResize untuk menginisialisasi isMdScreen
    handleResize();

    // Tambahkan event listener untuk memantau perubahan ukuran layar
    window.addEventListener("resize", handleResize);

    // Bersihkan event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Tentukan URL gambar latar belakang
  const bgImage = `${Bg}`; // Ganti dengan URL gambar latar belakang Anda
  const { userForgotPassword, isSuccess, isLoading } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    if (userForgotPassword || isSuccess) {
      navigate("/new_Password");
      // window.location.reload();
    }
    dispatch(reset());
  }, [userForgotPassword, isSuccess, dispatch, navigate]);
  const HandleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(ForgotPasswordUser({ email }));
  };
  return (
    <>
      <div
        className={`lg:bg-right lg:h-screen object-cover bg-cover bg-no-repeat ${
          isMdScreen ? "bg-none" : ""
        }`}
        style={{
          backgroundImage: isMdScreen ? "none" : `url(${bgImage})`,
        }}
      >
        <div className="w-full mx-auto p-11 lg:pl-20 pl-7 lg:pt-20">
          <div className="w-full flex items-center justify-between">
            <Link
              className="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
              to={"/"}
            >
              <img
                src={Logo}
                className="lg:h-auto lg:w-auto bounce-top-icons bg-opacity-100 "
                style={{
                  width: "60px",
                  height: "70px",
                  left: "109px",
                  top: "75px",
                }}
              />
            </Link>
          </div>
        </div>
        {/* <!--Main--> */}
        <div className="px-11 flex flex-col pl-4 md:flex-row items-center lg:pl-28 pt-3">
          {/* <!--Left Col--> */}
          <div className="w-full text-justify  lg:items-start overflow-y-hidden">
            <ul className="flex mb-4 ">
              <li className="pl-5">
                <a
                  href="#"
                  className="lg:text-xl text-xl pb-1  text-black font-semibold border-b-4 inline-block px-1 py-2  hover:border-b-4 border-[#6E205E]"
                >
                  Forgot Password
                </a>
              </li>
            </ul>

            <form
              className="lg:w-2/6 fade-in pl-5"
              onSubmit={HandleForgotPassword}
            >
              <div className="mb-5">
                <label
                  htmlFor="website-admin"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <img
                      src={User1}
                      className="lg:h-auto lg:w-auto bounce-top-icons bg-opacity-100 "
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block shadow-xl rounded-xl border w-full p-2.5 pl-10 text-sm text-gray-900 flex-1 min-w-0  focus:border-[#6E205E] focus:ring-[#6E205E] focus:outline-none focus:ring focus:ring-opacity-5"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="mt-10 ">
                <button
                  type="submit"
                  className="shadow-lg w-full px-5 py-2  text-white  bg-[#6E205E] rounded-lg hover:bg-[#8f397c] focus:outline-none focus:bg-[#8f397c]"
                >
                  {isLoading ? (
                        <div className="flex justify-center">
                          <div className="h-4 w-4 mt-1 mr-2  animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]">
                            {/* <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                              Loading...
                            </span> */}
                          </div>
                          <div className="text-center  flex justify-center items-center">
                            Loading...
                          </div>
                        </div>
                      ) : (
                        <div> Send Password Link</div>
                      )}
                 
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="pt-36 px-11 text-sm text-center md:text-left fade-in">
          <Link
            className="text-gray-500 pt-10 no-underline hover:no-underline fade-in w-full pb-6 text-sm text-center md:text-left"
            to={"#"}
          >
            © BeetStore 2023
          </Link>
        </div>
      </div>
    </>
  );
};

export default FogotPassword;
