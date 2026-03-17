import React, { useState } from 'react';
import { MapPin, X, Search } from 'lucide-react';
import './LocationPicker.css';

const INDIAN_CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Kanpur', 'Nagpur', 'Indore', 'Bhopal', 'Patna',
  'Varanasi', 'Agra', 'Meerut', 'Allahabad', 'Amritsar',
  'Rampur', 'Moradabad', 'Bareilly', 'Aligarh', 'Ghaziabad'
];

export default function LocationPicker({ isOpen, onClose, onSelect, currentLocation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState(INDIAN_CITIES);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCities(INDIAN_CITIES);
    } else {
      const filtered = INDIAN_CITIES.filter(city =>
        city.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  };

  const handleSelectCity = (city) => {
    onSelect(city);
    onClose();
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // For now, use default location
          // In production, use reverse geocoding
          onSelect('Rampur');
          onClose();
        },
        () => {
          alert('Location permission denied. Please select manually.');
        }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="location-picker-overlay">
      <div className="location-picker-modal">
        <div className="modal-header">
          <h3>Select Location</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Current Location Button */}
          <button className="use-current-location-btn" onClick={handleUseCurrentLocation}>
            <MapPin size={20} />
            Use Current Location
          </button>

          {/* Search Box */}
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search city..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* City List */}
          <div className="city-list">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <div
                  key={city}
                  className={`city-item ${city === currentLocation ? 'active' : ''}`}
                  onClick={() => handleSelectCity(city)}
                >
                  <MapPin size={16} />
                  <span>{city}</span>
                  {city === currentLocation && <span className="current-badge">Current</span>}
                </div>
              ))
            ) : (
              <p className="no-results">No cities found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
