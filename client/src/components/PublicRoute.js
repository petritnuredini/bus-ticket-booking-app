import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalLanguageSwitcher from "./GlobalLanguageSwitcher";

function PublicRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/easy-booking");
    }
  }, [navigate]);
  return (
    <div>
      <GlobalLanguageSwitcher position="top-right" />
      {children}
    </div>
  );
}

export default PublicRoute;
