import React, { useState } from "react";

const SearchProduct = ({ products, setSearchTerm }) => {
  const [searchValue, setSearchValue] = useState(""); // State untuk nilai pencarian
  const handleSubmit = (e) => e.preventDefault();
  // Handler untuk mengatur nilai pencarian saat input berubah
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value); // Update nilai pencarian saat input berubah

    if (!value) {
      setSearchTerm(products);
    } else {
      const resultsArray = products.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchTerm(resultsArray);
    }
  };

  // Handler untuk menghapus teks pencarian
  const clearSearch = () => {
    setSearchValue("");
    setSearchTerm(products);
  };

  return (
    <div className="w-full lg:pr-10 pr-3">
      {" "}
      <form className="lg:pt-3 pt-2 pl-5 lg:pl-10" onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <svg
              className="w-4 h-4 lg:w-6 lg:h-6  text-[#6E205E] text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            {/* <img
                      src={"/"}
                      className="lg:h-auto lg:w-auto bounce-top-icons bg-opacity-100 "
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                    /> */}
          </div>
          <input
            type="text"
            value={searchValue} // Bind nilai input dengan state
            onChange={handleSearchChange}
            className="block rounded-xl w-full border lg:p-2 p-1.5 lg:pl-10 pl-8 text-sm text-gray-900 focus:border-[#6E205E] focus:ring-[#6E205E] focus:outline-none focus:ring focus:ring-opacity-5"
            placeholder="Search"
          />
          {searchValue && ( // Tampilkan tombol "X" hanya jika ada teks pencarian
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 cursor-pointer"
              onClick={clearSearch} // Handler untuk menghapus teks pencarian
            >
              <svg
                className="w-4 h-4 lg:w-6 lg:h-6 text-[#6E205E] hover:text-[#9e438c]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchProduct;
