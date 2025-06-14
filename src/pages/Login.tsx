import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const navigate = useNavigate();

  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Simulate login and set token
  //   localStorage.setItem("token", "demo-token");
  //   navigate("/");
  // };

  return (
    <div className="h-screen w-full relative bg-white flex flex-row items-center justify-center gap-5 ">
      <div className="w-[632px] h-[612px] bg-black/20 rounded-[20px] overflow-hidden">
        <img
          src="/image/loginImage.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-[700px]">
        <div className="flex flex-col justify-start items-center gap-3">
          <div className="flex flex-col justify-start items-center gap-3 mb-2">
            <div className="text-right justify-start text-Black text-2xl font-bold">
              ورود با شماره همراه
            </div>
            <div className="text-right justify-start text-Dove-Gray-500 text-base font-medium leading-[27px]">
              برای ورود و ثبت نام شماره همراه و کدملی خود را واردنمایید
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-3">
            <div className="w-[378px] flex flex-col justify-center items-end gap-0.5">
              <div className="justify-start text-Dove-Gray-500 text-sm font-medium">
                شماره همراه
              </div>
              <input className="self-stretch h-12 p-2.5 bg-[#F4F6F9] rounded-[10px]" />
            </div>
            <div className="w-[378px] flex flex-col justify-center items-end gap-0.5">
              <div className="justify-start text-Dove-Gray-500 text-sm font-medium">
                کدملی
              </div>
              <input className="self-stretch h-12 p-2.5 bg-[#F4F6F9] rounded-[10px]" />
            </div>
          </div>
          <div className="text-right justify-start">
            <span className="text-[#F3084E] text-sm font-medium">توجه:</span>
            <span className="text-Black text-sm font-medium">
              {" "}
              کدملی و شماره همراه باید متعلق به یک نفر باشد
            </span>
          </div>
          <button className="w-[378px] h-12 p-2.5 bg-tropicalBlue-900 rounded-lg inline-flex justify-center items-center gap-2.5text-right mt-3 text-white text-base font-medium leading-[27px]">
            ادامه
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
