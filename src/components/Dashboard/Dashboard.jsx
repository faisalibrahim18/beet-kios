import bnr from "../../assets/bnr.png";
import bnr2 from "../../assets/bnr2.png";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Outlet from "../Outlet/Outlet";
import Topbar from "../topbar/Topbar";
import { debounce } from "lodash";
import LoadingScreen from "../Loading/LoadingScreen";
const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState([]);
  const [searchTermOutlet, setSearchTermOutlet] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [outlet, setOutlet] = useState([]);
  useEffect(() => {
    const getOutlet = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/v1/business`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const filteredOutlet = response.data.data.filter((item) => {
          // Memeriksa apakah semua properti tidak null
          return (
            item.Location !== null &&
            item.cz_entity_id !== null &&
            item.cz_pin !== null &&
            item.cz_user !== null &&
            item.cz_vendor_identifier !== null
          );
        });
        // console.log(filteredOutlet)
        setOutlet(filteredOutlet);
        setSearchTermOutlet(filteredOutlet);
        setLoading(false);
        // console.log(response);
      } catch (error) {
        if (error.response) {
          setLoading(false);
        }
      }
    };
    getOutlet();

    // Menambahkan event listener untuk memantau posisi scroll halaman
    window.addEventListener("scroll", handleScroll);

    // Membersihkan event listener ketika komponen unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const getProduct = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/api/v1/product/beetstore`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(response.data.data);
        setSearchTerm(response.data.data);
        setLoading(false);
        // console.log(response);
      } catch (error) {
        if (error.response) {
          setLoading(false);
        }
      }
    };
    getProduct();

    // Menambahkan event listener untuk memantau posisi scroll halaman
    window.addEventListener("scroll", handleScroll);

    // Membersihkan event listener ketika komponen unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // useEffect(() => {
  //   const getProduct = async () => {
  //     try {
  //       const API_URL = import.meta.env.VITE_API_KEY;
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get(`${API_URL}/api/v1/business`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }); // Filter data yang memiliki setidaknya satu nilai 'cz' tidak null di semua array
  //       const filteredOutlet = response.data.data.filter((item) => {
  //         // Memeriksa apakah semua properti tidak null
  //         return (
  //           item.cz_entity_id !== null &&
  //           item.cz_pin !== null &&
  //           item.cz_user !== null &&
  //           item.cz_vendor_identifier !== null
  //         );
  //       });

  //       console.log(filteredOutlet);

  //       console.log("filter", response);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   getProduct();
  // }, []);

  // Fungsi untuk menggulir ke atas halaman
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Fungsi yang akan dipanggil saat halaman di-scroll
  const handleScroll = debounce(() => {
    if (window.scrollY > 700) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }, 100); // Gunakan debounce dengan delay 100ms
  // bg-[#6E205E]
  return (
    <>
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#6E205E] hover:bg-[#77376a] text-white p-2 rounded-full shadow-xl focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
      <Topbar
        outlet={outlet}
        setSearchTermOutlet={setSearchTermOutlet}
        products={products}
        loading={loading}
      />
      {loading ? (
        <div className="pt-20 flex text-center justify-center items-center h-screen">
          <LoadingScreen />
        </div>
      ) : (
        <>
          <div className="pt-20 lg:h-80">
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              loop={true}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              pagination={{
                clickable: true,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay, Pagination, Navigation]}
              className="mySwiper max-w-2xl lg:mt-2 md:mt-2 md:rounded-xl lg:rounded-xl flex justify-center items-center relative  group"
            >
              <SwiperSlide>
                <div className="h-full w-full ">
                  <img src={bnr} className="object-cover" alt="Slider 1" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="h-full w-full">
                  <img src={bnr2} className="object-cover" alt="Slider 2" />
                </div>
              </SwiperSlide>
              <div className="swiper-button-prev absolute lg:-left-2.5 md:-left-2.5 shadow-xl transform translate-y-1/2 lg:w-10 lg:h-10 md:w-10 md:h-10 h-7 w-7 bg-white rounded-full flex items-center justify-center cursor-pointer text-white opacity-0 group-hover:bg-white  group-hover:text-[#6E205E] group-hover:shadow group-hover:opacity-100 transition duration-300"></div>
              <div className="swiper-button-next absolute lg:-right-2.5 md:-right-2.5 transform translate-y-1/2 lg:w-10 lg:h-10 md:w-10 md:h-10 h-7 w-7 bg-white rounded-full flex items-center justify-center  cursor-pointer text-white opacity-0 group-hover:bg-white  group-hover:text-[#6E205E] group-hover:shadow  group-hover:opacity-100 transition duration-300"></div>
            </Swiper>
          </div>
          {/* <div>
            <Category
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div> */}
          {/* <div>
            <ProductList
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
            />
          </div> */}
          <div>
            <Outlet searchTermOutlet={searchTermOutlet} />
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
