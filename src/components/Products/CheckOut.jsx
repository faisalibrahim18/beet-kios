import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading/Loading";
import Mt from "../../assets/mt.jpg";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { BsRecordFill } from "react-icons/bs";
import PrintReceipt from "../print/PrintReceipt ";
import ReactDOMServer from "react-dom/server";

function CheckOut({ isOpen, closeModal }) {
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [TRANSIDMERCHANT] = useState(nanoid(12));
  const [nominal, setNominal] = useState(0);
  const [urlVendor, setUrlVendor] = useState("");
  const [taxAndService, setTaxAndService] = useState({ tax: 0, charge: 0 });
  const [transactionData, setTransactionData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("Transaction Data Updated:", transactionData);
  }, [transactionData]);

  const [counter, setCounter] = useState(() => {
    // Get the counter value from localStorage or default to 1
    const storedCounter = parseInt(localStorage.getItem("counter")) || "01";
    return storedCounter;
  });

  const formatNumber = (number, length) => {
    let formattedNumber = number.toString();
    while (formattedNumber.length < length) {
      formattedNumber = "0" + formattedNumber;
    }
    return formattedNumber;
  };

  const resetCounterAt10PM = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (hours === 22 && minutes === 0 && seconds === 0) {
      setCounter(formatNumber(1, 2)); // Menggunakan formatNumber untuk memastikan dua digit
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("counter", counter);
      resetCounterAt10PM();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []); // Menghapus dependensi [counter]

  useEffect(() => {
    localStorage.setItem("counter", counter.toString());
  }, [counter]);
  const incrementCounter = () => {
    setCounter((prevCounter) => prevCounter + 1);
    // setCounter((prevCounter) => {
    //   // Increment the counter as a string and then format to ensure two digits
    //   const newCounter = formatNumber(parseInt(prevCounter, 10) + 1);
    //   return newCounter;
    // });
  };

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
      // console.log("tatatat", resultOutlet);
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

      // console.log("taxPercentage", taxPercentage);
      // console.log("servicePercentage", servicePercentage);

      setTaxAndService({ tax: taxPercentage, charge: servicePercentage });
    } catch (error) {
      console.error(error);
      console.log("error handleCheckTaxAndService");
    }
  };

  useEffect(() => {
    // handlePaymentApprovalActions();
    // incrementCounter();
    const intervalId = setInterval(() => {}, 1000);

    return () => clearInterval(intervalId);
  }, []);

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

  const handlePayment4 = async () => {
    try {
      setLoading1(true);
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_KEY;
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
      const userId = JSON.parse(localStorage.getItem("user")) || [];
      const businessId = cartData.length > 0 ? cartData[0].business_id : null;
      const outletId = cartData.length > 0 ? cartData[0].outlet_id : null;

      const totalAmount = calculateTotalPrice().totalResultTotal;
      const result = {
        tax: Math.ceil((totalAmount * taxAndService.tax) / 100),
        service: Math.ceil((totalAmount * taxAndService.charge) / 100),
        paymentTotal: totalAmount,
      };

      result.resultAmount = Math.ceil(result.paymentTotal);
      const response = await axios.get(
        `${API_URL}/api/v1/business-noverify/${businessId}`
      );
      const response3 = await axios.get(
        `${API_URL}/api/v1/outlet/${outletId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataOutlet = response3.data.data;

      const dataBusiness = response.data.data;

      const transactionData = {
        referenceId: TRANSIDMERCHANT,
        address: dataOutlet.address,
        merchantName: dataBusiness.name,
        paymentTotal: result.paymentTotal,
        resultAmount: result.resultAmount,
        transactionUsername: dataBusiness.cz_user,
      };
      // incrementCounter();
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
      // const generateReceiptId = () => {
      //   const now = new Date();
      //   const year = String(now.getFullYear()).slice(-2); // Ambil dua digit terakhir tahun
      //   const month = String(now.getMonth() + 1).padStart(2, "0"); // Bulan (indeks dimulai dari 0)
      //   const day = String(now.getDate()).padStart(2, "0"); // Hari
      //   const hours = String(now.getHours()).padStart(2, "0");
      //   const minutes = String(now.getMinutes()).padStart(2, "0");
      //   const seconds = String(now.getSeconds()).padStart(2, "0");

      //   // Gabungkan elemen-elemen untuk membentuk receipt ID
      //   const receiptId = `1:${year}/${month}/${day}:${hours}:${minutes}:${seconds}`;

      //   return receiptId;
      // };

      // Contoh penggunaan
      // const receiptId = generateReceiptId();
      // console.log(receiptId);

      // const sendData = {
      //   receipt_id: receiptId,
      //   items: cartData,
      //   outlet_id: outletId,
      //   business_id: businessId,
      //   customer_id: userId,
      //   sales_type_id: null || [],
      //   payment_method_id: null,
      //   payment_discount: null,
      //   payment_tax: result.tax,
      //   payment_service: result.service,
      //   payment_total: result.paymentTotal,
      //   amount: result.resultAmount,
      //   payment_change: 0,
      //   invoice: TRANSIDMERCHANT,
      //   status: "Done",
      // };
      // console.log("datasend", sendData);
      // const response1 = await axios.post(
      //   `${API_URL}/api/v1/transaction-customer`,
      //   sendData,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // console.log("datasend", response1);
      const resSignature = await axios.post(
        "https://api.beetpos.com/api/v1/signature/generate",
        generateSignature
      );
      generateSignature.signature = resSignature.data.data[0].result;

      const generateUrlVendor = await axios.post(
        `${API_URL}/api/v1/signature/generate-url-vendor`,
        generateSignature
      );
      // handlePaymentApprovalActions(transactionData);
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
            handlePaymentApprovalActions(transactionData);
            clearInterval(intervalId);
            // setCounter((prevCounter) => prevCounter + 1);
            // const sendData = {
            //   receipt_id: receiptId,
            //   items: cartData,
            //   outlet_id: outletId,
            //   business_id: businessId,
            //   customer_id: userId,
            //   sales_type_id: null || [],
            //   payment_method_id: null,
            //   payment_discount: null,
            //   payment_tax: result.tax,
            //   payment_service: result.service,
            //   payment_total: result.paymentTotal,
            //   amount: result.resultAmount,
            //   payment_change: 0,
            //   invoice: TRANSIDMERCHANT,
            //   status: "Done",
            // };
            // // console.log("datasend", sendData);
            // const response1 = await axios.post(
            //   `${API_URL}/api/v1/transaction-customer`,
            //   sendData,
            //   {
            //     headers: {
            //       "Content-Type": "application/json",
            //       Authorization: `Bearer ${token}`,
            //     },
            //   }
            // );

            // console.log("datasend", response1);
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

  const handlePaymentApprovalActions = async (transactionData) => {
    // Panggil fungsi untuk mencetak struk
    // setShowPrintReceipt(true);
    // generateReceiptContent();
    printReceipt(transactionData);
    Swal.fire({
      title: "Pembayaran sukses!",
      text: "Text lain sesuai kebutuhan",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      localStorage.removeItem("cart");

      closeModal();
      navigate("/dashboard");
    });
  };

  const generateReceiptContent = (transactionData) => {
    const tax = taxAndService.tax;
    const service = taxAndService.charge;
    const totaltax = totalValues.totalTax;
    const total = totalValues.totalResultTotal;
    const cartData1 = JSON.parse(localStorage.getItem("cart")) || [];

    // console.log("Value of transactionData:", transactionData);

    const receiptContent = ReactDOMServer.renderToString(
      <PrintReceipt
        cart={cartData1}
        tax={tax}
        service={service}
        total={total}
        totaltax={totaltax}
        counter={counter}
        transactionData={transactionData} // transactionData is passed as a prop
      />
    );

    return receiptContent;
  };

  const printReceipt = (transactionData) => {
    const printWindow = window.open();
    console.log("print ke sini");
    if (printWindow) {
      const receiptContent = generateReceiptContent(transactionData);

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
    } else {
      console.error("Failed to open print window");
    }
  };

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
        handlePaymentApprovalActions();
        incrementCounter();
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
                        {/* <div className="flex justify-center ">
                          <div className=" mt-5 mr-3">
                            *Jika sudah melakukan pembayaran. diKlik
                          </div>
                          <button
                            className="bg-[#091F4B] p-3 mt-3 text-white rounded-md"
                            onClick={HandleSelesaiPembayaran}
                          >
                            Pembayaran selesai{" "}
                          </button>
                        </div> */}
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
    </div>
  );
}

export default CheckOut;
