import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import ProductPage from "./Pages/ProductPage/ProductPage";
import OrderPage from "./Pages/OrderPage/OrderPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Home />}/>
          <Route path="home" element={<Home />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="orderpage" element={<OrderPage />} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
