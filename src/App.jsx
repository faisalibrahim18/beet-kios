import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import Forgot from "./Auth/FogotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProductsDetail from "./pages/Products/ProductsDetail";
import ProductKeranjang from "./pages/Products/ProductKeranjang";
import CheckOut from "./pages/Products/CheckOut";
import NewPassword from "./Auth/NewPassword";
import LogOut from "./Auth/LogOut";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/logout" element={<LogOut />} />
          <Route exact path="/forgotPassword" element={<Forgot />} />
          <Route exact path="/new_Password" element={<NewPassword />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route
            exact
            path="/products/detail/:id"
            element={<ProductsDetail />}
          />
          <Route
            exact
            path="/products/keranjang"
            element={<ProductKeranjang />}
          />
          <Route exact path="/CheckOut" element={<CheckOut />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
