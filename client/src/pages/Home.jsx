import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Bus from "../components/Bus";
import { Row, Col, message } from "antd";
import { Helmet } from "react-helmet";
import InternationalCitySelect from "../components/InternationalCitySelect";

function Home() {
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [journeyDate, setJourneyDate] = useState("");

  const getBusesByFilter = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        `/api/buses/get?from=${searchFrom}&to=${searchTo}&journeyDate=${journeyDate}`
      );
      dispatch(HideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.response?.data?.message || error.message);
    }
  }, [searchFrom, searchTo, journeyDate, dispatch]);

  const handleSearch = () => {
    if (!searchFrom || !searchTo || !journeyDate) {
      message.error("Please fill all the fields");
      return;
    }
    getBusesByFilter();
  };

  const swapCities = () => {
    const temp = searchFrom;
    setSearchFrom(searchTo);
    setSearchTo(temp);
  };

  // Load saved search data from international booking page
  useEffect(() => {
    const savedSearch = localStorage.getItem("internationalSearch");
    if (savedSearch) {
      try {
        const searchData = JSON.parse(savedSearch);
        setSearchFrom(searchData.from || "");
        setSearchTo(searchData.to || "");
        setJourneyDate(searchData.journeyDate || "");

        // Clear the saved search data
        localStorage.removeItem("internationalSearch");

        // Auto-search if all fields are filled
        if (searchData.from && searchData.to && searchData.journeyDate) {
          // Small delay to ensure state is updated
          setTimeout(() => {
            getBusesByFilter();
          }, 100);
        }
      } catch (error) {
        console.error("Error loading saved search:", error);
      }
    }
  }, [getBusesByFilter]);

  return (
    <>
      <Helmet>
        <title>International Bus Booking</title>
      </Helmet>
      <div>
        {/* International Bus Search Form */}
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Search International Buses
          </h2>
          <Row gutter={[20, 20]} align="middle">
            <Col lg={8} md={12} sm={24}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <InternationalCitySelect
                value={searchFrom}
                onChange={setSearchFrom}
                placeholder="Select departure city"
              />
            </Col>

            {/* Swap Button */}
            <Col lg={2} md={24} sm={24} className="flex items-end justify-center">
              <button
                onClick={swapCities}
                className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors border border-purple-200 hover:border-purple-300 rotate-90 lg:rotate-0 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Swap departure and destination cities"
                disabled={!searchFrom || !searchTo}
              >
                <i className="ri-arrow-left-right-line text-xl"></i>
              </button>
            </Col>

            <Col lg={8} md={12} sm={24}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <InternationalCitySelect
                value={searchTo}
                onChange={setSearchTo}
                placeholder="Select destination city"
              />
            </Col>

            <Col lg={6} md={24} sm={24}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Journey Date
              </label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </Col>

            <Col lg={24} sm={24} className="text-center">
              <button
                onClick={handleSearch}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <i className="ri-search-line mr-2"></i>
                Search International Buses
              </button>
            </Col>
          </Row>
        </div>
        {/* Search Results */}
        <div className="max-w-6xl mx-auto">
          {buses.length > 0 && (
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Available International Buses ({buses.length} found)
            </h3>
          )}
          <Row gutter={[15, 15]}>
            {buses.map((bus, index) => {
              return (
                <Col key={index} lg={24} sm={24}>
                  <Bus bus={bus} />
                </Col>
              );
            })}
            {buses.length === 0 && searchFrom && searchTo && journeyDate && (
              <div className="flex justify-center w-full py-12">
                <div className="text-center">
                  <i className="ri-bus-line text-6xl text-gray-300 mb-4"></i>
                  <h2 className="text-2xl font-bold text-gray-500 mb-2">
                    No buses found
                  </h2>
                  <p className="text-gray-400">
                    No international buses available for {searchFrom} → {searchTo} on {journeyDate}
                  </p>
                </div>
              </div>
            )}
            {buses.length === 0 && (!searchFrom || !searchTo || !journeyDate) && (
              <div className="flex justify-center w-full py-12">
                <div className="text-center">
                  <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
                  <h2 className="text-2xl font-bold text-gray-500 mb-2">
                    Search for International Buses
                  </h2>
                  <p className="text-gray-400">
                    Select your departure city, destination, and travel date to find available buses
                  </p>
                </div>
              </div>
            )}
          </Row>
        </div>
      </div>
    </>
  );
}

export default Home;
