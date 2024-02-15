import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "./style.css";
import axios from "axios";
import { FaXmark } from "react-icons/fa6";

const Category = ({
  isCategoryOpen,
  closeModal,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [categoryData, setCategoryData] = useState([]);
  const [initialCategoryData, setInitialCategoryData] = useState([]);
  const { id } = useParams();
  const [isFavoriteAvailable, setIsFavoriteAvailable] = useState(false);
  const dataBusiness = JSON.parse(localStorage.getItem("user"));

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
          `${API_URL}/api/v1/product/beetstore?outlet_id=${dataBusiness.outlet_id}&business_id=${dataBusiness.business_id}`,
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
      {/* tampilan utama */}
      <div className="md:block sm:block lg:block hidden md:w-full xs:w-[60px] sm:w-[120px] w-[75px] lg:mb-[370px] sm:mb-[270px] md:mb-[250px] mb-[160px]">
        <div className="cursor-context-menu text-gray-800 text-sm text-center font-semibold p-2">
          Pilihan Kategori
        </div>

        <div>
          <div className="py-3">
            <div>
              <div
                className={`bg-gray-100  text-sm cursor-pointer hover:bg-gray-300 w-full p-4 text-center ${
                  selectedCategory === "all"
                    ? "text-[#091F4B] font-medium bg-gray-300 "
                    : ""
                }`}
                onClick={() => {
                  setSelectedCategory("all");
                }}
              >
                Semua
              </div>
            </div>
            {isFavoriteAvailable && (
              <div>
                <div
                  className={`bg-gray-100 text-sm cursor-pointer  hover:bg-gray-300 w-full p-4 text-center ${
                    selectedCategory === "favorite"
                      ? "text-[#091F4B] font-medium bg-gray-300 "
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory("favorite");
                  }}
                >
                  Favorite
                </div>
              </div>
            )}
            {displayCategories.map((category) => (
              <div key={category.Product_Category?.name}>
                <div
                  className={`bg-gray-100 text-sm  hover:bg-gray-300 w-full p-4 cursor-pointer text-center ${
                    selectedCategory === category.Product_Category?.name
                      ? " bg-gray-300 font-medium text-[#091F4B]"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(category.Product_Category?.name);
                  }}
                >
                  {category.Product_Category?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* close tampilan utama */}

      {/* tampilan mobile */}
      {isCategoryOpen && (
        <div className="block md:hidden lg:hidden sm:hidden md:w-full xs:w-[60px] sm:w-[120px] lg:mb-[350px] w-[200px] sm:mb-[270px] md:mb-[250px] mb-[160px]">
          <div className="flex justify-between">
            {" "}
            <div className="text-gray-800 text-md ml-4 font-semibold pb-2 p-2">
              Pilihan Kategori
            </div>
            <button
              className="text-2xl  pr-3 font-semibold"
              onClick={closeModal}
            >
              <FaXmark />
            </button>
          </div>

          <div>
            <div className="py-3">
              <div>
                <div
                  className={`bg-gray-100 text-sm  hover:bg-gray-300 w-full p-3.5 text-center ${
                    selectedCategory === "all"
                      ? "text-[#091F4B] font-medium bg-gray-300 "
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory("all");
                  }}
                >
                  Semua
                </div>
              </div>
              {isFavoriteAvailable && (
                <div>
                  <div
                    className={`bg-gray-100 text-sm  hover:bg-gray-300 w-full p-3.5 text-center ${
                      selectedCategory === "favorite"
                        ? "text-[#091F4B] font-medium bg-gray-300 "
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedCategory("favorite");
                    }}
                  >
                    Favorite
                  </div>
                </div>
              )}
              {displayCategories.map((category) => (
                <div key={category.Product_Category?.name}>
                  <div
                    className={`bg-gray-100 text-sm  hover:bg-gray-300 w-full p-3.5 cursor-pointer text-center ${
                      selectedCategory === category.Product_Category?.name
                        ? " bg-gray-300 font-medium text-[#091F4B]"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedCategory(category.Product_Category?.name);
                    }}
                  >
                    {category.Product_Category?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* tampilan mobile */}
    </>
  );
};

export default Category;
