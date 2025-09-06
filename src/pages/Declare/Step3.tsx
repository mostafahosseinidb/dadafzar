import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeclarationLayout from "../../components/DeclarationLayout";
import { useDeclaration } from "../../contexts/DeclarationContext";
import { submitStatementOfClaim, type StatementOfClaimRequest } from "../../api/declaration";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";

const Step3: React.FC = () => {
  const navigate = useNavigate();
  const { declarationData, updateDeclarationData } = useDeclaration();
  
  const [selectedTemplate, setSelectedTemplate] = useState(declarationData.step3Data?.selectedTemplate || "بدون تمپلیت");
  const [subject, setSubject] = useState(declarationData.step3Data?.subject || "مطالبه طلب");
  const [documentText, setDocumentText] = useState(declarationData.step3Data?.documentText || `با سلام و احترام

با توجه به قرارداد اجاره مورخ [تاریخ عقد قرارداد] فی مابین اینجانب و جنابعالی، ملک واقع در [نشانی کامل مورد اجاره] به مدت [مدت اجاره] و با شرایط مشخص به شما واگذار گردید.

با توجه به اتمام مدت اجاره در تاریخ [تاریخ پایان قرارداد] و عدم تمدید آن، از شما درخواست میشود ظرف مدت حداکثر ۱۰ روز از تاریخ ابلاغ این اظهارنامه نسبت به تخلیه و تحویل مورد اجاره اقدام فرمایید.

بدیهی است در صورت عدم تخلیه در مهلت مقرر، اینجانب ناچار به اقدام قانونی از طریق مراجع ذی صلاح قضایی خواهم بود و کلیه هزینه های دادرسی و خسارات وارده بر عهده جنابعالی خواهد بود.

با احترام،

[نام و نام خانوادگی موجر]
[امضاء]
[تاریخ]`);
  const [attachments, setAttachments] = useState<File[]>(declarationData.step3Data?.attachments || []);
  const [isLoading, setIsLoading] = useState(false);

  const templates = [
    { value: "بدون تمپلیت", label: "بدون تمپلیت" },
    { value: "تمپلیت 1", label: "تمپلیت 1" },
    { value: "تمپلیت 2", label: "تمپلیت 2" },
  ];

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleDocumentTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDocumentText(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const prepareDataFromSteps = () => {
    // Get data from context
    const step1Data = declarationData.step1Data || {
      companyName: "",
      companyNationalId: "",
      companyEstablishmentDate: "",
      representativeFirstName: "",
      representativeLastName: "",
      ceoFirstName: "",
      ceoLastName: "",
      ceoNationalId: "",
      ceoGender: "",
      ceoPhone: "",
      ceoBirthDate: "",
      ceoFatherName: "",
      judicialOffice: ""
    };

    const step2Data = declarationData.step2Data || [];

    // Ensure ceoBirthDate is valid
    if (step1Data.ceoBirthDate && typeof step1Data.ceoBirthDate === 'string') {
      const date = new Date(step1Data.ceoBirthDate);
      if (isNaN(date.getTime())) {
        console.warn('Invalid CEO birth date in context:', step1Data.ceoBirthDate);
        step1Data.ceoBirthDate = "";
      }
    }

    return { step1Data, step2Data };
  };

  const formatDate = (date: Date | string | DateObject | null | undefined): string => {
    try {
      if (!date) return "";
      
      // Handle empty string
      if (typeof date === 'string' && date.trim() === '') {
        return "";
      }
      
      // Handle DateObject from react-multi-date-picker
      if (date && typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
        const jsDate = (date as DateObject).toDate();
        if (isNaN(jsDate.getTime())) {
          console.warn('Invalid DateObject date:', date);
          return "";
        }
        return jsDate.toISOString();
      }
      
      // Handle string dates - try different formats
      if (typeof date === 'string') {
        // Try parsing as Persian date format (YYYY/MM/DD)
        const persianDateMatch = date.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
        if (persianDateMatch) {
          const [, year, month, day] = persianDateMatch;
          // Create a DateObject from Persian date and convert to Gregorian
          const persianDateObj = new DateObject({
            year: parseInt(year),
            month: parseInt(month),
            day: parseInt(day),
            calendar: persian,
            locale: persian_fa
          });
          const gregorianDate = persianDateObj.convert(gregorian);
          const jsDate = new Date(gregorianDate.year, gregorianDate.month.number - 1, gregorianDate.day);
          if (!isNaN(jsDate.getTime())) {
            return jsDate.toISOString();
          }
        }
        
        // Try parsing as regular date
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toISOString();
        }
        
        console.warn('Invalid date string:', date);
        return "";
      }
      
      // Handle regular Date
      if (date instanceof Date) {
        if (isNaN(date.getTime())) {
          console.warn('Invalid Date object:', date);
          return "";
        }
        return date.toISOString();
      }
      
      console.warn('Unknown date type:', typeof date, date);
      return "";
    } catch (error) {
      console.warn('Error formatting date:', date, error);
      return "";
    }
  };

  const sendToJudicialOffice = async (data: StatementOfClaimRequest) => {
    try {
      const result = await submitStatementOfClaim(data);
      return result;
    } catch (error) {
      console.error('Error sending to judicial office:', error);
      throw error;
    }
  };

  const handleSendToOffice = async () => {
    setIsLoading(true);
    navigate("/declare/step4");
    return
    try {
      // Save current step3 data to context
      updateDeclarationData({
        step3Data: {
          selectedTemplate,
          subject,
          documentText,
          attachments
        }
      });
      const { step1Data, step2Data } = prepareDataFromSteps();
      console.log("Step 1 data:", step1Data);
      console.log("Step 2 data:", step2Data);
      // Prepare the API payload
      const apiPayload = {
        "simulate": true,
        "sequence": 0,
        "type": "StatementOfClaim" as const,
        "subject": subject,
        "content": documentText,
        "attachments": attachments.map(file => ({
          name: file.name,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.name.split('.').pop() || '',
          fileUrl: URL.createObjectURL(file),
          isAuthorizationDocument: false,
          type: "Photo"
        })),
        "plaintiffs": {
          "mainPerson": {
            "nationalId": step1Data.ceoNationalId,
            "firstName": step1Data.ceoFirstName,
            "lastName": step1Data.ceoLastName,
            "fatherName": step1Data.ceoFatherName,
            "genderKey": (step1Data.ceoGender === "آقا" ? "Male" : "Female") as "Male" | "Female",
            "address":  "",
            "birthdate": formatDate(step1Data.ceoBirthDate),
            "landlines": [],
            "mobiles": [step1Data.ceoPhone],
            "authorizationDocuments": [],
            "type": "Self"
          },
          "relatedPersons": step2Data.slice(1).map(contact => ({
            "nationalId": contact.nationalId,
            "firstName": contact.firstName,
            "lastName": contact.lastName,
            "fatherName": contact.fatherName,
            "genderKey": (contact.contactType === "real" ? "Male" : "Female") as "Male" | "Female",
            "address": contact.address,
            "birthdate": formatDate(contact.birthDate),
            "landlines": [],
            "mobiles": [contact.phone],
            "authorizationDocuments": []
          })),
          "relatedBusinesses": [{
            "nationalId": step1Data.companyNationalId,
            "name": step1Data.companyName,
            "ceo": {
              "nationalId": step1Data.ceoNationalId,
              "firstName": step1Data.ceoFirstName,
              "lastName": step1Data.ceoLastName,
              "fatherName": step1Data.ceoFatherName,
              "genderKey": (step1Data.ceoGender === "آقا" ? "Male" : "Female") as "Male" | "Female",
              "address": step2Data[0]?.address || "",
              "birthdate": formatDate(step1Data.ceoBirthDate),
              "landlines": [],
              "mobiles": [step1Data.ceoPhone],
              "authorizationDocuments": []
            },
            "landlines": [],
            "mobiles": []
          }]
        },
        "defendants": step2Data.map(contact => {
          console.log('Processing contact:', contact.firstName, 'birthDate:', contact.birthDate, 'type:', typeof contact.birthDate);
          return {
            "type": "Person" as const,
            "firstName": contact.firstName,
            "lastName": contact.lastName,
            "fatherName": contact.fatherName,
            "nationalId": contact.nationalId,
            "genderKey": (contact.contactType === "real" ? "Male" : "Female") as "Male" | "Female",
            "address": contact.address,
            "birthdate": formatDate(contact.birthDate),
            "landlines": [],
            "mobiles": [contact.phone],
            "name": "",
            "registrationdate": new Date().toISOString()
          };
        }),
        "officeCode": step1Data.judicialOffice || "98557656"
      };

      console.log("Sending data to API:", apiPayload);
        
      // Send to API
      await sendToJudicialOffice(apiPayload);
      
      // Navigate to next step or success page
      navigate("/declare/step4");
      
    } catch (error) {
      console.error("Error sending to judicial office:", error);
      alert("خطا در ارسال به دفتر قضایی. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/declare/step2");
  };

  return (
    <DeclarationLayout currentStep={3}>
      <div className="flex w-full gap-6">
      

        {/* Main Content Area */}
        <div className="flex-1 bg-stormGray-50 rounded-[20px] p-6">
          <div className="flex flex-col gap-6">
            {/* Subject Section */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-doveGray-400">موضوع</label>
              <input
                type="text"
                value={subject}
                onChange={handleSubjectChange}
                className="h-12 p-3 bg-white rounded-[10px] text-right text-sm font-medium text-doveGray-400 border-none outline-none"
                placeholder="موضوع را وارد کنید"
              />
            </div>

            {/* Document Text Section */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-doveGray-400">متن سند</label>
              <div className="bg-white rounded-[10px] p-4">
                <textarea
                  value={documentText}
                  onChange={handleDocumentTextChange}
                  className="w-full p-3 text-sm font-medium text-right text-black border-none outline-none resize-none h-96"
                  placeholder="متن سند را وارد کنید"
                />
              </div>
            </div>

            {/* Attachment Section */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-doveGray-400">فایلهای خود را اینجا بارگذاری نمایید</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-12 h-12 bg-white rounded-[10px] border-2 border-dashed border-doveGray-200 cursor-pointer hover:border-ceruleanBlue-300 transition-colors"
                >
                  <svg className="w-6 h-6 text-doveGray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </label>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg border-stormGray-200"
                    >
                      <span className="text-sm text-doveGray-400">{file.name}</span>
                      <button
                        onClick={() => handleRemoveAttachment(index)}
                        className="flex items-center justify-center w-4 h-4 transition-colors text-doveGray-400 hover:text-error"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            
          </div>
        </div>

          {/* Left Sidebar - Template Selection */}
          <div className="flex flex-col justify-between w-4/12 ">
          <div className="flex flex-col gap-4 p-6 bg-stormGray-50 rounded-[20px] ">
            <h3 className="text-base font-bold text-black">تمپلیت های شما</h3>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-doveGray-400">انتخاب تمپلیت</label>
              <div className="relative">
                <select
                disabled
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  className="w-full h-12 p-3 bg-white rounded-[10px] text-right text-sm font-medium text-doveGray-400 border-none outline-none appearance-none"
                >
                  {templates.map((template) => (
                    <option key={template.value} value={template.value}>
                      {template.label}
                    </option>
                  ))}
                </select>
                <div className="absolute transform -translate-y-1/2 pointer-events-none left-3 top-1/2">
                  <svg className="w-4 h-4 text-doveGray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleBack}
                className="px-8 py-3 text-sm font-medium transition-colors bg-white border rounded-lg border-stormGray-300 text-stormGray-700 hover:bg-stormGray-50"
              >
                بازگشت
              </button>
              <button
                onClick={handleSendToOffice}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3 text-sm font-medium text-white transition-colors rounded-lg bg-ceruleanBlue-600 hover:bg-ceruleanBlue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? "در حال ارسال..." : "ارسال به دفتر قضایی"}
              </button>
            </div>
        </div>
      </div>
    </DeclarationLayout>
  );
};

export default Step3;