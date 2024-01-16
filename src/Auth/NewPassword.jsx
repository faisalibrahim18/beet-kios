import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import Bg from "../assets/bg.png";
import Pass from "../assets/pass.png";
import { NewPasswordUser, reset } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const NewPassword = () => {
  const [new_password, setNewPassword] = useState("");
  const [isMdScreen, setIsMdScreen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("data");
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
        text: "Anda harus masukan email terlebih dahulu!",
      });
      navigate("/forgotpassword");
    }
  });
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
  const { userNewPassword, isSuccess, isLoading } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    if (userNewPassword || isSuccess) {
      // navigate("/Newpassword");
      // window.location.reload();
    }
    dispatch(reset());
  }, [userNewPassword, isSuccess, dispatch, navigate]);
  const HandleNewPassword = (e) => {
    e.preventDefault();
    dispatch(NewPasswordUser({ new_password }));
  };
  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }
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
                  New Password
                </a>
              </li>
            </ul>

            <form
              className="lg:w-2/6 fade-in pl-5"
              onSubmit={HandleNewPassword}
            >
              <div className="mb-2">
                <label
                  htmlFor="website-admin"
                  className="block mb-2 text-sm font-medium text-gray-90"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <img
                      src={Pass}
                      className="lg:h-auto lg:w-auto bounce-top-icons bg-opacity-100 "
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  </div>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    value={new_password}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block shadow-xl rounded-xl border w-full p-2.5 pl-10 text-sm text-gray-900 flex-1 min-w-0  focus:border-[#6E205E] focus:ring-[#6E205E] focus:outline-none focus:ring focus:ring-opacity-5"
                    placeholder="********"
                    required
                  />
                </div>

                <label className="flex items-center mt-5">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4"
                    checked={isPasswordVisible}
                    onChange={togglePasswordVisibility}
                  />
                  <span className="text-sm text-gray-600">Show password</span>
                </label>
              </div>

              <div className="mt-10 ">
                <button
                  type="submit"
                  className="shadow-lg w-full px-5 py-2  text-white  bg-[#6E205E] rounded-lg hover:bg-[#8f397c] focus:outline-none focus:bg-[#8f397c]"
                >
                  {isLoading ? (
                    <div className="flex sm:pl-48 lg:pl-0 md:pl-0 pl-20">
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
                    <div> Save Password</div>
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

export default NewPassword;
