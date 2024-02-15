import React, { useEffect, useState } from "react";
import Lg from "../../assets/logo.png";
const DetailKeranjang = ({ itemId, onClose, fetchItemDetails }) => {
  const [productDetails, setProductDetails] = useState(null);
  const API_URL = import.meta.env.VITE_API_KEY;
  // console.log(productDetails);
  // get data detail keranjang
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await fetchItemDetails(itemId);
        setProductDetails(details);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchDetails();
  }, [itemId, fetchItemDetails]);
  // get data detail keranjang

  return (
    <div className="fixed z-50  inset-0 overflow-y-auto cursor-context-menu">
      <div className="flex mt-32 place-items-start justify-center min-h-screen pt-4 px-4 pb-20">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0  bg-black opacity-50"></div>
        </div>

        {productDetails ? (
          <div className="relative w-full bg-white p-6 rounded-lg max-w-lg mx-auto">
            <button
              className="absolute top-0 right-0 mt-4 mr-4 text-[#091F4B] hover:text-[#0C376A] cursor-pointer"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {productDetails.nameItem}
            </h2>
            <div className="flex">
              <img
                src={
                  productDetails.imageItem == null
                    ? Lg
                    : `${API_URL}/${productDetails.imageItem}`
                }
                alt=""
                className="shadow object-cover w-20 h-20 border rounded-md "
              />
              <div className="w-full">
                <div className="text-gray-700 ml-2 font-semibold">Detail</div>

                {/* bagian detail product */}
                <ul className="list-disc ml-4 text-sm">
                  <li className="flex items-center text-gray-700 mb-0.5">
                    <span className="">Total Item</span>
                    <span className="mr-2 ml-[20px]">:</span>
                    <span>{productDetails?.totalItem}</span>
                  </li>
                  <li className="flex items-center text-gray-700 mb-0.5">
                    <span className="">Harga Item</span>
                    <span className="mr-1 ml-[12px]">:</span>
                    <span>
                      Rp. {productDetails?.priceItem.toLocaleString("id-ID")}
                    </span>
                  </li>
                  <li className="flex items-center text-gray-700 mb-0.5 ">
                    <span className={``}>Keterangan</span>
                    <span className="mr-1 ml-[11px]">:</span>
                    <span
                      className={`text-justify overflow-auto ${
                        productDetails?.notes &&
                        productDetails.notes.length > 30
                          ? "h-[60px] font-semibold"
                          : "h-auto"
                      }`}
                    >
                      {" "}
                      {productDetails?.notes == "" ? (
                        <>-</>
                      ) : (
                        <>{productDetails?.notes}</>
                      )}
                    </span>
                  </li>
                  {/* <li className="flex items-center text-gray-700 mb-0.5">
                    <span className="">Total Harga</span>
                    <span className="mr-1 ml-[11px]">:</span>
                    <span>
                      Rp. {productDetails?.totalAmount.toLocaleString("id-ID")}
                    </span>
                  </li> */}
                </ul>
                {/* close bagian detail product */}

                <hr className="ml-2 mt-2" />
                <div>
                  {/* bagian tambahan /addons */}
                  <div>
                    <div className="text-gray-700 ml-2 font-semibold">
                      Tambahan
                    </div>
                    {productDetails?.fullDataAddons.length === 0 ? (
                      <div className="ml-4 text-gray-700 text-sm">
                        Tidak ada tambahan
                      </div>
                    ) : (
                      <ul className="list-disc ml-4">
                        {productDetails.fullDataAddons.map((item) => (
                          <li className="flex items-center text-gray-700 text-sm mb-0.5">
                            <span className="flex-shrink-0 mr-[10px] ">
                              {item.name}
                            </span>
                            <span className="mr-1">:</span>
                            <span>
                              Rp. {item.price.toLocaleString("id-ID")}
                            </span>
                            <span className="ml-3">
                              x {productDetails?.totalItem}
                            </span>
                          </li>
                        ))}
                        <div className="text-gray-700 text-sm font-semibold">
                          <span>
                            Total Tambahan : Rp.{" "}
                            {productDetails?.price_addons_total.toLocaleString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                      </ul>
                    )}
                  </div>
                  {/* close bagian tambahan /addons */}
                </div>
              </div>
            </div>
            <div className="text-gray-700 text-md font-semibold mt-3">
              <span>Total Harga</span>
              <span className="ml-2  mr-2">:</span>
              <span>
                Rp. {productDetails?.price_total.toLocaleString("id-ID")}
              </span>
            </div>
            {/* Add other product details as needed */}
          </div>
        ) : (
          <p className="text-white">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default DetailKeranjang;
