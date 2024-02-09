import React, { useEffect, useState } from "react";
import LoadingProduct from "../Loading/LoadingProduct";
import { Link, useNavigate, useParams } from "react-router-dom";
import Pro from "../../assets/pro.jpg";
import Lg from "../../assets/logo.png";
import { BsCartPlus, BsFillStarFill } from "react-icons/bs";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import Iklan from "../iklan/Iklan";

const ProductList_ = ({ openModal, searchTerm, selectedCategory, favorite }) => {
  const [showMore, setShowMore] = useState(false);
  const [visibleData, setVisibleData] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const { id } = useParams();
  const [cart, setCart] = useState([]);
  const [notes, setNotes] = useState("");
  const [isFavoriteAvailable, setIsFavoriteAvailable] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(
    showMore ? searchTerm.length : 12
  );
  const [totalItem, setTotalItem] = useState(1);
  const API_URL = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();

  // Di dalam useEffect pada komponen ProductList_
  useEffect(() => {
    const filterProductsByCategory = async () => {
      try {
        let filteredData;

        if (selectedCategory === "favorite") {
          // Filter berdasarkan produk favorit
          filteredData = searchTerm.filter((item) => item.is_favorite);
          setIsFavoriteAvailable(filteredData.length > 0);
        } else if (selectedCategory === "all") {
          // Tampilkan semua produk jika kategori "all" dipilih
          filteredData = searchTerm;
        } else {
          // Filter berdasarkan kategori yang dipilih
          filteredData = searchTerm.filter(
            (item) => item.Product_Category?.name === selectedCategory
          );
        }

        setVisibleData(filteredData.slice(0, itemsToShow));
      } catch (error) {
        console.error("Error filtering products:", error);
      }
    };

    // Panggil fungsi filterProductsByCategory
    filterProductsByCategory();
  }, [searchTerm, selectedCategory, itemsToShow]);

  // useEffect(() => {
  //   const filterProductsByCategory = async () => {
  //     try {
  //       let filteredData;

  //       if (!selectedCategory || selectedCategory === "all") {
  //         filteredData = searchTerm.slice(0, itemsToShow);
  //       } else {
  //         const filtered = searchTerm.filter(
  //           (item) => item.Product_Category?.name === selectedCategory
  //         );
  //         filteredData = filtered.slice(0, itemsToShow);
  //       }

  //       setVisibleData(filteredData);
  //     } catch (error) {
  //       console.error("Error filtering products:", error);
  //     } finally {
  //       setLoadingInitial(false);
  //     }
  //   };

  //   // Call filterProductsByCategory function
  //   filterProductsByCategory();
  //   setLoading(false);
  //   setLoadingInitial(false);
  // }, [searchTerm, selectedCategory, itemsToShow]);
  // close filter category

  // function handle add to cart
  const handleAddToCart = (item) => {
    const token = localStorage.getItem("token");
    console.log("dataaa", item);
    if (!token) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "warning",
        text: "Anda harus Login Terlebih dahulu!",
      });
      navigate("/");
    } else {
      const itemToAdd = {
        id: item.id,
        business_id: item.business_id,
        outlet_id: item.outlet_id,
        nameItem: item.name,
        priceItem: item.price,
        descriptionItem: item.description || null,
        imageItem: item.image || null,
        totalItem: totalItem,
        updateAddons: [],
        fullDataAddons: [],
        fullDataProduct: item,
        allAddons: [],
        addons: [],
        sales_type_id: 1,
        totalAmount: item.price * totalItem,
        notes: notes,
        product_id: item.id,
        // addons: [],
        quantity: totalItem,
        price_product: item.price,
        price_discount: 0,
        price_service: 0,
        price_addons_total: 0 || 0,
        price_total: item.price * totalItem,
      };

      const existingItemIndex = cart.findIndex(
        (cartItem) => cartItem.id === itemToAdd.id
      );

      if (existingItemIndex !== -1) {
        // Jika item sudah ada di keranjang, tambahkan hanya jumlahnya
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCart(updatedCart);
        setTotalItem(1);
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        Swal.fire({
          icon: "success",
          title: "Item Ditambahkan ke Keranjang",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: "text-sm",
          },
        });
      } else {
        // Jika item belum ada di keranjang, tambahkan sebagai item baru
        const updatedCart = [...cart, itemToAdd];
        setCart(updatedCart);
        setTotalItem(1);
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        Swal.fire({
          icon: "success",
          title: "Item Ditambahkan ke Keranjang",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: "text-lg",
          },
        });
      }
    }
  };
  // close function handle add to cart

  // get data cart localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);
  // get data cart localStorage

  // function button show muat lebih banyak/tampilkan kurang
  const toggleShowMore = () => {
    setLoadingMore(true);
    setShowMore(!showMore);
    setItemsToShow(!showMore ? searchTerm.length : 12); // Update itemsToShow
    setVisibleData(!showMore ? searchTerm : searchTerm.slice(0, itemsToShow));

    // setTimeout(() => {
    //   setLoadingMore(false);
    // }, 1500);

    setLoadingMore(false);
  };
  // close function button show muat lebih banyak/tampilkan kurang

  // function tambah data
  const incrementQuantity = () => {
    setTotalItem(totalItem + 1);
  };
  // close function tambah data

  // function ngurangi data
  const decrementQuantity = () => {
    if (totalItem > 1) {
      setTotalItem(totalItem - 1);
    }
  };
  //close  function ngurangi data
  return (
    <div className="px-2 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-6 ">
      <div className="flex justify-between font-bold text-gray-900 mb-3 md:text-xl text-lg sm:ml-0 md:ml-0 lg:ml-0 ml-1">
        <div>Daftar Produk</div>
        <div className="flex">
          <div>Category</div>
          <div onClick={openModal}>...</div>
        </div>
      </div>

      <div>
        {/* data produk */}

        <div className="mb-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:gap-6 lg:gap-6 sm:gap-6 gap-2">
          {visibleData.map((item) => (
            <div
              className="relative bg-white border rounded-lg shadow hover:shadow-2xl group"
              key={item.id}
            >
              <div className="flex justify-center items-center">
                <Link to={`/products/detail/${item.id}`}>
                  <img
                    src={item.image == null ? Lg : `${API_URL}/${item.image}`}
                    className="w-auto object-cover sm:h-40 md:h-52 h-32 rounded-t-lg"
                  />
                </Link>
              </div>
              <div className=" relative">
                <div className="sm:pl-3 pl-2 pr-1 sm:pr-3 pb-1.5 flex justify-between">
                  <div>
                    <div>
                      <div className=" text-sm tracking-tight font-semibold text-gray-900">
                        {item.name}
                      </div>
                    </div>
                    <div className="flex">
                      {item && item.Product_Category && (
                        <p className="text-sm lowercase rounded-lg font-normal text-gray-400 flex">
                          {item.Product_Category.name}
                        </p>
                      )}
                    </div>
                    <div className="inline-flex items-center text-sm font-medium text-center text-black">
                      Rp {item.price.toLocaleString("id-ID")}
                      {/* Move the button here */}
                    </div>
                  </div>
                  {item.is_favorite && (
                    <div className="mt-1 text-yellow-500">
                      <BsFillStarFill />
                    </div>
                  )}
                </div>
                {/* button tambahkan ke keranjang dan menambah, mengurangi item */}
                <div className="flex mt-2 mb-2 ml-2 mr-3 text-sm md:justify-evenly sm:justify-between">
                  <div className=" md:px-2 sm:px-6 px-1.5 py-1 bg-[#091F4B] text-white rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus:outline-none   flex items-center justify-between  md:mr-4 sm:mr-4 mr-3 ">
                    <button
                      className={`sm:mr-2 text-white cursor-pointer hover:opacity-70 duration-500 ${
                        totalItem === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={decrementQuantity}
                      disabled={totalItem === 1}
                    >
                      <FaMinus />
                    </button>
                    <p className="font-bold text-sm text-white md:pl-4 md:pr-4 pr-2 pl-2">
                      {totalItem}
                    </p>
                    <button
                      className="sm:ml-2  hover:opacity-70 text-white cursor-pointer duration-500"
                      onClick={incrementQuantity}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    className="top-2 right-2 px-2 py-1 bg-[#091F4B] hover:bg-[#0C376A] text-white rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus:outline-none"
                    onClick={() => handleAddToCart(item)}
                  >
                    <BsCartPlus size={25} />
                  </button>
                </div>
                {/* close button tambahkan ke keranjang dan menambah, mengurangi item */}
              </div>
            </div>
          ))}
        </div>
        {!isFavoriteAvailable && selectedCategory === "favorite" && (
          <div className="text-gray-500 font-semibold text-center flex items-center justify-center">
            <div>
              <img src={Pro} alt="" className="w-96" />
              <span> Data favorit tidak tersedia.</span>
            </div>
          </div>
        )}

        {/* close data product */}

        {/* button keranjang */}
        <div>
          {cart.length > 0 && (
            <div className=" fixed sm:bottom-[255px] md:bottom-[190px] lg:bottom-[285px] bottom-[90px] right-6 bg-[#091F4B] hover:bg-[#0C376A] text-white lg:p-2 md:p-2 sm:p-2 p-1 rounded-md shadow-xl focus:outline-none">
              {/* Tambahkan komponen untuk menampilkan item di dalam keranjang */}
              <Link
                to={"/products/keranjang"}
                className="flex items-center justify-between w-full max-w-screen-md p-2"
              >
                <div>
                  {" "}
                  <div className="lg:text-3xl md:text-3xl sm:text-3xl text-2xl">
                    <FaShoppingCart />
                  </div>
                  <span className="absolute lg:bottom-[35px] md:bottom-[35px] sm:bottom-[35px] bottom-[28px] right-2 lg:right-3 md:right-3 sm:right-3 bg-red-500 text-white rounded-full px-1.5  sm:px-1.5 text-xs lg:text-sm md:text-sm sm:text-sm">
                    {cart.length}
                  </span>{" "}
                </div>
              </Link>
            </div>
          )}
        </div>
        {/* close button keranjang */}

        {/* button muat lebih banyak/tampilkan kurang */}
        <div>
          {visibleData.length >= 12 && (
            <div className="flex justify-center mt-6 mb-8">
              {visibleData.length > 3 && (
                <div>
                  <button
                    onClick={toggleShowMore}
                    className="px-4 py-2 rounded-lg font-bold text-[#091F4B] focus:outline-none bg-white border border-[#091F4B] hover:bg-gray-100 hover:text-[#091F4B] focus:z-10 focus:ring-4 focus:ring-gray-200"
                  >
                    {loadingMore ? (
                      <div className="flex justify-center">
                        <div className="h-4 w-4 mt-1 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        <div>Loading...</div>
                      </div>
                    ) : showMore ? (
                      "Tampilkan Kurang"
                    ) : (
                      "Muat Lebih Banyak"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* button muat lebih banyak/tampilkan kurang */}
      </div>
    </div>
  );
};

export default ProductList_;
