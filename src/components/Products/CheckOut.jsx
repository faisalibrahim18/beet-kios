import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading/Loading";
import Mt from "../../assets/mt.jpg";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import { Navigate, useNavigate } from "react-router-dom";

function CheckOut({
  isOpen,
  closeModal,
  setIsModalOpen,
  selectedItems,
  selectedOutlets,
}) {
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [checkoutTime, setCheckoutTime] = useState(new Date());
  const [TRANSIDMERCHANT] = useState(nanoid(12));
  const [nominal, setNominal] = useState(0);
  const [urlVendor, setUrlVendor] = useState("");
  const [taxAndService, setTaxAndService] = useState({ tax: 0, charge: 0 });
  // Mendefinisikan urlVendor sebagai state dengan nilai awal kosong
  // ...
  // console.log("data", selectedOutlets);
  useEffect(() => {
    const interval = setInterval(() => {
      setCheckoutTime(new Date());
    }, 1000);
  }, []);
  const handleCheckTaxAndService = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_KEY;
      const token = localStorage.getItem("token");
      const resultOutlet = await axios.get(`${API_URL}/api/v1/outlet/304`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("tatatat", resultOutlet);
      let taxPercentage = 0;
      let servicePercentage = 0;
      const resTemp = resultOutlet.data.data;

      if (resTemp.Outlet_Taxes && resTemp.Outlet_Taxes.length > 0) {
        resTemp.Outlet_Taxes.forEach((item) => {
          if (item.Tax.Tax_Type.name === "Tax") {
            taxPercentage = parseInt(item.Tax.value);
          }
          if (item.Tax.Tax_Type.name === "Charge") {
            servicePercentage = parseInt(item.Tax.value);
          }
        });
      }

      console.log("taxPercentage", taxPercentage);
      console.log("servicePercentage", servicePercentage);

      setTaxAndService({ tax: taxPercentage, charge: servicePercentage });
    } catch (error) {
      console.error(error);
      console.log("error handleCheckTaxAndService");
    }
  };
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartData = JSON.parse(localStorage.getItem("cart")) || [];
        const businessIds = cartData.map((item) => item.business_id);
        const businessIdsString = businessIds.join(",");
        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");
        const apiUrlWithQuery = `${API_URL}/api/v1/payment-method/development?businessId=${businessIdsString}`;

        const response = await axios.get(apiUrlWithQuery, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setPayment(response.data.data.rows);
      } catch (error) {
        console.error(error);
      } finally {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1500);
        return () => {
          clearTimeout(timer);
        };
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleCheckTaxAndService();
  }, []);

  const calculateTotalPrice = () => {
    let totalTax = 0;
    let totalService = 0;
    let totalPaymentTotal = 0;
    let totalResultTotal = 0;

    cart.forEach((item) => {
      const resultTotal = item.price * item.quantity;
      const tax = Math.ceil((resultTotal * taxAndService.tax) / 100);
      const service = Math.ceil((resultTotal * taxAndService.charge) / 100);

      const paymentTotal = resultTotal;

      // Hitung resultAmount
      const resultTotalValue = Math.ceil(paymentTotal + tax + service);

      // Accumulate totals
      totalTax += tax;
      totalService += service;
      totalPaymentTotal += paymentTotal;
      totalResultTotal += resultTotalValue;
    });

    // console.log("Total Tax:", totalTax);
    // console.log("Total Service:", totalService);
    // console.log("Total Payment Total:", totalPaymentTotal);
    // console.log("Total Result Total:", totalResultTotal);

    return {
      totalTax,
      totalService,
      totalPaymentTotal,
      totalResultTotal,
    };
  };
  const totalValues = calculateTotalPrice();
  // console.log("data", calculateTotalPrice());

  // const calculateTotalPrice = () => {
  //   let total = 0;
  //   cart.forEach((item) => {
  //     if (
  //       selectedItems.includes(item.id) &&
  //       selectedOutlets.includes(item.business)
  //     ) {
  //       total += item.price * item.quantity;
  //     }
  //   });
  //   return total;
  // };
  // const calculateTotalPrice = () => {
  //   let total = 0;

  //   // Iterasi melalui selectedItems
  //   for (const outletName in selectedItems) {
  //     const selectedItemIds = selectedItems[outletName];
  //     for (const itemId of selectedItemIds) {
  //       // Temukan item yang sesuai dengan itemId
  //       const selectedItem = cart.find((item) => item.id === itemId);

  //       if (selectedItem) {
  //         total += selectedItem.price * selectedItem.quantity;
  //       }
  //     }
  //   }

  //   return total;
  // };

  const handlePayment4 = async (nominal) => {
    try {
      setLoading1(true);
      const API_URL = import.meta.env.VITE_API_KEY;
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
      const businessId = cartData.length > 0 ? cartData[0].business_id : null;
      // console.log(businessId);
      const totalAmount = cartData.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Inisialisasi objek result
      const result = {
        tax: Math.ceil((totalAmount * taxAndService.tax) / 100),
        service: Math.ceil((totalAmount * taxAndService.charge) / 100),
        paymentTotal: totalAmount, // paymentTotal awalnya sama dengan totalAmount
      };

      // Hitung resultAmount
      result.resultAmount = Math.ceil(
        result.paymentTotal + result.tax + result.service
      );

      // const businessId = selectedItemsArray[0].business_id;
      const response = await axios.get(
        `${API_URL}/api/v1/business-noverify/${businessId}`
      );
      const dataBusiness = response.data.data;

      // Update generateSignature dengan menggunakan result
      const generateSignature = {
        data: {
          request: {
            vendorIdentifier: dataBusiness.cz_vendor_identifier,
            token: "",
            referenceId: TRANSIDMERCHANT,
            entityId: dataBusiness.cz_entity_id,
            merchantName: dataBusiness.name,
            merchantDescription: "Cashlez Sunter",
            currencyCode: "IDR",
            payment_tax: result.tax, // Gunakan result.tax
            payment_service: result.service, // Gunakan result.service
            payment_total: result.paymentTotal, // Gunakan result.paymentTotal
            amount: result.resultAmount,
            callbackSuccess: "",
            callbackFailure: "",
            message: "",
            description: "Transaction",
            transactionUsername: dataBusiness.cz_user,
          },
        },
        signature: "",
      };
      // console.log(generateSignature);
      const resSignature = await axios.post(
        "https://api.beetpos.com/api/v1/signature/generate",
        generateSignature
      );
      generateSignature.signature = resSignature.data.data[0].result;

      const generateUrlVendor = await axios.post(
        `${API_URL}/api/v1/signature/generate-url-vendor`,
        generateSignature
      );

      if (generateUrlVendor.data && generateUrlVendor.data.data.response) {
        setLoading1(false);
        const urlVendor = generateUrlVendor.data.data.response.generatedUrl;
        setUrlVendor(urlVendor);
      } else {
        setLoading1(false);
        // Menampilkan pesan kesalahan jika URL vendor tidak ditemukan
        Swal.fire({
          icon: "error",
          title: "Kesalahan",
          text: "Tidak dapat menghasilkan URL vendor. Silakan coba lagi nanti.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };  

  const handlePayment = () => {
    Swal.fire({
      imageUrl: Mt,
      imageWidth: 300,
      imageHeight: 200,
      html: '<p class="text-sm text-gray-400 font-semibold">Fitur Belum Tersedia Saat Ini :(</p>',
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const handlePayment3 = async (event) => {
    const url = event.target.getAttribute("data-url");

    if (url) {
      console.log("URL yang akan diolah:", url);

      try {
        const result = await axios.post(
          "https://api-link.cashlez.com/validate_url",
          {
            status: "",
            message: "",
            data: {
              request: {
                generatedUrl: url,
              },
            },
          }
        );

        console.log("Hasil proses URL:", result.data.data);
        console.log("Status proses:", result.data.data.response.processStatus);
        return result.data.data;
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.error("URL tidak ditemukan");
    }
  };

  const handlePayment1 = async (response) => {
    const API_URL = import.meta.env.VITE_API_KEY;

    try {
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
      const paymentMethods = cartData.map((item) => item.business_id);

      const customer_account_id = localStorage.getItem("user");
      const receiptId = `Pay_${customer_account_id}:${dayjs(new Date()).format(
        "YYYY/MM/DD:HH:mm:ss"
      )}`;
      let paymentMethod;
      let paymentMethodId;

      if (response && response.paymentType) {
        if (response.paymentType.id === 1) {
          paymentMethod = "ecomm";
        } else if (response.paymentType.id === 2) {
          paymentMethod = "virtual";
        } else if (response.paymentType.id === 3) {
          paymentMethod = "ovo";
        } else if (response.paymentType.id === 4) {
          paymentMethod = "qr";
        } else if (response.paymentType.id === 7) {
          paymentMethod = "virtual";
        }
      }

      cartData.forEach((value) => {
        if (value.business_id === paymentMethod) {
          paymentMethodId = value.id;
        }
      });

      const sendData = {
        receipt_id: receiptId,
        items: [],
        outlet_id: 3,
        business_id: 3, // Sesuaikan dengan nilai yang sesuai
        customer_account_id,
        payment_method_id: paymentMethodId,
        payment_discount: 0,
        payment_tax: 0,
        payment_service: 0,
        payment_total: 50000, // Sesuaikan dengan nilai yang sesuai
        amount: 50000, // Sesuaikan dengan nilai yang sesuai
        payment_change: 0,
        invoice: TRANSIDMERCHANT, // Ganti dengan variable yang sesuai
        paymentchannel:
          response && response.paymentType
            ? response.paymentType.code === "ECOMM"
              ? 15
              : response.paymentType.code === "TCASH_QR_PAYMENT"
              ? 0
              : null
            : null,
      };

      const token = localStorage.getItem("token");
      const resTransaction = await axios.post(
        `${API_URL}/api/v1/transaction-customer`,
        sendData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response transaction", resTransaction.data.data);
      console.log("Success topup saldo");
    } catch (error) {
      console.log("Failed topup saldo");
      console.log(error);
    }
  };

  const handlePayment2 = async () => {
    const API_URL = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("token");
    const sendData = {
      receipt_id: "1:23/10/15:09:28:52",
      items: [
        {
          product_id: 151,
          addons: [],
          quantity: 5,
          price_product: 5000,
          price_discount: 0,
          price_service: 0,
          price_addons_total: 1000,
          price_total: 6000,
          notes: "Semangka",
        },
      ],
      outlet_id: 3,
      business_id: 3,
      customer_id: 26,
      payment_method_id: 10,
      payment_discount: 4000,
      payment_tax: 2000,
      payment_service: 1000,
      payment_total: 33000,
      amount: 60900,
      payment_change: 8000,
      invoice: TRANSIDMERCHANT,
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/transaction-customer`,
        sendData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(sendData);
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const allSelectedItems = Object.values(selectedItems).flat();
  const selectedItemsData = cart.filter((item) =>
    selectedItems.includes(item.id)
  );
  // console.log(selectedItemsData);

  const navigate = useNavigate();
  const handleCash = async () => {
    try {
      const confirmation = await Swal.fire({
        icon: "success",
        title: "Pembayaran Cash.",
        text: "Anda yakin ingin menutup modal dan kembali ke dashboard?",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
        customClass: {
          title: "text-md",
        },
      });

      if (confirmation.isConfirmed) {
        closeModal();

        // Pastikan bahwa localStorage.removeItem("cart") berjalan tanpa kesalahan
        localStorage.removeItem("cart");

        // Coba untuk menavigasi
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during navigation:", error);
    }
  };

  const HandleSelesaiPembayaran = async () => {
    try {
      const confirmation = await Swal.fire({
        icon: "success",
        title: "Pembayaran Selesai",
        text: "Pembayaran Anda telah berhasil.",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
        customClass: {
          title: "text-md",
        },
      });

      if (confirmation.isConfirmed) {
        closeModal();

        // Pastikan bahwa localStorage.removeItem("cart") berjalan tanpa kesalahan
        localStorage.removeItem("cart");

        // Coba untuk menavigasi
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during navigation:", error);
    }
  };
  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 overflow-auto">
          <div className="fixed inset-0">
            <div className="absolute inset-0 bg-black opacity-70" />
          </div>
          <div className="relative z-10 w-full max-w-7xl m-5 bg-white shadow-lg rounded-lg lg:p-4 p-3.5 md:p-8">
            <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

            <button
              onClick={closeModal}
              className="absolute top-0 right-0 m-2 px-4 text-5xl py-2  text-[#091F4B] hover:text-[#0C376A] "
            >
              &times;
            </button>

            {loading ? (
              <div className="p-40 flex justify-center">
                <Loading />
              </div>
            ) : (
              <>
                {loading1 ? (
                  <div className="p-40 flex justify-center">
                    <Loading />
                  </div>
                ) : urlVendor ? (
                  <>
                    {" "}
                    {urlVendor && (
                      <div>
                        <iframe
                          src={urlVendor}
                          className="w-full"
                          height="600px"
                          title="Konten Pembayaran"
                          allow="geolocation"
                        />
                        <div className="flex justify-center ">
                          <div className=" mt-5 mr-3">
                            *Jika sudah melakukan pembayaran. diKlik
                          </div>
                          <button
                            className="bg-[#091F4B] p-3 mt-3 text-white rounded-md"
                            onClick={HandleSelesaiPembayaran}
                          >
                            Pembayaran selesai{" "}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="overflow-auto">
                    <div className="mb-4 md:space-x-8">
                      <div className="bg-gray-300 p-3 rounded-lg">
                        <ul>
                          {cart.map((item) => (
                            <li
                              key={item.id}
                              className="flex justify-between pl-2"
                            >
                              <span>{item.name}</span>
                              <span className="flex items-center">
                                <span className="w-16 text-right">
                                  {item.quantity}x
                                </span>
                                <span className="w-24 text-right flex-grow">
                                  Rp. {item.price.toLocaleString("id-ID")}
                                </span>
                              </span>
                            </li>
                          ))}

                          <hr className="border-2 ml-2 border-gray-400 mb-2 mt-2 rounded-lg" />
                          <li className="flex justify-between pl-2">
                            <span>
                              Tax{" "}
                              <span className="ml-1 text-xs">
                                ({taxAndService.tax}%)
                              </span>
                            </span>
                            <span>
                              Rp. {totalValues.totalTax.toLocaleString("id-ID")}
                            </span>
                          </li>
                          <li className="flex justify-between pl-2">
                            <span>
                              Service{" "}
                              <span className="ml-1 text-xs">
                                ({taxAndService.charge}%)
                              </span>
                            </span>
                            <span>
                              Rp.{" "}
                              {totalValues.totalService.toLocaleString("id-ID")}
                            </span>
                          </li>
                        </ul>
                      </div>

                      {/* <hr className="" /> */}
                      <div className="flex justify-between pr-3 pt-2">
                        <span className="font-semibold">Total Harga:</span>
                        <span>
                          Rp.{" "}
                          {totalValues.totalResultTotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {/* Tombol Bayar */}
                    <div className="text-center">
                      <button
                        className="bg-[#091F4B] text-white px-20 py-2 rounded-2xl mr-4 hover-bg-[#8f387d]"
                        onClick={handleCash}
                      >
                        Cash
                      </button>
                      <button
                        className="bg-[#091F4B] text-white px-20 py-2 rounded-2xl hover-bg-[#8f387d]"
                        onClick={() => handlePayment4(nominal)}
                      >
                        QRIS/CARD
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckOut;
