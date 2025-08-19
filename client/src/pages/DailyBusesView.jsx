import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { message } from "antd";
import { Helmet } from "react-helmet";
import DefaultLayout from "../components/DefaultLayout";

function DailyBusesView() {
  const dispatch = useDispatch();
  const [dailyBuses, setDailyBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getDailyBuses = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get("/api/daily-buses/active");
      dispatch(HideLoading());
      if (response.data.success) {
        setDailyBuses(response.data.data);
        setFilteredBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error("Failed to fetch daily bus schedules");
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

  useEffect(() => {
    getDailyBuses();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchFrom, searchTo, dailyBuses]);

  return (
    <DefaultLayout>
      <Helmet>
        <title>Daily Bus Schedules</title>
      </Helmet>
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Daily Bus Schedules
            </h1>
            <p className="text-gray-600">
              View recurring bus schedules and plan your regular journeys
            </p>
          </div>

          {/* Search Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <input
                  type="text"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  placeholder="Enter departure city"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="text"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  placeholder="Enter destination city"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearSearch}
                  className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {filteredBuses.length} daily bus schedule{filteredBuses.length !== 1 ? 's' : ''}
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
                  No daily bus schedules found
                </h3>
                <p className="text-gray-500">
                  {searchFrom || searchTo 
                    ? "Try adjusting your search criteria" 
                    : "No daily bus schedules are currently available"
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
                        <p className="text-gray-600">Bus #{bus.busNumber}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          ${parseFloat(bus.price).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {bus.capacity} seats
                        </div>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-800">{bus.from}</div>
                        <div className="text-sm text-gray-500">Departure</div>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="border-t-2 border-dashed border-gray-300 relative">
                          <i className="ri-bus-line absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-blue-600 text-xl"></i>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-800">{bus.to}</div>
                        <div className="text-sm text-gray-500">Arrival</div>
                      </div>
                    </div>

                    {/* Schedule Information */}
                    <div className="space-y-4">
                      {/* Active Days */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Operating Days:</h4>
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
                        <h4 className="font-medium text-gray-700 mb-2">Default Schedule:</h4>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex justify-between">
                            <span>Departure: <strong>{formatTime(bus.defaultDeparture)}</strong></span>
                            <span>Arrival: <strong>{formatTime(bus.defaultArrival)}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Variations */}
                      {bus.scheduleVariations && Object.keys(bus.scheduleVariations).length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Special Schedules:</h4>
                          <div className="space-y-2">
                            {Object.entries(bus.scheduleVariations).map(([dayNum, schedule]) => (
                              <div key={dayNum} className="bg-yellow-50 p-3 rounded-lg">
                                <div className="flex justify-between">
                                  <span className="font-medium text-yellow-800">
                                    {daysOfWeek[parseInt(dayNum)]}:
                                  </span>
                                  <span>
                                    Dep: <strong>{formatTime(schedule.departure)}</strong> | 
                                    Arr: <strong>{formatTime(schedule.arrival)}</strong>
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
    </DefaultLayout>
  );
}

export default DailyBusesView;
