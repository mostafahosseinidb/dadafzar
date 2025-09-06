import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get payment data from location state
  const paymentData = location.state || {
    amount: "۲,۰۰۰,۰۰۰",
    trackingNumber: "745865998",
    date: "20 دی-1402",
    time: "12:56",
    mobile: "09330217284"
  };

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCountdown(prev => {
  //       if (prev <= 1) {
  //         navigate("/declare/step5");
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [navigate]);

  const handleContinue = () => {
    navigate("/declare/step5");
  };

  return (
    <div className="w-[1366px] h-[668px] relative bg-white overflow-hidden mx-auto">
      {/* Background Gradient Circle */}
      <div className="w-[562px] h-[562px] left-[402px] top-[-359px] absolute bg-gradient-to-bl from-[#ceffef] to-[#b5fce6] rounded-[500px] overflow-hidden">
        <div className="w-[87px] h-[227.95px] left-[505.43px] top-[309.71px] absolute origin-top-left rotate-[29.51deg] bg-gradient-to-b from-[#b6fce7] to-[#b6fce7]/0" />
        <div className="w-[468px] h-[468px] left-[58px] top-[41px] absolute bg-[#ceffef] rounded-full" />
      </div>

      {/* Success Icon */}
      <div className="w-[84px] h-[84px] left-[641px] top-[161px] absolute bg-green-500 rounded-[70px] outline outline-[17px] outline-white overflow-hidden">
        <div className="w-8 h-8 left-[26px] top-[26px] absolute overflow-hidden">
          <div className="w-[21.33px] h-[14.67px] left-[5.33px] top-[8px] absolute">
            <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="left-[526px] top-[289px] absolute text-right justify-start text-black text-xl font-medium font-['Yekan_Bakh']">
        متشکریم، پرداخت شما با موفقیت انجام شد
      </div>

      {/* Payment Details */}
      <div className="w-[616px] px-[50px] py-6 left-[375px] top-[344px] absolute bg-gray-50 rounded-[10px] shadow-[0px_4px_5.800000190734863px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] inline-flex justify-center items-center gap-[30px]">
        <div className="inline-flex flex-col items-center justify-center gap-3">
          <div className="text-right justify-start text-gray-500 text-base font-medium font-['Yekan_Bakh'] leading-[27px]">مبلغ</div>
          <div className="inline-flex items-center justify-center gap-1">
            <div className="text-right justify-start text-gray-600 text-xs font-medium font-['Yekan_Bakh']">تومان</div>
            <div className="text-right justify-start text-black text-base font-medium font-['Yekan_Bakh'] leading-[27px]">{paymentData.amount}</div>
          </div>
        </div>
        <div className="w-0 h-[52px] outline outline-1 outline-offset-[-0.50px] outline-gray-200" />
        <div className="inline-flex flex-col items-center justify-center gap-3">
          <div className="text-right justify-start text-gray-500 text-base font-medium font-['Yekan_Bakh'] leading-[27px]">شماره همراه</div>
          <div className="text-right justify-start text-black text-base font-medium font-['Yekan_Bakh'] leading-[27px]">{paymentData.mobile}</div>
        </div>
        <div className="w-0 h-[52px] outline outline-1 outline-offset-[-0.50px] outline-gray-200" />
        <div className="inline-flex flex-col items-center justify-center gap-3">
          <div className="text-right justify-start text-gray-500 text-base font-medium font-['Yekan_Bakh'] leading-[27px]">تاریخ</div>
          <div className="text-right justify-start text-black text-base font-medium font-['Yekan_Bakh'] leading-[27px]">{paymentData.date}, {paymentData.time}</div>
        </div>
        <div className="w-0 h-[52px] outline outline-1 outline-offset-[-0.50px] outline-gray-200" />
        <div className="inline-flex flex-col items-center justify-center gap-3">
          <div className="text-right justify-start text-gray-500 text-base font-medium font-['Yekan_Bakh'] leading-[27px]">شماره پیگیری</div>
          <div className="text-right justify-start text-black text-base font-medium font-['Yekan_Bakh'] leading-[27px]">{paymentData.trackingNumber}</div>
        </div>
      </div>

      {/* Continue Button Section */}
      <div className="w-[143px] left-[612px] top-[488px] absolute inline-flex flex-col justify-start items-center gap-[11px]">
        <div className="self-stretch text-right justify-start text-gray-900 text-sm font-medium font-['Yekan_Bakh']">
          جهت ادامه فرآیند کلیک کنید
        </div>
        <button
          onClick={handleContinue}
          className="inline-flex items-center self-stretch justify-center h-12 gap-1 px-3 transition-colors bg-blue-800 rounded-lg hover:bg-blue-900"
        >
          <div className="text-center justify-start text-white text-base font-medium font-['Yekan_Bakh'] leading-7">
            ادامه فرآیند
          </div>
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
