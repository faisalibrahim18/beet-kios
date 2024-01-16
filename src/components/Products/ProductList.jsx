import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Category from "../Category/Category";
import Topbar from "../topbar/Topbar";
import { debounce } from "lodash";
import ProductList_ from "../Data/ProductList_";
import SearchProduct from "../search/SearchProduct";
import { useParams } from "react-router-dom";

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/api/v1/product/beetstore?business_id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response);
        setProducts(response.data.data);
        setSearchTerm(response.data.data);

        // Simulate a delay of 2 seconds before hiding loading and displaying data
        setTimeout(() => {
          setLoading(false);
        }, 2000);

        // console.log(response);
      } catch (error) {
        console.log(error.response.data.message);
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

  return (
    <>
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-3 right-4 bg-[#6E205E] hover:bg-[#77376a] text-white p-2 rounded-full shadow-md focus:outline-none"
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
      <Topbar products={products} loading={loading} />

      <div className="pt-20">
        <SearchProduct products={products} setSearchTerm={setSearchTerm} />
      </div>
      <div className="">
        <Category
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
      <div>
        {/* Use the ProductList_ component and pass searchTerm and selectedCategory */}
        <ProductList_
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
      </div>
    </>
  );
};

export default ProductList;
