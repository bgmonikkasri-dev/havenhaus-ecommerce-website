import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";



/* Context */

import { UserProvider } from "./components/UserDataContext";



/* Shared layout */

import Layout from "./components/Layout";



/* Protected Route Wrapper */

import ProtectedRoute from "./components/ProtectedRoute";



/* Auth & admin */

import Login from "./components/Login";

import Signup from "./components/Signup";

import ResetPassword from "./components/ResetPassword";

import AdminPanel from "./components/AdminPanel";

import ThankYou from "./components/ThankYou";



/* Main store pages */

import Home from "./components/Home";

import LivingRoom from "./components/LivingRoom";

import Bedroom from "./components/Bedroom";

import Kitchen from "./components/Kitchen";

import BathLaundry from "./components/BathLaundry";

import Devotion from "./components/Devotion";

import Gifting from "./components/Gifting";

import Contact from "./components/Contact";



/* Cart, Wishlist & Orders */

import Cart from "./components/Cart";

import Wishlist from "./components/Wishlist";

import MyOrders from "./components/MyOrders";



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