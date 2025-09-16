import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { message } from "antd";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
//import logo from "../assets/img/bus_tickets_app.png";
import CitySelect from "../components/CitySelect";
import { useTranslation } from "react-i18next";
import GlobalLanguageSwitcher from "../components/GlobalLanguageSwitcher";

function DailyBusesView() {
  const dispatch = useDispatch();
  const [dailyBuses, setDailyBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const { t } = useTranslation();

  const daysOfWeek = [
    t('common.sun') + 'day', 
    t('common.mon') + 'day', 
    t('common.tue') + 'day', 
    t('common.wed') + 'day', 
    t('common.thu') + 'day', 
    t('common.fri') + 'day', 
    t('common.sat') + 'day'
  ];

  const getDailyBuses = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get("/daily-buses/active");
      dispatch(HideLoading());
      if (response.data.success) {
        setDailyBuses(response.data.data);
        setFilteredBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
                      dispatch(HideLoading());
                      message.error(t('common.failedToFetchDailyBusSchedules'));
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatActiveDays = (activeDays) => {
    return activeDays.map(day => daysOfWeek[day]).join(', ');
  };

  const getScheduleForDay = (dailyBus, dayNumber) => {
    if (dailyBus.scheduleVariations && dailyBus.scheduleVariations[dayNumber]) {
      return {
        departure: dailyBus.scheduleVariations[dayNumber].departure,
        arrival: dailyBus.scheduleVariations[dayNumber].arrival
      };
    }
    return {
      departure: dailyBus.defaultDeparture,
      arrival: dailyBus.defaultArrival
    };
  };

  const handleSearch = () => {
    let filtered = dailyBuses;
    
    if (searchFrom) {
      filtered = filtered.filter(bus => 
        bus.from.toLowerCase().includes(searchFrom.toLowerCase())
      );
    }
    
    if (searchTo) {
      filtered = filtered.filter(bus => 
        bus.to.toLowerCase().includes(searchTo.toLowerCase())
      );
    }
    
    setFilteredBuses(filtered);
  };

  const clearSearch = () => {
    setSearchFrom("");
    setSearchTo("");
    setFilteredBuses(dailyBuses);
  };

  const swapCities = () => {
    const temp = searchFrom;
    setSearchFrom(searchTo);
    setSearchTo(temp);
  };

  useEffect(() => {
    getDailyBuses();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchFrom, searchTo, dailyBuses]);

  return (
    <>
      <Helmet>
        <title>{t('booking.dailyBuses')}</title>
      </Helmet>
      
      <GlobalLanguageSwitcher position="top-right" />

      {/* Public Header */}
      <div className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-white text-xl font-bold">{t('common.appName')}</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/international-booking"
                className="text-white hover:text-green-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('booking.internationalBusBooking')}
              </Link>
              <Link
                to="/login"
                className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('common.login')}
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {t('common.register')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t('booking.dailyBuses')}
            </h1>
            <p className="text-gray-600">
              {t('admin.dailyBusManagementDescription')}
            </p>
          </div>

          {/* Search Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('booking.from')}
                </label>
                <CitySelect
                  value={searchFrom}
                  onChange={setSearchFrom}
                  placeholder={t('booking.selectDepartureCity')}
                />
              </div>

              {/* Swap Button */}
              <div className="flex items-end justify-center">
                <button
                  onClick={swapCities}
                  className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors border border-blue-200 hover:border-blue-300 rotate-90 md:rotate-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={t('booking.swapDepartureAndDestination')}
                  disabled={!searchFrom || !searchTo}
                >
                  <i className="ri-arrow-left-right-line text-xl"></i>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('booking.to')}
                </label>
                <CitySelect
                  value={searchTo}
                  onChange={setSearchTo}
                  placeholder={t('booking.selectDestinationCity')}
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearSearch}
                  className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  {t('common.clearFilters')}
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              {t('common.showing')} {filteredBuses.length} {filteredBuses.length !== 1 
                ? t('admin.dailyBusSchedules').toLowerCase() 
                : t('common.schedule').toLowerCase()}
            </p>
          </div>

          {/* Daily Buses Grid */}
          <div className="grid gap-6">
            {filteredBuses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">
                  <i className="ri-bus-line"></i>
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  {t('booking.noDailyBusSchedulesFound')}
                </h3>
                <p className="text-gray-500">
                  {searchFrom || searchTo 
                    ? t('booking.tryAdjustingSearchCriteria')
                    : t('booking.noDailyBusSchedulesAvailable')
                  }
                </p>
              </div>
            ) : (
              filteredBuses.map((bus) => (
                <div key={bus.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    {/* Bus Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{bus.name}</h3>
                        <p className="text-gray-600">{t('booking.busNumber')}: {bus.busNumber}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {parseFloat(bus.price).toFixed(2)} €
                        </div>
                        <div className="text-sm text-gray-500">
                          {bus.capacity} {t('booking.seats').toLowerCase()}
                        </div>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-800">{bus.from}</div>
                        <div className="text-sm text-gray-500">{t('booking.departureShort')}</div>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="border-t-2 border-dashed border-gray-300 relative">
                          <i className="ri-bus-line absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-blue-600 text-xl"></i>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-800">{bus.to}</div>
                        <div className="text-sm text-gray-500">{t('booking.arrivalShort')}</div>
                      </div>
                    </div>

                    {/* Schedule Information */}
                    <div className="space-y-4">
                      {/* Active Days */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">{t('admin.activeDays')}:</h4>
                        <div className="flex flex-wrap gap-2">
                          {daysOfWeek.map((day, index) => (
                            <span
                              key={index}
                              className={`px-3 py-1 rounded-full text-sm ${
                                bus.activeDays.includes(index)
                                  ? 'bg-blue-100 text-blue-800 font-medium'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Default Schedule */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">{t('admin.defaultSchedule')}:</h4>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex justify-between">
                            <span>{t('booking.departureTime')}: <strong>{formatTime(bus.defaultDeparture)}</strong></span>
                            <span>{t('booking.arrivalTime')}: <strong>{formatTime(bus.defaultArrival)}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Variations */}
                      {bus.scheduleVariations && Object.keys(bus.scheduleVariations).length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">{t('admin.variations')}:</h4>
                          <div className="space-y-2">
                            {Object.entries(bus.scheduleVariations).map(([dayNum, schedule]) => (
                              <div key={dayNum} className="bg-yellow-50 p-3 rounded-lg">
                                <div className="flex justify-between">
                                  <span className="font-medium text-yellow-800">
                                    {daysOfWeek[parseInt(dayNum)]}:
                                  </span>
                                  <span>
                                    {t('booking.departureShort')}: <strong>{formatTime(schedule.departure)}</strong> | 
                                    {t('booking.arrivalShort')}: <strong>{formatTime(schedule.arrival)}</strong>
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DailyBusesView;
