import React, { useEffect, useState } from "react";
import LoadingProduct from "../Loading/LoadingProduct";
import { Link } from "react-router-dom";
import Nt from "../../assets/not.jpg";
import Vm from "../../assets/vm.png";
import Lg from "../../assets/logo.png";

const Outlet = ({ searchTermOutlet }) => {
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const itemsToShow = showMore ? searchTermOutlet.length : 10;

  const [visibleData, setVisibleData] = useState([]);

  const API_URL = import.meta.env.VITE_API_KEY;
  // console.log(searchTermOutlet);
  useEffect(() => {
    const filterProductsByCategory = () => {
      setVisibleData(searchTermOutlet.slice(0, itemsToShow));

      // Jika ada kategori yang dipilih, filter produk berdasarkan kategori
      const filtered = searchTermOutlet.filter((item) =>
        item?.name.toLowerCase()
      );
      setVisibleData(filtered.slice(0, itemsToShow));
    };

    filterProductsByCategory();
    setLoading(false);
  }, [searchTermOutlet, itemsToShow]);

  const toggleShowMore = () => {
    setShowMore(!showMore); // Mem-balik showMore
    // Update visibleData saat showMore berubah
    setVisibleData(
      !showMore ? searchTermOutlet : searchTermOutlet.slice(0, itemsToShow)
    ); // Mem-balik !showMore di sini juga
  };
  return (
    <div className="px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 mt-8">
      <div className="font-bold text-gray-900 mb-4 text-xl">Daftar Outlet</div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          <LoadingProduct />
          <LoadingProduct />
          <LoadingProduct />
          <LoadingProduct />
          <LoadingProduct />
        </div>
      ) : (
        <div>
          {/* products list */}
          {visibleData.length === 0 ? (
            <div className="text-center pt-10 text-gray-500">
              <img
                src={Nt}
                alt="Tidak ada Outlet"
                className="responsive-image"
              />
              <p>Tidak ada Outlet yang tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {visibleData.map((item) => (
                <Link
                  to={`/products/${item.id}`}
                  className="bg-white border rounded-lg shadow hover:shadow-2xl"
                  key={item.id}
                >
                  {/* <div className="flex items-center justify-center h-40 bg-gray-300 rounded-t-lg">
                    <svg
                      className="w-10 h-10 text-gray-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 20"
                    >
                      <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                      <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                  </div> */}
                  {/* <div className="flex justify-center items-center bg-gray-300 rounded-t-lg">
                    <img
                      src={Lg}
                      className="w-auto  h-36 object-cover rounded-t-lg"
                    />
                  </div> */}
                  <div className="flex justify-center items-center bg-gray-300 rounded-t-lg">
                    <img
                      src={
                        item.image == null ? Lg  : `${API_URL}/${item.image}` // Gunakan Lg sebagai sumber gambar default jika item.image == null
                      }
                      className="w-auto h-36 object-cover rounded-t-lg"
                      alt={item.name}
                    />
                  </div>
                  <div className="p-4">
                    <Link to={`/products/${item.id}`}>
                      <div className="mb-2 text-md font-semibold text-gray-900">
                        {item.name}
                      </div>
                    </Link>
                    <div className="text-sm text-gray-500">
                      {item.phone_number}
                    </div>
                    <div className="text-sm text-gray-500">{item.address}</div>

                    <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-[#F20000]">
                      {/* Rp {item.price} */}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div>
            {visibleData.length === 0 ? (
              ""
            ) : (
              <div className="flex justify-center mt-6">
                {visibleData.length > 3 && (
                  <button
                    onClick={toggleShowMore}
                    className="px-4 py-2 rounded-lg font-bold text-[#6E205E] focus:outline-none bg-white border border-[#6E205E] hover:bg-gray-100 hover:text-[#6E205E] focus:z-10 focus:ring-4 focus:ring-gray-200"
                  >
                    {showMore ? "Tampilkan Kurang" : "Muat Lebih Banyak"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* close products list */}
        </div>
      )}
    </div>
  );
};

export default Outlet;
