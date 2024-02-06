import axios from "axios";
import React, { useEffect, useState } from "react";
// import Lg from "../../assets/lg_r.png";
import "./PrintReceipt.css";

const PrintReceipt = ({
  cart,
  tax,
  total,
  totaltax,
  counter,
  transactionData,
  StatusPayment,
}) => {
  if (!cart || cart.length === 0) {
    return <div>Cart is empty</div>;
  }
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every 1000 milliseconds (1 second)

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);
  const API_URL = import.meta.env.VITE_API_KEY;
  // console.log("ini data printnya");
  const [taxAndService, setTaxAndService] = useState({ tax: 0, charge: 0 });

  useEffect(() => {
    handleCheckTaxAndService();
  }, []);
  const handleCheckTaxAndService = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_KEY;
      const token = localStorage.getItem("token");

      const resultOutlet = await axios.get(`${API_URL}/api/v1/outlet/207`, {
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
  const { totalPaymentTotal, totalResultTotal } = calculateTotalPrice();

  useEffect(() => {
    const setPrintStyles = () => {
      const printPage = document.getElementById("print-page");
      if (printPage) {
        printPage.style.fontFamily = "Arial, sans-serif";
        printPage.style.maxWidth = "300px";
        // Tambahkan properti gaya lainnya
      }
    };

    window.onbeforeprint = setPrintStyles;

    window.onafterprint = () => {
      const printPage = document.getElementById("print-page");
      if (printPage) {
        printPage.removeAttribute("style");
      }
    };

    return () => {
      window.onbeforeprint = null;
      window.onafterprint = null;
    };
  }, []);
  const logo = localStorage.getItem("logo");
  // console.log(logo);
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "80mm",
        margin: "0px",
        fontSize: "10px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "5px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={`${API_URL}/${logo}`}
            alt=""
            style={{
              width: "40px",
              height: "40px",
            }}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <span>{transactionData?.address}</span>
        </div>
      </div>
      <div style={{ fontSize: "10px", marginTop: "3px" }}>
        <div>
          <span>Tanggal dan Waktu:</span>
          <div style={{ fontSize: "9px" }}>
            <b>{currentDateTime.toLocaleString()}</b>
          </div>
        </div>
        <div>
          <span></span>
        </div>
      </div>
      <hr />
      {/* data Item */}
      <div>
        {cart.map((item) => (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                width: "100%",
              }}
            >
              <div>
                <span>{item.nameItem}</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <span>{item.totalItem}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                Rp. {item.priceItem.toLocaleString("id-ID")}
              </div>
            </div>

            {item.fullDataAddons && item.fullDataAddons.length > 0 && (
              <div style={{ marginTop: "2px", paddingLeft: "5px" }}>
                <b>Tambahan:</b>
                {item.fullDataAddons.map((addon) => (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      width: "100%",
                    }}
                  >
                    <div style={{ textAlign: "left" }}>{addon.name}</div>
                    <div style={{ textAlign: "right" }}>
                      Rp. {addon.price.toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <hr />
      {/* subtotal */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>Sub Total</div>
        <div style={{ textAlign: "right" }}>
          Rp. {totalPaymentTotal.toLocaleString("id-ID")}
        </div>
      </div>
      {/* taxAndService */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>Tax ({tax}%)</div>
          <div style={{ textAlign: "right" }}>
            {/* Rp. {totaltax} */}
            Rp. {totaltax.toLocaleString("id-ID")}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>Service ({taxAndService.charge}%)</div>
          <div style={{ textAlign: "right" }}>
            Rp. {totalValues.totalService.toLocaleString("id-ID")}
          </div>
        </div>
      </div>
      {/* Total */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>Total</div>
        <div style={{ textAlign: "right" }}>
          {/* Rp. {total} */}
          Rp. {totalResultTotal.toLocaleString("id-ID")}
        </div>
      </div>
      <hr />
      {/* footer */}
      <div style={{ textAlign: "center" }}>
        <span>No Antrian :</span>
        <div style={{ fontSize: "12px" }}>
          <b>{counter}</b>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        {" "}
        Terima kasih atas kunjungan Anda.
      </div>
    </div>
  );
};

export default PrintReceipt;
