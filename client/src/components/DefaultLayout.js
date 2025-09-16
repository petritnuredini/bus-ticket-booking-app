import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
//import logo from "../assets/img/bus_tickets_app.png";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.users);
  const { t } = useTranslation();

  const userMenu = [
    {
      name: t('common.home'),
      path: "/easy-booking",
      icon: "ri-home-line",
    },
    {
      name: t('common.myBookings'),
      path: "/bookings",
      icon: "ri-file-list-line",
    },
    {
      name: t('booking.dailyBuses', 'Daily Buses'),
      path: "/daily-buses",
      icon: "ri-calendar-line",
    },
    {
      name: t('booking.internationalBuses', 'International Buses'),
      path: "/international-booking",
      icon: "ri-plane-line",
    },
    {
      name: t('chat.chatWithUs'),
      path: "/chat",
      icon: "ri-message-2-line",
    },
    {
      name: t('common.logout'),
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const adminMenu = [
    {
      name: t('common.home'),
      path: "/easy-booking",
      icon: "ri-home-line",
    },
    {
      name: t('admin.buses'),
      path: "/admin/buses",
      icon: "ri-bus-line",
    },
    {
      name: t('admin.dailyBuses'),
      path: "/admin/daily-buses",
      icon: "ri-calendar-line",
    },
    {
      name: t('admin.users'),
      path: "/admin/users",
      icon: "ri-user-line",
    },
    {
      name: t('admin.bookings'),
      path: "/admin/bookings",
      icon: "ri-file-list-line",
    },
    {
      name: t('chat.chatWithUs'),
      path: "/chat",
      icon: "ri-message-2-line",
    },
    {
      name: t('common.logout'),
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const menutoBeRendered = user?.isAdmin ? adminMenu : userMenu;
  let activeRoute = window.location.pathname;
  if (window.location.pathname.includes("book-now")) {
    activeRoute = "/easy-booking";
  }

  return (
    <div className="flex w-full">
      <div className="h-screen sticky top-0 flex flex-col bg-gray-800 shadow justify-start px-5 py-0 ">
        <div className="flex flex-col justify-start items-center p-5">
          <div className="bg-gray-800 w-full ">
            {collapsed ? (
              <i
                className="ri-menu-2-fill cursor-pointer text-[30px] text-white"
                onClick={() => {
                  setCollapsed(false);
                }}
              ></i>
            ) : (
              <i
                className="ri-close-line cursor-pointer text-[30px] text-white"
                onClick={() => {
                  setCollapsed(true);
                }}
              ></i>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 justify-start mt-[100px] ">
          {menutoBeRendered.map((item, key) => {
            return (
              <div
                key={key}
                className={`${
                  activeRoute === item.path && "bg-blue-900 btn-disabled"
                } gap-2 relative inline-flex items-center justify-start px-10 py-3 overflow-hidden font-bold rounded-full group`}
              >
                <i
                  className={`${item.icon} w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-black opacity-[3%]`}
                ></i>
                <i
                  className={`${item.icon} text-white text-[20px] group-hover:text-black`}
                ></i>

                {!collapsed && (
                  <span
                    onClick={() => {
                      if (item.path === "/logout") {
                        localStorage.clear();
                        navigate("/");
                      } else {
                        navigate(item.path);
                      }
                    }}
                  >
                    <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                    <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:translate-x-0"></span>
                    <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-black">
                      {item.name}
                    </span>
                    <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full">
        <div className="bg-gray-800 flex flex-col justify-start items-center py-2">
          {/* <img
            onClick={() => navigate("/")}
            src={logo}
            alt="logo"
            className="w-30 h-20 rounded-full cursor-pointer"
          /> */}
          <h1 className="text-white text-base mb-0 p-0 text-center ">
            <div className="mt-1">{user?.name} </div>
            <div className="mt-1">{user?.email}</div>
          </h1>
          <div className="mt-3">
            <LanguageSwitcher />
          </div>
        </div>
        <div className="p-[10px] px-0">{children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
