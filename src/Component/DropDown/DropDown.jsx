import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const DropDown = ({
  placeholder = "Search Account",
  options = [],
  isLoading = false,
  selectedValue,
  onSelect,
  onClear,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearInput = () => {
    setSearchQuery("");
    if (onClear) onClear();
  };

  return (
    <div className="relative mb-2">
      <input
        autoComplete="off"
        type="text"
        id="account"
        placeholder={placeholder}
        className={`border p-2 pl-10 w-full ${
          disabled ? "cursor-not-allowed bg-gray-100" : "cursor-pointer"
        }`}
        value={selectedValue || searchQuery}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={disabled}
      />
      <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />

      {/* Clear Button */}
      {selectedValue && (
        <button
          type="button"
          onClick={clearInput}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <FaTimes className="text-gray-500" />
        </button>
      )}

      {/* Dropdown List */}
      {showDropdown && (
        <ul className="absolute border bg-white w-full mt-1 max-h-40 overflow-y-auto z-10">
          {isLoading ? (
            <li className="p-2 text-gray-500">Loading...</li>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  onSelect(option);
                  setShowDropdown(false);
                }}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No Account Found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
