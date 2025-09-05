import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Declare: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to step 1 when accessing /declare
    navigate("/declare/step1", { replace: true });
  }, [navigate]);

  return null;
};

export default Declare;
