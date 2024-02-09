import ProductKeranjang2 from "../../components/Products/ProductKeranjang";
import BottomBar from "../../components/bottombar/BottomBar";
import Iklan from "../../components/iklan/Iklan";

const ProductKeranjang = () => {
  return (
    <>
      {" "}
      <div className="sm:mb-[210px] md:mb-[210px] lg:mb-[260px] mb-[70px]">
        <ProductKeranjang2 />
      </div>
      <div className="">
        <Iklan />
      </div>
    </>
  );
};

export default ProductKeranjang;
