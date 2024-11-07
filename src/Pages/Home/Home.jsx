import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Home = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [disabled, setdisabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [disabledManu, setdisabledManu] = useState(true);
  const [disabledOption, setdisabledOption] = useState(true);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [orderType, setorderType] = useState("");
  const [finalBtn, setfinalBtn] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [screenLoading, setScreenLoading] = useState(false);
  const [MinimumOrder, setMinimumOrder] = useState()

  // fetching all
  const [accountsName, setaccountsName] = useState([]);
  const [singleAccountName, setsingleAccountName] = useState();

  const [MmanufacturerNames, setMmanufacturerNames] = useState();
    // console.log("namess", MmanufacturerNames);

  const [accountId, setaccountId] = useState()
  // console.log(accountId)

  const options = ["Wholesale Number", "Pre Orders"];

  const filteredOptions = accountsName.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (value) => {
    setScreenLoading(true)
    setTimeout(() => {
      setScreenLoading(false)

    }, 1000);
    setSelectedValue(value);
    setShowDropdown(false);
    setSearchQuery(""); // Clear the search query when an option is selected
    setdisabled(true);
    setsingleAccountName(value);
    // console.log(value); // Account name
    setdisabledManu(false);
  };

  const clearInput = () => {
    setSelectedValue("");
    setSearchQuery("");
    setShowDropdown(false);
    setdisabled(false);
    setdisabledManu(true);
    setdisabledOption(true);
    setSelectedManufacturer("");
    setfinalBtn(true);
    setorderType("");
  };

  const handleChange = (event) => {
    setSelectedManufacturer(event.target.value);
    setdisabledOption(false);
  };
  const handleChange2 = (event) => {
    setorderType(event.target.value);
    setfinalBtn(false);
  };

  // fetching

  const fetchAccounts = async () => {
    try {
      const url = "http://localhost:3001/getaccounts";
      const response = await axios.get(url);
      //   console.log(response);
      setaccountsName(response.data.records.map((item) => item.Name));
      setisLoading(false);
    } catch (error) {
      console.log(`Error coming ${error}`);
    }
  };

  const fetchAccountByName = async () => {
    const name = singleAccountName; // Assuming singleAccountName is defined in your component's state
    try {
      const url = "http://localhost:3001/getaccountsbyname";
      const response = await axios.post(url, { name: name });
  
      console.log("Response:", response);
  
      if (response.data.accounts && response.data.accounts.length > 0) {
        const account = response.data.accounts[0]; 
  
        console.log("Account Details:", account);
  
        const manufacturerNames = account.Account_Manufacturers__r.records.map(
          (item) => item.ManufacturerName__c
        );
        
        setMinimumOrder(response.data.manufacturers)
        setMmanufacturerNames(manufacturerNames);
        setaccountId(account.Id);
      } else {
        console.log("No records found for the specified account name.");
        setMmanufacturerNames([]); 
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };
  

  useEffect(() => {
    fetchAccounts();
    fetchAccountByName();
  }, [singleAccountName]);

  const allDetails = (e) => {
    setScreenLoading(true);

    e.preventDefault();
    const selectedDetails = {
      manufacturer: selectedManufacturer,
      orderType: orderType,
      accountId:accountId,
      accountManufactureMinimum:MinimumOrder
    };
    // console.log(selectedDetails);
    setTimeout(() => {
      setScreenLoading(false);

      navigate("/products", { state: selectedDetails,accountId });
    }, 2000);
  };

  return (
    <>
      <div className="flex justify-center mt-10">
        <img
          src="https://beautyfashionsales.my.site.com/resource/1663582945000/headerLogo"
          alt="Loading"
          className="w-2/3"
        />
      </div>
      <div className="mt-10  flex justify-center">
        <div className="" style={{ width: "25%" }}>
          <form action="">
            {/* Account */}
            <label
              htmlFor="account"
              className="block mb-2 text-sm text-[#696969]"
            >
              <span className="text-red-500">*</span> Account
            </label>
            <div className="relative mb-2">
              <input
                autoComplete="off"
                type="text"
                id="account"
                placeholder="Search Account"
                className={`border border-gray-300 rounded p-2 pl-10 w-full ${
                  disabled ? "cursor-not-allowed bg-gray-100" : "cursor-text "
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
                <ul className="absolute border bg-white w-full mt-1 max-h-60 overflow-y-auto z-10">
                  {isLoading ? (
                    <li className="p-2 text-gray-500">Loading...</li>
                  ) : filteredOptions.length > 0 ? (
                    filteredOptions.slice(0, 20).map((option, index) => (
                      <li
                        key={index}
                        className="p-2 cursor-pointer  hover:bg-gray-200"
                        onClick={() => handleSelect(option)}
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

            {/* Manufacturer */}
            <label
              htmlFor="manufacturer"
              className="block mb-2 text-sm text-[#696969]"
            >
              <span className="text-red-500">*</span> Manufacturer
            </label>
            <div className="relative mb-2">
              <select
                id="manufacturer"
                value={selectedManufacturer}
                onChange={handleChange}
                className={`border border-gray-300 rounded p-2 pl-4 w-full  ${
                  disabledManu
                    ? "cursor-not-allowed bg-gray-200"
                    : "cursor-pointer  "
                }`}
                disabled={disabledManu}
              >
                <option value="" disabled>
                  Select Manufacturer
                </option>
                {MmanufacturerNames && MmanufacturerNames.length > 0 ? (
                  MmanufacturerNames.flatMap((item) => item.split(";")) // Split each item by ';' to get individual names
                    .filter((manufacturer) => manufacturer.trim() !== "") // Filter out empty values
                    .map((manufacturer, index) => (
                      <option key={index} value={manufacturer}>
                        {manufacturer}
                      </option>
                    ))
                ) : (
                  <option disabled>Loading...</option>
                )}
              </select>
            </div>

            {/* Order Type */}
            <label
              htmlFor="orderType"
              className="block mb-2 text-sm text-[#696969]"
            >
              <span className="text-red-500">*</span> Order Type
            </label>
            <div className="relative mb-2">
              <select
                type="text"
                value={orderType}
                onChange={handleChange2}
                className={`border border-gray-300 rounded p-2 pl-4 w-full ${
                  disabledOption
                    ? "cursor-not-allowed bg-gray-200"
                    : "cursor-pointer"
                }`}
                disabled={disabledOption}
              >
                <option value="" disabled>
                  Select Order Type
                </option>
                {options.map((orderType, index) => (
                  <option key={index} value={orderType}>
                    {orderType}
                  </option>
                ))}
              </select>
            </div>

            {/* Button */}
            <div className="mt-5 flex justify-center">
              <button
                type="submit"
                disabled={finalBtn}
                className={` text-blue-600 border border-blue-600 px-4 py-2 rounded text-sm ${
                  finalBtn
                    ? "cursor-not-allowed bg-gray-200"
                    : "cursor-pointer bg-white hover:bg-blue-50"
                }`}
                onClick={allDetails}
              >
                Show Products
              </button>
            </div>
          </form>
        </div>
      </div>
      {screenLoading && (
        <div className="loading-overlay">
          <h1 className="loading-text flex items-center">
            <AiOutlineLoading3Quarters className="animate-spin mr-2" />
            Loading...
          </h1>
        </div>
      )}
    </>
  );
};

export default Home;
