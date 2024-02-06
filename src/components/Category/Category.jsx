import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "./style.css";
import axios from "axios";

const Category = ({ selectedCategory, setSelectedCategory }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [initialCategoryData, setInitialCategoryData] = useState([]);
  const { id } = useParams();
  const [isFavoriteAvailable, setIsFavoriteAvailable] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");
        // o_id:207
        // robopark
        // o_id: 304
        // b_id: 223
        // demofnb
        // o_id: 207
        // b_id: 152 by
        const response = await axios.get(
          `${API_URL}/api/v1/product/beetstore?outlet_id=207&business_id=152`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategoryData(response.data.data);

        // Simpan data awal
        if (initialCategoryData.length === 0) {
          setInitialCategoryData(response.data.data);
        }

        // Hitung jumlah kategori favorit yang ada
        const favoriteCount = response.data.data.filter(
          (category) => category.is_favorite
        ).length;

        // Set nilai isFavoriteAvailable
        setIsFavoriteAvailable(
          selectedCategory === "favorite" || favoriteCount > 0
        );
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.message);
        }
      }
    };
    getData();
  }, [id]);

  // Filter data kategori
  const uniqueCategories = categoryData.filter(
    (category, index, self) =>
      index ===
      self.findIndex(
        (c) => c.Product_Category?.name === category.Product_Category?.name
      )
  );

  // Filter data favorit
  // const favoriteCategories = uniqueCategories.filter(
  //   (category) => category.is_favorite
  // );

  // Tentukan data yang akan ditampilkan berdasarkan apakah kategori favorit dipilih
  const displayCategories = uniqueCategories;

  return (
    <>
      <div className=" md:w-full xs:w-[60px] sm:w-[120px] w-[75px] lg:mb-[350px] sm:mb-[270px] md:mb-[250px] mb-[160px]">
        <div className="text-gray-800 md:text-sm text-xs text-center mt-2 font-semibold pb-2 p-2">
          Pilihan Kategori
        </div>
        <div>
          <div className="py-3">
            <div className="">
              <Link>
                <div
                  className={`bg-gray-100 md:text-sm text-xs md:mb-4 lg:mb-4 sm:mb-4 mb-1 font-semibold md:p-5 lg:p-5 sm:p-5 p-2.5 hover:bg-gray-300 w-full text-center ${
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
            <div className="">
              <Link>
                {isFavoriteAvailable && (
                  <div
                    className={`bg-gray-100 md:text-sm text-xs md:mb-4 lg:mb-4 sm:mb-4 mb-1 font-semibold md:p-5 lg:p-5 sm:p-5 p-2.5 hover:bg-gray-300 w-full text-center ${
                      selectedCategory === "favorite"
                        ? "text-[#091F4B] bg-gray-300 "
                        : ""
                    }`}
                    onClick={() => setSelectedCategory("favorite")}
                  >
                    Favorite
                  </div>
                )}
              </Link>
            </div>
            {/* Data dari kategori */}
            {displayCategories.map((category) => (
              <div className="" key={category.Product_Category?.name}>
                <div
                  className={`bg-gray-100 md:text-sm text-xs font-semibold hover:bg-gray-300 w-full md:p-5 lg:p-5 sm:p-5 p-2.5  cursor-pointer md:mb-4 lg:mb-4 sm:mb-4 mb-1 text-center ${
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
            {/* Tutup data dari kategori */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
