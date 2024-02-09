import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading/Loading";
import Mt from "../../assets/mt.jpg";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { BsRecordFill } from "react-icons/bs";
import PrintReceiptCash from "../print/PrintReceiptCash";
import ReactDOMServer from "react-dom/server";
import dayjs from "dayjs";
import PrintReceiptQR from "../print/PrintReceiptQR";

function CheckOut({ isOpen, closeModal }) {
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState([]);
  const [paymentCash, setPaymentCash] = useState([]);
  const [paymentQr, setPaymentQr] = useState([]);
  const [salesTypeId, setSalesTypeId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [TRANSIDMERCHANT] = useState(nanoid(12));
  const [nominal, setNominal] = useState(0);
  const [urlVendor, setUrlVendor] = useState("");
  const [taxAndService, setTaxAndService] = useState({ tax: 0, charge: 0 });
  const [transactionData, setTransactionData] = useState(null);
  const navigate = useNavigate();
  const data_Business = JSON.parse(localStorage.getItem("user"));

  // console.log("payyyyyyy", payment);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/api/v1/payment-method/development?businessId=${data_Business.business_id}&outlet_id=${data_Business.outlet_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filter data untuk pembayaran tunai (Cash)
        const cashPayments = response.data.data.rows.filter(
          (payment) => payment.name === "Cash"
        );

        // Filter data untuk pembayaran QR
        const qrPayments = response.data.data.rows.filter(
          (payment) => payment.name === "Cashlez QR"
        );

        // console.log("cash", cashPayments[0].id);
        // console.log("Qr", qrPayments[0].id);
        setPaymentCash(cashPayments[0]);
        setPaymentQr(qrPayments[0]);
        setPayment(response.data.data.rows);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const [counter, setCounter] = useState(1);
  useEffect(() => {
    // Ambil nomor antrian dari local storage saat komponen dipasang
    const storedQueueNumber = localStorage.getItem("queueNumber");
    if (storedQueueNumber) {
      setCounter(parseInt(storedQueueNumber));
    }
  }, []);

  const handleTransaction = () => {
    // Tambahkan 1 ke nomor antrian dan simpan ke local storage
    const newQueueNumber = counter + 1;
    setCounter(newQueueNumber);
    localStorage.setItem("queueNumber", newQueueNumber.toString());
  };

  useEffect(() => {
    const resetDataAt10PM = () => {
      // Hapus data nomor antrian dari local storage setiap jam 10 malam
      const now = new Date();
      if (
        now.getHours() === 22 &&
        now.getMinutes() === 0 &&
        now.getSeconds() === 0
      ) {
        localStorage.removeItem("queueNumber");
        setCounter(1);
      }
    };

    // Set timeout untuk menjalankan resetDataAt10PM pada pukul 10 malam
    const now = new Date();
    const resetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      22,
      0,
      0,
      0
    );
    const timeUntilReset = resetTime.getTime() - now.getTime();
    const timeoutId = setTimeout(resetDataAt10PM, timeUntilReset);

    // Hapus timeout saat komponen dibongkar
    return () => clearTimeout(timeoutId);
  }, [counter]);
  // close counter

  // get data Type sales Take away
  useEffect(() => {
    const getsales = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/api/v1/sales-type/guest?business_id=${data_Business.business_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Cari objek dengan properti 'name' yang sama dengan 'Take away'
        const takeAwayData = response.data.data.find(
          (item) => item.name === "Take away"
        );

        if (takeAwayData) {
          // Jika ditemukan, simpan data 'Take away' ke dalam state
          // console.log("typesales", takeAwayData.id);
          setSalesTypeId(takeAwayData);
        } else {
          console.error("Take away data not found");
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    getsales();
  }, []);
  // close get data Type sales Take away

  // tax and service
  useEffect(() => {
    handleCheckTaxAndService();
  }, []);
  const handleCheckTaxAndService = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_KEY;
      const token = localStorage.getItem("token");

      const resultOutlet = await axios.get(
        `${API_URL}/api/v1/outlet/${data_Business.outlet_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
  // close tax and service

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

        // setPayment(response.data.data.rows);
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

  // perhitungan jumlah total
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
      let addonsTotal = item.price_addons_total || 0; // Ambil nilai dari price_addons_total
      // let addonsTotal = 0;
      // if (item.fullDataAddons) {
      //   addonsTotal = item.fullDataAddons.reduce(
      //     (accumulator, addon) => accumulator + addon.price,
      //     0
      //   );
      // }

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
  // close pergitungan jumlah total
  // console.log("toaa", totalValues);
  //  Payment Qr
  // handle buat pembayaran/checkout QR
  const handlePayment = async () => {
    try {
      setLoading1(true);
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_KEY;
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];

      const totalAmount = calculateTotalPrice().totalResultTotal;
      const result = {
        tax: Math.ceil((totalAmount * taxAndService.tax) / 100),
        service: Math.ceil((totalAmount * taxAndService.charge) / 100),
        paymentTotal: totalAmount,
      };

      result.resultAmount = Math.ceil(result.paymentTotal);
      const response = await axios.get(
        `${API_URL}/api/v1/business-noverify/${data_Business.business_id}`
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
          // console.log("status", response1.data.data.response);
          const StatusPayment = response1.data.data.response.processStatus;
          if (response1.data.data.response.processStatus === "APPROVED") {
            handleTransaction();
            const receiptId =
              "ORDER_" +
              dayjs(new Date()).format("YY/MM/DD-HH/mm/ss") +
              data_Business.outlet_id;
            // kirim data ke beetOffice
            const sendData = {
              receipt_id: receiptId,
              items: cartData,
              outlet_id: data_Business.outlet_id,
              business_id: data_Business.business_id,
              customer_id: data_Business.user_id,
              sales_type_id: salesTypeId.id,
              payment_method_id: paymentQr.id,
              payment_discount: 0,
              payment_tax: result.tax,
              payment_service: result.service,
              payment_total: result.paymentTotal,
              amount: result.resultAmount,
              payment_change: 0,
              kitchen: true,
              queue_number: counter,
              status: "Done",
            };
            // console.log("datasend", sendData);
            const response1 = await axios.post(
              `${API_URL}/api/v1/transaction`,
              sendData,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            // console.log("datasend", response1);
            // close  kirim data ke beetOffice

            // kirim data ke kitchen

            // console.log("cart", cartData);
            const sendDataKitchen = {
              receipt_id: receiptId,
              items: cartData,
              outlet_id: parseInt(data_Business.outlet_id),
              business_id: parseInt(data_Business.business_id),
              status: "Done",
            };
            console.log("sendData", sendDataKitchen);
            const resTransaction = await axios.post(
              `${API_URL}/api/v1/transaction/save/qr  `,
              sendDataKitchen,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log("transaksi", resTransaction);
            const getUserBusiness = await axios.get(
              `${API_URL}/api/v1/auth/get-user?business_id=${parseInt(
                data_Business.business_id
              )}&outlet_id=${parseInt(data_Business.outlet_id)}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("getUserBusiness", getUserBusiness.data.data);

            if (resTransaction.data.statusCode === 201) {
              if (getUserBusiness) {
                const deviceUser = [];
                getUserBusiness.data.data.forEach((value) => {
                  console.log("looping device ", value.device);
                  if (value.device) {
                    const splitDevice = value.device.split("-");
                    if (splitDevice.length === 5) {
                      deviceUser.push(value);
                    }
                  }
                });
                // console.log("deviceUser", deviceUser);
                const resultDevice = deviceUser.map((value) => value.device);

                // console.log("include_player_ids yang akan dikirim", resultDevice);
                const bodyOneSignal = {
                  app_id: "545db6bf-4448-4444-b9c8-70fb9fae225b",
                  include_player_ids: resultDevice,
                  contents: {
                    en: "Mohon konfirmasi order pada menu booking aplikasi BeetPOS anda",
                    id: "Mohon konfirmasi order pada menu booking aplikasi BeetPOS anda",
                  },
                  headings: {
                    en: "Request Self Order baru ",
                    id: "Request Self Order baru ",
                  },
                  subtitle: {
                    en: "Request Self Order baru ",
                    id: "Request Self Order baru",
                  },
                };
                fetch("https://onesignal.com/api/v1/notifications", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization:
                      "Basic ZGJiNjZmYWEtNTQ2Ny00MmExLTgwZjMtZDRhN2U2YWUwMjk0",
                  },
                  body: JSON.stringify(bodyOneSignal),
                })
                  .then((response) => response.json())
                  .then((responseJson) => {
                    const result = responseJson;
                    console.log("responseJSON send notif ==> ", result);
                  })
                  .catch((_err) => {
                    console.log("ERR ==> ", _err);
                  });
              }
            }
            // close kirim data ke kitchen
            setLoading1(false);
            setUrlVendor(urlVendor);
            handlePaymentQrApprovalActions(transactionData, StatusPayment);

            clearInterval(intervalId);
            // setCounter((prevCounter) => prevCounter + 1);
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
  //  close handle buat pembayaran/checkout Qr

  // action ketika selesai pembayaran qr
  const handlePaymentQrApprovalActions = async (
    transactionData,
    StatusPayment
  ) => {
    // Panggil fungsi untuk mencetak struk
    // setShowPrintReceipt(true);
    // generateReceiptContent();
    printReceiptQr(transactionData, StatusPayment);
    Swal.fire({
      title: "Pembayaran sukses!",
      // text: "Text lain sesuai kebutuhan",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      localStorage.removeItem("cart");

      closeModal();
      navigate("/dashboard");
    });
  };
  // close  action ketika selesai pembayaran qr

  // generate data receipt qr
  const generateReceiptQrContent = (transactionData, StatusPayment) => {
    const tax = taxAndService.tax;
    const service = taxAndService.charge;
    const totaltax = totalValues.totalTax;
    const totalservice = totalValues.totalService;
    const Subtotal = totalValues.totalPaymentTotal;
    const total = totalValues.totalResultTotal;
    const cartData1 = JSON.parse(localStorage.getItem("cart")) || [];

    // console.log("Value of transactionData:", transactionData);

    const receiptContent = ReactDOMServer.renderToString(
      <PrintReceiptQR
        payment={payment}
        cart={cartData1}
        tax={tax}
        service={service}
        Subtotal={Subtotal}
        total={total}
        totaltax={totaltax}
        totalservice={totalservice}
        counter={counter}
        transactionData={transactionData} // transactionData is passed as a prop
        StatusPayment={StatusPayment}
      />
    );

    return receiptContent;
  };
  // close generate data receipt qr

  //  print receipt Qr
  const printReceiptQr = (transactionData, StatusPayment) => {
    const printWindow = window.open();
    // console.log("print ke sini");
    if (printWindow) {
      const receiptContent = generateReceiptQrContent(
        transactionData,
        StatusPayment
      );

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
  //  close print receipt
  // close PaymentQr

  // Paymnet Cash
  // action ketika selesai pembayaran cash
  const handlePaymentCashApprovalActions = async (
    transactionData,
    StatusPayment
  ) => {
    // Panggil fungsi untuk mencetak struk
    // setShowPrintReceipt(true);
    // generateReceiptContent();
    printReceiptCash(transactionData, StatusPayment);
    Swal.fire({
      title: "Pembayaran sukses!",
      // text: "Text lain sesuai kebutuhan",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      localStorage.removeItem("cart");

      closeModal();
      navigate("/dashboard");
    });
  };
  // close  action ketika selesai pembayaran cash

  // generate data receipt cash
  const generateReceiptCashContent = (transactionData, StatusPayment) => {
    const tax = taxAndService.tax;
    const service = taxAndService.charge;
    const totaltax = totalValues.totalTax;
    const totalservice = totalValues.totalService;
    const Subtotal = totalValues.totalPaymentTotal;
    const total = totalValues.totalResultTotal;
    const cartData1 = JSON.parse(localStorage.getItem("cart")) || [];

    // console.log("Value of transactionData:", transactionData);

    const receiptContent = ReactDOMServer.renderToString(
      <PrintReceiptCash
        payment={payment}
        cart={cartData1}
        tax={tax}
        service={service}
        Subtotal={Subtotal}
        total={total}
        totaltax={totaltax}
        totalservice={totalservice}
        counter={counter}
        transactionData={transactionData} // transactionData is passed as a prop
        StatusPayment={StatusPayment}
      />
    );

    return receiptContent;
  };
  // close generate data receipt

  //  print receipt
  const printReceiptCash = (transactionData, StatusPayment) => {
    const printWindow = window.open();
    // console.log("print ke sini");
    if (printWindow) {
      const receiptContent = generateReceiptCashContent(
        transactionData,
        StatusPayment
      );

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
  //  close print receipt

  // handle pembayaran cash
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
        handleTransaction();
        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");
        const cartData = JSON.parse(localStorage.getItem("cart")) || [];

        const totalAmount = calculateTotalPrice().totalResultTotal;
        const result = {
          tax: Math.ceil((totalAmount * taxAndService.tax) / 100),
          service: Math.ceil((totalAmount * taxAndService.charge) / 100),
          paymentTotal: totalAmount,
        };

        result.resultAmount = Math.ceil(result.paymentTotal);
        const response = await axios.get(
          `${API_URL}/api/v1/business-noverify/${data_Business.business_id}`
        );

        const dataBusiness = response.data.data;

        const transactionData = {
          referenceId: TRANSIDMERCHANT,
          merchantName: dataBusiness.name,
          paymentTotal: result.paymentTotal,
          resultAmount: result.resultAmount,
          transactionUsername: dataBusiness.cz_user,
        };
        // setTransactionData(transactionData);
        const receiptId =
          "ORDER_" +
          dayjs(new Date()).format("YY/MM/DD-HH/mm/ss") +
          data_Business.outlet_id;
        // kirim data ke beetOffice
        const sendData = {
          receipt_id: receiptId,
          items: cartData,
          outlet_id: data_Business.outlet_id,
          business_id: data_Business.business_id,
          customer_id: data_Business.user_id,
          sales_type_id: salesTypeId.id,
          payment_method_id: paymentCash.id,
          payment_discount: 0,
          payment_tax: result.tax,
          payment_service: result.service,
          payment_total: result.paymentTotal,
          amount: result.resultAmount,
          payment_change: 0,
          kitchen: true,
          queue_number: counter,
          status: "Done",
        };
        //  parameter_send.queue_number = this.state.queue_number;
        //   kitchen = true;

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

        const response1 = await axios.post(
          `${API_URL}/api/v1/transaction`,
          sendData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("datasend", response1);
        closeModal();
        handlePaymentCashApprovalActions(transactionData);

        // Pastikan bahwa localStorage.removeItem("cart") berjalan tanpa kesalahan
        localStorage.removeItem("cart");

        // Coba untuk menavigasi
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during navigation:", error);
    }
  };
  // close handle pembayaran cash
  // close payment cash
  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 mt-20 flex place-items-start  justify-center transition-opacity duration-300 overflow-auto">
          <div className="fixed inset-0">
            <div className="absolute inset-0 bg-black opacity-70" />
          </div>
          <div className="relative z-10 w-full max-w-7xl m-5 bg-white shadow-lg rounded-lg lg:p-4 p-3.5 md:p-8">
            <h1 className="text-2xl font-semibold mb-4">Pesanan</h1>

            <button
              onClick={closeModal}
              className="absolute -top-3 right-0 m-2 px-4 text-5xl py-2  text-[#091F4B] hover:text-[#0C376A] "
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
                    {/* untuk menampilkan iframe dan memunculkan jenis pembayaran */}
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
                    {/*close  untuk menampilkan iframe dan memunculkan jenis pembayaran */}
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

                              {/* data dari tambahan */}
                              {item.fullDataAddons &&
                                item.fullDataAddons.length > 0 && (
                                  <ul className="pl-5">
                                    <div className="text-sm font-bold flex">
                                      {" "}
                                      <div className="mt-1.5 mr-1">
                                        <BsRecordFill size={8} />
                                      </div>
                                      Tambahan :
                                    </div>
                                    {item.fullDataAddons.map((addon) => (
                                      <li
                                        key={addon.id}
                                        className="flex justify-between pl-4 font-semibold"
                                      >
                                        <span> - {addon.name}</span>
                                        <span className="flex items-center">
                                          <span className="w-16 text-right">
                                            {item.totalItem}x
                                          </span>
                                          <span className="w-24 text-right flex-grow">
                                            Rp.{" "}
                                            {addon.price.toLocaleString(
                                              "id-ID"
                                            )}
                                          </span>
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              {/* close data dari tambahan */}
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
                    <div className="text-center ">
                      <button
                        className="bg-[#091F4B] ml-4 text-white px-20 py-2 rounded-2xl mr-4 hover-bg-[#8f387d]"
                        onClick={handleCash}
                      >
                        Cash
                      </button>
                      <button
                        className="bg-[#091F4B] text-white px-20 py-2 rounded-2xl hover-bg-[#8f387d] mt-2"
                        onClick={() => handlePayment(nominal)}
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
