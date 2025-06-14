import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../api/auth";
import { toast } from "react-toastify";

const OTP_LENGTH = 6;

interface LocationState {
  phoneNumber: string;
  nationalId: string;
}

const OtpVerify: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(85); // 1:25 in seconds
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber, nationalId } = (location.state as LocationState) || {};

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    if (!phoneNumber || !nationalId) {
      setError("اطلاعات کاربری یافت نشد. لطفا دوباره وارد شوید.");
      navigate("/login");
    }
  }, [phoneNumber, nationalId, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (otpCode: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.verifyOtp({
        otp: parseInt(otpCode),
        phoneNumber,
        nationalId,
      });
      console.log("Full response:", response);
      if (response?.token) {
        localStorage.setItem("token", response.token);
        navigate("/dashboard");
      } else {
        setError("کد تایید نامعتبر است");
      }
    } catch (err) {
      setError("خطا در تایید کد. لطفا دوباره تلاش کنید.");
      console.error("OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== OTP_LENGTH) {
      setError("Please enter the complete verification code");
      return;
    }

    await verifyOtp(otpCode);
  };

  const handleChangePhone = () => {
    navigate("/login");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login({
        nationalId,
        phoneNumber,
      });
      setTimer(85); // Reset timer
      toast.success(response?.data?.message);
    } catch (err) {
      setError("خطا در ارسال مجدد کد. لطفا دوباره تلاش کنید.");
      console.error("Resend code error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative bg-white flex flex-row items-center justify-center gap-5">
      <div className="w-[660px] h-[612px] bg-black/20 rounded-[20px] overflow-hidden">
        <img
          src="/image/loginImage.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-[600px] flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6 w-full"
        >
          <div className="text-2xl font-bold text-center mb-2">دریافت کد</div>
          <div className="text-base text-Dove-Gray-500 text-center mb-4">
            لطفا کد ارسال شده به تلفن همراهتان را وارد کنید.
          </div>
          <div className="flex flex-row justify-center items-center gap-4 mb-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-[60px] h-[60px] rounded-lg bg-[#F4F6F9] text-center text-2xl font-bold border border-gray-200 focus:border-tropicalBlue-900 outline-none transition-all"
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-[448px] h-12 p-2.5 bg-tropicalBlue-900 rounded-lg inline-flex justify-center items-center gap-2.5 text-white text-base font-medium leading-[27px] disabled:opacity-50"
          >
            {isLoading ? "در حال بررسی..." : "ورود"}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <div className="flex flex-row justify-between items-center w-[448px] mt-2 ">
            {timer > 0 ? (
              <span className="text-sm text-gray-500">{formatTime(timer)}</span>
            ) : (
              <button
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-right justify-start text-Cerulean-Blue-700 text-base font-medium px-0 bg-transparent leading-[27px] disabled:opacity-50 hover:outline-none hover:border-none"
              >
                ارسال مجدد کد
              </button>
            )}

            <button
              className="flex justify-start items-center gap-[11px] !bg-transparent !px-0"
              onClick={handleChangePhone}
            >
              <div className="text-right justify-start text-Black text-sm font-medium ">
                تغییر شماره همراه
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                </g>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;
