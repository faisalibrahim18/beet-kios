// PrintReceipt.jsx

import React from "react";
import "./PrintReceipt.css";

const PrintReceipt = ({ transactionData, totalValues, cart }) => {
  return (
    <div className="print-page">
      <h2>Struk Pembayaran</h2>
      <div>ID Referensi: {transactionData?.referenceId}</div>
      <div>Merchant: {transactionData?.merchantName}</div>
      <div>
        Total Pembayaran: Rp.{" "}
        {totalValues?.totalResultTotal.toLocaleString("id-ID")}
      </div>

      {/* Additional details from the cart or other data */}
      {cart.map((item) => (
        <div key={item.id}>
          <div>
            {item.nameItem} - {item.totalItem}x - Rp.{" "}
            {item.priceItem.toLocaleString("id-ID")}
          </div>

          {item.fullDataAddons && item.fullDataAddons.length > 0 && (
            <ul>
              <div>Add-On:</div>
              {item.fullDataAddons.map((addon) => (
                <li key={addon.id}>
                  - {addon.name} - Rp. {addon.price.toLocaleString("id-ID")}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default PrintReceipt;
