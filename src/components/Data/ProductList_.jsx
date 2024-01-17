import React, { useEffect, useState } from "react";
import LoadingProduct from "../Loading/LoadingProduct";
import { Link, useNavigate, useParams } from "react-router-dom";
import Pro from "../../assets/pro.jpg";
import Lg from "../../assets/logo.png";
import { BsCartPlus } from "react-icons/bs";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import Iklan from "../iklan/Iklan";

const ProductList_ = ({ searchTerm, selectedCategory }) => {
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [visibleData, setVisibleData] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const { id } = useParams();
  const [cart, setCart] = useState([]);

  const [itemsToShow, setItemsToShow] = useState(
    showMore ? searchTerm.length : 12
  );
  const [quantity, setQuantity] = useState(1);
  const API_URL = import.meta.env.VITE_API_KEY;
  // console.log("dasyidtuas", selectedCategory);

  const [detail, setDetail] = useState(null); // Tambahkan 'detail' ke dalam state

  useEffect(() => {
    const filterProductsByCategory = async () => {
      // Fungsi filterProductsByCategory tetap sama
    };

    // Panggil fungsi filterProductsByCategory
    filterProductsByCategory();
    setLoading(false);
    setLoadingInitial(false);

    // Ambil 'detail' berdasarkan 'id'
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/product/find-product/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setDetail(data.detail);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    // Panggil fetchProductDetail ketika 'id' berubah
    if (id) {
      fetchProductDetail();
    }
  }, [searchTerm, selectedCategory, itemsToShow, id]);

  // Fungsi-fungsi dan bagian lainnya tetap sama

  useEffect(() => {
    const filterProductsByCategory = async () => {
      try {
        let filteredData;

        if (!selectedCategory || selectedCategory === "all") {
          filteredData = searchTerm.slice(0, itemsToShow);
        } else {
          const filtered = searchTerm.filter(
            (product) =>
              product.Product_Category?.name?.toLowerCase() === selectedCategory
          );
          filteredData = filtered.slice(0, itemsToShow);
        }

        setVisibleData(filteredData);
      } catch (error) {
        console.error("Error filtering products:", error);
      } finally {
        setLoadingInitial(false);
      }
    };

    // Call filterProductsByCategory function
    filterProductsByCategory();
    setLoading(false);
    setLoadingInitial(false);
  }, [searchTerm, selectedCategory, itemsToShow]); // Add itemsToShow to the dependency array
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    const token = localStorage.getItem("token");
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
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: quantity,
      };

      const existingItemIndex = cart.findIndex(
        (cartItem) => cartItem.id === itemToAdd.id
      );

      if (existingItemIndex !== -1) {
        // Jika item sudah ada di keranjang, tambahkan hanya jumlahnya
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCart(updatedCart);
        setQuantity(1);
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
        setQuantity(1);
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
  useEffect(() => {
    // Update cart state from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);
  const toggleShowMore = () => {
    setLoadingMore(true);
    setShowMore(!showMore);
    setItemsToShow(!showMore ? searchTerm.length : 12); // Update itemsToShow
    setVisibleData(!showMore ? searchTerm : searchTerm.slice(0, itemsToShow));

    // Simulate waiting time for additional loading (replace with actual API request)
    setTimeout(() => {
      setLoadingMore(false);
    }, 1500);
  };

  // if (loadingInitial) {
  //   return (
  //     <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
  //       <LoadingProduct />
  //       <LoadingProduct />
  //       <LoadingProduct />
  //       <LoadingProduct />
  //       <LoadingProduct />
  //       <LoadingProduct />
  //     </div>
  //   );
  // }
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  return (
    <div className="px-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-6 ">
      <div className="font-bold text-gray-900 mb-3 text-xl">Daftar Produk</div>

      <div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {visibleData.map((item) => (
            <Link
              // to={`/products/detail/${item.id}`}
              className="relative bg-white border rounded-lg shadow hover:shadow-2xl group"
              key={item.id}
            >
              <div className="flex justify-center items-center">
                <img
                  src={item.image == null ? Lg : `${API_URL}/${item.image}`}
                  className="w-auto object-cover md:h-52 h-32 rounded-t-lg"
                  alt={item.name}
                />
              </div>
              <div className="pl-1.5 pr-1.5 pb-1.5 relative">
                <Link to={`/products/detail/${item.id}`}>
                  <div className=" text-sm tracking-tight font-semibold text-gray-900">
                    {item.name}
                  </div>
                </Link>
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
                <div className="flex mt-2 mb-1 text-sm md:justify-evenly">
                  <div className=" md:px-2 px-0.5 py-1 bg-[#091F4B] text-white rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus:outline-none   flex items-center justify-between  md:mr-4 mr-3 ">
                    <button
                      className={` text-white cursor-pointer hover:opacity-70 duration-500 ${
                        quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={decrementQuantity}
                      disabled={quantity === 1}
                    >
                      <FaMinus />
                    </button>
                    <p className="font-bold text-sm text-white md:pl-4 md:pr-4 pr-2 pl-2">
                      {quantity}
                    </p>
                    <button
                      className=" hover:opacity-70 text-white cursor-pointer duration-500"
                      onClick={incrementQuantity}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    className="top-2 right-2 px-2 py-1 bg-[#091F4B] hover:bg-[#0C376A] text-white rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus:outline-none"
                    onClick={() => handleAddToCart(item)}
                  >
                    <BsCartPlus size={20} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div>
          {cart.length > 0 && (
            <div className=" fixed bottom-[270px] right-6 bg-[#091F4B] hover:bg-[#0C376A] text-white p-2 rounded-md shadow-xl focus:outline-none">
              {/* Tambahkan komponen untuk menampilkan item di dalam keranjang */}
              <Link
                to={"/products/keranjang"}
                className="flex items-center justify-between w-full max-w-screen-md p-2"
              >
                <div>
                  {" "}
                  <FaShoppingCart size={30} />
                  <span className="absolute bottom-[35px] right-3 bg-red-500 text-white rounded-full px-1.5 text-sm">
                    {cart.length}
                  </span>{" "}
                </div>
              </Link>
            </div>
          )}
        </div>
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
      </div>
     

     
    </div>
  );
};

export default ProductList_;
