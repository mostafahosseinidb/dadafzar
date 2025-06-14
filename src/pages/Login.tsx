import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/auth";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

interface LoginFormValues {
  phoneNumber: string;
  nationalId: string;
}

const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required("شماره همراه الزامی است")
    .matches(/^09[0-9]{9}$/, "شماره همراه باید با ۰۹ شروع شود و ۱۱ رقم باشد"),
  nationalId: Yup.string()
    .required("کد ملی الزامی است")
    .matches(/^[0-9]{10}$/, "کد ملی باید ۱۰ رقم باشد"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const response = await authService.login({
        nationalId: values.nationalId,
        phoneNumber: values.phoneNumber,
      });

      navigate("/otp-verify", {
        state: {
          phoneNumber: values.phoneNumber,
          nationalId: values.nationalId,
        },
      });
      toast.success(response?.data?.message);
    } catch (error: unknown) {
      console.log("error", error);
      // let message = "خطایی رخ داده است. لطفا دوباره تلاش کنید.";
      // if (error && typeof error === "object" && "response" in error) {
      //   // @ts-expect-error: dynamic error shape from axios
      //   message = error.response?.data?.message || error.message || message;
      // } else if (error instanceof Error) {
      //   message = error.message;
      // }
      // toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full relative bg-white flex flex-row items-center justify-center gap-5">
      <div className="w-[632px] h-[612px] bg-black/20 rounded-[20px] overflow-hidden">
        <img
          src="/image/loginImage.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-[700px]">
        <Formik
          initialValues={{ phoneNumber: "", nationalId: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="flex flex-col justify-start items-center gap-3">
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
                  <Field
                    type="tel"
                    name="phoneNumber"
                    placeholder="شماره همراه را وارد کنید"
                    className={`self-stretch h-12 p-2.5 bg-[#F4F6F9] rounded-[10px] text-right ${
                      errors.phoneNumber && touched.phoneNumber
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber}
                    </div>
                  )}
                </div>
                <div className="w-[378px] flex flex-col justify-center items-end gap-0.5">
                  <div className="justify-start text-Dove-Gray-500 text-sm font-medium">
                    کدملی
                  </div>
                  <Field
                    type="text"
                    name="nationalId"
                    placeholder="کد ملی را وارد کنید"
                    className={`self-stretch h-12 p-2.5 bg-[#F4F6F9] rounded-[10px] text-right ${
                      errors.nationalId && touched.nationalId
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                  {errors.nationalId && touched.nationalId && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.nationalId}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right justify-start">
                <span className="text-[#F3084E] text-sm font-medium">
                  توجه:
                </span>
                <span className="text-Black text-sm font-medium">
                  {" "}
                  کدملی و شماره همراه باید متعلق به یک نفر باشد
                </span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-[378px] h-12 p-2.5 bg-tropicalBlue-900 rounded-lg inline-flex justify-center items-center gap-2.5 text-right mt-3 text-white text-base font-medium leading-[27px] ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "در حال پردازش..." : "ادامه"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
