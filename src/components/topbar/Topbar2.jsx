import Lg from "../../assets/lg_robo.jfif";
import Lg1 from "../../assets/logo.png";

const Topbar2 = () => {
  return (
    <>
      <div>
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
              className="lg:w-[60px] md:w-[50px] sm:w-[60px] w-[35px] m-2 mr-4"
            />
          </div>
          {/* close logo beetpos */}
        </div>
      </div>
    </>
  );
};

export default Topbar2;
