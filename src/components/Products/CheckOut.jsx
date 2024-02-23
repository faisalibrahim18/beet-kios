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
import { HiTicket } from "react-icons/hi2";

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
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [promos, setPromos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePromoSelection = (promo) => {
    setSelectedPromo(promo);
    applyPromo(promo);
    setModalOpen(false); // Tutup modal saat promo dipilih
  };

  const closeModalPromo = () => {
    // setSelectedPromo(null); // Reset selectedPromo saat modal ditutup
    setModalOpen(false); // Tutup modal
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/v1/special-promo`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setPromos(response.data.data);
        console.log("promo", response);
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
  // Perhitungan jumlah total
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
      let addonsTotal = item.price_addons_total || 0;

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

  // fungsi untuk mengaplikasikan promo
  const applyPromo = (promo, totalPrice) => {
    // Menghitung total harga dengan mempertimbangkan promo yang dipilih
    if (promo) {
      let discount = 0;
      if (promo.type === "percentage") {
        discount = totalPrice * (promo.value / 100);
      } else if (promo.type === "currency") {
        discount = promo.value;
      }
      return totalPrice - discount;
    }
    return totalPrice;
  };

  // Memanggil applyPromo dan menyimpan hasilnya dalam totalPriceAfterPromo
  const totalPriceAfterPromo = applyPromo(
    selectedPromo,
    totalValues.totalResultTotal
  );
  // console.log("Total", totalValues);
  // close pergitungan jumlah total

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
        tax: totalValues.totalTax,
        service: totalValues.totalService,
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
            payment_total: totalValues.totalPaymentTotal,
            amount: totalPriceAfterPromo,
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
      console.log("datdaa", generateUrlVendor);

      const paymentTypeId = 4; // Set the ID of the desired payment type

      const processUrl = {
        data: {
          request: {
            vendorIdentifier: dataBusiness.cz_vendor_identifier,
            entityId: dataBusiness.cz_entity_id,
            referenceId: "TEST-BEETKios" - TRANSIDMERCHANT,
            paymentType: paymentTypeId,
            customerMobilePhone: "",
            message: "",
            customerLatitude: "-6.1675794999999995",
            customerLongitude: "106.7824544",
          },
        },
        signature: "",
      };

      const response2 = await axios.post(
        "https://api-link.cashlez.com/process_url",
        processUrl,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("data response Process Url", response2);
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

          console.log("status", response1.data.data.response);
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
              payment_discount:
                totalValues.totalResultTotal - totalPriceAfterPromo,
              payment_tax: result.tax,
              payment_service: result.service,
              payment_total: totalPriceAfterPromo,
              amount: totalValues.totalPaymentTotal,
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
            // const sendDataKitchen = {
            //   receipt_id: receiptId,
            //   items: cartData,
            //   outlet_id: parseInt(data_Business.outlet_id),
            //   business_id: parseInt(data_Business.business_id),
            //   status: "Done",
            // };
            // console.log("sendData", sendDataKitchen);
            // const resTransaction = await axios.post(
            //   `${API_URL}/api/v1/transaction/save/qr  `,
            //   sendDataKitchen,
            //   {
            //     headers: {
            //       "Content-Type": "application/json",
            //       Authorization: `Bearer ${token}`,
            //     },
            //   }
            // );

            // console.log("transaksi", resTransaction);
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
            // console.log("getUserBusiness", getUserBusiness.data.data);

            if (response1.data.statusCode === 201) {
              if (getUserBusiness) {
                const deviceUser = [];
                getUserBusiness.data.data.forEach((value) => {
                  // console.log("looping device ", value.device);
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
                    en: "Mohon konfirmasi order pada menu Kitchen aplikasi BeetPOS anda",
                    id: "Mohon konfirmasi order pada menu Kitchen aplikasi BeetPOS anda",
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
                    // console.log("responseJSON send notif ==> ", result);
                  })
                  .catch((_err) => {
                    console.log("ERR ==> ", _err);
                  });
              }
            }
            // close kirim data ke kitchen
            setLoading1(false);
            setUrlVendor(urlVendor);
            handlePaymentQrApprovalActions(transactionData);

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
  const handlePaymentQrApprovalActions = async (transactionData) => {
    // Panggil fungsi untuk mencetak struk
    // setShowPrintReceipt(true);
    // generateReceiptContent();
    printReceiptQr(transactionData);
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
  const generateReceiptQrContent = (transactionData) => {
    const tax = taxAndService.tax;
    const service = taxAndService.charge;
    const totaltax = totalValues.totalTax;
    const totalservice = totalValues.totalService;
    const Subtotal = totalValues.totalPaymentTotal;
    const total = totalPriceAfterPromo;
    const diskon = totalValues.totalResultTotal - totalPriceAfterPromo;
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
        diskon={diskon}
        totaltax={totaltax}
        totalservice={totalservice}
        counter={counter}
        transactionData={transactionData} // transactionData is passed as a prop
      />
    );

    return receiptContent;
  };
  // close generate data receipt qr

  //  print receipt Qr
  const printReceiptQr = (transactionData) => {
    const printWindow = window.open();
    // console.log("print ke sini");
    if (printWindow) {
      const receiptContent = generateReceiptQrContent(transactionData);

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
  //  close print receipt Qr
  // close PaymentQr

  // Paymnet Cash
  // action ketika selesai pembayaran cash
  const handlePaymentCashApprovalActions = async (transactionData) => {
    // Panggil fungsi untuk mencetak struk
    // setShowPrintReceipt(true);
    // generateReceiptContent();
    printReceiptCash(transactionData);
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
  const generateReceiptCashContent = (transactionData) => {
    const tax = taxAndService.tax;
    const service = taxAndService.charge;
    const totaltax = totalValues.totalTax;
    const totalservice = totalValues.totalService;
    const Subtotal = totalValues.totalPaymentTotal;
    const total = totalPriceAfterPromo;
    const diskon = totalValues.totalResultTotal - totalPriceAfterPromo;
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
        diskon={diskon}
        totaltax={totaltax}
        totalservice={totalservice}
        counter={counter}
        transactionData={transactionData} // transactionData is passed as a prop
      />
    );

    return receiptContent;
  };
  // close generate data receipt

  //  print receipt
  const printReceiptCash = (transactionData) => {
    const printWindow = window.open();
    // console.log("print ke sini");
    if (printWindow) {
      const receiptContent = generateReceiptCashContent(transactionData);

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
        text: "Anda yakin ingin menutup halaman ini dan kembali ke dashboard?",
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
          tax: totalValues.totalTax,
          service: totalValues.totalService,
          paymentTotal: totalAmount,
        };
        console.log("ini tax", result);
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
          payment_discount: totalValues.totalResultTotal - totalPriceAfterPromo,
          payment_tax: result.tax,
          payment_service: result.service,
          payment_total: totalPriceAfterPromo,
          amount: totalValues.totalPaymentTotal,
          payment_change: 0,
          kitchen: true,
          queue_number: counter,
          status: "Done",
        };

        // console.log("dgfasjgudas", sendData);
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

        const sendDataKitchen = {
          receipt_id: receiptId,
          items: cartData,
          outlet_id: parseInt(data_Business.outlet_id),
          business_id: parseInt(data_Business.business_id),
          status: "Done",
        };
        // console.log("sendData", sendDataKitchen);
        // const resTransaction = await axios.post(
        //   `${API_URL}/api/v1/transaction/save/qr  `,
        //   sendDataKitchen,
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );

        // console.log("transaksi", resTransaction);
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
        // console.log("getUserBusiness", getUserBusiness.data.data);

        if (response1.data.statusCode === 201) {
          if (getUserBusiness) {
            const deviceUser = [];
            getUserBusiness.data.data.forEach((value) => {
              // console.log("looping device ", value.device);
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
                en: "Mohon konfirmasi order pada menu Kitchen aplikasi BeetPOS anda",
                id: "Mohon konfirmasi order pada menu Kitchen aplikasi BeetPOS anda",
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
                // console.log("responseJSON send notif ==> ", result);
              })
              .catch((_err) => {
                console.log("ERR ==> ", _err);
              });
          }
        }
        // console.log("datasend", response1);
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
        <div className="fixed cursor-context-menu  inset-0 z-50 mt-20 flex place-items-start  justify-center transition-opacity duration-300 overflow-auto">
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
                            <span>SubTotal</span>
                            <span>
                              Rp.{" "}
                              {totalValues.totalPaymentTotal.toLocaleString(
                                "id-ID"
                              )}
                            </span>
                          </li>
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
                          <li className="flex justify-between pl-2">
                            <span>Diskon</span>
                            <span>
                              - Rp.{" "}
                              {(
                                totalValues.totalResultTotal -
                                totalPriceAfterPromo
                              ).toLocaleString("id-ID")}
                            </span>
                          </li>
                        </ul>
                      </div>

                      {/* <hr className="" /> */}
                      <div className="flex justify-between pr-3 pt-2">
                        {/* <div className="checkout-section">
                          <h2 className="text-lg font-semibold mb-4">
                            Ringkasan Pembelian
                          </h2>
                          <p>Subtotal: {totalValues.totalResultTotal}</p>
                          {selectedPromo && (
                            <p>
                              Promo: -
                              {totalValues.totalResultTotal -
                                totalPriceAfterPromo}
                            </p>
                          )}
                          <p className="text-xl font-bold">
                            Total: {totalPriceAfterPromo}
                          </p>
                        </div> */}

                        <span className="font-semibold">Total Harga:</span>
                        <span>
                          Rp. {totalPriceAfterPromo.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-4">
                        <span className="text-lg font-bold  cursor-context-menu">
                          Promo
                        </span>
                        <span
                          onClick={() => setModalOpen(true)}
                          className={`ml-3 font-semibold cursor-pointer ${
                            selectedPromo
                              ? "bg-gray-100 p-2 -mt-1 rounded-md text-blue-500"
                              : "text-black mt-1"
                          }`}
                        >
                          {selectedPromo
                            ? `Anda memilih promo :  ${selectedPromo.name}`
                            : "Silakan pilih promo"}
                        </span>
                      </div>
                      {modalOpen && (
                        <div className="z-50 overflow-y-auto overflow-x-auto lg:mb-0 sm:mb-0 md:mb-0 mb-[60px] fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                          <div className="modal m-4 lg:mt-0 sm:mt-0 md:mt-0 mt-[150px]  bg-white p-7 rounded-md max-w-md w-full">
                            <div className="flex justify-end">
                              <button
                                onClick={closeModalPromo}
                                className="text-gray-600 font-semibold hover:text-gray-800 text-4xl"
                              >
                                &times;
                              </button>
                            </div>
                            <h2 className="text-xl font-bold mb-4">
                              Pilih Promo
                            </h2>
                            {promos.length === 0 ? (
                              <p className="text-gray-600 text-center mb-4">
                                Tidak ada promo yang tersedia saat ini.
                              </p>
                            ) : (
                              <ul className="space-y-2">
                                {promos.map((promo) => (
                                  <li
                                    key={promo.id}
                                    onClick={() => {
                                      setSelectedPromo(promo);
                                      setModalOpen(false);
                                    }}
                                    className="flex justify-between items-center bg-gray-100 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                                  >
                                    <div className="flex">
                                      {" "}
                                      <span className="mr-2 text-4xl">
                                        <HiTicket />
                                      </span>{" "}
                                      <span className="mt-1.5 font-semibold">
                                        {" "}
                                        {promo.name}
                                      </span>
                                    </div>
                                    {selectedPromo &&
                                      selectedPromo.id === promo.id && (
                                        <button
                                          className="text-red-500"
                                          onClick={(e) => {
                                            e.stopPropagation(); // Mencegah propagasi klik ke atas
                                            setSelectedPromo(null);
                                            setModalOpen(false);
                                          }}
                                        >
                                          Batalkan
                                        </button>
                                      )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
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
