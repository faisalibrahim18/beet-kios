import { Footer } from "flowbite-react";
import ProductList1 from "../../components/Products/ProductList";
import Topbar2 from "../../components/topbar/Topbar2";
import BottomBar from "../../components/bottombar/BottomBar";

const ProductsList = () => {
  return (
    <>
      <div className="">
        <ProductList1 />
      </div>
      <BottomBar/>
    </>
  );
};

export default ProductsList;
