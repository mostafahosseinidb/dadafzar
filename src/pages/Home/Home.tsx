import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="w-[924px] mx-auto flex flex-col justify-center items-center gap-10">
        <div className="self-stretch inline-flex justify-start items-center gap-5">
          <div className="w-[492px] inline-flex flex-col justify-start items-start gap-5">
            <div className="self-stretch h-[164px] relative bg-white rounded-[15px] shadow-[0px_4px_7.800000190734863px_0px_rgba(38,68,130,0.05)] outline outline-[10px] outline-offset-[-10px] outline-white overflow-hidden">
              <img
                className="w-[492px] h-[275px] left-0 top-[-74px] absolute"
                src="/image/loginImage.png"
                alt="Dashboard preview"
              />
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-6">
              <div className="w-[233px] h-[124px] py-3.5 bg-white rounded-[10px] shadow-[0px_4px_7.800000190734863px_0px_rgba(38,68,130,0.05)] outline outline-1 outline-offset-[-1px] outline-stormGray-200 inline-flex flex-col justify-between items-center">
                <div className="inline-flex justify-center items-center gap-2.5">
                  <svg
                    width="33"
                    height="32"
                    viewBox="0 0 33 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M30.9186 14.9535H27.9772C27.4581 9.63721 23.0749 5.3814 17.5814 4.89302V2.04651C17.5814 1.47442 17.0912 1 16.5 1C15.9088 1 15.4186 1.47442 15.4186 2.04651V4.89302C9.92512 5.39535 5.52744 9.63721 5.02279 14.9535H2.0814C1.49023 14.9535 1 15.4279 1 16C1 16.5721 1.49023 17.0465 2.0814 17.0465H5.02279C5.54186 22.3628 9.92512 26.6186 15.4186 27.107V29.9535C15.4186 30.5256 15.9088 31 16.5 31C17.0912 31 17.5814 30.5256 17.5814 29.9535V27.107C23.0749 26.6046 27.4726 22.3628 27.9772 17.0465H30.9186C31.5098 17.0465 32 16.5721 32 16C32 15.4279 31.5098 14.9535 30.9186 14.9535ZM16.5 20.3535C14.02 20.3535 12.0014 18.4 12.0014 16C12.0014 13.6 14.02 11.6465 16.5 11.6465C18.98 11.6465 20.9986 13.6 20.9986 16C20.9986 18.4 18.98 20.3535 16.5 20.3535Z"
                      fill="#6DEDBC"
                    />
                  </svg>

                  <div className="text-right justify-start text-black text-sm font-medium ">
                    تعــــــــداد
                    <br />
                    اظهارنامه‌‌ها فعال
                  </div>
                </div>
                <div className="w-[178px] h-0 outline outline-1 outline-offset-[-0.50px] outline-stormGray-200" />
                <div className="text-center justify-start text-Black text-base font-medium  leading-[27px]">
                  0
                </div>
              </div>
              <div className="w-[235px] h-[124px] py-3.5 bg-white rounded-[10px] shadow-[0px_4px_7.800000190734863px_0px_rgba(38,68,130,0.05)] outline outline-1 outline-offset-[-1px] outline-stormGray-200 inline-flex flex-col justify-center items-center gap-2.5">
                <div className="inline-flex justify-center items-center gap-2.5">
                  <svg
                    width="32"
                    height="33"
                    viewBox="0 0 32 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.7463 4H10.2661C5.71385 4 3 6.7125 3 11.2625V21.725C3 26.2875 5.71385 29 10.2661 29H20.7338C25.2861 29 28 26.2875 28 21.7375V11.2625C28.0125 6.7125 25.2986 4 20.7463 4ZM22.1971 12.8125L19.2706 22.2375C18.5703 24.475 15.4312 24.5125 14.6933 22.2875L13.8179 19.7C13.5803 18.9875 13.0175 18.4125 12.3046 18.1875L9.70334 17.3125C7.50224 16.575 7.52726 13.4125 9.76587 12.7375L19.1956 9.8C21.0465 9.2375 22.7849 10.975 22.1971 12.8125Z"
                      fill="#FFC043"
                    />
                  </svg>
                  <div className="w-[115px] text-right justify-start text-black text-sm font-medium ">
                    تعداد اظهارنامه‌‌های <br />
                    ارسال شده
                  </div>
                </div>
                <div className="w-[178px] h-0 outline outline-1 outline-offset-[-0.50px] outline-stormGray-200" />
                <div className="text-center justify-start text-Black text-base font-medium  leading-[27px]">
                  0
                </div>
              </div>
            </div>
          </div>
          <div className="w-[412px] h-[308px] relative bg-white rounded-[15px] shadow-[0px_4px_7.800000190734863px_0px_rgba(38,68,130,0.05)] outline outline-1 outline-offset-[-1px] outline-stormGray-200 overflow-hidden">
            <div className=" justify-start text-black text-sm font-medium p-5 ">
              آموزش استفاده از پنل
            </div>
            <div className="w-[372px] h-[234px] bg-Storm-Gray-100 rounded-[10px] overflow-hidden" />
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-end gap-2">
          <div className="self-stretch text-right justify-start text-black text-base font-medium  leading-[27px]">
            تمپلیت‌های شما
          </div>
          <div className="self-stretch inline-flex justify-start items-center gap-[15px]">
            <Link to="/declare" className="w-[172px] h-[98px] flex items-center justify-center relative bg-white rounded-[10px] shadow-[0px_4px_7.800000190734863px_0px_rgba(38,68,130,0.05)] outline outline-1 outline-offset-[-1px] outline-stormGray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center justify-start text-Black text-sm font-medium ">
                ثبت اظهارنامه مطالبه طلب
              </div>
            </Link>
            <Link to="/declare" className="w-[173px] h-[98px] flex items-center justify-center relative bg-white rounded-[10px] shadow-[0px_4px_7.800000190734863px_0px_rgba(38,68,130,0.05)] outline outline-1 outline-offset-[-1px] outline-stormGray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className=" text-center justify-start text-Black text-sm font-medium ">
                ثبت اظهارنامه
                <br />
                الزام به به انجام تعهدات
              </div>
            </Link>
            <Link to="/declare" className="w-[173px] h-[98px] flex items-center justify-center relative bg-white rounded-[10px] shadow-[0px_4px_7.800000190734863px_0px_rgba(38,68,130,0.05)] outline outline-1 outline-offset-[-1px] outline-stormGray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center justify-start text-Black text-sm font-medium ">
                ثبت اظهارنامه
                <br />
                خام
              </div>
            </Link>
            <Link to="/declare" className="w-[173px] h-[98px] flex items-center justify-center relative bg-white rounded-[10px] shadow-[0px_4px_7.800000190734863px_0px_rgba(38,68,130,0.05)] outline outline-1 outline-offset-[-1px] outline-stormGray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center justify-start text-Black text-sm font-medium ">
                ثبت اظهارنامه
                <br />
                خام
              </div>
            </Link>

            <div className="w-[172px] h-[98px] flex items-center justify-center relative bg-white rounded-[10px] shadow-[0px_4px_7.800000190734863px_0px_rgba(38,68,130,0.05)] outline outline-2 outline-offset-[-2px] outline-Tropical-Blue-900 overflow-hidden">
              <div className=" inline-flex justify-start items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#264482"
                    d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"
                  />
                </svg>
                <div className="text-right justify-start text-tropicalBlue-900 text-base font-medium  leading-[27px]">
                  تمپلیت جدید
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
