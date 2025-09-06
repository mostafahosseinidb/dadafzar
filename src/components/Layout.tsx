import React from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { confirmLogout } from "../api/auth";
import { useKycStatus } from "../api/kyc";

const Layout: React.FC = () => {
  const { isAuthenticated, expirationDate, isLoading } = useKycStatus();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-row  pr-[326px]">
      {/* Header or Sidebar can go here */}

      <aside className="fixed top-0 bottom-0 right-0 w-[326px] border-l border-StormGray-200 bg-white flex flex-col justify-start items-center">
        <div className="mt-11 mb-9">
          <img className=" h-[40px] " src="/image/logo.png" />
        </div>
        <nav className="w-[244px] flex flex-col justify-start items-start gap-4 h-full">
          <Link
            to={""}
            className="self-stretch p-2.5 bg-tropicalBlue-800 hover:bg-tropicalBlue-600 transition-all rounded-[10px] outline outline-1 outline-offset-[-1px] inline-flex justify-between items-center"
          >
            <div className="justify-start text-sm font-medium text-white ">
              پیشخوان
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-white rotate-90"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M4.43 8.512a.75.75 0 0 1 1.058-.081L12 14.012l6.512-5.581a.75.75 0 0 1 .976 1.138l-7 6a.75.75 0 0 1-.976 0l-7-6a.75.75 0 0 1-.081-1.057"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <div className="self-stretch px-2.5 py-5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-stormGray-200 flex flex-col justify-center items-start gap-4">
            <div className="self-stretch flex flex-col justify-center items-start pb-4 gap-3.5 border-b border-stormGray-200">
              <div className="justify-start text-sm font-medium text-Black ">
                اظهارنامه ها
              </div>
            </div>
            <Link
              to={""}
              className="self-stretch p-2.5 inline-flex justify-between items-center"
            >
              <div className="justify-start text-sm font-medium text-center text-Black ">
                همه اظهارنامه‌ها
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="w-4 h-4 rotate-90"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M4.43 8.512a.75.75 0 0 1 1.058-.081L12 14.012l6.512-5.581a.75.75 0 0 1 .976 1.138l-7 6a.75.75 0 0 1-.976 0l-7-6a.75.75 0 0 1-.081-1.057"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              to="/declare"
              className="self-stretch p-2.5 inline-flex justify-between items-center"
            >
              <div className="justify-start text-sm font-medium text-center text-Black ">
                ثبت اظهارنامه جدید
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="w-4 h-4 rotate-90"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M4.43 8.512a.75.75 0 0 1 1.058-.081L12 14.012l6.512-5.581a.75.75 0 0 1 .976 1.138l-7 6a.75.75 0 0 1-.976 0l-7-6a.75.75 0 0 1-.081-1.057"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              to={""}
              className="self-stretch p-2.5 inline-flex justify-between items-center"
            >
              <div className="justify-start text-sm font-medium text-center text-Black ">
                تمپلیت ها
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="w-4 h-4 rotate-90"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M4.43 8.512a.75.75 0 0 1 1.058-.081L12 14.012l6.512-5.581a.75.75 0 0 1 .976 1.138l-7 6a.75.75 0 0 1-.976 0l-7-6a.75.75 0 0 1-.081-1.057"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          <Link
            to={""}
            className="self-stretch p-2.5 bg-white rounded-[10px] inline-flex justify-between items-center"
          >
            <div className="justify-start text-sm font-medium text-Black ">
              کیف پول
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="w-4 h-4 rotate-90"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M4.43 8.512a.75.75 0 0 1 1.058-.081L12 14.012l6.512-5.581a.75.75 0 0 1 .976 1.138l-7 6a.75.75 0 0 1-.976 0l-7-6a.75.75 0 0 1-.081-1.057"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <Link
            to={""}
            className="self-stretch p-2.5 bg-white rounded-[10px] inline-flex justify-between items-center"
          >
            <div className="justify-start text-sm font-medium text-Black ">
              شرکت‌ها
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="w-4 h-4 rotate-90"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M4.43 8.512a.75.75 0 0 1 1.058-.081L12 14.012l6.512-5.581a.75.75 0 0 1 .976 1.138l-7 6a.75.75 0 0 1-.976 0l-7-6a.75.75 0 0 1-.081-1.057"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <Link
            to={""}
            className="self-stretch p-2.5 bg-white rounded-[10px] inline-flex justify-between items-center"
          >
            <div className="justify-start text-sm font-medium text-Black ">
              پنل کاربری
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="w-4 h-4 rotate-90"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M4.43 8.512a.75.75 0 0 1 1.058-.081L12 14.012l6.512-5.581a.75.75 0 0 1 .976 1.138l-7 6a.75.75 0 0 1-.976 0l-7-6a.75.75 0 0 1-.081-1.057"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          {/* Logout Button */}
          {/* <button
            onClick={confirmLogout}
            className="self-stretch p-2.5 bg-red-50 hover:bg-red-100 transition-colors rounded-[10px] inline-flex justify-between items-center text-red-600 hover:text-red-700 mt-auto"
            title="خروج از حساب کاربری"
          >
            <div className="justify-start text-sm font-medium">
              خروج از حساب
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 17L3 12L8 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 12H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button> */}
        </nav>
      </aside>
      <section className="w-full bg-stormGray-100">
        <header className="sticky top-0 left-0 right-0 w-full z-50  px-[58px] py-3.5 bg-white border-b border-Storm-Gray-200 inline-flex justify-between items-center">
          <div className="flex items-center justify-start gap-4">
            <div className="flex justify-start items-center gap-2.5">
              <div className="p-2 bg-[#2a5fcb] rounded-[10px] inline-flex justify-start items-center gap-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#fff"
                    d="M12 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8M6 8a6 6 0 1 1 12 0A6 6 0 0 1 6 8m2 10a3 3 0 0 0-3 3a1 1 0 1 1-2 0a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5a1 1 0 1 1-2 0a3 3 0 0 0-3-3z"
                  />
                </svg>
              </div>
              <p className="justify-start text-sm font-medium text-black ">
                ادمین
              </p>
            </div>
            {isLoading ? (
              <>loading... </>
            ) : isAuthenticated ? (
              <>
                <div className="h-[38px] pl-1.5 pr-2 py-1 bg-successLight rounded-[50px] outline outline-1 outline-offset-[-1px] outline-success flex justify-center items-center gap-2">
                  <div className="justify-start text-sm font-medium text-right text-Black ">
                    احراز هویت شده
                  </div>
                  <div className="px-1 py-0.5 bg-white rounded-[15px] flex justify-center items-center gap-2.5">
                    <div className="justify-start text-sm font-medium text-right text-Black ">
                      {expirationDate}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/userAuthorization" className="h-[38px] pl-1.5 pr-2 py-1 bg-[#FFEDC7] rounded-[50px] outline outline-1 outline-offset-[-1px] outline-[#F8C017] inline-flex justify-center items-center gap-1.5">
               
                  <div className="justify-start text-sm font-medium text-right text-Black ">
                    احراز هویت نشده
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="rotate-180"
                  >
                    <path
                      fill="#000"
                      fillRule="evenodd"
                      d="M8.512 4.43a.75.75 0 0 0-.081 1.058L14.012 12l-5.581 6.512a.75.75 0 1 0 1.138.976l6-7a.75.75 0 0 0 0-.976l-6-7a.75.75 0 0 0-1.057-.081"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center justify-start gap-5">
            <div className="p-2.5 bg-stormGray-50 rounded-[10px] flex justify-start items-center gap-3.5">
              <div className="flex justify-center items-center gap-2.5">
                <span className="justify-start text-sm font-medium text-black ">
                  شرکت مینو دشت گلستان
                </span>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="#000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="m5 9l7 6l7-6"
                />
              </svg>
            </div>
            <div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="24" height="24" fill="#1E1E1E" />
                <g id="pannel" clipPath="url(#clip0_3_11)">
                  <rect
                    width="1366"
                    height="728"
                    transform="translate(-58 -23)"
                    fill="#ECEFF3"
                  />
                  <g id="Frame 7">
                    <mask id="path-1-inside-1_3_11" fill="white">
                      <path d="M-58 -23H982V47H-58V-23Z" />
                    </mask>
                    <path d="M-58 -23H982V47H-58V-23Z" fill="white" />
                    <path
                      d="M982 47V46H-58V47V48H982V47Z"
                      fill="#DCE1E9"
                      mask="url(#path-1-inside-1_3_11)"
                    />
                    <g id="Frame 1000002663">
                      <g id="bell">
                        <path
                          id="Vector"
                          d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 10.8946 5.48703 12.9342 4.88533 14.3309C4.49389 15.2396 5.31337 17 6.30278 17H17.6972C18.6866 17 19.5061 15.2396 19.1147 14.3309C18.513 12.9342 18 10.8946 18 8Z"
                          stroke="#1842CC"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          id="Vector_2"
                          d="M13.7295 21C13.5537 21.3031 13.3014 21.5547 12.9978 21.7295C12.6941 21.9044 12.3499 21.9965 11.9995 21.9965C11.6492 21.9965 11.3049 21.9044 11.0013 21.7295C10.6977 21.5547 10.4453 21.3031 10.2695 21"
                          stroke="#1842CC"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </g>
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_3_11">
                    <rect
                      width="1366"
                      height="728"
                      fill="white"
                      transform="translate(-58 -23)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <button
              onClick={confirmLogout}
              className="p-2.5 bg-red-50 hover:bg-red-100 transition-colors rounded-[10px] flex items-center gap-2 text-red-600 hover:text-red-700"
              title="خروج از حساب کاربری"
            >
          
              <span className="text-sm font-medium">خروج</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 17L3 12L8 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 12H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </header>
        <Outlet />
      </section>
    </div>
  );
};

export default Layout;
