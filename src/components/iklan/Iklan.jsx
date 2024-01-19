import React from "react";
import bnr from "../../assets/bnr3.png";
import bnr2 from "../../assets/bnr4.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { Autoplay, Scrollbar } from "swiper/modules";

const Iklan = () => {
  return (
    <div className="fixed z-50 inset-x-0 mx-auto bottom-0 bg-gray-50">
      <Swiper
        scrollbar={{
          hide: true,
        }}
        modules={[Autoplay, Scrollbar]}
        className="mySwiper max-w-screen"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        <SwiperSlide>
          <div className="h-[240px] w-full relative">
            <img
              src={bnr}
              alt="Slider 1"
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-[240px] w-full relative">
            <img
              src={bnr2}
              alt="Slider 2"
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Iklan;
