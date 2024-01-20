import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./style.css"; // Pastikan file style.css sudah terhubung dengan benar
import { Navigation } from "swiper/modules";
import axios from "axios";

const Category = ({ selectedCategory, setSelectedCategory }) => {
  const [categoryData, setCategoryData] = useState([]);
  const { id } = useParams();
  // console.log(selectedCategory);
  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const API_URL = import.meta.env.VITE_API_KEY;
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get(
  //         `${API_URL}/api/v1/customer-app/transaction/emenu?customer_account_id=26&order=newest`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       console.log(response);
  //       // setCategoryData(response.data.data);
  //     } catch (error) {
  //       if (error.response) {
  //         console.log(error.response.data.message);
  //       }
  //     }
  //   };
  //   getData();
  // }, [id]);

  // b 152 o 207
  useEffect(() => {
    const getData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/api/v1/product/beetstore?outlet_id=207&business_id=152`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data.data)
        setCategoryData(response.data.data);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.message);
        }
      }
    };
    getData();
  }, [id]);

  const uniqueCategories = categoryData.filter(
    (category, index, self) =>
      index ===
      self.findIndex(
        (c) => c.Product_Category?.name === category.Product_Category?.name
      )
  );
  // console.log("kategori", uniqueCategories);
  return (
    <>
      <div className=" md:w-full xs:w-[60px] sm:w-[120px] w-[70px] mb-[320px]">
        <div className="text-gray-800 text-center mt-2 font-semibold pb-2 p-2">
          Pilihan Kategori
        </div>
        <div className="">
          <div className="  py-3">
            {/* Konten Swiper di sini */}

            <div className="">
              <Link>
                <div
                  className={`bg-gray-100 text-sm md:mb-4 lg:mb-4 sm:mb-4 mb-1 font-semibold md:p-5 lg:p-5 sm:p-5 p-2 hover:bg-gray-300 w-full text-center ${
                    selectedCategory === "all"
                      ? "text-[#091F4B] bg-gray-300 "
                      : ""
                  }`}
                  onClick={() => setSelectedCategory("all")}
                >
                  Semua
                </div>
              </Link>
            </div>

            {uniqueCategories.map((category) => (
              <div className="">
                <div
                  className={`bg-gray-100 text-sm  font-semibold hover:bg-gray-300 w-full md:p-5 lg:p-5 sm:p-5 p-2  cursor-pointer md:mb-4 lg:mb-4 sm:mb-4 mb-1 text-center ${
                    selectedCategory === category.Product_Category?.name
                      ? " bg-gray-300 text-[#091F4B]"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(category.Product_Category?.name)
                  }
                >
                  {category.Product_Category?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
