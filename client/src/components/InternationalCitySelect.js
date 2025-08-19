import React, { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../helpers/axiosInstance";

function InternationalCitySelect({ 
  value, 
  onChange, 
  placeholder = "Select international city", 
  className = "",
  disabled = false 
}) {
  const [cities, setCities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch international cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/international-cities/get-all-cities");
        if (response.data.status === "success") {
          setCities(response.data.data);
          setFilteredCities(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching international cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Filter cities based on search term
  useEffect(() => {
    if (searchTerm && isOpen && searchTerm !== value) {
      // Only filter when user is actively typing something different from selected value
      const filtered = cities.filter((city) =>
        city.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      // Show all cities when dropdown opens or when displaying selected value
      setFilteredCities(cities);
    }
  }, [searchTerm, cities, isOpen, value]);

  // Set initial search term based on value
  useEffect(() => {
    if (value && cities.length > 0) {
      const selectedCity = cities.find(city => city.ville === value);
      if (selectedCity) {
        setSearchTerm(selectedCity.ville);
      }
    } else if (!value) {
      setSearchTerm("");
    }
  }, [value, cities]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    
    // If user clears the input, clear the selection
    if (!newValue) {
      onChange("");
    }
  };

  const handleCitySelect = (city) => {
    setSearchTerm(city.ville);
    onChange(city.ville);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
    // Keep the selected city displayed, but show all cities in dropdown
  };

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleDropdownToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      inputRef.current?.blur();
    } else {
      setIsOpen(true);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCities.length === 1) {
        handleCitySelect(filteredCities[0]);
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={loading ? "Loading cities..." : placeholder}
          disabled={disabled || loading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-16"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 pointer-events-none"></div>
          ) : (
            <div className="flex items-center space-x-1">
              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors w-8 h-8"
                  title="Clear selection"
                >
                  <i className="ri-close-line text-gray-400 hover:text-gray-600 text-sm"></i>
                </button>
              )}
              <button
                type="button"
                onClick={handleDropdownToggle}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors w-8 h-8"
                title={isOpen ? "Close dropdown" : "Open dropdown"}
              >
                <i
                  className={`ri-arrow-${
                    isOpen ? "up" : "down"
                  }-s-line text-gray-400 hover:text-gray-600`}
                ></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredCities.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              {searchTerm ? `No cities found matching "${searchTerm}"` : "No cities available"}
            </div>
          ) : (
            filteredCities.map((city) => (
              <div
                key={city.id}
                onClick={() => handleCitySelect(city)}
                className={`px-4 py-3 cursor-pointer hover:bg-purple-50 flex justify-between items-center ${
                  value === city.ville ? 'bg-purple-100 text-purple-800' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{city.flag}</span>
                  <div>
                    <span className="font-medium">{city.ville}</span>
                    <div className="text-sm text-gray-500">{city.country}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default InternationalCitySelect;
