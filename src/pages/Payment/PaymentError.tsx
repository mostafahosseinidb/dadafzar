import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentError: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/declare/step4");
  };

  return (
    <div className="w-[1366px] h-[668px] relative bg-white overflow-hidden mx-auto">
      {/* Background gradient circle */}
      <div className="w-[562px] h-[562px] left-[402px] top-[-359px] absolute bg-gradient-to-bl from-[#f3084e]/20 to-[#f2074e]/70 rounded-[500px] overflow-hidden">
        <div className="w-[87px] h-[227.95px] left-[505.43px] top-[309.71px] absolute origin-top-left rotate-[29.51deg] bg-gradient-to-b from-[#f2074e] to-[#f3084e]/0" />
        <div className="w-[468px] h-[468px] left-[58px] top-[41px] absolute bg-[#ffd5e1] rounded-full" />
      </div>
      
      {/* Error icon */}
      <div className="w-[84px] h-[84px] left-[641px] top-[161px] absolute bg-red-500 rounded-[70px] outline outline-[17px] outline-white overflow-hidden">
        <div className="w-[43px] h-[43px] left-[20px] top-[20px] absolute overflow-hidden flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      
      {/* Error message */}
      <div className="left-[522px] top-[334px] absolute text-right justify-start text-black text-xl font-medium font-['Yekan_Bakh']">
        خطا، پرداخت شما با مشکلی مواجه شده است.
      </div>
      
      {/* Action section */}
      <div className="w-[143px] left-[612px] top-[389px] absolute inline-flex flex-col justify-start items-center gap-[11px]">
        <div className="self-stretch text-right justify-start text-black text-sm font-medium font-['Yekan_Bakh']">
          جهت ادامه فرآیند کلیک کنید
        </div>
        <button
          onClick={handleBack}
          className="self-stretch h-12 px-3 bg-blue-600 rounded-lg inline-flex justify-center items-center gap-1 hover:bg-blue-700 transition-colors"
        >
          <div className="text-center justify-start text-white text-base font-medium font-['Yekan_Bakh'] leading-7">
            بازگشت
          </div>
        </button>
      </div>
      
      {/* Decorative line */}
      <div className="w-[35.75px] h-0 left-[795px] top-[135.28px] absolute origin-top-left -rotate-45 bg-white" />
    </div>
  );
};

export default PaymentError;
