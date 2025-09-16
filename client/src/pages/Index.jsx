import logo from "../assets/img/bus_tickets_app.png";
import { Helmet } from "react-helmet";
import React, { useCallback } from "react";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Bus from "../components/Bus";
import { Row, message } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GlobalLanguageSwitcher from "../components/GlobalLanguageSwitcher";


function Index() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Easy-Booking</title>
      </Helmet>
      <GlobalLanguageSwitcher position="top-right" />
      <div className="h-screen flex bg-gray-900">
        <div
          className="hero min-h-screen lg:flex w-full lg:w-3/4"
          style={{
            backgroundImage: `url("https://cdn.dribbble.com/users/1976094/screenshots/4687414/buss_trvl.gif")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
        </div>

        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md ">
            <div className="flex justify-center">
              <img
                className=" text-center w-20 h-20 rounded-full"
                src={logo}
                alt="logo"
              />
            </div>

            <h1 className="mb-5 text-5xl text-white font-bold ">
              {t('common.appName')}
            </h1>
            <p className="mb-5 text-xl text-white">
              {t('common.appDescription')}
            </p>
            <div className="flex flex-col gap-4">
              <Link
                to="/login"
                className="relative inline-flex items-center justify-start
                  px-10 py-3 overflow-hidden font-bold rounded-full
                  group"
              >
                <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:translate-x-1"></span>
                <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                  {t('common.checkTickets')}
                </span>
                <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
              </Link>

              <Link
                to="/daily-buses"
                className="relative inline-flex items-center justify-start
                  px-10 py-3 overflow-hidden font-bold rounded-full
                  group border-2 border-green-500"
              >
                <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-green-500 opacity-100 group-hover:translate-x-1"></span>
                <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white flex items-center justify-center gap-2">
                  <i className="ri-map-pin-line"></i>
                  {t('common.viewDailyBuses')}
                </span>
                <span className="absolute inset-0 border-2 border-green-500 rounded-full"></span>
              </Link>

              <Link
                to="/international-booking"
                className="relative inline-flex items-center justify-start
                  px-10 py-3 overflow-hidden font-bold rounded-full
                  group border-2 border-purple-500"
              >
                <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-purple-500 opacity-100 group-hover:translate-x-1"></span>
                <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white flex items-center justify-center gap-2">
                  <i className="ri-plane-line"></i>
                  {t('common.bookInternational')}
                </span>
                <span className="absolute inset-0 border-2 border-purple-500 rounded-full"></span>
              </Link>
            </div>

            {/* Travel Options Info Section */}
            <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="flex flex-col justify-start">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    <i className="ri-map-pin-line mr-2"></i>
                    {t('common.domesticTravel')}
                  </h3>
                  <p className="text-white text-sm opacity-90 mb-3">
                    {t('common.domesticDescription')}
                  </p>
                  <Link
                    to="/daily-buses"
                    className="text-green-400 hover:text-green-300 text-sm font-medium underline"
                  >
                    {t('common.viewKosovoRoutes')}
                  </Link>
                </div>
                <div className="flex flex-col justify-start">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    <i className="ri-plane-line mr-2"></i>
                    {t('common.internationalTravel')}
                  </h3>
                  <p className="text-white text-sm opacity-90 mb-3">
                    {t('common.internationalDescription')}
                  </p>
                  <Link
                    to="/international-booking"
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium underline mt-auto"
                  >
                    {t('common.bookInternationalLink')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
