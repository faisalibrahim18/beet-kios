import Lg from "../../assets/lg_robo.jfif";
import Lg1 from "../../assets/lgo_r.png";

const Topbar2 = () => {
  return (
    <>
      <div className="">
        <div className="bg-white shadow fixed z-50 bg-opacity-85 w-full flex justify-between ">
          {/* logo robo */}
          <div className="">
            <img
              src={Lg}
              alt=""
              className="lg:w-[130px] sm:w-[120px] md:w-[100px] w-[65px] m-2"
            />
          </div>
          {/* close logo robo */}

          {/* logo beetpos */}
          <div className="">
            <img
              src={Lg1}
              alt=""
              className="lg:w-[130px]  sm:w-[120px] lg:mt-4 md:mt-4 mt-3 md:w-[100px] w-[75px] m-2 mr-4"
            />
          </div>
          {/* close logo beetpos */}
        </div>
      </div>
    </>
  );
};

export default Topbar2;
