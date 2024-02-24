import React, { useEffect, useState } from "react";
// import bnr_robo from "../../assets/bnr_robo2.png";
import bnr2_robo from "../../assets/banner_.png";
// import bnr2_robo from "../../assets/bnr2_robo.png";
// import bnr2_robo from "../../assets/lgo_r.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { Autoplay, Scrollbar } from "swiper/modules";
import axios from "axios";

const Iklan = () => {
  const [iklan, setIklan] = useState([]);
  const token = localStorage.getItem("token");
  const data_Business = JSON.parse(localStorage.getItem("user"));
  const API_URL = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    getIklan();
  }, []);

  const getIklan = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/ads-image?business_id=${data_Business.business_id}&outlet_id=${data_Business.outlet_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Filter data berdasarkan properti 'active'
      const activeIklan = response.data.data.filter(
        (item) => item.active === true
      );
      setIklan(activeIklan);
      // console.log("iklan", activeIklan);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed z-50 inset-x-0 mx-auto bottom-0 bg-gray-50 pt-2">
      <Swiper
        scrollbar={{
          hide: true,
        }}
        modules={[Autoplay, Scrollbar]}
        className="mySwiper max-w-screen "
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        {/* <SwiperSlide>
          <div className=" sm:h-auto  w-full relative">
            <img
              src={bnr_robo}
              alt="Slider 1"
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide> */}

        {iklan.map((i) => (
          <SwiperSlide>
            <div className=" relative">
              {/* sm:h-auto w-full */}
              <img
                src={`${API_URL}/${i.uri}`}
                alt="Slider 1"
                className=" w-56 h-56 "
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Iklan;
