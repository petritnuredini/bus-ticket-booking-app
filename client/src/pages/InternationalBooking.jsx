import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import logo from "../assets/img/bus_tickets_app.png";
import InternationalCitySelect from "../components/InternationalCitySelect";

function InternationalBooking() {
  const navigate = useNavigate();
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [journeyDate, setJourneyDate] = useState("");

  const handleSearch = () => {
    if (!searchFrom || !searchTo || !journeyDate) {
      message.error("Please fill all the fields");
      return;
    }

    // Store search data in localStorage for after login
    localStorage.setItem("internationalSearch", JSON.stringify({
      from: searchFrom,
      to: searchTo,
      journeyDate: journeyDate
    }));

    // Redirect to login
    navigate("/login");
  };

  const swapCities = () => {
    const temp = searchFrom;
    setSearchFrom(searchTo);
    setSearchTo(temp);
  };

  return (
    <>
      <Helmet>
        <title>International Ticket Booking</title>
      </Helmet>
      
      {/* Public Header */}
      <div className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <img className="h-10 w-10 rounded-full" src={logo} alt="Logo" />
              <span className="text-white text-xl font-bold">Easy-Booking</span>
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/daily-buses"
                className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Daily Buses
              </Link>
              <Link
                to="/login"
                className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-100 rounded-full">
                <i className="ri-plane-line text-4xl text-purple-600"></i>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              International Ticket Booking
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect Kosovo with the world. Book your international travel tickets 
              for destinations across Europe and beyond.
            </p>
          </div>

          {/* Search Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Book Your International Journey
              </h2>
              <p className="text-lg text-gray-600">
                Search for international bus routes and book your tickets
              </p>
            </div>

            {/* Search Form */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <InternationalCitySelect
                    value={searchFrom}
                    onChange={setSearchFrom}
                    placeholder="Select departure city"
                  />
                </div>

                {/* Swap Button */}
                <div className="flex items-end justify-center">
                  <button
                    onClick={swapCities}
                    className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors border border-purple-200 hover:border-purple-300 rotate-90 md:rotate-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Swap departure and destination cities"
                    disabled={!searchFrom || !searchTo}
                  >
                    <i className="ri-arrow-left-right-line text-xl"></i>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <InternationalCitySelect
                    value={searchTo}
                    onChange={setSearchTo}
                    placeholder="Select destination city"
                  />
                </div>

                <div>
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
                </div>
              </div>

              {/* Search Button */}
              <div className="text-center">
                <button
                  onClick={handleSearch}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  <i className="ri-search-line mr-2"></i>
                  Search International Buses
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  You'll be redirected to login to complete your booking
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Popular International Destinations
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Explore some of our most popular international routes
                </p>
              </div>

              {/* Destination Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { city: "Vienna", country: "Austria", flag: "🇦🇹" },
                  { city: "Munich", country: "Germany", flag: "🇩🇪" },
                  { city: "Zurich", country: "Switzerland", flag: "🇨🇭" },
                  { city: "Milan", country: "Italy", flag: "🇮🇹" },
                  { city: "Paris", country: "France", flag: "🇫🇷" },
                  { city: "Amsterdam", country: "Netherlands", flag: "🇳🇱" },
                  { city: "Brussels", country: "Belgium", flag: "🇧🇪" },
                  { city: "Stockholm", country: "Sweden", flag: "🇸🇪" },
                ].map((destination, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors cursor-pointer"
                    onClick={() => setSearchTo(destination.city)}
                  >
                    <div className="text-xl mb-1">{destination.flag}</div>
                    <div className="font-semibold text-gray-800 text-sm">{destination.city}</div>
                    <div className="text-xs text-gray-600">{destination.country}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <i className="ri-shield-check-line text-3xl text-green-500 mb-3"></i>
                <h3 className="font-semibold text-gray-800 mb-2">Secure Booking</h3>
                <p className="text-sm text-gray-600">
                  Safe and secure payment processing for international tickets
                </p>
              </div>
              <div className="text-center">
                <i className="ri-customer-service-line text-3xl text-blue-500 mb-3"></i>
                <h3 className="font-semibold text-gray-800 mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">
                  Round-the-clock customer support for international travelers
                </p>
              </div>
              <div className="text-center">
                <i className="ri-price-tag-line text-3xl text-purple-500 mb-3"></i>
                <h3 className="font-semibold text-gray-800 mb-2">Best Prices</h3>
                <p className="text-sm text-gray-600">
                  Competitive pricing for all international destinations
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default InternationalBooking;
