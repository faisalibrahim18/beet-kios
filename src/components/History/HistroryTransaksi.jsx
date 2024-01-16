import React, { useEffect, useState } from "react";
import Topbar from "../topbar/Topbar";
import axios from "axios";
import Swal from "sweetalert2";

import Mt from "../../assets/mt.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

const HistoryTransaksi = () => {
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(true);
  const { basketId } = useParams(); // Mengambil parameter dari URL jika diperlukan
  const navigate = useNavigate();
  const [TRANSIDMERCHANT] = useState(nanoid(12));

  // Contoh data keranjang belanja dalam bentuk array item
  const basket = [
    { itemId: 1, itemName: "Produk A", price: 100 },
    { itemId: 2, itemName: "Produk B", price: 150 },
    // ... tambahkan item lainnya sesuai kebutuhan
  ];

  // Contoh data variabel lainnya
  const clientIdCCVA = 2; // Ganti dengan ID client Anda
  const resultAmount = 2500; // Ganti dengan jumlah yang sesuai
  const dateNow = "2023-10-11T12:00:00"; // Ganti dengan tanggal dan waktu yang sesuai
  const mallIdCCVA = 2; // Ganti dengan ID mal Anda

  const selected = {
    value: "doku-payment-channel", // Ganti dengan channel pembayaran yang sesuai
    text: "Metode Pembayaran DOKU", // Ganti dengan teks yang sesuai
  };

  const dataCustomer = {
    name: "Nama Pelanggan", // Ganti dengan nama pelanggan
    email: "email@pelanggan.com", // Ganti dengan alamat email pelanggan
    phoneNumber: "081234567890", // Ganti dengan nomor telepon pelanggan
  };
  const API_URL = import.meta.env.VITE_API_FRONTEND_URL;
  // Menghasilkan URL pembayaran
  const paymentUrl = `${API_URL}/payment/doku?BASKET=${basket
    .map((item) => `${item.itemId}:${item.price}`)
    .join(
      ";"
    )}&MALLID=${clientIdCCVA}&CHAINMERCHANT=NA&AMOUNT=${resultAmount}.00&PURCHASEAMOUNT=${resultAmount}.00&TRANSIDMERCHANT=${TRANSIDMERCHANT}&WORDS=&REQUESTDATETIME=${dateNow}&CURRENCY=360&PURCHASECURRENCY=360&SESSIONID=&PAYMENTCHANNEL=${
    selected.value
  }&ADDRESS=&COUNTRY=INDONESIA&STATE=&CITY=&PROVINCE=&ZIPCODE=&TAXSERVICE=${0}&SUBTOTAL=${resultAmount}&PAYMENTMETHOD=${
    selected.text
  }&NAME=${dataCustomer.name}&EMAIL=${dataCustomer.email}&PHONENUMBER=${
    dataCustomer.phoneNumber
  }&SHAREDKEY=${mallIdCCVA}`;

  const redirectToPayment = () => {
    // Mengarahkan pengguna ke URL pembayaran
    window.location.href = paymentUrl;
  };

  // console.log(payment);
  useEffect(() => {
    // Mengambil data dari localStorage
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parse the cart data from local storage
        const cartData = JSON.parse(localStorage.getItem("cart")) || [];

        // Extract business_id from each cart item
        const businessIds = cartData.map((item) => item.business_id);

        // Gabungkan businessIds menjadi string yang dipisahkan koma (misalnya: "1,2,3")
        const businessIdsString = businessIds.join(",");

        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");

        const apiUrlWithQuery = `${API_URL}/api/v1/payment-method/development?businessId=${businessIdsString}`;

        // Kemudian, buat permintaan GET ke API
        axios
          .get(apiUrlWithQuery, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setPayment(response.data.data.rows);
            // console.log(response.data.data.rows[2].name);
          })
          .catch((error) => {
            // Handle any errors that occur during the API request
            console.error(error);
          });
      } catch (error) {
        // Handle any errors that occur during the API request
        console.error(error);
      }
    };

    fetchData(); // Call the async function to fetch data
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_KEY;
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/api/v1/customer-app/transaction/emenu?customer_account_id=26&order=newest`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        // setCategoryData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  const checkStatusPaymentCz = async (url) => {
    console.log('urlnya', url);
  
    try {
      const result = await axios.post('https://api-link.cashlez.com/validate_url', {
        status: '',
        message: '',
        data: {
          request: {
            generatedUrl: url
          }
        }
      });
  
      console.log('result.data.data', result.data.data);
      console.log('result.data.data.response.processStatus', result.data.data.response.processStatus);
  
      return result.data.data;
    } catch (error) {
      console.error('Error in checkStatusPaymentCz:', error);
      throw error; // You can handle errors as per your application's needs
    }
  };
  const calculateTotalPrice = () => {
    // Menghitung total harga pesanan
    if (cart) {
      return cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }
    return 0;
  };

  const handlePayment = () => {
    Swal.fire({
      imageUrl: Mt,
      imageWidth: 300,
      imageHeight: 200,
      html: '<p class="text-sm text-gray-400 font-semibold">Fitur Belum Tersedia Saat Ini :(</p>',
      showConfirmButton: false,
      timer: 2000, // Menampilkan alert selama 1,5 detik
    });
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

  return (
    <>
      <Topbar products={cart} loading={loading} />
      <div className="cart-items flex justify-center text-center p-4 text-sm pt-20">
        <div clasName="text-center">
          {" "}
          <img src={Mt} className="bg-transparent w-[550px]" />
          <div className="text-gray-500 font-semibold">
            Fitur ini masih dalam pengembangan.
          </div>
          {/* <button onClick={checkStatusPaymentCz}>Klik disini </button> */}
        </div>
      </div>
    </>
  );
};

export default HistoryTransaksi;
