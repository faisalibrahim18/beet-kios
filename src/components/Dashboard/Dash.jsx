import React, { useEffect, useState } from "react";
import LoadingProduct from "../Loading/LoadingProduct";
import { Link } from "react-router-dom";
import Pro from "../../assets/pro.jpg";
import Lg from "../../assets/logo.png";
import ProductList_ from "../Data/ProductList_";
import { debounce } from "lodash";
import axios from "axios";
import Category from "../Category/Category";
import Iklan from "../iklan/Iklan";

const Dash = () => {
  const [searchTerm, setSearchTerm] = useState([]);
  const [products, setProducts] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const dataTableParsed = JSON.parse(localStorage.getItem("data_table"));
        const token = localStorage.getItem("token");

        // o_id:207
        // robopark
        // o_id: 304
        // b_id: 223
        // demofnb
        // o_id: 207
        // b_id: 152
        const productResponse = await axios.get(
          `${API_URL}/api/v1/product/emenu?outlet_id=304&business_id=223`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // const response = await axios.get(
        //   `${API_URL}/api/v1/business/223`,
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        // console.log("cek", response)
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
          console.log("dataB", BusinessResponse.data.data);
          // Mendapatkan URL gambar dari respons API
          const imageUrl = BusinessResponse.data.data.image; // Ganti dengan properti yang sesuai dari respons API

          // Menyimpan base64 string ke dalam localStorage
          localStorage.setItem("logo", imageUrl);

          // console.log("Gambar berhasil disimpan di localStorage");
        } catch (error) {
          console.error("Terjadi kesalahan:", error.message);
        }

        const categoryProductResponse = await axios.get(
          `${API_URL}/api/v1/product-category/lite?outlet_id=304&business_id=223`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-[330px] z-50 right-6 bg-[#091F4B] hover:bg-[#0C376A] text-white p-2 rounded-full shadow-xl focus:outline-none"
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
      <div className="flex pt-[50px]">
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
        <div className="flex-grow mt-[40px] pl-[67px] sm:pl-[100px] md:pl-[140px]">
          {/* Gunakan komponen ProductList_ dan teruskan searchTerm dan selectedCategory */}
          <ProductList_
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>

      <div className="">
        <Iklan />
      </div>
    </>
  );
};

export default Dash;
