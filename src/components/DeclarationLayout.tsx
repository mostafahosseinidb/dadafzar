import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useDeclaration } from '../contexts/DeclarationContext';

interface DeclarationLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps?: number;
}

const DeclarationLayout: React.FC<DeclarationLayoutProps> = ({ 
  children, 
  currentStep, 
  totalSteps = 7 
}) => {
  const navigate = useNavigate();
  const { declarationData } = useDeclaration();

  const stepTitles = [
    "اطلاعات شرکت",
    "مخاطب", 
    "متن اظهارنامه",
    "تایید و بررسی",
    "پرداخت",
    "ارسال کد",
    "فایل نهایی"
  ];

  const handleClose = () => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید از این صفحه خارج شوید؟ تمام اطلاعات وارد شده از بین خواهد رفت.")) {
      navigate("/declaration");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="w-full mx-auto ">
      

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="bg-white rounded-[20px] shadow-card p-5 w-full pb-10 px-8">
            <div className="relative flex items-center justify-between">
              
              {/* Step 1 - اطلاعات شرکت */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  currentStep > 1 
                    ? 'bg-green-100 border border-green-300' 
                    : currentStep === 1
                    ? 'bg-blue-100 border-2 border-blue-800'
                    : 'bg-blue-100 border border-blue-200'
                }`}>
                  <Icon 
                    icon="uit:bag" 
                    className={`w-6 h-6 ${
                      currentStep > 1 ? 'text-green-600' : currentStep === 1 ? 'text-blue-800' : 'text-blue-400'
                    }`} 
                  />
                </div>
                <span className="absolute text-sm font-medium text-center text-black top-12 whitespace-nowrap">
                  اطلاعات شرکت
                </span>
              </div>

              {/* Connecting line 1-2 */}
              <div className={`flex-1 h-px ${
                currentStep > 1 ? 'bg-green-300' : currentStep === 1 ? 'bg-blue-800' : 'bg-blue-200'
              }`} />

              {/* Step 2 - مخاطب */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  currentStep > 2 
                    ? 'bg-green-100 border border-green-300' 
                    : currentStep === 2
                    ? 'bg-blue-100 border-2 border-blue-800'
                    : 'bg-blue-100 border border-blue-200'
                }`}>
                  <Icon 
                    icon="solar:user-outline" 
                    className={`w-6 h-6 ${
                      currentStep > 2 ? 'text-green-600' : currentStep === 2 ? 'text-blue-800' : 'text-blue-400'
                    }`} 
                  />
                </div>
                <span className="absolute text-sm font-medium text-center text-black top-12 whitespace-nowrap">
                  مخاطب
                </span>
              </div>

              {/* Connecting line 2-3 */}
              <div className={`flex-1 h-px ${
                currentStep > 2 ? 'bg-green-300' : currentStep === 2 ? 'bg-blue-800' : 'bg-blue-200'
              }`} />

              {/* Step 3 - متن اظهارنامه */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  currentStep > 3 
                    ? 'bg-green-100 border border-green-300' 
                    : currentStep === 3
                    ? 'bg-blue-100 border-2 border-blue-800'
                    : 'bg-blue-100 border border-blue-200'
                }`}>
                  <Icon 
                    icon="solar:document-text-linear" 
                    className={`w-6 h-6 ${
                      currentStep > 3 ? 'text-green-600' : currentStep === 3 ? 'text-blue-800' : 'text-blue-400'
                    }`} 
                  />
                </div>
                <span className="absolute text-sm font-medium text-center text-black top-12 whitespace-nowrap">
                  متن اظهارنامه
                </span>
              </div>

              {/* Connecting line 3-4 */}
              <div className={`flex-1 h-px ${
                currentStep > 3 ? 'bg-green-300' : currentStep === 3 ? 'bg-blue-800' : 'bg-blue-200'
              }`} />

              {/* Step 4 - تایید و بررسی */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  currentStep > 4 
                    ? 'bg-green-100 border border-green-300' 
                    : currentStep === 4
                    ? 'bg-blue-100 border-2 border-blue-800'
                    : 'bg-blue-100 border border-blue-200'
                }`}>
                  <Icon 
                    icon="cuida:edit-outline" 
                    className={`w-6 h-6 ${
                      currentStep > 4 ? 'text-green-600' : currentStep === 4 ? 'text-blue-800' : 'text-blue-400'
                    }`} 
                  />
                </div>
                <span className="absolute text-sm font-medium text-center text-black top-12 whitespace-nowrap">
                  تایید و بررسی
                </span>
              </div>

              {/* Connecting line 4-5 */}
              <div className={`flex-1 h-px ${
                currentStep > 4 ? 'bg-green-300' : currentStep === 4 ? 'bg-blue-800' : 'bg-blue-200'
              }`} />

              {/* Step 5 - پرداخت */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  currentStep > 5 
                    ? 'bg-green-100 border border-green-300' 
                    : currentStep === 5
                    ? 'bg-blue-100 border-2 border-blue-800'
                    : 'bg-blue-100 border border-blue-200'
                }`}>
                  <Icon 
                    icon="hugeicons:dollar-square" 
                    className={`w-6 h-6 ${
                      currentStep > 5 ? 'text-green-600' : currentStep === 5 ? 'text-blue-800' : 'text-blue-400'
                    }`} 
                  />
                </div>
                <span className="absolute text-sm font-medium text-center text-black top-12 whitespace-nowrap">
                  پرداخت
                </span>
              </div>

              {/* Connecting line 5-6 */}
              <div className={`flex-1 h-px ${
                currentStep > 5 ? 'bg-green-300' : currentStep === 5 ? 'bg-blue-800' : 'bg-blue-200'
              }`} />

              {/* Step 6 - ارسال کد */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  currentStep > 6 
                    ? 'bg-green-100 border border-green-300' 
                    : currentStep === 6
                    ? 'bg-blue-100 border-2 border-blue-800'
                    : 'bg-blue-100 border border-blue-200'
                }`}>
                  <Icon 
                    icon="hugeicons:bar-code-01" 
                    className={`w-6 h-6 ${
                      currentStep > 6 ? 'text-green-600' : currentStep === 6 ? 'text-blue-800' : 'text-blue-400'
                    }`} 
                  />
                </div>
                <span className="absolute text-sm font-medium text-center text-black top-12 whitespace-nowrap">
                  ارسال کد
                </span>
              </div>

              {/* Connecting line 6-7 */}
              <div className={`flex-1 h-px ${
                currentStep > 6 ? 'bg-green-300' : currentStep === 6 ? 'bg-blue-800' : 'bg-blue-200'
              }`} />

              {/* Step 7 - فایل نهایی */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  currentStep > 7 
                    ? 'bg-green-100 border border-green-300' 
                    : currentStep === 7
                    ? 'bg-blue-100 border-2 border-blue-800'
                    : 'bg-blue-100 border border-blue-200'
                }`}>  
                  <Icon 
                    icon="solar:clipboard-check-outline" 
                    className={`w-6 h-6 ${
                      currentStep > 7 ? 'text-green-600' : currentStep === 7 ? 'text-blue-800' : 'text-blue-400'
                    }`} 
                  />
                </div>
                <span className="absolute text-sm font-medium text-center text-black top-12 whitespace-nowrap">
                  فایل نهایی
                </span>
              </div>
            </div>
          </div>
          
          {/* <div className="flex justify-center mt-4">
            <div className="text-sm text-stormGray-600">
              {stepTitles[currentStep - 1]}
            </div>
          </div> */}
        </div>


        {/* Content */}
        <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DeclarationLayout;
