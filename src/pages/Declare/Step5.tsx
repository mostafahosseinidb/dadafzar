import React, { useState } from "react";
import DeclarationLayout from "../../components/DeclarationLayout";

type Step5State = "awaiting_approval" | "code_sent" | "code_expired";

// Configurable parameters
const CONFIG = {
  approvalWaitTime: "20:00", // Time to show in awaiting approval state
  codeValidityMinutes: 10, // How long the SMS code is valid
  codeLength: 4, // Length of SMS code
  approvalMessage:
    "درخواست شما برای دفتر قضایی ارسال شده است. بعد از تایید، کد ۵ رقمی از سامانه عدل ایران برای شما از طریق پیامک ارسال خواهد شد.",
  successMessage: "رمز موقت با موفقیت ارسال شد",
  resultMessage: "نتیجه از طریق پیامک به شما ارسال خواهد شد",
  expiredMessage: "لطفا برای احراز هویت مجدد درخواست دریافت کد را بدهید",
};

const Step5: React.FC = () => {
  const [smsCode, setSmsCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [currentState, setCurrentState] =
    useState<Step5State>("awaiting_approval");

  // useEffect(() => {
  //   let timer: NodeJS.Timeout;
  //   if (countdown > 0) {
  //     timer = setTimeout(() => setCountdown(countdown - 1), 1000);
  //   } else if (countdown === 0 && currentState === "code_sent") {
  //     setCurrentState("code_expired");
  //   }
  //   return () => clearTimeout(timer);
  // }, [countdown, currentState]);

  const handleSendCode = () => {
    setCurrentState("code_sent");
    setCountdown(CONFIG.codeValidityMinutes * 60); // Convert minutes to seconds
    // Here you would typically call an API to send the SMS
  };

  const handleResendCode = () => {
    setCurrentState("code_sent");
    setCountdown(CONFIG.codeValidityMinutes * 60); // Convert minutes to seconds
    setSmsCode("");
    // Here you would typically call an API to resend the SMS
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= CONFIG.codeLength) {
      setSmsCode(value);
    }
  };

  // const handleVerifyCode = () => {
  //   if (smsCode.length === CONFIG.codeLength) {
  //     // Here you would typically verify the code with the backend
  //     updateDeclarationData({ smsVerified: true });
  //     navigate("/declare/step6");
  //   }
  // };

  // const handleNext = () => {
  //   if (smsCode.length === CONFIG.codeLength) {
  //     handleVerifyCode();
  //   }
  // };

  // const handlePrev = () => {
  //   navigate("/declare/step4");
  // };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // const getProgressPercentage = () => {
  //   if (countdown === 0) return 0;
  //   const totalSeconds = CONFIG.codeValidityMinutes * 60;
  //   return ((totalSeconds - countdown) / totalSeconds) * 100;
  // };

  const renderNotificationBanner = () => {
    switch (currentState) {
      case "awaiting_approval":
        return (
          <div className="flex items-center gap-3 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            {/* Warning Icon */}
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex items-start w-full gap-3">
              {/* Main Content */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    در انتظار تایید دفتر قضایی
                  </h3>
                  <span className="text-lg font-bold text-yellow-600">
                    {CONFIG.approvalWaitTime}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-700">
                  {CONFIG.approvalMessage}
                </p>
              </div>

              {/* Status Tag */}
              <div className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-md">
                در انتظار تایید
              </div>
            </div>
          </div>
        );

      case "code_sent":
        return (
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-start gap-3">
              {/* Status Tag */}
              <div className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 border border-green-300 rounded-md">
                در حال بررسی از سمت دفاتر
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {CONFIG.successMessage} {formatTime(countdown)}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-700">
                  {CONFIG.resultMessage}
                </p>
              </div>

              {/* Success Icon */}
              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-green-500 rounded-full">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        );

      case "code_expired":
        return (
          <div className="flex items-center gap-3 p-4 border border-pink-200 rounded-lg bg-pink-50">
            {/* Error Icon */}
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-pink-500 rounded-full">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex items-start w-full gap-3">
              {/* Main Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    کد منقضی شده
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-700">
                  {CONFIG.expiredMessage}
                </p>
              </div>
              {/* Status Tag */}
              <div className="px-3 py-1 text-sm font-medium text-pink-800 bg-pink-100 border border-pink-300 rounded-md">
                کد منقضی شده
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DeclarationLayout currentStep={5}>
      <div className="space-y-6">
        {/* Dynamic Notification Banner - Show for awaiting_approval and code_expired states */}
        {(currentState === "awaiting_approval" ||
          currentState === "code_expired") &&
          renderNotificationBanner()}

        {/* SMS Code Section */}
        <div className="w-full bg-stormGray-50 rounded-[20px] p-6">
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div className="text-right">
                <h3 className="text-base font-bold text-black">
                  رمز موقت امضا دادخواست
                </h3>
                <div className="w-full h-px mt-2 bg-stormGray-200"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-2 border-2 rounded-full bg-ceruleanBlue-100 border-tropicalBlue-400">
                  <span className="text-sm font-medium text-black">
                    رمز موقت برای شما پیامک شده است
                  </span>
                </div>
              </div>
            </div>

            {/* SMS Code Input Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-black">
                  لطفا کد پیامک شده را اینجا وارد نمایید.
                </p>
              </div>

              <div className="flex items-end gap-4">
                {/* SMS Code Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={smsCode}
                    onChange={handleCodeChange}
                    placeholder={`کد ${CONFIG.codeLength} رقمی`}
                    maxLength={CONFIG.codeLength}
                    className="w-full h-12 px-4 text-sm font-medium text-right text-black bg-white border rounded-lg border-stormGray-200 focus:outline-none focus:ring-2 focus:ring-ceruleanBlue-500 focus:border-transparent"
                    disabled={
                      currentState === "awaiting_approval" ||
                      currentState === "code_expired"
                    }
                  />
                </div>

                {/* Send/Resend Code Button */}
                <button
                  onClick={
                    currentState === "code_expired"
                      ? handleResendCode
                      : handleSendCode
                  }
                  disabled={currentState === "awaiting_approval"}
                  className={`h-12 px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
                    currentState === "awaiting_approval"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-tropicalBlue-800 text-white hover:bg-tropicalBlue-700"
                  }`}
                >
                  {currentState === "code_expired" ? "ارسال مجدد" : "ارسال کد"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {/* <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={handlePrev}
            className="px-6 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            مرحله قبل
          </button>

          <button
            onClick={handleNext}
            disabled={
              smsCode.length !== CONFIG.codeLength ||
              currentState === "awaiting_approval" ||
              currentState === "code_expired"
            }
            className={`px-6 py-2 rounded-lg transition-colors ${
              smsCode.length === CONFIG.codeLength && currentState === "code_sent"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            مرحله بعد
          </button>
        </div> */}
      </div>
    </DeclarationLayout>
  );
};

export default Step5;
