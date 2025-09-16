import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PublicHeader from "./PublicHeader";

function PublicRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/easy-booking");
    }
  }, [navigate]);
  return (
    <div>
      <PublicHeader />
      {children}
    </div>
  );
}

export default PublicRoute;
