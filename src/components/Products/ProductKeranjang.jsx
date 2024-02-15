import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import Cr from "../../assets/cart.jpg";
import Lg from "../../assets/logo.png";
import CheckOut from "./CheckOut";
import { checkTokenExpiration } from "../../utils/token";
import { Link, useNavigate } from "react-router-dom";
import DetailKeranjang from "./DetailKeranjang";
import { BiDetail } from "react-icons/bi";
import axios from "axios";
import Iklan from "../iklan/Iklan";

const ProductKeranjang = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDetail, setIsModalDetail] = useState(false);
  const [selectedDetailItemId, setSelectedDetailItemId] = useState(null);
  const API_URL = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();

  // opsional bagian selectedOutlets dan selectedItems itu
  // tidak terpakai karna tidak menggunakan checkbox untuk memilih itemnya
  const [selectedOutlets, setSelectedOutlets] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // get data cart dari localstorage
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
  }, []);
  // close get data cart dari localstorage

  // get data detail
  const fetchItemDetails = (itemId) => {
    try {
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];

      const selectedItem = cartData.find((item) => item.id === itemId);

      return selectedItem;
    } catch (error) {
      console.error("Error fetching item details:", error);
      throw error;
    }
  };
  // close get data detail

  //  hitung total data keranjang
  const calculateTotalPrice = () => {
    let total = 0;

    cart.forEach((item) => {
      let productTotal = item.priceItem * item.totalItem;

      let addonsTotal = item.price_addons_total || 0; // Ambil nilai dari price_addons_total

      total += productTotal + addonsTotal;
    });

    return total;
  };

  // const calculateTotalPrice = () => {
  //   let total = 0;

  //   cart.forEach((item) => {
  //     let productTotal = item.priceItem * item.totalItem;

  //     let addonsTotal = 0;
  //     if (item.fullDataAddons) {
  //       addonsTotal = item.fullDataAddons.reduce(
  //         (accumulator, addon) => accumulator + addon.price,
  //         0
  //       );
  //     }

  //     total += productTotal + addonsTotal;
  //   });

  //   return total;
  // };
  // close hitung total data keranjang

  // function menambahkan item
  const incrementQuantity = (item) => {
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.id === item.id) {
        const updatedTotalItem = cartItem.totalItem + 1;
        const updatedTotalAmount = item.priceItem * updatedTotalItem;
        const updateTotalAddons = item.price_addons_total * updatedTotalItem;
        return {
          ...cartItem,
          totalItem: updatedTotalItem,
          quantity: updatedTotalItem,
          totalAmount: updatedTotalAmount,
          price_addons_total: updateTotalAddons,
        };
      }
      return cartItem;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  // close function menambahkan item

  // function mengurangi item
  const decrementQuantity = (item) => {
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.id === item.id && cartItem.totalItem > 1) {
        const updatedTotalItem = cartItem.totalItem - 1;
        const updatedTotalAmount = cartItem.priceItem * updatedTotalItem;

        // Perhitungan total addons
        const updatedTotalAddons = cartItem.fullDataAddons.reduce(
          (total, addon) => total + addon.price * updatedTotalItem,
          0
        );

        return {
          ...cartItem,
          totalItem: updatedTotalItem,
          quantity: updatedTotalItem,
          totalAmount: updatedTotalAmount,
          price_addons_total: updatedTotalAddons,
        };
      }

      return cartItem;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // close function mengurangi item
  const calculateTotalAmount = (cart) => {
    return cart.reduce((total, item) => {
      return total + item.price * item.totalItem;
    }, 0);
  };

  // function hapus data cart
  const handleRemoveFromCart = (itemId) => {
    Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus item ini dari keranjang?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cart.filter((item) => item.id !== itemId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        Swal.fire({
          icon: "success",
          title: "Item Telah Dihapus",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: "text-sm",
          },
        }).then(() => {
          // setClickCounts((prevClickCounts) => {
          //   const updatedClickCounts = { ...prevClickCounts };
          //   delete updatedClickCounts[itemId];
          //   return updatedClickCounts;
          // });
          // window.location.reload();
        });
      }
    });
  };
  // close function hapus data cart

  //  function open modal untuk ke halaman checkout
  const openModal = () => {
    checkTokenExpiration();
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
      setIsModalOpen(true);
    }
  };
  // close function open modal untuk ke halaman checkout

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // function open modal detail Keranjang
  const openModalDetail = (itemId) => {
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
      setIsModalDetail(true);
      setSelectedDetailItemId(itemId);
    }
  };
  // function open modal detail Keranjang

  // function close modal detail Keranjang
  const closeModalDetail = () => {
    setIsModalDetail(false);
  };
  // closefunction close modal detail Keranjang

  //  get data cart dari localstorage
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
    setLoading(false);
  }, []);
  //  get data cart dari localstorage

  return (
    <>
      <div className="pt-5">
        <div className="mt-6 ml-5 text-2xl text-[#091F4B]">
          <Link to={"/dashboard"}>
            <FaArrowLeft />
          </Link>
        </div>
        <div className="lg:pl-12 p-5 lg:flex-1 md:flex block">
          <div className="lg:w-2/3 md:w-2/3">
            <h2 className="text-2xl font-bold cursor-context-menu">
              Keranjang Belanja
            </h2>

            {cart && cart.length === 0 ? (
              <div className="text-center flex justify-center lg:pl-96 md:pl-56">
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={Cr}
                    alt="Keranjang kosong"
                    style={{
                      maxWidth: "70%", // Maksimum lebar gambar adalah lebar container
                      height: "auto", // Tinggi gambar akan menyesuaikan
                      display: "block", // Agar gambar tidak memiliki margin bawah tambahan
                      margin: "0 auto", // Pusatkan gambar horizontal
                    }}
                  />
                  <div className="font-semibold text-gray-500 cursor-context-menu">
                    Keranjang belanja Anda masih kosong.
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {Array.from(new Set(cart.map((item) => item.business))).map(
                  (outletName) => {
                    const filteredItems = cart.filter((item) => {
                      return item.business === outletName && item.business_id;
                    });
                    const groupedItems = {};

                    cart.forEach((item) => {
                      if (item.business === outletName) {
                        if (!groupedItems[item.business_id]) {
                          groupedItems[item.business_id] = [];
                        }
                        groupedItems[item.business_id].push(item.business_id);
                      }
                    });

                    const businessIds = Object.keys(groupedItems);

                    return (
                      <div
                        key={outletName}
                        className="border p-2  border-[#091F4B] rounded-lg mt-2"
                      >
                        {/* <div className="flex items-center">
                          <div>
                            <div
                              // Gunakan outletName dalam URL
                              className="text-lg font-semibold text-gray-900 mt-"
                            >
                              {outletName}
                            </div>
                          </div>
                        </div> */}
                        <div>
                          {cart.map((item) => (
                            <div
                              className="flex flex-wrap justify-between items-center shadow-[#091F4B] shadow-sm border rounded-lg mb-1 mt-4 p-2 lg:mx-4 cursor-context-menu"
                              key={item.id}
                            >
                              <div className="flex items-center pl-3">
                                <div className="flex">
                                  <img
                                    src={
                                      item.imageItem == null
                                        ? Lg
                                        : `${API_URL}/${item.imageItem}`
                                    }
                                    alt=""
                                    className="shadow object-cover w-20 h-20 border rounded-md pl-"
                                  />
                                </div>
                              </div>
                              <div className="flex-1 lg:pl-5 lg:pr-20 pt-3 pl-3.5">
                                <div className="mb-2 lg:text-xl md:text-lg text-md font-semibold tracking-tight text-gray-900">
                                  <div> {item.nameItem}</div>
                                </div>
                                <div className="flex items-center py-2 text-lg font-medium text-center text-gray-500">
                                  <button
                                    className={`px-3 py-1 bg-[#091F4B] rounded-full text-white text-sm ${
                                      item.total === 1
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    onClick={() => decrementQuantity(item)}
                                    disabled={item.totalItem === 1}
                                  >
                                    <FaMinus />
                                  </button>
                                  <p className="font-bold pl-2 pr-2">
                                    {item.totalItem}
                                  </p>
                                  <button
                                    className="px-3 py-1 bg-[#091F4B] rounded-full text-white text-sm"
                                    onClick={() => incrementQuantity(item)}
                                  >
                                    <FaPlus />
                                  </button>
                                </div>
                                <div className="py-2 text-lg text-gray-500">
                                  Rp{" "}
                                  {(
                                    item.priceItem * item.totalItem
                                  ).toLocaleString("id-ID")}
                                </div>
                              </div>
                              <div>
                                {" "}
                                <div className=" lg:mt-0 mr-3 ml-auto">
                                  <button
                                    className="bg-[#091F4B] rounded-2xl p-1.5 mb-2  text-white font-semibold  hover-bg-[#8f387d]"
                                    onClick={() => openModalDetail(item.id)}
                                  >
                                    <BiDetail />
                                  </button>
                                </div>
                                <div className="  lg:mt-0 mr-2">
                                  <button
                                    className="bg-[#091F4B] rounded-2xl text-white font-semibold p-1.5 hover-bg-[#8f387d]"
                                    onClick={() =>
                                      handleRemoveFromCart(item.id)
                                    }
                                  >
                                    <FaTrashAlt />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
          {cart && cart.length === 0 ? (
            <div></div>
          ) : (
            <div className="lg:w-1/3 md:w-1/2 md:pt-4">
              {/* <div>
                <h1 className="text-2xl font-bold mb-4 ml-10">
                  Struk Pembelian
                </h1>
                <PrintReceipt cart={cart} />

                <div className="mt-4 ml-32">
                  <button
                    // onClick={handlePrint}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cetak Struk
                  </button>
                </div>
              </div> */}
              <div className="lg:pl-10 md:pl-5 w-full cursor-context-menu">
                <div className="border border-[#091F4B] mt-8 p-3 rounded-2xl">
                  <div className="flex">
                    <div className=" text-gray-500 md:w-2/3 w-3/4">
                      <div>Total Harga :</div>
                    </div>
                    <div className="">
                      <div>
                        Rp {calculateTotalPrice().toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-10 ">
                  <div className="w-full">
                    <button
                      onClick={openModal}
                      className="bg-[#091F4B] w-full text-white px-20 py-2 rounded-2xl hover-bg-[#8f387d]"
                    >
                      Bayar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalDetail && (
        <DetailKeranjang
          itemId={selectedDetailItemId}
          onClose={closeModalDetail}
          fetchItemDetails={fetchItemDetails}
        />
      )}
      {isModalOpen && (
        <CheckOut
          isOpen={isModalOpen}
          closeModal={closeModal}
          loading={loading}
          selectedItems={selectedItems} // Pass selected item IDs to the Checkout component
          selectedOutlets={selectedOutlets} // Pass selected item IDs to the Checkout component
        />
      )}
    </>
  );
};

export default ProductKeranjang;
