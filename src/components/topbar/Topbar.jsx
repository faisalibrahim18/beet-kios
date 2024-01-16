import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaThLarge,
  FaUserAlt,
  FaHistory,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { CgLogOut } from "react-icons/cg";
import Swal from "sweetalert2";
import axios from "axios";
import Lg from "../../assets/lg.png";
import Mt from "../../assets/mt.jpg";
import Cart from "./Cart";
import "animate.css/animate.min.css"; // Impor animate.css

const Topbar = ({ detail, outlet, products, setSearchTermOutlet, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchValue, setSearchValue] = useState(""); // State untuk nilai pencarian
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isOpenUser, setIsOpenUser] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 448);

  const location = useLocation();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 448);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Mengambil data dari localStorage
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
  }, []);
  const toggleOpen = () => {
    setIsOpenUser(!isOpenUser);
  };

  const closeOpen = () => {
    setIsOpenUser(false);
  };

  const handleClick = () => {
    if (!isOpenUser) {
      setIsOpenUser(true);
    } else {
      setIsOpenUser(false);
    }
  };
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  const closeCart = () => {
    setIsCartOpen(false);
  };
  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };
  const closeHistory = () => {
    setIsHistoryOpen(false);
  };

  // const handleClick1 = () => {
  //   if (!isCartOpen) {
  //     setIsCartOpen(true);
  //   } else {
  //     setIsCartOpen(false);
  //   }
  // };
  // Menghitung total item dalam keranjang
  const totalItems = cart.length;
  const { id } = useParams();
  // console.log("data", products);
  useEffect(() => {
    const getData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user");

        const response = await axios.get(
          `${API_URL}/api/v1/customer-account/${user_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser([response.data.data]);
        // console.log(dataOutlet);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.message);
        }
      }
    };
    getData();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
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
  const handleSubmit = (e) => e.preventDefault();
  // Handler untuk mengatur nilai pencarian saat input berubah
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value); // Update nilai pencarian saat input berubah

    if (!value) {
      setSearchTermOutlet(outlet);
    } else {
      const resultsArray = outlet.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchTermOutlet(resultsArray);
    }
  };
  // Handler untuk mengatur elemen pencarian menjadi full lebar saat diklik
  const expandSearch = () => {
    setIsSearchExpanded(true);
  };

  // Handler untuk mengatur ulang elemen pencarian saat elemen tersebut kehilangan fokus
  const resetSearchWidth = () => {
    setIsSearchExpanded(false);
  };
  // Handler untuk menghapus teks pencarian
  const clearSearch = () => {
    setSearchValue("");
    setSearchTermOutlet(outlet);
  };
  return (
    <>
      <div>
        {id ? (
          <nav className="bg-[#091F4B] shadow-md fixed w-full z-50 max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16">
              <div className="flex">
                <div className="mt-6">
                  <button
                    onClick={() => window.history.back()}
                    className="text-xl text-white"
                  >
                    <FaArrowLeft />
                  </button>
                </div>
                {loading ? (
                  <div className="w-full lg:pl-0 pl-10 text-white font-semibold pt-3 mt-3 text-center"></div>
                ) : (
                  <>
                    {products && products.length > 0 ? (
                      <div className="w-full lg:pl-0 pl-10  text-white font-semibold pt-3 mt-2  md:mt-2.5 lg:mt-3 text-center">
                        <div key={products[0].id}>
                          <div>{products[0].Business.name}</div>
                        </div>
                      </div>
                    ) : detail ? (
                      <div className="w-full lg:pl-0 pl-10 text-white font-semibold pt-3 mt-2 md:mt-2.5 lg:mt-3 text-center">
                        <div key={detail?.id}>
                          <div>{detail?.Business?.name}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full lg:pl-0 pl-10 text-white font-semibold pt-3 mt-2.5 md:mt-2.5 lg:mt-3 text-center">
                        Profile
                      </div>
                    )}
                  </>
                )}

                <div className="flex">
                  <div className="lg:text-xl text-xl mr-4 mt-1 lg:mt-1.5 md:mt-2">
                    <div className="relative text-left bottom-3">
                      <Link
                        to={"/products/keranjang"}
                        className="text-white px-4 py-2 rounded-md focus:outline-none hover:text-gray-200"
                        onMouseEnter={toggleCart}
                      >
                        <FaShoppingCart />
                        {totalItems > 0 && (
                          <span className="absolute top-5 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
                            {totalItems}
                          </span>
                        )}
                      </Link>
                      <div
                        className={`${
                          isCartOpen
                            ? "cart-dropdown absolute lg:block md:block hidden right-0 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto cart-dropdown-animation"
                            : "hidden"
                        }`}
                        onMouseLeave={closeCart}
                      >
                        <div className="cart-items p-4">
                          <Cart cart={cart} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:mt-3 md:mt-4 mt-5 text-white">
                    {" "}
                    <Link to={"/dashboard"}>
                      <img src={Lg} className="bg-transparent lg:w-40 w-40" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        ) : (
          <nav className="bg-[#52BFD8] shadow-md fixed w-full z-50  mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:block md:block flex items-center justify-between h-20">
              <div className="flex items-center">
                {isMobile && isSearchExpanded ? (
                  // Logo dan tombol toggle akan disembunyikan saat isSearchExpanded true
                  <div className="w-0 h-0 overflow-hidden">
                    <img
                      src={Lg}
                      className="bg-transparent lg:w-40 w-28 lg:mt-0"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0">
                    <Link to={"/dashboard"}>
                      <img
                        src={Lg}
                        className="bg-transparent lg:w-40 w-28 lg:mt-0"
                      />
                    </Link>
                  </div>
                )}
                <div className="w-full lg:pr-10 pr-2">
                  {" "}
                  <form
                    className={`lg:pt-0 pl-2 lg:pl-10 ${
                      isMobile && isSearchExpanded ? "pl-0 w-screen pr-8" : ""
                    }`}
                    onSubmit={handleSubmit}
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                        <svg
                          className="w-4 h-4 lg:w-6 lg:h-6  text-[#6E205E] text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        onClick={() => setIsSearchExpanded(true)} // Mengatur lebar elemen saat diklik
                        onBlur={() => setIsSearchExpanded(false)} // Mengatur ulang lebar elemen saat kehilangan fokus
                        className={`block rounded-xl border lg:p-2 p-1.5 lg:pl-10 pl-8 text-sm text-gray-900 focus:border-[#6E205E] focus:ring-[#6E205E] focus:outline-none focus:ring focus:ring-opacity-5 ${
                          isMobile && isSearchExpanded
                            ? "w-full p-2.5"
                            : "w-full" // Mengatur lebar elemen sesuai dengan state isSearchExpanded
                        }`}
                        placeholder="Search"
                      />

                      {searchValue && ( // Tampilkan tombol "X" hanya jika ada teks pencarian
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 cursor-pointer"
                          onClick={clearSearch} // Handler untuk menghapus teks pencarian
                        >
                          <svg
                            className="w-4 h-4 lg:w-6 lg:h-6 text-[#6E205E] hover:text-[#9e438c]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="text-2xl hidden md:block">
                  <div className="relative inline-block text-left">
                    <Link
                      to={"/products/keranjang"}
                      className="text-white px-4 py-2 rounded-md  focus:outline-none hover:text-gray-200"
                      // onClick={handleClick}
                      onMouseEnter={toggleCart}
                      // onMouseLeave={closeCart}
                    >
                      <FaShoppingCart />
                      {totalItems > 0 && ( // Tampilkan notifikasi angka hanya jika ada item dalam keranjang
                        <span className="absolute top-5 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                    <div
                      className={`${
                        isCartOpen
                          ? "cart-dropdown absolute ml-20 right-0 w-[450px] rounded-md shadow-lg mt-3 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto cart-dropdown-animation"
                          : "hidden"
                      }`}
                      onMouseLeave={closeCart}
                    >
                      <div className="cart-items p-4 ">
                        <Cart cart={cart} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl hidden md:block ml-5">
                  <div className="relative inline-block text-left">
                    <Link
                      to={"/history"}
                      onMouseEnter={toggleHistory}
                      className="text-white px-4 py-2 rounded-md  focus:outline-none hover:text-gray-200"
                    >
                      <FaHistory />
                    </Link>
                    <div
                      className={`${
                        isHistoryOpen
                          ? "cart-dropdown absolute ml-20 right-0 w-[450px] rounded-md shadow-lg mt-3 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto cart-dropdown-animation"
                          : "hidden"
                      }`}
                      onMouseLeave={closeHistory}
                    >
                      <div className="cart-items flex justify-center text-center p-4 text-sm">
                        <div clasName="text-center">
                          {" "}
                          <img src={Mt} className="bg-transparent" />
                          <div className="text-gray-500 font-semibold">
                            Fitur ini masih dalam pengembangan.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-4 text-gray-400 text-2xl hidden md:block md:mr-3">
                  |
                </div>
                {loading ? (
                  <div className="lg:flex md:flex hidden ml-3 text-white font-semibold pt-2 right-0 fixed mr-6 pl-2">
                    <div className="h-5 w-5 mt-0 mr-2 ml-2 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]">
                      {/* <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                       Loading...
                     </span> */}
                    </div>
                    <div className="text-center flex justify-center md:hidden items-center">
                      Loading...
                    </div>
                  </div>
                ) : (
                  <>
                    {user.length ? (
                      <div className="md:block hidden mb-7 p-1">
                        {" "}
                        <ul className="flex fixed mr-5 right-0">
                          <li className="">
                            <a
                              className="px-3 flex text-sm rounded-full focus:outline-none"
                              id="user-menu-button"
                              onClick={handleClick}
                              onMouseEnter={toggleOpen}
                            >
                              <div className="relative cursor-pointer text-white">
                                <div>
                                  {/* <UserPicture /> */}
                                  <FaUserAlt className="text-2xl" />
                                </div>
                                {/* <img className="h-10 w-10 rounded-full border border-gray-300 bg-gray-700" /> */}
                                <span
                                  title="online"
                                  className="flex justify-center absolute -bottom-0.5 ltr:right-1 rtl:left-1 text-center bg-green-500 border border-white w-3 h-3 rounded-full"
                                ></span>
                              </div>
                              {/* {users.map((item) => (
                            <span
                              className="hidden md:block ml-1 mr-1 self-center cursor-pointer"
                              key={item._id}
                            >
                              {" "}
                              {item.name}
                            </span>
                          ))} */}
                            </a>

                            <div
                              className={`${
                                isOpenUser
                                  ? "cart-dropdown absolute ml-20  right-0 w-40 rounded-md shadow-lg mt-3 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto cart-dropdown-animation"
                                  : "hidden"
                              }`}
                              onMouseLeave={closeOpen}
                              onClick={handleClick}
                            >
                              <div className="p-2 items-center">
                                {user.map((item) => (
                                  <Link
                                    to={`/profile/${item.id}`}
                                    className="flex w-full  px-4 py-2 text-gray-500 rounded-lg hover:bg-[#6E205E] hover:text-gray-50"
                                    key={item.id}
                                  >
                                    <FaUserAlt className="text-lg m-2" />
                                    <span className="pt-2 pl-1"> Profile</span>
                                  </Link>
                                ))}
                                <button
                                  type="button"
                                  onClick={logout}
                                  className="flex w-full  px-4 py-2 text-gray-500 rounded-lg hover:bg-[#6E205E] hover:text-gray-50"
                                >
                                  <CgLogOut className="text-xl m-2 mt-0" />
                                  Logout
                                </button>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <div className="md:block hidden">
                        <div className="w-full">
                          <Link
                            to={"/"}
                            className="mt-5 py-2.5 px-5  mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-xl border border-[#6E205E] hover:bg-gray-100 hover:text-[#6E205E] focus:ring-4 focus:ring-gray-200"
                          >
                            Login
                          </Link>
                        </div>

                        <div>
                          {/* <Link
                  to={"/"}
                  className="mt-5 py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-white bg-[#6E205E] rounded-xl hover:bg-[#77376a] hover:text-gray-50"
                >
                  SignIn 
                </Link> */}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              {!isSearchExpanded && ( // Tombol akan ditampilkan hanya jika isSearchExpanded adalah false
                <div className="md:hidden">
                  <button
                    onClick={() => {
                      toggleMenu();
                    }}
                    className="text-white hover:text-gray-300 focus:outline-none focus:text-white mt-1.5"
                  >
                    {isOpen ? (
                      <svg
                        className="h-8 w-8 "
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    ) : (
                      <svg
                        className="h-8 w-8 "
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {isOpen ? (
                          <path d="M6 18L18 6M6 6l12 12"></path>
                        ) : (
                          <path d="M4 6h16M4 12h16M4 18h16"></path>
                        )}
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>

            {isOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  <Link
                    to={"/dashboard"}
                    className={`text-white hover:bg-[#853074] hover:text-white flex px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === "/dashboard" ? "bg-[#853074]" : ""
                    }`}
                  >
                    <div className="mt-1">
                      <FaThLarge />
                    </div>{" "}
                    <div className="pl-2">Beranda</div>
                  </Link>
                  <Link
                    to={"/products/keranjang"}
                    className={`text-white hover:bg-[#853074] hover:text-white flex px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === "/products/keranjang"
                        ? "bg-[#853074]"
                        : ""
                    }`}
                  >
                    <div className="mt-1">
                      <FaShoppingCart />
                    </div>{" "}
                    <div className="pl-2">Keranjang</div>
                  </Link>
                  <Link
                    to={"/history"}
                    className={`text-white hover:bg-[#853074] hover:text-white flex px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === "/history" ? "bg-[#853074]" : ""
                    }`}
                  >
                    <div className="mt-1">
                      <FaHistory />
                    </div>{" "}
                    <div className="pl-2">History Transaksi</div>
                  </Link>

                  {user.length ? (
                    <div className="block md:hidden mb-3">
                      {" "}
                      <ul className="">
                        <li className="">
                          {user.map((item) => (
                            <Link
                              to={`/profile/${item.id}`}
                              className={`text-white hover:bg-[#853074] hover:text-white flex px-3 py-2 rounded-md text-base font-medium ${
                                location.pathname === `/profile/${item.id}`
                                  ? "bg-[#853074]"
                                  : ""
                              }`}
                              key={item.id}
                            >
                              <FaUserAlt className="text-lg mt-1" />
                              <span className="pl-2">Profile</span>
                            </Link>
                          ))}

                          <button
                            type="button"
                            onClick={logout}
                            className="text-white w-full hover:bg-[#853074] hover:text-white flex px-3 py-2 rounded-md text-base font-medium"
                          >
                            <CgLogOut className="text-xl " />
                            <span className="pl-2">Logout</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="block md:hidden">
                      <div className="w-full mb-4 mt-4 flex justify-center">
                        <Link
                          to={"/"}
                          className="mt-5 py-2.5 px-5 w-full text-center font-semibold  mb-2 text-sm text-gray-7
                          0 focus:outline-none bg-white rounded-xl border border-[#6E205E] hover:bg-gray-100 hover:text-[#6E205E] focus:ring-4 focus:ring-gray-200"
                        >
                          Login
                        </Link>
                      </div>

                      <div>
                        {/* <Link
                          to={"/"}
                          className="mt-5 py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-white bg-[#6E205E] rounded-xl hover:bg-[#77376a] hover:text-gray-50"
                        >
                          SignIn 
                        </Link> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>
        )}
      </div>
    </>
  );
};

export default Topbar;
