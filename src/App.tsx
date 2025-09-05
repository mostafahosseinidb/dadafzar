import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import OtpVerify from "./pages/OtpVerify";
import Declaration from "./pages/Declaration";
import Declare from "./pages/Declare";
import Step1 from "./pages/Declare/Step1";
import Step2 from "./pages/Declare/Step2";
import Step3 from "./pages/Declare/Step3";
import Step4 from "./pages/Declare/Step4";
import Step5 from "./pages/Declare/Step5";
import Step6 from "./pages/Declare/Step6";
// import Step7 from "./pages/Declare/Step7";
import UserAuthorization from "./pages/UserAuthorization";
import { DeclarationProvider } from "./contexts/DeclarationContext";
import { PaymentGateway, PaymentSuccess, PaymentError } from "./pages/Payment";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        {/* Payment routes - outside main layout */}
        <Route path="/payment/gateway" element={<PaymentGateway />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/error" element={<PaymentError />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/userAuthorization" element={<UserAuthorization />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/declaration" element={<Declaration />} />
            <Route path="/declare" element={<Declare />} />
            <Route path="/declare/*" element={
              <DeclarationProvider>
                <Routes>
                  <Route path="step1" element={<Step1 />} />
                  <Route path="step2" element={<Step2 />} />
                  <Route path="step3" element={<Step3 />} />
                  <Route path="step4" element={<Step4 />} />
                  <Route path="step5" element={<Step5 />} />
                  <Route path="step6" element={<Step6 />} />
           
                </Routes>
              </DeclarationProvider>
            } />
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ fontFamily: "IRANYekanX" }}
      />
    </>
  );
}

export default App;
