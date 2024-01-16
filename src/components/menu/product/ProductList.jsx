import React, { useEffect, useState } from "react";
import axios from "axios";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Category from "../../Category/Category";
import { debounce } from "lodash";
import ProductList_ from "../../Data/ProductList_";
import SearchProduct from "../../search/SearchProduct";
import ProductNavbar from "../../topbar/ProductNavbar";
import { useParams } from "react-router-dom";
const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState([]);
  const [products, setProducts] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [category, setCategory] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const dataTableParsed = JSON.parse(localStorage.getItem("data_table"));
        const token = localStorage.getItem("token");

        const outletResponse = await axios.get(
          `${API_URL}/api/v1/table-management/table-guest/${dataTableParsed.tableId}/${dataTableParsed.businessId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(outletResponse)
        const outletId = outletResponse.data.data.outlet_id;

        const productResponse = await axios.get(
          `${API_URL}/api/v1/product/emenu?outlet_id=${outletId}&business_id=${dataTableParsed.businessId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(productResponse);
        const categoryProductResponse = await axios.get(
          `${API_URL}/api/v1/product-category/lite?outlet_id=${outletId}&business_id=${dataTableParsed.businessId}`,
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

        const result = productResponse.data.data.filter(
          (val) => val.outlet_id === outletId
        );

        // console.log("data result", result);

        // console.log("category", resCategoryProduct);
        setSearchTerm(result);
        setCategory(resCategoryProduct);
        setProducts(result);
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
    <div>
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
      <ProductNavbar />

      <div className="pt-20">
        <SearchProduct products={products} setSearchTerm={setSearchTerm} />
      </div>
      <div className="">
        <Category
          category={category}
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
    </div>
  );
};

export default ProductList;
