import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentGateway: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Get payment data from location state
  const paymentData = location.state || {
    amount: "۳۶۲,۵۰۰",
    description: "هزینه ثبت اظهارنامه",
    trackingNumber: "745865998"
  };

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      setIsProcessing(true);
      
      // Simulate payment result (80% success rate)
      const isSuccess = Math.random() > 0.2;
      
      setTimeout(() => {
        if (isSuccess) {
          navigate("/payment/success", {
            state: {
              ...paymentData,
              trackingNumber: Math.floor(Math.random() * 1000000000).toString(),
              date: new Date().toLocaleDateString('fa-IR'),
              time: new Date().toLocaleTimeString('fa-IR'),
              mobile: "09330217284"
            }
          });
        } else {
          navigate("/payment/error", {
            state: paymentData
          });
        }
      }, 2000);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, paymentData]);

  useEffect(() => {
    if (isProcessing) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isProcessing]);

  const handleCancel = () => {
    navigate("/declare/step4");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">درگاه پرداخت</h1>
          <p className="text-gray-600">لطفاً منتظر بمانید تا به درگاه پرداخت منتقل شوید</p>
        </div>

        {/* Payment Details */}
        <div className="p-6 mb-6 bg-gray-50 rounded-xl">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">جزئیات پرداخت</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">مبلغ:</span>
              <span className="font-semibold text-gray-900">{paymentData.amount} تومان</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">شرح:</span>
              <span className="font-semibold text-gray-900">{paymentData.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">شماره پیگیری:</span>
              <span className="font-semibold text-gray-900">{paymentData.trackingNumber}</span>
            </div>
          </div>
        </div>

        {/* Processing Status */}
        {!isProcessing ? (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
            <p className="mb-2 text-gray-600">در حال انتقال به درگاه پرداخت...</p>
            <p className="text-sm text-gray-500">لطفاً منتظر بمانید ({countdown} ثانیه)</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-green-200 rounded-full border-t-green-600 animate-spin"></div>
            <p className="mb-2 text-gray-600">در حال پردازش پرداخت...</p>
            <p className="text-sm text-gray-500">لطفاً منتظر بمانید</p>
          </div>
        )}

        {/* Cancel Button */}
        <button
          onClick={handleCancel}
          className="w-full px-4 py-3 mt-6 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          انصراف از پرداخت
        </button>
      </div>
    </div>
  );
};

export default PaymentGateway;
