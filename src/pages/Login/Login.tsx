import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../api";
import { Formik, Form, Field } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

interface LoginFormValues {
  mobileNumber: string;
  nationalCode: string;
}

const validationSchema = Yup.object().shape({
  mobileNumber: Yup.string()
    .required("شماره همراه الزامی است")
    .matches(/^09[0-9]{9}$/, "شماره همراه باید با ۰۹ شروع شود و ۱۱ رقم باشد"),
  nationalCode: Yup.string()
    .required("کد ملی الزامی است")
    .matches(/^[0-9]{10}$/, "کد ملی باید ۱۰ رقم باشد"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

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
      await loginMutation.mutateAsync({
        nationalCode: values.nationalCode,
        mobileNumber: values.mobileNumber,
      });
      
      navigate("/otp-verify", {
        state: {
          mobileNumber: values.mobileNumber,
          nationalCode: values.nationalCode,
        },
      });
    } catch (error: unknown) {
      console.log("error", error);
      // Error handling is now managed by React Query
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-row items-center justify-center w-full h-screen gap-5 bg-white">
      <div className="w-[700px]">
        <Formik
          initialValues={{ mobileNumber: "", nationalCode: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="flex flex-col items-center justify-start gap-3">
              <div className="flex flex-col items-center justify-start gap-3 mb-2">
                <div className="justify-start text-2xl font-bold text-right text-black">
                  ورود با شماره همراه
                </div>
                <div className="text-right justify-start text-Dove-Gray-500 text-base font-medium leading-[27px]">
                  برای ورود و ثبت نام شماره همراه و کدملی خود را واردنمایید
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-3">
                <div className="w-[378px] flex flex-col justify-center items-start gap-0.5">
                  <div className="text-sm font-medium text-right text-Dove-Gray-500">
                    شماره همراه
                  </div>
                  <Field
                    type="tel"
                    name="mobileNumber"
                    placeholder="شماره همراه را وارد کنید"
                    className={`self-stretch h-12 p-2.5 bg-[#F4F6F9] rounded-[10px] text-right ${
                      errors.mobileNumber && touched.mobileNumber
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                  {errors.mobileNumber && touched.mobileNumber && (
                    <div className="mt-1 text-sm text-red-500">
                      {errors.mobileNumber}
                    </div>
                  )}
                </div>
                <div className="w-[378px] flex flex-col justify-center items-start gap-0.5">
                  <div className="justify-start text-sm font-medium text-Dove-Gray-500">
                    کدملی
                  </div>
                  <Field
                    type="text"
                    name="nationalCode"
                    placeholder="کد ملی را وارد کنید"
                    className={`self-stretch h-12 p-2.5 bg-[#F4F6F9] rounded-[10px] text-right ${
                      errors.nationalCode && touched.nationalCode
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                  {errors.nationalCode && touched.nationalCode && (
                    <div className="mt-1 text-sm text-red-500">
                      {errors.nationalCode}
                    </div>
                  )}
                </div>
              </div>
              <div className="justify-start text-right">
                <span className="text-[#F3084E] text-sm font-medium">
                  توجه:
                </span>
                <span className="text-sm font-medium text-Black">
                  {" "}
                  کدملی و شماره همراه باید متعلق به یک نفر باشد
                </span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || loginMutation.isPending}
                className={`w-[378px] h-12 p-2.5 bg-tropicalBlue-900 rounded-lg inline-flex justify-center items-center gap-2.5 text-right mt-3 text-white text-base font-medium leading-[27px] ${
                  isSubmitting || loginMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting || loginMutation.isPending ? "در حال پردازش..." : "ادامه"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div className="w-[632px] h-[612px] bg-black/20 rounded-[20px] overflow-hidden">
        <img
          src="/image/loginImage.png"
          alt=""
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default Login;
