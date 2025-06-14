import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import OtpVerify from './pages/OtpVerify';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
            {/* Add more protected routes here */}
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
