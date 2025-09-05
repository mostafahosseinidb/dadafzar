import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import type { DateObject } from "react-multi-date-picker";
import DeclarationLayout from "../../components/DeclarationLayout";
import { useDeclaration } from "../../contexts/DeclarationContext";
import { getOfficeCodes, type OfficeCode } from "../../api/declaration";

const Step1: React.FC = () => {
  const navigate = useNavigate();
  const { declarationData, updateDeclarationData } = useDeclaration();
  
  const [errors, setErrors] = useState({
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
    judicialOffice: "",
  });

  const [formData, setFormData] = useState({
    companyName: declarationData.step1Data?.companyName || "",
    companyNationalId: declarationData.step1Data?.companyNationalId || "",
    companyEstablishmentDate: null as DateObject | null,
    representativeFirstName: declarationData.step1Data?.representativeFirstName || "",
    representativeLastName: declarationData.step1Data?.representativeLastName || "",
    articlesOfAssociation: declarationData.step1Data?.articlesOfAssociation || null,
    officialGazette: declarationData.step1Data?.officialGazette || null,
    representationLetter: declarationData.step1Data?.representationLetter || null,
    // CEO Information
    ceoFirstName: declarationData.step1Data?.ceoFirstName || "",
    ceoLastName: declarationData.step1Data?.ceoLastName || "",
    ceoNationalId: declarationData.step1Data?.ceoNationalId || "",
    ceoGender: declarationData.step1Data?.ceoGender || "",
    ceoPhone: declarationData.step1Data?.ceoPhone || "",
    ceoBirthDate: null as DateObject | null,
    ceoFatherName: declarationData.step1Data?.ceoFatherName || "",
    // Judicial Office
    judicialOffice: declarationData.step1Data?.judicialOffice || "",
  });

  const [officeCodes, setOfficeCodes] = useState<OfficeCode[]>([]);
  const [isLoadingOffices, setIsLoadingOffices] = useState(false);

  const genderOptions = [
    { value: "آقا", label: "آقا" },
    { value: "خانم", label: "خانم" },
  ];

  // Fetch office codes on component mount
  useEffect(() => {
    const fetchOfficeCodes = async () => {
      setIsLoadingOffices(true);
              try {
          const codes = await getOfficeCodes();
          setOfficeCodes(codes);
      } catch (error) {
        console.error('Error fetching office codes:', error);
        // Fallback to empty array or show error message
        setOfficeCodes([]);
      } finally {
        setIsLoadingOffices(false);
      }
    };

    fetchOfficeCodes();
  }, []);

  const handleInputChange = (
    field: string,
    value: string | DateObject | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = (
    field: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const validateForm = () => {
    const newErrors = {
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
      judicialOffice: "",
    };

    if (!formData.companyName.trim())
      newErrors.companyName = "نام شرکت الزامی است";
    if (!formData.companyNationalId.trim())
      newErrors.companyNationalId = "شناسه ملی شرکت الزامی است";
    if (!formData.companyEstablishmentDate)
      newErrors.companyEstablishmentDate = "تاریخ تاسیس شرکت الزامی است";
    if (!formData.representativeFirstName.trim())
      newErrors.representativeFirstName = "نام نماینده الزامی است";
    if (!formData.representativeLastName.trim())
      newErrors.representativeLastName = "نام خانوادگی نماینده الزامی است";
    if (!formData.ceoFirstName.trim())
      newErrors.ceoFirstName = "نام الزامی است";
    if (!formData.ceoLastName.trim())
      newErrors.ceoLastName = "نام خانوادگی الزامی است";
    if (!formData.ceoNationalId.trim())
      newErrors.ceoNationalId = "کد ملی الزامی است";
    if (!formData.ceoGender)
      newErrors.ceoGender = "جنسیت الزامی است";
    if (!formData.ceoPhone.trim())
      newErrors.ceoPhone = "شماره تلفن الزامی است";
    if (!formData.ceoBirthDate)
      newErrors.ceoBirthDate = "تاریخ تولد الزامی است";
    if (!formData.ceoFatherName.trim())
      newErrors.ceoFatherName = "نام پدر الزامی است";
    if (!formData.judicialOffice)
      newErrors.judicialOffice = "دفتر قضایی الزامی است";

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleNext = () => {
    if (validateForm()) {
      // Save data to context
      console.log("Form data:", formData);
      updateDeclarationData({
        step1Data: {
          companyName: formData.companyName,
          companyNationalId: formData.companyNationalId,
          companyEstablishmentDate: formData.companyEstablishmentDate?.format("YYYY/MM/DD") || "",
          representativeFirstName: formData.representativeFirstName,
          representativeLastName: formData.representativeLastName,
          articlesOfAssociation: formData.articlesOfAssociation,
          officialGazette: formData.officialGazette,
          representationLetter: formData.representationLetter,
          ceoFirstName: formData.ceoFirstName,
          ceoLastName: formData.ceoLastName,
          ceoNationalId: formData.ceoNationalId,
          ceoGender: formData.ceoGender,
          ceoPhone: formData.ceoPhone,
          ceoBirthDate: formData.ceoBirthDate ? formData.ceoBirthDate.format("YYYY/MM/DD") : "",
          ceoFatherName: formData.ceoFatherName,
          judicialOffice: formData.judicialOffice,
        }
      });
      navigate("/declare/step2");
    }
  };

  const handleBack = () => {
    navigate("/declaration");
  };

  return (
    <DeclarationLayout currentStep={1}>
      <div className="flex flex-col w-full gap-6">
     
      <div className="flex w-full gap-6">
        {/* Company Information Section */}
        <div className="w-1/2 relative bg-stormGray-50 rounded-[20px] py-6">
          <div className="flex flex-col items-start justify-start gap-5">
            {/* Company Information Header */}
            <div className="flex flex-col items-start self-stretch justify-center gap-3">
              <div className="px-5 text-base font-bold text-right text-black">اطلاعات شرکت</div>
              <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-stormGray-200" />
            </div>

            {/* Form Fields */}
            <div className="flex flex-col items-start self-stretch justify-start gap-4 px-5">
              {/* Company Name */}
              <div className="flex flex-col items-end self-stretch justify-start gap-[3px]">
                <div className="self-stretch justify-start text-sm font-medium text-right text-doveGray-400 ">نام شرکت</div>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium  border-none outline-none"
                  placeholder="نام شرکت را وارد کنید"
                />
                {errors.companyName && (
                  <div className="text-xs text-error ">{errors.companyName}</div>
                )}
              </div>

              {/* Company National ID */}
              <div className="flex flex-col items-start self-stretch justify-center">
                <div className="justify-start text-sm font-medium text-doveGray-400 ">شناسه ملی شرکت</div>
                <input
                  type="text"
                  value={formData.companyNationalId}
                  onChange={(e) => handleInputChange("companyNationalId", e.target.value)}
                  className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium  border-none outline-none"
                  placeholder="شناسه ملی شرکت را وارد کنید"
                />
                {errors.companyNationalId && (
                  <div className="text-xs text-error ">{errors.companyNationalId}</div>
                )}
              </div>

              {/* Company Establishment Date */}
              <div className="self-stretch flex flex-col justify-center items-start gap-0.5">
                <div className="justify-start text-sm font-medium text-doveGray-400 ">تاریخ تاسیس شرکت</div>
                <div className="self-stretch h-12 p-2.5 bg-white rounded-[10px] inline-flex justify-between items-center">
                  <DatePicker
                    value={formData.companyEstablishmentDate}
                    onChange={(date) => handleInputChange("companyEstablishmentDate", date)}
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    className="w-full h-full border-none outline-none"
                    inputClass="w-full h-full border-none outline-none text-right text-doveGray-400 text-sm font-medium  bg-transparent"
                    containerStyle={{ width: "100%" }}
                  />
                  <div className="w-[18px] h-[18px] relative overflow-hidden">
                    <div className="w-[13.50px] h-[13.50px] left-[2.25px] top-[3px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-doveGray-200" />
                    <div className="w-0 h-[3px] left-[12px] top-[1.50px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-doveGray-200" />
                    <div className="w-0 h-[3px] left-[6px] top-[1.50px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-doveGray-200" />
                    <div className="w-[13.50px] h-0 left-[2.25px] top-[7.50px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-doveGray-200" />
                  </div>
                </div>
                {errors.companyEstablishmentDate && (
                  <div className="text-xs text-error ">{errors.companyEstablishmentDate}</div>
                )}
              </div>

              {/* File Upload Fields */}
              <div className="inline-flex items-start self-stretch justify-start gap-4">
                {/* Articles of Association */}
                <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
                  <div className="justify-start text-sm font-medium text-doveGray-400 ">اساس نامه</div>
                  <div className="self-stretch h-12 p-2.5 bg-white rounded-[10px] inline-flex justify-between items-center">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("articlesOfAssociation", e)}
                      className="hidden"
                      id="articlesOfAssociation"
                    />
                    <label htmlFor="articlesOfAssociation" className="cursor-pointer">
                      <div className="w-[18px] h-[18px] flex items-center justify-center">
                        <svg className="w-4 h-4 text-doveGray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </div>
                    </label>
                    <div className="px-2.5 py-[5px] bg-white rounded-[50px] outline outline-1 outline-offset-[-1px] outline-stormGray-200 flex justify-center items-center gap-1">
                      <div className="justify-start text-sm font-medium text-right text-doveGray-400 ">
                        {formData.articlesOfAssociation ? formData.articlesOfAssociation.name : "فایل را انتخاب کنید"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Official Gazette */}
                <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
                  <div className="justify-start text-sm font-medium text-doveGray-400 ">روزنامه رسمی</div>
                  <div className="self-stretch h-12 p-2.5 bg-white rounded-[10px] inline-flex justify-between items-center">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("officialGazette", e)}
                      className="hidden"
                      id="officialGazette"
                    />
                    <label htmlFor="officialGazette" className="cursor-pointer">
                      <div className="w-[18px] h-[18px] flex items-center justify-center">
                        <svg className="w-4 h-4 text-doveGray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </div>
                    </label>
                    <div className="px-2.5 py-[5px] bg-white rounded-[50px] outline outline-1 outline-offset-[-1px] outline-stormGray-200 flex justify-center items-center gap-1">
                      <div className="justify-start text-sm font-medium text-right text-doveGray-400 ">
                        {formData.officialGazette ? formData.officialGazette.name : "فایل را انتخاب کنید"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Separator Line */}
              <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-stormGray-200" />

              {/* Representative Information */}
              <div className="inline-flex items-start self-stretch justify-start gap-4">
                {/* Representative Last Name */}
                <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
                  <div className="justify-start text-sm font-medium text-doveGray-400 ">نام خانوادگی نماینده</div>
                  <input
                    type="text"
                    value={formData.representativeLastName}
                    onChange={(e) => handleInputChange("representativeLastName", e.target.value)}
                    className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium  border-none outline-none"
                    placeholder="نام خانوادگی نماینده"
                  />
                  {errors.representativeLastName && (
                    <div className="text-xs text-error ">{errors.representativeLastName}</div>
                  )}
                </div>

                {/* Representative First Name */}
                <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
                  <div className="justify-start text-sm font-medium text-doveGray-400 ">نام نماینده</div>
                  <input
                    type="text"
                    value={formData.representativeFirstName}
                    onChange={(e) => handleInputChange("representativeFirstName", e.target.value)}
                    className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium  border-none outline-none"
                    placeholder="نام نماینده"
                  />
                  {errors.representativeFirstName && (
                    <div className="text-xs text-error ">{errors.representativeFirstName}</div>
                  )}
                </div>
              </div>

              {/* Representation Letter */}
              <div className="self-stretch flex flex-col justify-center items-start gap-0.5">
                <div className="justify-start text-sm font-medium text-doveGray-500 ">نامه نمایندگی</div>
                <div className="self-stretch h-12 p-2.5 bg-white rounded-[10px] inline-flex justify-between items-center">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload("representationLetter", e)}
                    className="hidden"
                    id="representationLetter"
                  />
                  <label htmlFor="representationLetter" className="cursor-pointer">
                    <div className="w-[18px] h-[18px] flex items-center justify-center">
                      <svg className="w-4 h-4 text-doveGray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
                  </label>
                  <div className="px-2.5 py-[5px] bg-white rounded-[50px] outline outline-1 outline-offset-[-1px] outline-stormGray-200 flex justify-center items-center gap-1">
                    <div className="justify-start text-sm font-medium text-right text-doveGray-400 ">
                      {formData.representationLetter ? formData.representationLetter.name : "فایل را انتخاب کنید"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CEO Information Section */}
        <div className="w-1/2 relative bg-stormGray-50 rounded-[20px] py-6">
          <div className="flex flex-col items-start justify-start gap-5">
            {/* CEO Information Header */}
            <div className="flex flex-col items-start self-stretch justify-center gap-3">
              <div className="px-5 text-base font-bold text-right text-black">اطلاعات مدیر عامل</div>
              <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-stormGray-200" />
            </div>

            {/* CEO Form Fields */}
            <div className="flex flex-col items-start self-stretch justify-start gap-4 px-5">
              {/* Name Fields */}
              <div className="inline-flex items-start self-stretch justify-start gap-4">
                {/* First Name */}
                <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
                  <div className="justify-start text-sm font-medium text-doveGray-400">نام</div>
                  <input
                    type="text"
                    value={formData.ceoFirstName}
                    onChange={(e) => handleInputChange("ceoFirstName", e.target.value)}
                    className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium border-none outline-none"
                    placeholder="نام را وارد کنید"
                  />
                  {errors.ceoFirstName && (
                    <div className="text-xs text-error">{errors.ceoFirstName}</div>
                  )}
                </div>

                {/* Last Name */}
                <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
                  <div className="justify-start text-sm font-medium text-doveGray-400">نام خانوادگی</div>
                  <input
                    type="text"
                    value={formData.ceoLastName}
                    onChange={(e) => handleInputChange("ceoLastName", e.target.value)}
                    className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium border-none outline-none"
                    placeholder="نام خانوادگی را وارد کنید"
                  />
                  {errors.ceoLastName && (
                    <div className="text-xs text-error">{errors.ceoLastName}</div>
                  )}
                </div>
              </div>

              {/* National ID */}
              <div className="flex flex-col items-start self-stretch justify-center">
                <div className="justify-start text-sm font-medium text-doveGray-400">کدملی</div>
                <input
                  type="text"
                  value={formData.ceoNationalId}
                  onChange={(e) => handleInputChange("ceoNationalId", e.target.value)}
                  className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium border-none outline-none"
                  placeholder="کد ملی را وارد کنید"
                />
                {errors.ceoNationalId && (
                  <div className="text-xs text-error">{errors.ceoNationalId}</div>
                )}
              </div>

              {/* Gender */}
              <div className="flex flex-col items-start self-stretch justify-center">
                <div className="justify-start text-sm font-medium text-doveGray-400">جنسیت</div>
                <div className="self-stretch h-12 p-2.5 bg-white rounded-[10px] inline-flex justify-between items-center">
                  <select
                    value={formData.ceoGender}
                    onChange={(e) => handleInputChange("ceoGender", e.target.value)}
                    className="w-full h-full text-sm font-medium text-right bg-transparent border-none outline-none text-doveGray-400"
                  >
                    <option value="">جنسیت را انتخاب کنید</option>
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="w-[18px] h-[18px] flex items-center justify-center">
                    <svg className="w-4 h-4 text-doveGray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.ceoGender && (
                  <div className="text-xs text-error">{errors.ceoGender}</div>
                )}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col items-start self-stretch justify-center">
                <div className="justify-start text-sm font-medium text-doveGray-400">شماره تلفن</div>
                <input
                  type="tel"
                  value={formData.ceoPhone}
                  onChange={(e) => handleInputChange("ceoPhone", e.target.value)}
                  className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium border-none outline-none"
                  placeholder="شماره تلفن را وارد کنید"
                />
                {errors.ceoPhone && (
                  <div className="text-xs text-error">{errors.ceoPhone}</div>
                )}
              </div>

              {/* Birth Date */}
              <div className="self-stretch flex flex-col justify-center items-start gap-0.5">
                <div className="justify-start text-sm font-medium text-doveGray-400">تاریخ تولد</div>
                <div className="self-stretch h-12 p-2.5 bg-white rounded-[10px] inline-flex justify-between items-center">
                  <DatePicker
                    value={formData.ceoBirthDate}
                    onChange={(date) => handleInputChange("ceoBirthDate", date)}
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    className="w-full h-full border-none outline-none"
                    inputClass="w-full h-full border-none outline-none text-right text-doveGray-400 text-sm font-medium bg-transparent"
                    containerStyle={{ width: "100%" }}
                  />
                  <div className="w-[18px] h-[18px] relative overflow-hidden">
                    <div className="w-[13.50px] h-[13.50px] left-[2.25px] top-[3px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-doveGray-200" />
                    <div className="w-0 h-[3px] left-[12px] top-[1.50px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-doveGray-200" />
                    <div className="w-0 h-[3px] left-[6px] top-[1.50px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-doveGray-200" />
                    <div className="w-[13.50px] h-0 left-[2.25px] top-[7.50px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-doveGray-200" />
                  </div>
                </div>
                {errors.ceoBirthDate && (
                  <div className="text-xs text-error">{errors.ceoBirthDate}</div>
                )}
              </div>

              {/* Father's Name */}
              <div className="flex flex-col items-start self-stretch justify-center">
                <div className="justify-start text-sm font-medium text-doveGray-400">نام پدر</div>
                <input
                  type="text"
                  value={formData.ceoFatherName}
                  onChange={(e) => handleInputChange("ceoFatherName", e.target.value)}
                  className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium border-none outline-none"
                  placeholder="نام پدر را وارد کنید"
                />
                {errors.ceoFatherName && (
                  <div className="text-xs text-error">{errors.ceoFatherName}</div>
                )}
              </div>
            </div>
          </div>
        </div>
</div>
        {/* Judicial Office Selection Section */}
        <div className="w-full relative bg-stormGray-50 rounded-[20px] py-6 mt-6">
          <div className="flex flex-col items-start justify-start gap-5">
            {/* Judicial Office Header */}
            <div className="flex flex-col items-start self-stretch justify-center gap-3">
              <div className="px-5 text-base font-bold text-right text-black">انتخاب دفتر قضایی</div>
              <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-stormGray-200" />
            </div>

            {/* Judicial Office Form */}
            <div className="flex flex-col items-start self-stretch justify-start gap-4 px-5">
              {/* Judicial Office Selection */}
              <div className="flex flex-col items-start self-stretch justify-center">
                <div className="justify-start text-sm font-medium text-doveGray-400">نام دفتر قضایی</div>
                <div className="self-stretch h-12 p-2.5 bg-white rounded-[10px] inline-flex justify-between items-center">
                  <select
                    value={formData.judicialOffice}
                    onChange={(e) => handleInputChange("judicialOffice", e.target.value)}
                    className="w-full h-full text-sm font-medium text-right bg-transparent border-none outline-none text-doveGray-400"
                    disabled={isLoadingOffices}
                  >
                    <option value="">
                      {isLoadingOffices ? "در حال بارگذاری..." : "دفتر قضایی را انتخاب کنید"}
                    </option>
                    {officeCodes && officeCodes.length > 0 ? officeCodes.map((office) => (
                      <option key={office.officeCode} value={office.officeCode}>
                        {office.officeTitle}
                      </option>
                    )) : null}
                  </select>
                  <div className="w-[18px] h-[18px] flex items-center justify-center">
                    <svg className="w-4 h-4 text-doveGray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.judicialOffice && (
                  <div className="text-xs text-error">{errors.judicialOffice}</div>
                )}
              </div>

              {/* Information Icon */}
              <div className="flex items-start self-stretch gap-2">
                <div className="flex items-center justify-center w-5 h-5">
                  <svg className="w-5 h-5 text-info" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                </div>
                <div className="flex-1 text-sm text-doveGray-400">
                  لطفاً دفتر قضایی مورد نظر خود را از لیست انتخاب کنید. این انتخاب در فرآیند ثبت درخواست شما تأثیر خواهد داشت.
                </div>
              </div>
            </div>
                      </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={handleBack}
            className="px-8 py-3 text-sm font-medium transition-colors bg-white border rounded-lg border-stormGray-300 text-stormGray-700 hover:bg-stormGray-50"
          >
            بازگشت
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-3 text-sm font-medium text-white transition-colors rounded-lg bg-ceruleanBlue-600 hover:bg-ceruleanBlue-700"
          >
            ادامه
          </button>
    </div>
    </DeclarationLayout>
  );
};

export default Step1;
