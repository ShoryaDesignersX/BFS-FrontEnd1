import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { IoIosWarning } from "react-icons/io";
import { IoIosInformationCircle } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useLocation, useNavigate } from "react-router-dom";
import { handleError } from "../../utils/Toastify/Toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ProductPage = () => {
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDetails = location.state || {};
  const [allProducts, setallProducts] = useState([]);
  const [marignAccount, setmarignAccount] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  // Total ammount
  const [MinOrderAmmount, setMinOrderAmmount] = useState();
  const [RemaninAmmount, setRemaninAmmount] = useState();
  const [TotalAmount, setTotalAmount] = useState();
  // Minimum Order
  const [ManufacturerMinOrderAmmount, setManufacturerMinOrderAmmount] =
    useState();

  const fetchProducts = async () => {
    try {
      const url = "http://localhost:3001/getproducts";
      const response = await axios.post(url, selectedDetails);
      // console.log(response);
      setallProducts(response.data);
      setmarignAccount(response.data[0].Margin__c);
      // console.log(response.data)
      setisLoading(true);
    } catch (error) {
      console.log(`Error coming ${error}`);
    }
  };

  const fetchMinimumOrder = async () => {
    const minOrder = selectedDetails.accountManufactureMinimum;
    setManufacturerMinOrderAmmount(minOrder);
  };

  const MinOrderAmount = () => {
    if (ManufacturerMinOrderAmmount) {
      const manufacturer = ManufacturerMinOrderAmmount.map((e) => {
        if (e.Name === selectedDetails.manufacturer) {
          setMinOrderAmmount(e.Minimum_Order_Amount__c);
          setRemaninAmmount(e.Minimum_Order_Amount__c);
        } else {
          console.log("false");
        }
      });
      console.log("final", manufacturer);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMinimumOrder();
    MinOrderAmount();
  }, [ManufacturerMinOrderAmmount]);

  const groupProductsByCategory = (products) => {
    return products.reduce((acc, product) => {
      const category = product.Product2.Category__c;
      const unitPrice = product.UnitPrice;

      // Only add product if UnitPrice is greater than 0
      if (unitPrice > 0) {
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
      }

      return acc;
    }, {});
  };

  const handleSearch = (e) => {
    console.log(e.target.value);
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
  };

  const groupedProducts = groupProductsByCategory(allProducts);
  // console.log("Grouped",groupedProducts);

  const filteredItems = Object.keys(groupedProducts).reduce((acc, category) => {
    const products = groupedProducts[category];
    const matchedProducts = products.filter(
      (product) =>
        product.Product2.Name.toLowerCase().includes(
          searchItem.toLowerCase()
        ) || product.Product2.ProductCode.includes(searchItem)
    );

    if (matchedProducts.length > 0) {
      acc[category] = matchedProducts; // Add matched products to the accumulator
    }

    return acc;
  }, {});
  // console.log("filtered items",filteredItems)

  const sortedFilteredItems = Object.keys(filteredItems)
    .sort() // Sort categories alphabetically
    .reduce((acc, category) => {
      acc[category] = filteredItems[category]; // Rebuild the object with sorted categories
      return acc;
    }, {});

  const [quantity, setquantity] = useState(0);

  const handleQuantityChange = (productCode, newQuantity) => {
    const product = allProducts.find(
      (prod) => prod.Product2.ProductCode === productCode
    );
    // console.log("product", product);

    if (product) {
      const minQuantity = product.Product2.Min_Order_QTY__c;

      const adjustedQuantity = minQuantity
        ? Math.max(0, Math.floor(newQuantity / minQuantity) * minQuantity)
        : Math.max(0, newQuantity);

      setquantity((prevQuantities) => {
        const updatedQuantities = {
          ...prevQuantities,
          [productCode]: adjustedQuantity,
        };

        // Calculate the total amount using updated quantities
        const totalAmount = Object.keys(updatedQuantities).reduce(
          (acc, code) => {
            const qty = updatedQuantities[code]; // for quantity
            const currentProduct = allProducts.find(
              (prod) => prod.Product2.ProductCode === code
            );

            if (currentProduct) {
              const salesPrice =
                currentProduct.UnitPrice -
                currentProduct.UnitPrice * (currentProduct.Margin__c / 100);
              return acc + (qty > 0 ? qty * salesPrice : 0);
            }
            return acc;
          },
          0
        );

        setTotalAmount(totalAmount);
        setRemaninAmmount(MinOrderAmmount - totalAmount);
        return updatedQuantities; // Return the updated quantities
      });
    }
  };

  const handleDetailsClick = () => {
    const productsWithQuantity = Object.entries(quantity).filter(
      ([, qty]) => qty >= 1
    );

    const selectedProducts = productsWithQuantity.map(([productCode, qty]) => {
      const product = allProducts.find(
        (product) => product.Product2.ProductCode === productCode
      );
      return {
        ...product,
        quantity: qty,
      };
    });

    if (RemaninAmmount <= 0) {
      const details = {
        account: selectedDetails.accountId, // Assuming `account` is in selectedDetails
        manufacturer: selectedDetails.manufacturer,
        products: selectedProducts,
        totalPrice:TotalAmount
      };
      console.log("final details", details);
      setTimeout(() => {
        navigate('/orderpage',{ state: details })
      }, 1000);
    } else {
      handleError(" Please Complete its Minimum Order Amount")
    }

    // console.log("final details", details); // For testing, you could replace this with any display logic or a modal
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Users table",
    sheet: "Users",
  });

  return (
    <>
      <div className="m-14 mx-20 ">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src="https://beautyfashionsales.my.site.com/resource/1663582945000/headerLogo"
            alt="Loading"
            className="w-3/4"
          />
        </div>
        <div className="sticky top-0 bg-[#fff] z-10">
          {/* Navbar */}
          <div className="p-3 mt-5 bg-white border border-gray-300 rounded">
            <div className="grid grid-cols-12 items-center">
              {/* Left Section */}
              <div className="col-span-5 m-1">
                <h1 className="font-bold">{selectedDetails.manufacturer}</h1>
              </div>

              {/* Right Section */}
              <div className="col-span-7 flex justify-between items-center space-x-4 ">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={handleSearch}
                  className="border border-gray-300 rounded p-1 w-2/4  placeholder:text-sm placeholder:text-gray-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate("/home")}
                    className="bg-white text-[#2574a9] border border-gray-300 rounded px-4 py-2 text-xs hover:bg-blue-100"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleDetailsClick}
                    className="bg-white text-[#2574a9] border border-gray-300 rounded px-4 py-2 text-xs  hover:bg-blue-100"
                  >
                    Next
                  </button>
                  <button
                    onClick={onDownload}
                    className="bg-[#2574a9] text-white rounded px-4 py-1 text-xs hover:bg-[#275878]"
                  >
                    Download Order Form
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Warning Sign */}
          {RemaninAmmount > 0 && (
            <div className="bg-orange-400 p-3 mt-4 flex items-center">
              <IoIosWarning className="text-[#514f4d] mr-2" size={30} />
              <div>
                <p className=" text-[#333334] text-sm">
                  Warning! Minimum Order Amount ${MinOrderAmmount}
                </p>
                <p className="text-[#333334] text-sm">
                  It remains to order: ${RemaninAmmount}
                </p>
              </div>
            </div>
          )}
          {/* Discount div */}
          <div className="flex items-center bg-[#747474] mt-4 text-white p-2 ">
            <IoIosInformationCircle size={28} className="mr-2" />
            <p className="text-sm">
              For this manufacturer, you have a {marignAccount}% discount on the
              price!
            </p>
          </div>
        </div>
        {/* Table Products Info */}
        <div>
          <table
            ref={tableRef}
            className="bg-[#ffffff] border border-x-0 border-gray-300 w-full"
          >
            <thead>
              <tr
                className={`text-[#696969] text-xs bg-white border-b sticky ${
                  RemaninAmmount > 0 ? "top-44" : "top-25"
                }`}
              >
                <th className="px-4 py-2 text-left pt-8">SR No.</th>
                <th className="px-4 py-2 text-left pt-8">Product Code</th>
                <th className="px-4 py-2 text-left pt-8">Product UPC</th>
                <th className="px-4 py-2 text-left pt-8">Name</th>
                <th className="px-4 py-2 text-left pt-8">Product Image</th>
                <th className="px-4 py-2 text-left pt-8">List Price</th>
                <th className="px-4 py-2 text-left pt-8">Sales Price</th>
                <th className="px-4 py-2 text-left pt-8">Min QTY</th>
                <th className="px-4 py-2 text-left pt-8">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Object.entries(sortedFilteredItems).map(
                  ([category, products]) => (
                    <React.Fragment key={category}>
                      {/* Display Category Row */}
                      <tr>
                        <td
                          colSpan="9"
                          className="bg-[#fafaf9] text-center py-2 border-b text-lg hover:bg-blue-50 transition-colors duration-200"
                        >
                          {category}
                        </td>
                      </tr>
                      {/* Display Product Details for each product in the category */}
                      {products.map((product, index) => (
                        <tr
                          className="text-xs border-b hover:bg-blue-50"
                          key={product.Product2.ProductCode}
                        >
                          <td className="px-4">{index + 1}</td>
                          <td className="px-4">
                            {product.Product2.ProductCode}
                          </td>
                          <td className="px-4">
                            {product.Product2.ProductUPC__c}
                          </td>
                          <td className="px-4">{product.Product2.Name}</td>
                          {/* Image */}
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
                          {/* Product Sales Price */}
                          <td className="px-4">
                            $
                            {product.UnitPrice -
                              (
                                product.UnitPrice *
                                (product.Margin__c / 100)
                              ).toFixed(2)}
                          </td>
                          {/* Min Qty */}
                          <td className="px-4">
                            {product.Product2.Min_Order_QTY__c}
                          </td>
                          {/* Quantity */}
                          <td className="px-4">
                            <div className="flex items-center">
                              <div className="flex items-center">
                                <button
                                  className="w-8 h-8 flex items-center justify-center hover:text-[#0f4f7a] border-2 rounded"
                                  onClick={() =>
                                    handleQuantityChange(
                                      product.Product2.ProductCode,
                                      (quantity[product.Product2.ProductCode] ||
                                        0) - 1
                                    )
                                  }
                                >
                                  <FiMinus size={18} />
                                </button>

                                <input
                                  type=""
                                  value={
                                    quantity[product.Product2.ProductCode] || 0
                                  }
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      product.Product2.ProductCode,
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-14 h-8 text-center bg-white border rounded"
                                />

                                <button
                                  className="w-8 h-8 flex items-center justify-center hover:text-[#0f4f7a] border-2 rounded"
                                  onClick={() => {
                                    const currentQuantity =
                                      quantity[product.Product2.ProductCode] ||
                                      0;
                                    const minQuantity =
                                      product.Product2.Min_Order_QTY__c;

                                    // Increment by Min_Order_QTY__c if it's defined and greater than 0, otherwise increment by 1
                                    const incrementValue =
                                      minQuantity && minQuantity > 0
                                        ? minQuantity
                                        : 1;

                                    handleQuantityChange(
                                      product.Product2.ProductCode,
                                      currentQuantity + incrementValue
                                    );
                                  }}
                                >
                                  <GoPlus size={20} />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  )
                )
              ) : (
                // Loading
                <tr>
                  <td colSpan="9" className="py-5">
                    <div className="flex justify-center items-center">
                      <h1 className="text-gray-500 text-xl animate-pulse">
                        Fetching...
                      </h1>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Final Button and Total Amount */}
        <div className="flex justify-between items-center mt-4 p-4 border-t border-gray-300">
          <div className="text-lg font-bold">
            Total Amount:{" "}
            <span className="text-green-600">${TotalAmount || 0}</span>
          </div>
          <button
            onClick={handleDetailsClick}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Proceed
          </button>
        </div>
      </div>
      <ToastContainer/>
    </>
  );
};

export default ProductPage;
