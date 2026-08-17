import React, { useState } from "react";
import axios from "axios";
import API_URL from "../api";

import contactImage from "../images/havenlogo.png";

import {
  FaFacebookF,
  FaTripadvisor,
  FaTwitter,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================================================
  // HANDLE INPUT CHANGES
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SUBMIT CONTACT FORM
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/contact`,
        form
      );

      if (response.data.success) {
        alert(
          `Thank you ${form.name}, we will get back to you shortly!`
        );

        setForm({
          name: "",
          email: "",
          message: "",
        });
      } else {
        alert(
          response.data.message ||
            "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      console.error("Contact form error:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
            "Server error. Please try again."
        );
      } else {
        alert(
          "Unable to connect to the server. Please make sure the HavenHaus backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="contact-header">
        <p className="contact-eyebrow">
          HAVENHAUS SUPPORT
        </p>

        <h1 className="contact-title">
          Contact Us
        </h1>

        <div className="contact-divider" />

        <p className="contact-description">
          Have questions about our products or need assistance?
          Our team is here to help you with everything related to
          your home appliances. Reach out anytime, and we'll make
          sure your HavenHaus experience is smooth and satisfying.
        </p>
      </section>

      {/* =====================================================
          SOCIAL ICONS
      ===================================================== */}

      <div className="social-icons">
        <a href="https://www.facebook.com/login.php/" aria-label="Facebook" className="social-link">
          <FaFacebookF />
        </a>
        <a href="https://x.com/" aria-label="Twitter" className="social-link">
          <FaTwitter />
        </a>
        <a href="https://www.instagram.com/" aria-label="Instagram" className="social-link">
          <FaInstagram />
        </a>
      </div>

      {/* =====================================================
          IMAGE / BRAND SECTION
      ===================================================== */}

      <div className="contact-image-container">
        <img
          src={contactImage}
          alt="HavenHaus Home Appliances"
          className="contact-image"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>

      {/* =====================================================
          CONTACT INFORMATION
      ===================================================== */}

      <section className="contact-info">
        <p className="section-eyebrow">
          WE'RE HERE FOR YOU
        </p>

        <h2>
          We'd Love to Assist You
        </h2>

        <p className="contact-info-description">
          Whether you have a product question, need assistance
          with an order, or simply want to know more about
          HavenHaus, our team is ready to help.
        </p>

        <div className="contact-cards">
          {/* LOCATION */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <FaMapMarkerAlt />
            </div>
            <h3>Our Location</h3>
            <p>
              HavenHaus Appliances
              <br />
              123, Industrial Area
              <br />
              Avinashi Road
              <br />
              Coimbatore – 641103
              <br />
              Tamil Nadu, India
            </p>
          </div>

          {/* PHONE */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <FaPhoneAlt />
            </div>
            <h3>Call Us</h3>
            <p>
              +91 9150030947
            </p>
          </div>

          {/* EMAIL */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <FaEnvelope />
            </div>
            <h3>Email Us</h3>
            <p>
              havenhausofficial@gmail.com
              <br />
              helpdeskhavenhaus@gmail.com
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT FORM
      ===================================================== */}

      <section className="contact-form-section">
        <p className="section-eyebrow">
          GET IN TOUCH
        </p>

        <h2 className="form-title">
          Tell Us How We Can Help
        </h2>

        <p className="form-description">
          Send us a message and our team will get back to you
          as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="contact-form">
          {/* NAME */}
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* MESSAGE */}
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="How can we help you?"
              value={form.message}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="contact-submit"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>

      {/* =====================================================
          PAGE STYLES
      ===================================================== */}

      <style>{`
        :root {
          --black: #171310;
          --dark-brown: #4A2F22;
          --brown: #6F4E37;
          --light-brown: #8B6B55;
          --cream: #F7F3EF;
          --beige: #EDE4DC;
          --white: #FFFFFF;
          --gray: #66615D;
          --shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        /* =====================================================
            MAIN CONTAINER
        ===================================================== */
        .contact-container {
          min-height: 100vh;
          padding: 4rem 20px;
          background-color: var(--white);
          color: var(--black);
          font-family: "Times New Roman", Times, serif;
          box-sizing: border-box;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* =====================================================
            HEADER
        ===================================================== */
        .contact-header {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .contact-eyebrow,
        .section-eyebrow {
          margin: 0 0 0.7rem;
          color: var(--light-brown);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .contact-title {
          margin: 0;
          color: var(--dark-brown);
          font-size: clamp(2.5rem, 6vw, 3.5rem);
          font-weight: 800;
          letter-spacing: 1px;
        }

        .contact-divider {
          width: 65px;
          height: 3px;
          margin: 1.2rem auto 1.5rem;
          background-color: var(--brown);
          border-radius: 2px;
        }

        .contact-description {
          max-width: 800px;
          margin: 0 auto;
          color: var(--gray);
          font-size: 1.15rem;
          line-height: 1.8;
        }

        /* =====================================================
            SOCIAL ICONS
        ===================================================== */
        .social-icons {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.2rem;
          margin: 2rem auto 3.5rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background-color: var(--cream);
          color: var(--dark-brown);
          border: 1px solid var(--beige);
          border-radius: 50%;
          text-decoration: none;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background-color: var(--dark-brown);
          color: var(--white);
          border-color: var(--dark-brown);
          transform: translateY(-4px);
          box-shadow: 0 8px 18px rgba(74, 47, 34, 0.2);
        }

        /* =====================================================
            IMAGE
        ===================================================== */
        .contact-image-container {
          width: auto;
          max-width: 700px;
          height: 500px;
          margin: 0 auto 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 20px;
          background-color: var(--cream);
          border: 1px solid var(--beige);
          box-shadow: var(--shadow);
        }

        .contact-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* =====================================================
            CONTACT INFORMATION
        ===================================================== */
        .contact-info {
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }

        .contact-info h2 {
          margin: 0 0 1rem;
          color: var(--dark-brown);
          font-size: 2.3rem;
          font-weight: 700;
        }

        .contact-info-description {
          max-width: 700px;
          margin: 0 auto 3rem;
          color: var(--gray);
          font-size: 1.05rem;
          line-height: 1.7;
        }

        /* =====================================================
            CONTACT CARDS
        ===================================================== */
        .contact-cards {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .contact-card {
          flex: 1 1 280px;
          max-width: 320px;
          min-height: 230px;
          padding: 2.5rem 1.5rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          background-color: var(--white);
          border: 1px solid var(--beige);
          border-radius: 20px;
          box-shadow: var(--shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .contact-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(74, 47, 34, 0.12);
        }

        .contact-card-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.2rem;
          background-color: var(--cream);
          color: var(--brown);
          border: 1px solid var(--beige);
          border-radius: 15px;
          font-size: 1.5rem;
        }

        .contact-card h3 {
          margin: 0 0 0.8rem;
          color: var(--dark-brown);
          font-size: 1.3rem;
          font-weight: 700;
        }

        .contact-card p {
          margin: 0;
          color: var(--gray);
          font-size: 1rem;
          line-height: 1.7;
        }

        /* =====================================================
            FORM SECTION
        ===================================================== */
        .contact-form-section {
          max-width: 700px;
          margin: 6rem auto 0;
          padding-top: 4rem;
          border-top: 1px solid var(--beige);
          text-align: center;
        }

        .form-title {
          margin: 0 0 1rem;
          color: var(--dark-brown);
          font-size: 2.3rem;
          font-weight: 700;
        }

        .form-description {
          margin: 0 auto 2.5rem;
          color: var(--gray);
          font-size: 1.05rem;
          line-height: 1.6;
        }

        /* =====================================================
            FORM
        ===================================================== */
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: left;
          background: var(--white);
          padding: 2.5rem;
          border: 1px solid var(--beige);
          border-radius: 20px;
          box-shadow: var(--shadow);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .form-group label {
          color: var(--light-brown);
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 1rem 1.2rem;
          background-color: var(--cream);
          color: var(--black);
          border: 1px solid var(--beige);
          border-radius: 12px;
          font-family: "Times New Roman", Times, serif;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
        }

        .contact-form input {
          height: 52px;
        }

        .contact-form textarea {
          min-height: 160px;
          resize: vertical;
        }

        .contact-form input::placeholder,
        .contact-form textarea::placeholder {
          color: #aaa39a;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          background-color: var(--white);
          border-color: var(--brown);
          box-shadow: 0 0 0 3px rgba(111, 78, 55, 0.1);
        }

        .contact-form input:disabled,
        .contact-form textarea:disabled {
          background-color: #f0ebe6;
          color: var(--gray);
          cursor: not-allowed;
        }

        /* =====================================================
            SUBMIT BUTTON
        ===================================================== */
        .contact-submit {
          width: 100%;
          padding: 1rem 1.5rem;
          margin-top: 1rem;
          background-color: var(--dark-brown);
          color: var(--white);
          border: none;
          border-radius: 25px;
          font-family: "Times New Roman", Times, serif;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-submit:hover:not(:disabled) {
          background-color: #3f3022;
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(74, 47, 34, 0.2);
        }

        .contact-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .contact-submit:disabled {
          background-color: var(--light-brown);
          cursor: not-allowed;
          opacity: 0.7;
        }

        /* =====================================================
            RESPONSIVE
        ===================================================== */
        @media (max-width: 768px) {
          .contact-container {
            padding: 3rem 15px;
          }

          .contact-title {
            font-size: 2.2rem;
          }

          .contact-description {
            font-size: 1rem;
          }

          .contact-image-container {
            height: 240px;
            margin-bottom: 3.5rem;
          }

          .contact-info h2,
          .form-title {
            font-size: 2rem;
          }

          .contact-card {
            width: 100%;
            max-width: 100%;
          }

          .contact-form-section {
            margin-top: 4rem;
            padding-top: 3rem;
          }

          .contact-form {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .contact-container {
            padding: 2.5rem 12px;
          }

          .contact-title {
            font-size: 2rem;
          }

          .contact-eyebrow,
          .section-eyebrow {
            font-size: 0.75rem;
            letter-spacing: 2px;
          }

          .social-icons {
            margin-bottom: 2.5rem;
          }

          .contact-image-container {
            height: 200px;
            border-radius: 15px;
          }

          .contact-card {
            min-height: 190px;
            padding: 1.5rem;
          }

          .form-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;