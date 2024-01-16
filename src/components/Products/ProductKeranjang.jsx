import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import Topbar from "../topbar/Topbar";
import Swal from "sweetalert2";
import Cr from "../../assets/cart.jpg";
import Lg from "../../assets/logo.png";
import CheckOut from "./CheckOut";
import { checkTokenExpiration } from "../../utils/token";
import { Link, useNavigate } from "react-router-dom";
import ProductNavbar from "../topbar/ProductNavbar";
import { BsArrowLeft } from "react-icons/bs";

const ProductKeranjang = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOutlets, setSelectedOutlets] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);

  const API_URL = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  // const handleOutletSelection = (outletName) => {
  //   if (selectedOutlets.includes(outletName)) {
  //     setSelectedOutlets(
  //       selectedOutlets.filter((outlet) => outlet !== outletName)
  //     );
  //     setSelectedItems((prevSelectedItems) =>
  //       prevSelectedItems.filter(
  //         (itemId) =>
  //           !cart.find(
  //             (item) => item.id === itemId && item.business === outletName
  //           )
  //       )
  //     );
  //   } else {
  //     setSelectedOutlets([...selectedOutlets, outletName]);
  //     setSelectedItems((prevSelectedItems) =>
  //       prevSelectedItems.concat(
  //         cart
  //           .filter((item) => item.business === outletName)
  //           .map((item) => item.id)
  //       )
  //     );
  //   }
  // };

  // const handleItemSelection = (itemId) => {
  //   const item = cart.find((cartItem) => cartItem.id === itemId);
  //   if (item) {
  //     if (selectedItems.includes(itemId)) {
  //       setSelectedItems(
  //         selectedItems.filter((selectedItemId) => selectedItemId !== itemId)
  //       );

  //       // Cek apakah masih ada item lain dalam outlet yang dipilih, jika tidak, batalkan pemilihan outlet
  //       if (
  //         !selectedItems.some((selectedItemId) =>
  //           cart.find(
  //             (cartItem) =>
  //               cartItem.business === item.business && selectedItemId !== itemId
  //           )
  //         )
  //       ) {
  //         setSelectedOutlets(
  //           selectedOutlets.filter((outlet) => outlet !== item.business)
  //         );
  //       }
  //     } else {
  //       setSelectedItems([...selectedItems, itemId]);

  //       // Pilih outlet secara otomatis jika belum dipilih
  //       if (!selectedOutlets.includes(item.business)) {
  //         setSelectedOutlets([...selectedOutlets, item.business]);
  //       }
  //     }
  //   }
  // };
  //
  // const handleOutletSelection = (outletName) => {
  //   if (selectedOutlets.includes(outletName)) {
  //     // Outlet sudah dipilih, hilangkan dari daftar pemilihan
  //     setSelectedOutlets(
  //       selectedOutlets.filter((outlet) => outlet !== outletName)
  //     );

  //     // Batalkan pemilihan item yang ada dalam outlet ini
  //     const itemsInOutlet = cart
  //       .filter((item) => item.business === outletName)
  //       .map((item) => item.id);
  //     setSelectedItems(
  //       selectedItems.filter((itemId) => !itemsInOutlet.includes(itemId))
  //     );
  //   } else {
  //     // Outlet belum dipilih, tambahkan ke daftar pemilihan
  //     setSelectedOutlets([...selectedOutlets, outletName]);

  //     // Pilih semua item dalam outlet ini secara otomatis
  //     const selectedItemsInOutlet = cart
  //       .filter((item) => item.business === outletName)
  //       .map((item) => item.id);
  //     setSelectedItems([...selectedItems, ...selectedItemsInOutlet]);
  //   }
  // };

  // const handleItemSelection = (itemId) => {
  //   const item = cart.find((item) => item.id === itemId);
  //   if (item) {
  //     if (selectedItems.includes(itemId)) {
  //       setSelectedItems(
  //         selectedItems.filter((selectedItemId) => selectedItemId !== itemId)
  //       );

  //       // Batalkan pemilihan outlet jika tidak ada item lain dalam outlet ini yang terpilih
  //       const itemsInOutlet = cart
  //         .filter((outletItem) => outletItem.business === item.business)
  //         .map((outletItem) => outletItem.id);

  //       if (
  //         !selectedItems.some((selectedItemId) =>
  //           itemsInOutlet.includes(selectedItemId)
  //         )
  //       ) {
  //         setSelectedOutlets(
  //           selectedOutlets.filter((outlet) => outlet !== item.business)
  //         );
  //       }
  //     } else {
  //       setSelectedItems([...selectedItems, itemId]);

  //       // Pilih outlet secara otomatis jika ada item dalam outlet ini yang terpilih
  //       if (!selectedOutlets.includes(item.business)) {
  //         setSelectedOutlets([...selectedOutlets, item.business]);
  //       }
  //     }
  //   }
  // };

  // const handleItemSelection = (itemId) => {
  //   // Periksa apakah item sudah ada dalam state selectedItems
  //   if (selectedItems.includes(itemId)) {
  //     // Item sudah dipilih, maka hilangkan dari daftar pemilihan
  //     setSelectedItems(selectedItems.filter((item) => item !== itemId));
  //   } else {
  //     // Item belum dipilih, tambahkan ke daftar pemilihan
  //     setSelectedItems([...selectedItems, itemId]);
  //   }
  // };

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
  }, []);

  const calculateTotalPrice = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  const incrementQuantity = (item) => {
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, quantity: cartItem.quantity + 1 };
      }
      return cartItem;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decrementQuantity = (item) => {
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.id === item.id && cartItem.quantity > 1) {
        return { ...cartItem, quantity: cartItem.quantity - 1 };
      }
      return cartItem;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

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
          setClickCounts((prevClickCounts) => {
            const updatedClickCounts = { ...prevClickCounts };
            delete updatedClickCounts[itemId];
            return updatedClickCounts;
          });
          window.location.reload();
        });
      }
    });
  };

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
      // Izinkan untuk membuka modal jika semua kondisi telah terpenuhi
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
    setLoading(false);
  }, []);

  return (
    <>
      <div className="pt-5">
        <div className="mt-6">
          <button
            onClick={() => window.history.back()}
            className="text-xl ml-5"
          >
            <FaArrowLeft />
          </button>
        </div>
        <div className="lg:pl-12 p-5 lg:flex-1 md:flex block">
          <div className="lg:w-2/3 md:w-2/3">
            <h2 className="text-2xl font-bold">Keranjang Belanja</h2>

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
                  <div className="font-semibold text-gray-500">
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
                        className="border p-2 mb-4  border-[#091F4B] rounded-lg mt-2"
                      >
                        <div className="flex items-center">
                          <div>
                            <div
                              // Gunakan outletName dalam URL
                              className="text-lg font-semibold text-gray-900 mt-4"
                            >
                              {outletName}
                            </div>
                          </div>
                        </div>
                        <div>
                          {cart.map((item) => (
                            <div
                              className="flex mt-3 flex-wrap justify-between items-center shadow-[#091F4B] shadow-sm border rounded-lg mb-4 p-2 lg:mx-4"
                              key={item.id}
                            >
                              <div className="flex items-center pl-3">
                                <div className="flex">
                                  <img
                                    src={
                                      item.image == null
                                        ? Lg
                                        : `${API_URL}/${item.image}`
                                    }
                                    alt=""
                                    className="shadow object-cover w-20 h-20 border rounded-md pl-"
                                  />
                                </div>
                              </div>
                              <div className="flex-1 lg:pl-5 lg:pr-20 pt-3 pl-3.5">
                                <div className="mb-2 lg:text-xl md:text-lg text-md font-semibold tracking-tight text-gray-900">
                                  <div> {item.name}</div>
                                </div>
                                <div className="flex items-center py-2 text-lg font-medium text-center text-gray-500">
                                  <button
                                    className={`px-3 py-1 bg-[#091F4B] rounded-full text-white text-sm ${
                                      item.quantity === 1
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    onClick={() => decrementQuantity(item)}
                                    disabled={item.quantity === 1}
                                  >
                                    <FaMinus />
                                  </button>
                                  <p className="font-bold pl-2 pr-2">
                                    {item.quantity}
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
                                  {(item.price * item.quantity).toLocaleString(
                                    "id-ID"
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-end mt-3 lg:mt-0 mr-3">
                                <button
                                  className="bg-[#091F4B] rounded-2xl text-white font-semibold p-1.5 hover-bg-[#8f387d]"
                                  onClick={() => handleRemoveFromCart(item.id)}
                                >
                                  <FaTrashAlt />
                                </button>
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
            <div className="lg:w-1/3  md:w-1/2 md:pt-4">
              <div className="lg:pl-10 md:pl-5 w-full">
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
                      CheckOut
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
