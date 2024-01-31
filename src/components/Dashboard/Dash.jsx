import React, { useEffect, useState } from "react";
import ProductList_ from "../Data/ProductList_";
import { debounce } from "lodash";
import axios from "axios";
import Category from "../Category/Category";
import Iklan from "../iklan/Iklan";

const Dash = () => {
  const [searchTerm, setSearchTerm] = useState([]);

  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [category, setCategory] = useState([]);

  // get data logo, product dan category
  useEffect(() => {
    const getProduct = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const dataTableParsed = JSON.parse(localStorage.getItem("data_table"));
        const token = localStorage.getItem("token");

        // const product1 = await axios.get(
        //   `${API_URL}/api/v1/kitchen-management?business_id=152&outlet_id=207`,
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        // console.log("kitchen", product1);
        // get logo untuk di taro di localStorage
        try {
          // Mendapatkan respons dari API
          const BusinessResponse = await axios.get(
            `${API_URL}/api/v1/business/223`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log("dataB", BusinessResponse.data.data);
          // Mendapatkan URL gambar dari respons API
          const imageUrl = BusinessResponse.data.data.image; // Ganti dengan properti yang sesuai dari respons API

          // Menyimpan base64 string ke dalam localStorage
          localStorage.setItem("logo", imageUrl);

          // console.log("Gambar berhasil disimpan di localStorage");
        } catch (error) {
          console.error("Terjadi kesalahan:", error.message);
        }
        // close get logo untuk di taro di localStorage

        // o_id:207
        // robopark
        // o_id: 304
        // b_id: 223
        // demofnb
        // o_id: 207
        // b_id: 152

        // get data product
        const productResponse = await axios.get(
          `${API_URL}/api/v1/product/emenu?outlet_id=207&business_id=152`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //  close get data product

        // get data category
        const categoryProductResponse = await axios.get(
          `${API_URL}/api/v1/product-category/lite?outlet_id=207&business_id=152`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // close get data category

        const resCategoryProduct = categoryProductResponse.data.data.filter(
          (value) => value.Products.length > 0 && !value.hidden
        );

        setSearchTerm(productResponse.data.data);
        setCategory(resCategoryProduct);
      } catch (error) {
        console.log(error);
      }
    };

    getProduct();
    window.addEventListener("scroll", handleScroll);

    // Membersihkan event listener ketika komponen unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // close get data logo, product dan category

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
  }, 100);

  return (
    <>
      {/* button scroll top */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed sm:bottom-[330px] lg:bottom-[360px]  md:bottom-[265px] bottom-[150px]  z-50 right-6 bg-[#091F4B] hover:bg-[#0C376A] text-white p-2 rounded-full shadow-xl focus:outline-none"
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
      {/* close  button scroll top */}

      {/* data product dan category */}
      <div className="flex pt-[50px]">
        {/* data category */}
        <div
          className={`bg-gray-100 flex-grow  pt-5 shadow h-full mt-[50px] z-50 fixed ${
            category.length > 0
              ? "overflow-auto scroll-m-1.5"
              : "overflow-hidden"
          }`}
        >
          <Category
            category={category}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
        {/* close data category */}

        {/* data product */}
        <div className="flex-grow mt-[40px] pl-[70px] sm:pl-[100px] md:pl-[140px]">
          <ProductList_
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
          />
        </div>
        {/* close data product */}
      </div>
      {/* close data product dan category */}

      <div className="">
        <Iklan />
      </div>
    </>
  );
};

export default Dash;
