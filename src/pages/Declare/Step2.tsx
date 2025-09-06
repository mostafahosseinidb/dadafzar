import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { DateObject } from "react-multi-date-picker";
import DeclarationLayout from "../../components/DeclarationLayout";
import { useDeclaration } from "../../contexts/DeclarationContext";

interface ContactFormData {
  contactType: "real" | "legal";
  nationalId: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: DateObject | null;
  fatherName: string;
  address: string;
}

const Step2: React.FC = () => {
  const navigate = useNavigate();
  const { declarationData, updateDeclarationData } = useDeclaration();
  
  const initialContactState = {
    contactType: "real" as "real" | "legal",
    nationalId: "",
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: null as DateObject | null,
    fatherName: "",
    address: "",
  };

  const initialErrorsState = {
    contactType: "",
    nationalId: "",
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: "",
    fatherName: "",
    address: "",
  };

  const [formData, setFormData] = useState<ContactFormData[]>(
    declarationData.step2Data && declarationData.step2Data.length > 0 
      ? declarationData.step2Data.map(contact => ({
          ...contact,
          birthDate: contact.birthDate ? new DateObject(contact.birthDate) : null
        }))
      : [initialContactState]
  );
  const [errors, setErrors] = useState([initialErrorsState]);

  const contactTypes = [
    { value: "real", label: "مخاطب حقیقی" },
    { value: "legal", label: "مخاطب حقوقی" },
  ];

  const handleInputChange = (
    index: number,
    field: string,
    value: string | DateObject | null
  ) => {
    setFormData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });

    // Clear error when user starts typing
    if (errors[index] && errors[index][field as keyof typeof initialErrorsState]) {
      setErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = { ...newErrors[index], [field]: "" };
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = formData.map(() => ({
      contactType: "",
      nationalId: "",
      firstName: "",
      lastName: "",
      phone: "",
      birthDate: "",
      fatherName: "",
      address: "",
    }));

    let isValid = true;

    formData.forEach((contact, index) => {
      if (!contact.contactType) {
        newErrors[index].contactType = "نوع مخاطب الزامی است";
        isValid = false;
      }
      if (!contact.nationalId.trim()) {
        newErrors[index].nationalId = "کد ملی الزامی است";
        isValid = false;
      }
      if (!contact.firstName.trim()) {
        newErrors[index].firstName = "نام الزامی است";
        isValid = false;
      }
      if (!contact.lastName.trim()) {
        newErrors[index].lastName = "نام خانوادگی الزامی است";
        isValid = false;
      }
      if (!contact.phone.trim()) {
        newErrors[index].phone = "شماره تماس الزامی است";
        isValid = false;
      }
      if (!contact.birthDate) {
        newErrors[index].birthDate = "تاریخ تولد الزامی است";
        isValid = false;
      }
      if (!contact.fatherName.trim()) {
        newErrors[index].fatherName = "نام پدر الزامی است";
        isValid = false;
      }
      if (!contact.address.trim()) {
        newErrors[index].address = "آدرس الزامی است";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Save data to context
      updateDeclarationData({
        step2Data: formData.map(contact => ({
          contactType: contact.contactType as 'real' | 'legal',
          nationalId: contact.nationalId,
          firstName: contact.firstName,
          lastName: contact.lastName,
          phone: contact.phone,
          birthDate: typeof contact.birthDate === 'string' ? contact.birthDate : (contact.birthDate ? contact.birthDate.format("YYYY/MM/DD") : ""),
          fatherName: contact.fatherName,
          address: contact.address,
        }))
      });
      navigate("/declare/step3");
    }
  };

  const handleBack = () => {
    navigate("/declare/step1");
  };

  const handleAddContact = () => {
    setFormData((prev) => [...prev, { ...initialContactState }]);
    setErrors((prev) => [...prev, { ...initialErrorsState }]);
  };

  return (
    <DeclarationLayout currentStep={2}>
      <div className="flex flex-col w-full gap-6">
        {/* Dynamic Contact Sections */}
        {formData.map((contact, index) => (
          <div key={index} className="w-full relative bg-stormGray-50 rounded-[20px] py-6">
            <div className="flex flex-col items-start justify-start gap-5">
              {/* Header */}
              <div className="flex flex-col items-start self-stretch justify-center gap-3">
                <div className="px-5 text-base font-bold text-right text-black">
                  مخاطب {index === 0 ? "اول" : index === 1 ? "دوم" : `${index + 1}`}
                </div>
                <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-stormGray-200" />
              </div>

              {/* Form Fields */}
              <div className="flex flex-col items-start self-stretch justify-start gap-4 px-5">
                {/* Contact Type Selection */}
                <div className="flex flex-col items-start self-stretch justify-center gap-3">
                  <div className="flex items-center gap-6">
                    {contactTypes.map((type) => (
                      <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`contactType-${index}`}
                          value={type.value}
                        disabled
                          checked={contact.contactType === type.value}
                          onChange={(e) => handleInputChange(index, "contactType", e.target.value)}
                          className="w-4 h-4 text-ceruleanBlue-600 border-stormGray-300 focus:ring-ceruleanBlue-500"
                        />
                        <span className="text-sm font-medium text-doveGray-400">{type.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors[index]?.contactType && (
                    <div className="text-xs text-error">{errors[index].contactType}</div>
                  )}
                </div>

                {/* First Row: National ID, First Name, Last Name */}
                <div className="inline-flex items-start self-stretch justify-start gap-4">
                  {/* National ID */}
                  <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
                    <div className="justify-start text-sm font-medium text-doveGray-400">کدملی</div>
                    <input
                      type="text"
                      value={contact.nationalId}
                      onChange={(e) => handleInputChange(index, "nationalId", e.target.value)}
                      className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium border-none outline-none"
                      placeholder="کد ملی را وارد کنید"
                    />
                    {errors[index]?.nationalId && (
                      <div className="text-xs text-error">{errors[index].nationalId}</div>
                    )}
                  </div>

                  {/* First Name */}
                  <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
                    <div className="justify-start text-sm font-medium text-doveGray-400">نام</div>
                    <input
                      type="text"
                      value={contact.firstName}
                      onChange={(e) => handleInputChange(index, "firstName", e.target.value)}
                      className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium border-none outline-none"
                      placeholder="نام را وارد کنید"
                    />
                    {errors[index]?.firstName && (
                      <div className="text-xs text-error">{errors[index].firstName}</div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
                    <div className="justify-start text-sm font-medium text-doveGray-400">نام خانوادگی</div>
                    <input
                      type="text"
                      value={contact.lastName}
                      onChange={(e) => handleInputChange(index, "lastName", e.target.value)}
                      className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium border-none outline-none"
                      placeholder="نام خانوادگی را وارد کنید"
                    />
                    {errors[index]?.lastName && (
                      <div className="text-xs text-error">{errors[index].lastName}</div>
                    )}
                  </div>
                </div>

                {/* Second Row: Phone, Birth Date, Father's Name */}
                <div className="inline-flex items-start self-stretch justify-start gap-4">
                  {/* Phone Number */}
                  <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
                    <div className="justify-start text-sm font-medium text-doveGray-400">شماره تماس</div>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => handleInputChange(index, "phone", e.target.value)}
                      className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium border-none outline-none"
                      placeholder="شماره تماس را وارد کنید"
                    />
                    {errors[index]?.phone && (
                      <div className="text-xs text-error">{errors[index].phone}</div>
                    )}
                  </div>

                  {/* Birth Date */}
                  <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
                    <div className="justify-start text-sm font-medium text-doveGray-400">تاریخ تولد</div>
                    <div className="self-stretch h-12 p-2.5 bg-white rounded-[10px] inline-flex justify-between items-center">
                      <DatePicker
                        value={contact.birthDate}
                        onChange={(date) => handleInputChange(index, "birthDate", date)}
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
                    {errors[index]?.birthDate && (
                      <div className="text-xs text-error">{errors[index].birthDate}</div>
                    )}
                  </div>

                  {/* Father's Name */}
                  <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
                    <div className="justify-start text-sm font-medium text-doveGray-400">نام پدر</div>
                    <input
                      type="text"
                      value={contact.fatherName}
                      onChange={(e) => handleInputChange(index, "fatherName", e.target.value)}
                      className="self-stretch h-12 p-2.5 bg-white rounded-[10px] flex flex-col justify-center items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium border-none outline-none"
                      placeholder="نام پدر را وارد کنید"
                    />
                    {errors[index]?.fatherName && (
                      <div className="text-xs text-error">{errors[index].fatherName}</div>
                    )}
                  </div>
                </div>

                {/* Third Row: Address */}
                <div className="flex flex-col items-start self-stretch justify-center gap-0.5">
                  <div className="justify-start text-sm font-medium text-doveGray-400">آدرس</div>
                  <textarea
                    value={contact.address}
                    onChange={(e) => handleInputChange(index, "address", e.target.value)}
                    className="self-stretch h-20 p-2.5 bg-white rounded-[10px] flex flex-col justify-start items-end gap-2.5 text-right text-doveGray-400 text-sm font-medium border-none outline-none resize-none"
                    placeholder="آدرس را وارد کنید"
                  />
                  {errors[index]?.address && (
                    <div className="text-xs text-error">{errors[index].address}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Contact Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleAddContact}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-lg text-ceruleanBlue-600 border-ceruleanBlue-200 hover:bg-ceruleanBlue-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            افزودن مخاطب
          </button>
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
      </div>
    </DeclarationLayout>
  );
};

export default Step2;