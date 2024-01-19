import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading/Loading";
import Mt from "../../assets/mt.jpg";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import { Navigate, useNavigate } from "react-router-dom";
import { BsRecordFill } from "react-icons/bs";
import PrintReceipt from "../print/PrintReceipt ";
import ReactDOMServer from "react-dom/server";

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
  const [transactionData, setTransactionData] = useState(null);

  const [showPrintReceipt, setShowPrintReceipt] = useState(false);

  // console.log("show", showPrintReceipt);
  // Mendefinisikan urlVendor sebagai state dengan nilai awal kosong
  // ...
  // console.log("data", selectedOutlets);
  useEffect(() => {
    const interval = setInterval(() => {
      setCheckoutTime(new Date());
    }, 1000);
  }, []);
  useEffect(() => {
    handleCheckTaxAndService();
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
  const checkStatusPaymentCz = async () => {
    try {
      const result = await axios.post(
        "https://api-link.cashlez.com/validate_url",
        {
          status: "",
          message: "",
          data: {
            request: {
              generatedUrl: urlVendor,
            },
          },
        }
      );
      console.log("vendor", urlVendor);
      console.log("result.data.data2222", result.data.data);

      // Check if the process status has changed
      // if (
      //   result.data.data &&
      //   result.data.data.response.processStatus === "SUCCESS"
      // ) {
      //   // If the process status is SUCCESS, update the URL vendor and clear the interval
      //   setUrlVendor(result.data.data.response.generatedUrl);
      //   clearInterval(intervalId);
      // }
    } catch (error) {
      console.error("Error in checkStatusPaymentCz:", error);
    }
  };

  useEffect(() => {
    // handlePaymentApprovalActions();
    // setShowPrintReceipt(true);
    // Set an interval to check the status every few seconds (adjust the interval as needed)
    const intervalId = setInterval(() => {
      // checkStatusPaymentCz();
    }, 1000); // Check every 5 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures that this effect runs once after the initial render

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

  const calculateTotalPrice = () => {
    let totalTax = 0;
    let totalService = 0;
    let totalPaymentTotal = 0;
    let totalResultTotal = 0;

    cart.forEach((item) => {
      const resultTotal = item.priceItem * item.totalItem;
      const tax = Math.ceil((resultTotal * taxAndService.tax) / 100);
      const service = Math.ceil((resultTotal * taxAndService.charge) / 100);

      // Calculate addons total
      let addonsTotal = 0;
      if (item.fullDataAddons) {
        addonsTotal = item.fullDataAddons.reduce(
          (accumulator, addon) => accumulator + addon.price,
          0
        );
      }

      const paymentTotal = resultTotal + addonsTotal;

      // Hitung resultAmount
      const resultTotalValue = Math.ceil(paymentTotal + tax + service);

      // Accumulate totals
      totalTax += tax;
      totalService += service;
      totalPaymentTotal += paymentTotal;
      totalResultTotal += resultTotalValue;
    });

    return {
      totalTax,
      totalService,
      totalPaymentTotal,
      totalResultTotal,
    };
  };
  const totalValues = calculateTotalPrice();

  const handlePayment4 = async (nominal) => {
    try {
      setLoading1(true);
      const API_URL = import.meta.env.VITE_API_KEY;
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
      const businessId = cartData.length > 0 ? cartData[0].business_id : null;

      const totalAmount = calculateTotalPrice().totalResultTotal;

      const result = {
        tax: Math.ceil((totalAmount * taxAndService.tax) / 100),
        service: Math.ceil((totalAmount * taxAndService.charge) / 100),
        paymentTotal: totalAmount,
      };

      result.resultAmount = Math.ceil(
        result.paymentTotal + result.tax + result.service
      );

      const response = await axios.get(
        `${API_URL}/api/v1/business-noverify/${businessId}`
      );
      const dataBusiness = response.data.data;
      const transactionData = {
        referenceId: TRANSIDMERCHANT,
        merchantName: dataBusiness.name,
        paymentTotal: result.paymentTotal,
        resultAmount: result.resultAmount,
        transactionUsername: dataBusiness.cz_user,
      };

      setTransactionData(transactionData);

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
            payment_tax: result.tax,
            payment_service: result.service,
            payment_total: result.paymentTotal,
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

        const intervalId = setInterval(async () => {
          const response1 = await axios.post(
            "https://api-link.cashlez.com/validate_url",
            {
              status: "",
              message: "",
              data: {
                request: {
                  generatedUrl: urlVendor,
                },
              },
            }
          );

          if (response1.data.data.response.processStatus === "APPROVED") {
            setLoading1(false);
            setUrlVendor(urlVendor);
            handlePaymentApprovalActions();
            clearInterval(intervalId);
          }
        }, 5000);
      } else {
        setLoading1(false);
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
  const handlePayment6 = async (nominal) => {
    try {
      setLoading1(true);
      const API_URL = import.meta.env.VITE_API_KEY;
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
      const businessId = cartData.length > 0 ? cartData[0].business_id : null;

      const totalAmount = calculateTotalPrice().totalResultTotal;

      const result = {
        tax: Math.ceil((totalAmount * taxAndService.tax) / 100),
        service: Math.ceil((totalAmount * taxAndService.charge) / 100),
        paymentTotal: totalAmount,
      };

      result.resultAmount = Math.ceil(
        result.paymentTotal + result.tax + result.service
      );

      const response = await axios.get(
        `${API_URL}/api/v1/business-noverify/${businessId}`
      );
      const dataBusiness = response.data.data;
      const transactionData = {
        referenceId: TRANSIDMERCHANT,
        merchantName: dataBusiness.name,
        paymentTotal: result.paymentTotal,
        resultAmount: result.resultAmount,
        transactionUsername: dataBusiness.cz_user,
      };

      // Dapatkan URL PDF struk dari server

      setTransactionData(transactionData);

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
            payment_tax: result.tax,
            payment_service: result.service,
            payment_total: result.paymentTotal,
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

        // Start checking the status at intervals
        const intervalId = setInterval(async () => {
          const response1 = await axios.post(
            "https://api-link.cashlez.com/validate_url",
            {
              status: "",
              message: "",
              data: {
                request: {
                  generatedUrl: urlVendor,
                },
              },
            }
          );

          console.log("response1.data.data", response1.data.data);
          console.log(
            "response1.data.data.response.processStatus",
            response1.data.data.response.processStatus
          );

          // Check if the process status has changed
          if (response1.data.data.response.processStatus === "APPROVED") {
            // If the process status is SUCCESS, close the modal and clear the interval
            setLoading1(false);
            setUrlVendor(urlVendor);
            handlePaymentApprovalActions();
            // Generate and display a receipt or perform other actions
            // generateReceipt(response1.data.data.response);

            clearInterval(intervalId);
            // closeModal();
            // Additional code to close the modal or perform any other actions
          }
        }, 5000); // Check every 5 seconds
      } else {
        setLoading1(false);
        // Display an error message if the URL vendor is not found
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

  const generateReceiptText = (paymentData) => {
    // Sesuaikan dengan format struk yang diinginkan
    const referenceId = paymentData?.referenceId || "N/A";
    const merchantName = paymentData?.merchantName || "N/A";
    const resultAmount = paymentData?.amount || 0;

    return `
      ====== Struk Pembayaran ======
      ID Referensi: ${referenceId}
      Merchant: ${merchantName}
      Total Pembayaran: Rp. ${resultAmount}
      ==============================
    `;
  };

  const handlePaymentApprovalActions = async () => {
    localStorage.removeItem("cart");

    // Panggil fungsi untuk mencetak struk
    // setShowPrintReceipt(true);
    printReceipt(transactionData);
    Swal.fire({
      title: "Pembayaran sukses!",
      text: "Text lain sesuai kebutuhan",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      closeModal();
      navigate("/dashboard");
    });
  };

  // useEffect(() => {
  //   // Check if showPrintReceipt is true and trigger printing
  //   if (showPrintReceipt) {
  //     // const printWindow = window.open();
  //     window.print(<PrintReceipt />);

  //     // Optionally, reset showPrintReceipt after printing
  //     setShowPrintReceipt(false);
  //   }
  // }, [showPrintReceipt]);

  const generateReceiptContent = () => {
    // Generate and return the receipt content (HTML structure) here
    // You can use React's renderToString to convert the component to HTML string
    const receiptContent = ReactDOMServer.renderToString(
      <PrintReceipt
        transactionData={transactionData}
        totalValues={totalValues}
        cart={cart}
      />
    );
    return receiptContent;
  };

  const printReceipt = () => {
    const printWindow = window.open("");

    // Get the receipt content
    const receiptContent = generateReceiptContent();

    // Write the content to the print window
    printWindow.document.write(`
      <html>
        <head>
          <style>
            /* Add styles here if needed */
          </style>
        </head>
        <body>
          ${receiptContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };
  const handlePayment5 = async (nominal) => {
    try {
      setLoading1(true);
      const API_URL = import.meta.env.VITE_API_KEY;
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
      const businessId = cartData.length > 0 ? cartData[0].business_id : null;

      const totalAmount = calculateTotalPrice().totalResultTotal;

      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      console.log("cart", calculateTotalPrice().totalResultTotal);
      {
        calculateTotalPrice;
      }
      // const tempItems = [];
      // cartItems.forEach((value) => {
      //   const tempAddons = [];
      //   if (value.fullDataAddons) {
      //     value.fullDataAddons.forEach((value2) => {
      //       tempAddons.push({
      //         id: value2.id,
      //         price: value2.price,
      //       });
      //     });
      //   }
      //   // tempItems.push({
      //   //   sales_type_id: getSalesType,
      //   //   product_id: value.id,
      //   //   addons: tempAddons || [],
      //   //   quantity: value.totalItem,
      //   //   price_product: value.priceItem,
      //   //   price_discount: 0,
      //   //   price_service: 0,
      //   //   price_addons_total: value.totalPriceAddons || 0,
      //   //   price_total: value.totalAmount,
      //   //   notes: value.notes,
      //   // });
      // });
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
        console.log(urlVendor);
        const response1 = await axios.post(
          "https://api-link.cashlez.com/validate_url",
          {
            status: "",
            message: "",
            data: {
              request: {
                generatedUrl: urlVendor,
              },
            },
          }
        );
        console.log("result.data.data", response1.data.data);
        console.log(
          "response1.data.data.response.processStatus",
          response1.data.data.response.processStatus
        );
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
            <h1 className="text-2xl font-semibold mb-4">Pesanan</h1>

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
                            <div key={item.id}>
                              <div className="flex justify-between pl-2">
                                <span>{item.nameItem}</span>
                                <span className="flex items-center">
                                  <span className="w-16 text-right">
                                    {item.totalItem}x
                                  </span>
                                  <span className="w-24 text-right flex-grow">
                                    Rp. {item.priceItem.toLocaleString("id-ID")}
                                  </span>
                                </span>
                              </div>

                              {/* Display addons if they exist */}
                              {item.fullDataAddons &&
                                item.fullDataAddons.length > 0 && (
                                  <ul className="pl-5">
                                    <div className="text-sm font-bold flex">
                                      {" "}
                                      <div className="mt-1.5 mr-1">
                                        <BsRecordFill size={8} />
                                      </div>
                                      Add-On
                                    </div>
                                    {item.fullDataAddons.map((addon) => (
                                      <li
                                        key={addon.id}
                                        className="flex justify-between pl-4 font-semibold"
                                      >
                                        <span> - {addon.name}</span>
                                        <span>
                                          Rp.{" "}
                                          {addon.price.toLocaleString("id-ID")}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </div>
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
      {/* {showPrintReceipt && (
        <PrintReceipt
          transactionData={transactionData}
          totalValues={totalValues}
          cart={cart}
        />
      )} */}
    </div>
  );
}

export default CheckOut;
