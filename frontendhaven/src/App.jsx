import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Context */
import { UserProvider } from "./Components/UserDataContext";

/* Shared layout */
import Layout from "./Components/Layout";

/* Protected Route Wrapper */
import ProtectedRoute from "./Components/ProtectedRoute";

/* Auth & admin */
import Login from "./Components/login";
import Signup from "./Components/Signup";
import ResetPassword from "./Components/ResetPassword";
import AdminPanel from "./Components/AdminPanel";
import ThankYou from "./Components/ThankYou";

/* Main store pages */
import Home from "./Components/Home";
import LivingRoom from "./Components/LivingRoom";
import Bedroom from "./Components/Bedroom";
import Kitchen from "./Components/Kitchen";
import BathLaundry from "./Components/BathLaundry";
import Devotion from "./Components/Devotion";
import Gifting from "./Components/Gifting";
import Contact from "./Components/Contact";

/* Cart, Wishlist & Orders */
import Cart from "./Components/Cart";
import Wishlist from "./Components/Wishlist";
import MyOrders from "./Components/MyOrders";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>

          {/* Routes using the shared Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/living-room" element={<LivingRoom />} />
            <Route path="/bedroom" element={<Bedroom />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/bath-laundry" element={<BathLaundry />} />
            <Route path="/devotion" element={<Devotion />} />
            <Route path="/gifting" element={<Gifting />} />
            <Route path="/contact" element={<Contact />} />

            {/* PROTECTED STORE PAGES (Require Login) */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Open Routes (No Layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/thankyou" element={<ThankYou />} />

        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;