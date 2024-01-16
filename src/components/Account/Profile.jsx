import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [primary_address, setPrimary_address] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [image, setImage] = useState(null); // State untuk menyimpan file gambar yang dipilih
  const [imagePreview, setImagePreview] = useState(null); // State untuk preview gambar
  const { id } = useParams();

  useEffect(() => {
    const getUserById = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_KEY;
        const response = await axios.get(
          `${API_URL}/api/v1/customer-account/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data.data);

        setName(response.data.data.name);
        setEmail(response.data.data.email);
        setImage(response.data.data.image);
        setPrimary_address(response.data.data.primary_address);
        setPhone_number(response.data.data.phone_number);
      } catch (error) {
        if (error.response) {
          console.log("error", error.response.data.message);
        }
      }
    };
    getUserById();
  }, [id]);

  const handleImageChange = (e) => {
    // Memperbarui state 'image' dengan file yang dipilih
    setImage(e.target.files[0]);

    // Menampilkan preview gambar
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_KEY;
      const token = localStorage.getItem("token");

      const formData = new FormData(); // Buat objek FormData untuk mengirim file

      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone_number", phone_number);
      formData.append("primary_address", primary_address);

      // Tambahkan file 'image' ke FormData
      if (image) {
        formData.append("image", image);
      }
      console.log("FormData:", formData);
      await axios
        .put(`${API_URL}/api/v1/customer-account/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Setel tipe konten untuk unggah file
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          console.log("Response Data:", data);
          // Swal.fire({
          //   icon: "success",
          //   text: data.message,
          // });
        });
      // window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.log(error);
      } else {
        Swal.fire({
          text: error.message,
          icon: "error",
        });
      }
    }
  };
  return (
    <>
      <div className="lg:p-10 p-5 md:pt-10 lg:flex md:flex lg:mr-10 md:mr-20 mr-0 justify-center items-center">
        <div className="font-semibold lg:hidden md:hidden block mb-4">
          Edit Profile
        </div>
        <div className="md:w-1/2 lg:w-1/5 mb-5 md:mb-0">
          <div className="relative flex items-center justify-center">
            <label
              htmlFor="imageInput"
              className="w-36 h-36 md:w-40 md:h-40 bg-gray-200 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-300 flex items-center justify-center"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full rounded-lg"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="imageInput"
            />
          </div>
          <label
            htmlFor="imageInput"
            className="block text-center mt-2 text-[#6E205E] cursor-pointer"
          >
            Choose Photo
          </label>
        </div>
        <form
          className="w-full md:w-1/2 lg:w-80"
          onSubmit={updateProfile}
          encType="multipart/form-data"
        >
          <div className="">
            <div className="pl-5 pb-5 font-semibold lg:block md:block hidden">
              Edit Profile
            </div>

            <div className="mb-5">
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block rounded-xl border border-[#6E205E] w-full p-2.5  text-sm text-gray-900 flex-1 min-w-0  focus:border-[#6E205E] focus:ring-[#6E205E] focus:outline-none focus:ring focus:ring-opacity-5"
                  placeholder="Name"
                  required
                />
              </div>
            </div>
            <div className="mb-5">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block rounded-xl border w-full p-2.5 border-[#6E205E] text-sm text-gray-900 flex-1 min-w-0  focus:border-[#6E205E] focus:ring-[#6E205E] focus:outline-none focus:ring focus:ring-opacity-5"
                  placeholder="Email"
                  required
                />
              </div>
            </div>
            <div className="mb-5">
              <div className="relative">
                <input
                  type="number"
                  value={phone_number}
                  onChange={(e) => setPhone_number(e.target.value)}
                  className="block rounded-xl border w-full p-2.5 border-[#6E205E] text-sm text-gray-900 flex-1 min-w-0  focus:border-[#6E205E] focus:ring-[#6E205E] focus:outline-none focus:ring focus:ring-opacity-5"
                  placeholder="Phone Number"
                  required
                />
              </div>
            </div>
            <div className="mb-5">
              <div className="relative">
                <textarea
                  type="text"
                  value={primary_address}
                  onChange={(e) => setPrimary_address(e.target.value)}
                  className="block rounded-xl border w-full p-2.5 border-[#6E205E] text-sm text-gray-900 flex-1 min-w-0  focus:border-[#6E205E] focus:ring-[#6E205E] focus:outline-none focus:ring focus:ring-opacity-5"
                  placeholder="Address"
                  rows={4}
                  required
                ></textarea>
              </div>
            </div>

            <div className="">
              <div className="">
                <button
                  type="submit"
                  className="shadow-lg w-full px-5 py-1  text-white  bg-[#6E205E] rounded-lg hover:bg-[#8f397c] focus:outline-none focus:bg-[#8f397c]"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
