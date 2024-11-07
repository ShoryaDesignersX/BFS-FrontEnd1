import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OrderPage.css";
import axios from "axios";

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state || {};
  const [isLoading, setisLoading] = useState(true);
  const [cartDetials] = useState(orderDetails.products);
  const [accountDetails, setaccountDetails] = useState();
  const [poNum, setpoNum] = useState();
  const [error, seterror] = useState(true);

  const fetchAccountAdrress = async () => {
    const id = orderDetails.account;
    try {
      const url = "http://localhost:3001/accountaddress";
      const response = await axios.post(url, {
        id: id,
      });
      // console.log(response);
      setaccountDetails(response.data[0]);
      setisLoading(false);
    } catch (error) {
      console.log(`Error coming ${error}`);
    }
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }); // Example: "Nov 6, 2024"

  const handleChange = (e) => {
    setpoNum(e.target.value);
    seterror(e.target.value === ""); // This will set error to true if PO number is empty
  };

  useEffect(() => {
    fetchAccountAdrress();
  }, []);

  const handleSubmit = () => {
    if (error === true) {
      alert("Empty");
    } else {
      const AccountDetails = {
        ...accountDetails, // spread the existing accountDetails properties
        poNum: poNum, // add poNum as a new property
        Manufacturer: orderDetails.manufacturer,
      };
      const Product = {
        ...cartDetials,
        totalPrice: orderDetails.totalPrice,
      };

      const OrderPlace = {
        AccountInfo: AccountDetails,
        ProductDetails: Product,
      };
      console.log(OrderPlace);
    }
  };

  return (
    <>
      <div className="m-14 mx-20 ">
        <div className="flex justify-center">
          <img
            src="https://beautyfashionsales.my.site.com/resource/1663582945000/headerLogo"
            alt="Loading"
            className="w-3/4"
          />
        </div>
        {/* Navbar */}
        <div className="p-3 mt-5 bg-white border border-gray-300 rounded">
          <div className="grid grid-cols-12 items-center">
            {/* Left Section */}
            <div className="col-span-9 m-1">
              <h1 className="font-medium" id="OrderPageh1">
                Please review your order carefully once you hit submit order we
                can not make any modification to your order.
              </h1>
            </div>

            {/* Right Section */}
            <div className="col-span-3 flex justify-end items-center space-x-4 ">
              <div className="flex space-x-2 ">
                <button
                  onClick={handleSubmit}
                  className="bg-white text-[#2574a9] border border-gray-300 rounded px-4 py-2 text-xs hover:bg-blue-50"
                >
                  Submit Order
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="bg-white text-[#2574a9] border border-gray-300 rounded px-4 py-2 text-xs hover:bg-blue-50"
                >
                  Back
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="bg-white text-[#2574a9] border border-gray-300 rounded px-4 py-2 text-xs  hover:bg-blue-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Order From */}
        <div className="m-10">
          {isLoading ? (
            <div className="flex justify-center items-center mt-4">
              <div
                className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-4 border-gray-200 rounded-full"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <form
              className=" mx-auto p-4 border border-gray-300 rounded "
              style={{ width: "350px" }}
            >
              <h2 className="text-xm mt-0 font-bold mb-4">Order</h2>

              <div className="mb-2">
                <label
                  htmlFor="poNumber"
                  className="block text-xs font-medium text-gray-700"
                >
                  PO Number:
                </label>
                <input
                  type="text"
                  id="poNumber"
                  name="poNumber"
                  className={`mt-1 block w-full h-8 text-xs p-2 border ${
                    error ? "border-red-600 border-2" : "border-gray-300"
                  } rounded`}
                  onChange={handleChange}
                />
                {error && (
                  <p className="text-xs mt-1 text-red-600">
                    Complete this field.
                  </p>
                )}
              </div>

              <div className="mb-2">
                <label
                  htmlFor="closeDate"
                  className="block text-xs font-medium  text-gray-700"
                >
                  Close Date:
                </label>
                <input
                  type=""
                  id="closeDate"
                  name="closeDate"
                  className="mt-1 text-gray-500 block w-full h-8 text-xs p-2 border bg-[#f3f3f3] cursor-not-allowed border-gray-300 rounded"
                  value={formattedDate}
                  disabled
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="account"
                  className="block text-xs font-medium text-gray-700"
                >
                  Account:
                </label>
                <input
                  type="text"
                  id="account"
                  name="account"
                  className="mt-1 text-gray-500 block w-full h-8 text-xs p-2 border bg-[#f3f3f3] cursor-not-allowed border-gray-300 rounded"
                  disabled
                  value={accountDetails.Name}
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="shippingStreet"
                  className="block text-xs font-medium text-gray-700"
                >
                  Shipping Street:
                </label>
                <input
                  type="text"
                  id="shippingStreet"
                  name="shippingStreet"
                  className="mt-1 text-gray-500 block w-full h-8 text-xs p-2 border bg-[#f3f3f3] cursor-not-allowed border-gray-300 rounded"
                  disabled
                  value={accountDetails.ShippingStreet}
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="shippingCity"
                  className="block text-xs font-medium text-gray-700"
                >
                  Shipping City:
                </label>
                <input
                  type="text"
                  id="shippingCity"
                  name="shippingCity"
                  className="mt-1 text-gray-500 block w-full h-8 text-xs p-2 border bg-[#f3f3f3] cursor-not-allowed border-gray-300 rounded"
                  disabled
                  value={accountDetails.ShippingCity}
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="shippingState"
                  className="block text-xs font-medium text-gray-700"
                >
                  Shipping State:
                </label>
                <input
                  type="text"
                  id="shippingState"
                  name="shippingState"
                  className="mt-1 text-gray-500 block w-full h-8 text-xs p-2 border bg-[#f3f3f3] cursor-not-allowed border-gray-300 rounded"
                  disabled
                  value={accountDetails.ShippingState}
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="shippingZip"
                  className="block text-xs font-medium text-gray-700"
                >
                  Shipping Zip:
                </label>
                <input
                  type="text"
                  id="shippingZip"
                  name="shippingZip"
                  className="mt-1 text-gray-500 block w-full h-8 text-xs p-2 border bg-[#f3f3f3] cursor-not-allowed border-gray-300 rounded"
                  disabled
                  value={accountDetails.ShippingPostalCode}
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="shippingCountry"
                  className="block text-xs font-medium text-gray-700"
                >
                  Shipping Country:
                </label>
                <input
                  type="text"
                  id="shippingCountry"
                  name="shippingCountry"
                  className="mt-1 text-gray-500 block w-full h-8 text-xs p-2 border bg-[#f3f3f3] cursor-not-allowed border-gray-300 rounded"
                  disabled
                  value={accountDetails.ShippingCountry}
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="additionalInfo"
                  className="block text-xs font-medium text-gray-700"
                >
                  Additional Information:
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  className="mt-1 block w-full h-12 text-xs p-2 border  border-gray-300 rounded"
                  rows="4"
                />
              </div>
            </form>
          )}
        </div>
        {/* Cart */}
        <div className="border border-gray-300 p-5 rounded mt-20">
          <h1 className="mb-2 font-semibold" id="Cart">
            Your Cart
          </h1>
          <table className="bg-[#ffffff] border border-x-0 border-gray-300 w-full">
            <thead>
              <tr className="text-[#696969] text-xs border-b  bg-white">
                <th className="px-4 py-2 text-left ">SR No.</th>
                <th className="px-4 py-2 text-left ">Product Code</th>
                <th className="px-4 py-2 text-left ">Product UPC</th>
                <th className="px-4 py-2 text-left ">Name</th>
                <th className="px-4 py-2 text-left ">Product Image</th>
                <th className="px-4 py-2 text-left ">List Price</th>
                <th className="px-4 py-2 text-left ">Sales Price</th>
                <th className="px-4 py-2 text-left ">Quantity</th>
                <th className="px-4 py-2 text-left ">Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan="9"
                  className="bg-[#fafaf9] text-center py-1 border-b text-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  Products
                </td>
              </tr>
              {cartDetials.map((product, index) => (
                <tr key={index} className="text-xs border-b hover:bg-blue-50">
                  <td className="px-4">{index + 1}</td>
                  <td className="px-4">{product.Product2.ProductCode}</td>
                  <td className="px-4">{product.Product2.ProductUPC__c}</td>
                  <td className="px-4">{product.Product2.Name}</td>
                  <td className="px-4">
                    {product.images.length > 0 ? ( // Check if there are images
                      product.images.map((image) => (
                        <img
                          key={image.id}
                          src={image.imageUrl}
                          alt={`Image not Found`} // Use product name or any other relevant description
                          className="w-16 h-16 object-cover"
                        />
                      ))
                    ) : (
                      <div className="w-16 h-16"></div> // Display a message when no images are present
                    )}
                  </td>
                  <td className="px-4">${product.UnitPrice}</td>
                  <td className="px-4">
                    $
                    {product.UnitPrice -
                      (product.UnitPrice * (product.Margin__c / 100)).toFixed(
                        2
                      )}
                  </td>
                  <td className="px-4">{product.quantity}</td>
                  <td className="px-4">
                    <div className="flex items-center">
                      $
                      {(
                        (product.UnitPrice -
                          product.UnitPrice * (product.Margin__c / 100)) *
                        product.quantity
                      ).toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan="9"
                  className="bg-[#fafaf9] text-end text-gray-500 p-4 border-b text-sm  font-mono"
                >
                  TOTAL: $
                  {cartDetials
                    .reduce(
                      (acc, product) =>
                        acc +
                        (product.UnitPrice -
                          product.UnitPrice * (product.Margin__c / 100)) *
                          product.quantity,
                      0
                    )
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* last navbar */}
        <div className="p-3 mt-5 bg-white border border-gray-300 rounded">
          <div className="grid grid-cols-12 items-center">
            {/* Left Section */}
            <div className="col-span-9 m-1">
              <h1 className="font-medium" id="OrderPageh1">
                Please review your order carefully once you hit submit order we
                can not make any modification to your order.
              </h1>
            </div>

            {/* Right Section */}
            <div className="col-span-3 flex justify-end items-center space-x-4 ">
              <div className="flex space-x-2 ">
                <button
                  onClick={handleSubmit}
                  className="bg-white text-[#2574a9] border border-gray-300 rounded px-4 py-2 text-xs hover:bg-blue-50"
                >
                  Submit Order
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="bg-white text-[#2574a9] border border-gray-300 rounded px-4 py-2 text-xs hover:bg-blue-50"
                >
                  Back
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="bg-white text-[#2574a9] border border-gray-300 rounded px-4 py-2 text-xs  hover:bg-blue-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
