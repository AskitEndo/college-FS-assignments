import React, { useState, useRef, useEffect } from "react";
import "../styles/FilterDropdown.css";

export default function FilterDropdown({ filter, setFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const filterOptions = [
    { value: "all", label: "All Tasks", icon: "🔍" },
    { value: "high", label: "High Priority", icon: "🔴" },
    { value: "medium", label: "Medium Priority", icon: "🟠" },
    { value: "low", label: "Low Priority", icon: "🟢" },
  ];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Get the label for currently selected filter
  const getFilterLabel = () => {
    return filterOptions.find(option => option.value === filter)?.label || "All Tasks";
  };
  
  // Get the icon for currently selected filter
  const getFilterIcon = () => {
    return filterOptions.find(option => option.value === filter)?.icon || "🔍";
  };
  
  return (
    <div className="filter-container">
      <div className="filter-label">
        <span className="filter-icon">{getFilterIcon()}</span>
        Filter by Priority
      </div>
      
      <div className="filter-actions">
        <div className="filter-dropdown" ref={dropdownRef}>
          <div 
            className={`dropdown-selected ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{getFilterLabel()}</span>
            <span className={`dropdown-icon ${isOpen ? 'open' : ''}`}>▼</span>
          </div>
          
          {isOpen && (
            <div className="dropdown-menu">
              {filterOptions.map((option) => (
                <div 
                  key={option.value}
                  className={`dropdown-item ${filter === option.value ? 'active' : ''}`}
                  onClick={() => {
                    setFilter(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span className="priority-indicator">{option.icon}</span>
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
