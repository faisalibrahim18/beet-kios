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
  console.log(selectedCategory);
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
  return (
    <>
      <div className=" mb-5 md:w-full ">
        <div className="text-gray-800 text-center mt-2 font-semibold pb-2">
          Pilihan Category
        </div>
        <div className="">
          <div className=" whitespace-nowrap py-3">
            {/* Konten Swiper di sini */}

            <div className="">
              <Link>
                <div
                  className={`bg-gray-100 text-sm mb-4 font-semibold p-5 hover:bg-gray-300 w-full text-center ${
                    selectedCategory === "all"
                      ? "text-[#091F4B] bg-gray-300 "
                      : ""
                  }`}
                  onClick={() => setSelectedCategory("all")}
                >
                  all
                </div>
              </Link>
            </div>

            {uniqueCategories.map((category) => (
              <div className="">
                <div
                  className={`bg-gray-100 text-sm  font-semibold hover:bg-gray-300 w-full p-5 lowercase cursor-pointer mb-4  text-center ${
                    selectedCategory ===
                    category.Product_Category?.name.toLowerCase()
                      ? " bg-gray-300 text-[#091F4B]"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      category.Product_Category?.name.toLowerCase()
                    )
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