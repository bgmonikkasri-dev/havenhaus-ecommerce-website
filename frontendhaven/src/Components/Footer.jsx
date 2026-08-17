
import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";

import "./Footer.css";
import logo from "../images/havenlogo.png";

const Footer = () => {
  return (
    <footer className="footer">

      {/* =====================================================
          FOOTER MAIN CONTENT
      ===================================================== */}

      <div className="footer-container">

        {/* ================= BRAND ================= */}

        <div className="footer-brand">

          <Link to="/" className="footer-logo-link">
            <img
              src={logo}
              alt="HavenHaus Logo"
              className="footer-logo"
            />
          </Link>

          <h2>HAVENHAUS</h2>

          <p>
            Equip Your Home, Elevate Your Life.
          </p>

          <p className="footer-description">
            Modern appliances thoughtfully designed to bring comfort,
            convenience, and effortless living into every home.
          </p>

        </div>


        {/* ================= QUICK LINKS ================= */}

        <div className="footer-links">

          <h2>Quick Links</h2>

          <ul>

            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/living-room">
                Living Room
              </Link>
            </li>

            <li>
              <Link to="/bedroom">
                Bedroom
              </Link>
            </li>

            <li>
              <Link to="/kitchen">
                Kitchen
              </Link>
            </li>

            <li>
              <Link to="/bath-laundry">
                Bath & Laundry
              </Link>
            </li>

            <li>
              <Link to="/devotion">
                Devotion
              </Link>
            </li>

            <li>
              <Link to="/gifting">
                Gifting
              </Link>
            </li>

            <li>
              <Link to="/contact">
                Contact
              </Link>
            </li>

          </ul>

        </div>


        {/* ================= CONTACT ================= */}

        <div className="footer-contact">

          <h2>Contact Us</h2>

          <p>
            Email: havenhausofficial@gmail.com
          </p>

          <p>
            Phone: +91 9150030947
          </p>

          <div className="footer-icons">

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>

            <a
              href="mailto:havenhausofficial@gmail.com"
              aria-label="Email HavenHaus"
            >
              <FaEnvelope />
            </a>

          </div>

        </div>

      </div>


      {/* =====================================================
          FOOTER BOTTOM
      ===================================================== */}

      <div className="footer-bottom">

        <p>
          &copy; {new Date().getFullYear()} HavenHaus.
          All rights reserved.
        </p>

      </div>

    </footer>
  );
};

export default Footer;
