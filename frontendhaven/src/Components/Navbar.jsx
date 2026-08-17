import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSignInAlt,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useUserData } from "./UserDataContext";

import "./Navbar.css";
import logo from "../images/havenlogo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart, wishlist } = useUserData();

  const [greeting, setGreeting] = useState("");
  const [moodSuggestion, setMoodSuggestion] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // =========================================================
  // TIME-BASED GREETING & AUTH SESSION CHECK
  // =========================================================

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning ☀️");
      setMoodSuggestion("Start your day with smart kitchen essentials.");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon 🌤️");
      setMoodSuggestion("Stay comfortable with breezy living spaces.");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good Evening 🌆");
      setMoodSuggestion("Unwind with comfort designed for your home.");
    } else {
      setGreeting("Good Night 🌙");
      setMoodSuggestion("Prepare for tomorrow with effortless home care.");
    }

    const checkUser = () => {
      const savedUser =
        sessionStorage.getItem("loggedInUser") ||
        localStorage.getItem("loggedInUser");
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    checkUser();

    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInUser");
    setCurrentUser(null);
    navigate("/login");
  };

  const cartItemCount = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );
  const wishlistItemCount = wishlist.length;

  return (
    <nav className="navbar">
      {/* =====================================================
          LOGO & BRANDING
      ===================================================== */}

      <div className="logo-container">
        <Link to="/" aria-label="HavenHaus Home">
          <img
            src={logo}
            alt="HavenHaus Logo"
            className="logo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </Link>

        <div className="brand-text">
          <strong className="brand-name">HAVENHAUS</strong>
          <p className="brand-tagline">
            Equip Your Home, Elevate Your Life
          </p>
        </div>
      </div>

      {/* =====================================================
          CENTER NAVIGATION
      ===================================================== */}

      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/living-room">Living Room</Link>
          </li>
          <li>
            <Link to="/bedroom">Bedroom</Link>
          </li>
          <li>
            <Link to="/kitchen">Kitchen</Link>
          </li>
          <li>
            <Link to="/bath-laundry">Bath & Laundry</Link>
          </li>
          <li>
            <Link to="/devotion">Devotion</Link>
          </li>
          <li>
            <Link to="/gifting">Gifting</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>

      {/* =====================================================
          RIGHT SIDE — CART / WISHLIST / AUTH / GREETING
      ===================================================== */}

      <div className="navbar-right">
        {/* Cart */}
        <Link
          to="/cart"
          title="Cart"
          className="icon-link"
          aria-label="Shopping Cart"
        >
          <div className="icon-badge-wrapper">
            <FaShoppingCart size={21} className="nav-icon" />
            {cartItemCount > 0 && (
              <span className="nav-badge">{cartItemCount}</span>
            )}
          </div>
        </Link>

        {/* Wishlist */}
        <Link
          to="/wishlist"
          title="Wishlist"
          className="icon-link"
          aria-label="Wishlist"
        >
          <div className="icon-badge-wrapper">
            <FaHeart size={21} className="nav-icon" />
            {wishlistItemCount > 0 && (
              <span className="nav-badge">{wishlistItemCount}</span>
            )}
          </div>
        </Link>

        {/* Dynamic User Authentication State */}
        {currentUser ? (
          <div className="user-session-menu">
            <span className="logged-in-user">
              <FaUser size={14} /> {currentUser.name ? currentUser.name.split(" ")[0] : "Account"}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="logout-btn-nav"
              aria-label="Logout"
            >
              <FaSignOutAlt size={21} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            title="Login"
            className="icon-link"
            aria-label="Login"
          >
            <FaSignInAlt size={23} className="nav-icon" />
          </Link>
        )}

        {/* Greeting */}
        <div className="navbar-greeting">
          <strong>{greeting}</strong>
          <p>{moodSuggestion}</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;