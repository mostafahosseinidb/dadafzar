import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeclarationLayout from "../../components/DeclarationLayout";
import { useDeclaration } from "../../contexts/DeclarationContext";

const Step4: React.FC = () => {
  const navigate = useNavigate();
  const { declarationData } = useDeclaration();
  
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [isLoading, setIsLoading] = useState(false);
  const [declarationStatus, setDeclarationStatus] = useState<"success" | "needs_edit" | "approved" | "rejected">("success");

  // Get data from Step 3
  const step3Data = declarationData.step3Data || {
    subject: "مطالبه طلب",
    documentText: `با سلام و احترام

با توجه به قرارداد اجاره مورخ [تاریخ عقد قرارداد] فی مابین اینجانب و جنابعالی، ملک واقع در [نشانی کامل مورد اجاره] به مدت [مدت اجاره] و با شرایط مشخص به شما واگذار گردید.

با توجه به اتمام مدت اجاره در تاریخ [تاریخ پایان قرارداد] و عدم تمدید آن، از شما درخواست میشود ظرف مدت حداکثر ۱۰ روز از تاریخ ابلاغ این اظهارنامه نسبت به تخلیه و تحویل مورد اجاره اقدام فرمایید.

بدیهی است در صورت عدم تخلیه در مهلت مقرر، اینجانب ناچار به اقدام قانونی از طریق مراجع ذی صلاح قضایی خواهم بود و کلیه هزینه های دادرسی و خسارات وارده بر عهده جنابعالی خواهد بود.

با احترام،

[نام و نام خانوادگی موجر]
[امضاء]
[تاریخ]`,
    attachments: []
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to payment gateway
      navigate("/payment/gateway", {
        state: {
          amount: "۳۶۲,۵۰۰",
          description: "هزینه ثبت اظهارنامه",
          trackingNumber: Math.floor(Math.random() * 1000000000).toString()
        }
      });
      
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("خطا در پردازش پرداخت. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/declare/step3");
  };

  const handleResubmit = () => {
    navigate("/declare/step1");
  };

  const renderStatusBanner = () => {
    switch (declarationStatus) {
      case "success":
        return (
          <div className="w-full p-4 mb-6 bg-yellow-50 border border-yellow-400 rounded-[20px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 border-2 border-yellow-400 rounded-full bg-yellow-50">
                    <span className="text-lg font-bold text-yellow-600">!</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-black">اظهارنامه ها با موفقیت برای دفتر قضایی ارسال شد</p>
                    <p className="text-sm font-bold text-black">نتیجه بررسی تا 48 ساعت آینده برای شما ارسال خواهد شد</p>
                  </div>
                </div>
              </div>
              <div className="px-3 py-1 border border-yellow-400 rounded-full bg-yellow-50">
                <span className="text-sm font-bold text-black">در حال بررسی</span>
              </div>
            </div>
          </div>
        );

      case "needs_edit":
        return (
          <div className="w-full p-6 mb-6 bg-white border border-orange-400 rounded-[20px]">
            <div className="flex items-center justify-between mb-6">
              <div className="px-3 py-1 border border-orange-400 rounded-full bg-orange-50">
                <span className="text-sm font-bold text-black">نیاز به ویرایش</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h3 className="text-lg font-bold text-black">اظهارنامه نیاز به ویرایش دارند</h3>
                  <p className="text-sm text-gray-600">لطفاً نسبت به اصلاح موارد فوق در اسرع وقت اقدام فرمایید تا فرایند بررسی ادامه یابد.</p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 border-2 border-orange-400 rounded-full bg-orange-50">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  ویرایش
                </button>
                <div className="flex-1 p-4 rounded-lg bg-gray-50">
                  <h4 className="mb-2 text-sm font-bold text-black">نقص در اطلاعات مخاطب</h4>
                  <p className="text-sm text-gray-600">نام نماینده و اساس نامه درست نیست</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  ویرایش
                </button>
                <div className="flex-1 p-4 rounded-lg bg-gray-50">
                  <h4 className="mb-2 text-sm font-bold text-black">نقص در اطلاعات مربوط به شرکت</h4>
                  <p className="text-sm text-gray-600">نام نماینده و اساس نامه درست نیست</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    ویرایش متن
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    دانلود فایل اصلاح شده
                  </button>
                </div>
                <div className="flex-1 p-4 rounded-lg bg-gray-50">
                  <h4 className="mb-2 text-sm font-bold text-black">نقص در متن اظهارنامه</h4>
                  <p className="text-sm text-gray-600">شماره تماس اشتباه است</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "approved":
        return (
          <div className="w-full p-4 mb-6 bg-white border border-teal-400 rounded-[20px]">
            <div className="flex items-center justify-between">
              <div className="px-3 py-1 border border-teal-400 rounded-full bg-teal-50">
                <span className="text-sm font-bold text-black">تایید شده</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h3 className="text-lg font-bold text-black">اظهارنامه تایید شد</h3>
                  <p className="text-sm text-gray-600">جهت ادامه فرآیند لطفا پرداخت را انجام دهید</p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 border-2 border-teal-400 rounded-full bg-teal-50">
                  <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );

      case "rejected":
        return (
          <div className="w-full p-6 mb-6 bg-white border border-pink-400 rounded-[20px]">
            <div className="flex items-center justify-between mb-4">
              <div className="px-3 py-1 border border-pink-400 rounded-full bg-pink-50">
                <span className="text-sm font-bold text-black">رد شده</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h3 className="text-lg font-bold text-black">اظهارنامه رد شد</h3>
                  <p className="text-sm text-gray-600">اظهارنامه شما کاملا رد شده به دلایل زیر لطفا مجدد برای ثبت اظهارنامه اقدام نمایید.</p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 border-2 border-pink-400 rounded-full bg-pink-50">
                  <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان.</li>
                <li>• لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.</li>
                <li>• لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است</li>
              </ul>
            </div>
            
            <button
              onClick={handleResubmit}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              ثبت مجدد اظهارنامه
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DeclarationLayout currentStep={4}>
      <div className="w-full">
        {/* Status Selector for Testing */}
        <div className="p-4 mb-4 bg-gray-100 rounded-lg">
          <label className="block mb-2 text-sm font-medium text-gray-700">تست وضعیت:</label>
          <select
            value={declarationStatus}
            onChange={(e) => setDeclarationStatus(e.target.value as any)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="success">موفقیت آمیز</option>
            <option value="needs_edit">نیاز به ویرایش</option>
            <option value="approved">تایید شده</option>
            <option value="rejected">رد شده</option>
          </select>
        </div>
        
        {renderStatusBanner()}
        
        <div className="flex w-full gap-6">
       

        {/* Main Content Area */}
        <div className="flex-1 bg-stormGray-50 rounded-[20px] p-6">
          <div className="flex flex-col gap-6">
            {/* Subject Section */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-doveGray-400">موضوع</label>
              <div className="h-12 p-3 bg-white rounded-[10px] flex items-center justify-end">
                <span className="text-sm font-medium text-doveGray-400">{step3Data.subject}</span>
              </div>
            </div>

            {/* Document Text Section */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-doveGray-400">متن سند</label>
              <div className="bg-white rounded-[10px] p-4">
                <div className="w-full p-3 overflow-y-auto text-sm font-medium text-right text-black whitespace-pre-wrap h-96">
                  {step3Data.documentText}
                </div>
              </div>
            </div>

            {/* Attachment Section */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-doveGray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <label className="text-sm font-medium text-doveGray-400">فایلهای خود را اینجا بارگذاری نمایید</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {step3Data.attachments && step3Data.attachments.length > 0 ? (
                  step3Data.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg border-stormGray-200"
                    >
                      <span className="text-sm text-doveGray-400">{file.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg border-stormGray-200">
                    <span className="text-sm text-doveGray-400">عکس.png</span>
                    <button className="flex items-center justify-center w-4 h-4 transition-colors text-doveGray-400 hover:text-error">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

         {/* Left Sidebar - Payment Section */}
         <div className="flex flex-col w-4/12 gap-6">
          {/* Cost Section */}
          <div className="bg-stormGray-50 rounded-[20px] p-6">
            <h3 className="mb-4 text-base font-bold text-black">هزینه ثبت اظهارنامه</h3>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-doveGray-400">مبلغ</label>
              <div className="h-12 p-3 bg-white rounded-[10px] flex items-center justify-end">
                <span className="text-sm font-medium text-doveGray-400">۳۶۲,۵۰۰ تومان</span>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-stormGray-50 rounded-[20px] p-6">
            <h3 className="mb-4 text-base font-bold text-black">روش پرداخت</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-ceruleanBlue-600"
                />
                <span className="text-sm font-medium text-doveGray-400">پرداخت بانکی</span>
              </label>
              <label className="flex items-center gap-3 opacity-50 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled
                  className="w-4 h-4 text-ceruleanBlue-600"
                />
                <span className="text-sm font-medium text-doveGray-400">پرداخت با کیف پول</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-auto">
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full h-12 px-4 py-3 text-sm font-medium text-white transition-colors rounded-lg bg-ceruleanBlue-600 hover:bg-ceruleanBlue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "در حال پردازش..." : "پرداخت"}
            </button>
            <button
              onClick={handleBack}
              className="w-full h-12 px-4 py-3 text-sm font-medium transition-colors bg-white border rounded-lg border-stormGray-300 text-stormGray-700 hover:bg-stormGray-50"
            >
              بازگشت
            </button>
          </div>
                 </div>
       </div>
      </div>
    </DeclarationLayout>
  );
};

export default Step4;

