import { useNavigate } from "react-router-dom";
import ProductDetail2 from "../../components/Products/ProductDetail";
import { useEffect } from "react";
import { checkTokenExpiration } from "../../utils/token";
import Swal from "sweetalert2";

const ProductsDetail = () => {
  const navigate = useNavigate();

  // cek expired token
  useEffect(() => {
    checkTokenExpiration();
    const token = localStorage.getItem("token");
    if (!token) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "warning",
        text: "Anda harus Login Terlebih dahulu!",
      });
      navigate("/");
    }
  });
  // close cek expired token

  return (
    <>
    
      <div className="">
        <ProductDetail2 />
      </div>
      
    </>
  );
};

export default ProductsDetail;
