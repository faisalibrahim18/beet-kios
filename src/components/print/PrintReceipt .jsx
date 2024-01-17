// PrintReceipt.js
import React from "react";
import "./PrintReceipt.css";

const PrintReceipt = ({ receiptData }) => {
  const { items, subtotal, tax, total, paymentMethod, transactionDate } =
    receiptData;

  return (
    <div id="printReceipt" className="receipt p-4 border ">
      <h1 className="text-center text-2xl font-bold mb-4">Struk Pembayaran</h1>

      <div className="flex justify-between mb-2">
        <span>Tanggal Transaksi:</span>
        <span>{transactionDate}</span>
      </div>

      <div className="mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.name}</span>
            <span>{item.price}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between mb-2">
        <span>Subtotal:</span>
        <span>{subtotal}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Pajak (10%):</span>
        <span>{tax}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Total:</span>
        <span>{total}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Metode Pembayaran:</span>
        <span>{paymentMethod}</span>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        Terima kasih atas kunjungan Anda! Selamat menikmati makanan.
      </div>
    </div>
  );
};

export default PrintReceipt;
