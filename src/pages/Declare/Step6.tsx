import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeclaration } from '../../contexts/DeclarationContext';
import DeclarationLayout from '../../components/DeclarationLayout';

const Step6: React.FC = () => {
  const navigate = useNavigate();
  const { declarationData, updateDeclarationData } = useDeclaration();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configurable parameters
  const declarationNumber = "123456789";
  const CONFIG = {
    declarationNumber,
    courtName: "دادگستری جمهوری اسلامی ایران",
    formTitle: "برگ اظهارنامه",
    attachments: [
      {
        id: 1,
        name: "فرم مخصوص قرارداد کار موضوع تبصره ۳ الحاقی ۱۳۹۴ به قانون کار منتشر شده از سوی وزارت تعاون، کار و رفاه اجتماعی",
        type: "document",
        preview: "/image/document-preview.png"
      }
    ],
    declarationText: `با سلام و عرض ادب

در پاسخ اظهار نامه شماره ${declarationNumber}

سرکار خانم

با توجه به اینکه جنابعالی مدعی دریافت کامل مبلغ ۱۲ میلیارد تومان نقدی شده‌اید، اینجانب ضمن رد این ادعا، اعلام می‌دارم که با توجه به محدودیت‌های کرونایی و محدودیت‌های بانکی، امکان پرداخت این مبلغ به صورت نقدی وجود نداشته است.

همچنین توافق شده بود که پرداخت از طریق ساتنا انجام شود که تاکنون محقق نشده است.

در خصوص ادعای مزاحمت و سلب آسایش در منزل جنابعالی نیز باید اعلام کنم که این موضوع صحت ندارد و معامله فسخ شده است.

لذا از جنابعالی تقاضا می‌کنم از طرح ادعا واهی و طرح شکایت واهی خودداری فرمایید و در غیر این صورت، اینجانب اعاده حیثیت خواهم نمود.`
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to submit declaration
      console.log("Submitting declaration:", declarationData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page or next step
      navigate("/payment/gateway", {
        state: {
          amount: "۳۶۲,۵۰۰",
          description: "هزینه ثبت اظهارنامه",
          trackingNumber: CONFIG.declarationNumber
        }
      });
      
    } catch (error) {
      console.error("Error submitting declaration:", error);
      alert("خطا در ثبت اظهارنامه. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    navigate('/declare/step5');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log("Downloading declaration...");
  };

  return (
    <DeclarationLayout currentStep={6}>
      <div className="flex h-full gap-6">
   
        {/* Main Content - Declaration Form */}
        <div className="flex-1 bg-white rounded-[20px] p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ceruleanBlue-600">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-lg font-bold text-black">{CONFIG.courtName}</h1>
              </div>
              <h2 className="text-xl font-bold text-black">{CONFIG.formTitle}</h2>
            </div>

            {/* Declaration Table */}
            <div className="overflow-hidden border rounded-lg border-stormGray-200">
              <table className="w-full">
                <thead className="bg-stormGray-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-right text-black border-l border-stormGray-200">
                      مشخصات و اقامتگاه اظهار کننده
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-right text-black border-l border-stormGray-200">
                      موضوع اظهارنامه
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-right text-black">
                      مشخصات و اقامتگاه مخاطب
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-8 text-sm border-l text-doveGray-600 border-stormGray-200">
                      {/* Will be filled with declarant info */}
                    </td>
                    <td className="px-4 py-8 text-sm border-l text-doveGray-600 border-stormGray-200">
                      {/* Will be filled with subject */}
                    </td>
                    <td className="px-4 py-8 text-sm text-doveGray-600">
                      {/* Will be filled with recipient info */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary of Statements */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black">خلاصه اظهارات</h3>
              <div className="p-6 rounded-lg bg-stormGray-50">
                <div className="text-sm leading-relaxed text-black whitespace-pre-line">
                  {CONFIG.declarationText}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-stormGray-200">
              <button
                onClick={handlePrev}
                className="px-6 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                مرحله قبل
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-2 rounded-lg transition-colors ${
                  isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-ceruleanBlue-600 text-white hover:bg-ceruleanBlue-700"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    در حال ارسال...
                  </div>
                ) : (
                  "ارسال اظهارنامه"
                )}
              </button>
            </div>
          </div>
        </div>

             {/* Left Sidebar - Attachments */}
             <div className="w-1/4 bg-stormGray-50 rounded-[20px] p-6">
          <div className="flex flex-col gap-6">
            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition-colors rounded-lg bg-ceruleanBlue-600 hover:bg-ceruleanBlue-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                پرینت
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition-colors rounded-lg bg-tropicalBlue-600 hover:bg-tropicalBlue-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                دانلود
              </button>
            </div>

            {/* Attachments Section */}
            <div>
              <h3 className="mb-4 text-base font-bold text-black">پیوستهای اظهارنامه</h3>
              <div className="space-y-3">
                {CONFIG.attachments.map((attachment) => (
                  <div key={attachment.id} className="p-3 bg-white border rounded-lg border-stormGray-200">
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs">پیش‌نمایش</span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-doveGray-600">
                      {attachment.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </DeclarationLayout>
  );
};

export default Step6;