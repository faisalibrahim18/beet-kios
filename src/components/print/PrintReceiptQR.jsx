import React, { useEffect, useState } from "react";
// import Lg from "../../assets/lg_r.png";
import "./PrintReceipt.css";

const PrintReceiptQR = ({
  cart,
  tax,
  service,
  total,
  diskon,
  Subtotal,
  totaltax,
  counter,
  totalservice,
}) => {
  if (!cart || cart.length === 0) {
    return <div>Cart is empty</div>;
  }

  const API_URL = import.meta.env.VITE_API_KEY;
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const data_Business = JSON.parse(localStorage.getItem("user"));
  // console.log()
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // console.log("total", total);
  // console.log("subtotal", Subtotal);
  // console.log("tax", tax);
  // console.log("service", service);
  // console.log("totaltax ", totaltax);
  // console.log("totalservice ", totalservice);
  const logo = localStorage.getItem("logo");
  // console.log(logo);
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "80mm",
        margin: "0px",
        fontSize: "10px",
        marginBottom: "50px",
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
          <span>{data_Business.outlet_address}</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "10px",
          marginTop: "3px",
        }}
      >
        <div>
          <span>Tanggal dan Waktu:</span>
          <div style={{ fontSize: "9px" }}>
            <b>{currentDateTime.toLocaleString()}</b>
          </div>
        </div>
        <div>
          {" "}
          <span>QRIS</span>{" "}
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
          Rp. {Subtotal.toLocaleString("id-ID")}
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
          <div>Service ({service}%)</div>
          <div style={{ textAlign: "right" }}>
            Rp. {totalservice.toLocaleString("id-ID")}
          </div>
        </div>
      </div>

      {/* diskon */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>Diskon</div>
        <div style={{ textAlign: "right" }}>
          - Rp. {diskon.toLocaleString("id-ID")}
        </div>
      </div>
      {/* Total */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>Total</div>
        <div style={{ textAlign: "right" }}>
          {/* Rp. {total} */}
          Rp. {total.toLocaleString("id-ID")}
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
      <div style={{ textAlign: "center", marginBottom: "70px" }}>
        {" "}
        Terima kasih atas kunjungan Anda.
      </div>
      <div style={{ textAlign: "center", marginBottom: "70px" }}> -</div>
    </div>
  );
};

export default PrintReceiptQR;
