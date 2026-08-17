import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // Redirect to home page after 4 seconds
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="thankyou-container">
      <div className="thankyou-card">
        <div className="thankyou-icon-wrapper">
          <FaCheckCircle className="thankyou-icon" />
        </div>

        <h1 className="thankyou-title">Thank You for Your Order!</h1>
        
        <p className="thankyou-subtitle">
          Your order has been successfully placed with HavenHaus. We are preparing your items with utmost care and elegance.
        </p>

        <div className="thankyou-redirect-box">
          <div className="thankyou-spinner"></div>
          <span>You will be redirected to the homepage shortly...</span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="thankyou-button"
        >
          Return to Home Now
        </button>
      </div>

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
          --green: #55745a;
          --shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        * { box-sizing: border-box; }

        .thankyou-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--cream);
          padding: 2rem;
          font-family: "Times New Roman", Times, serif;
        }

        .thankyou-card {
          background-color: var(--white);
          padding: 3.5rem 2.5rem;
          border-radius: 20px;
          border: 1px solid var(--beige);
          box-shadow: 0 10px 30px rgba(74, 47, 34, 0.08);
          width: 100%;
          max-width: 500px;
          text-align: center;
        }

        .thankyou-icon-wrapper {
          margin-bottom: 1.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #E5EFE6;
          color: var(--green);
        }

        .thankyou-icon {
          font-size: 40px;
        }

        .thankyou-title {
          margin: 0 0 1rem;
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--dark-brown);
          line-height: 1.2;
        }

        .thankyou-subtitle {
          margin: 0 0 2rem;
          font-size: 1.05rem;
          color: var(--gray);
          line-height: 1.6;
        }

        .thankyou-redirect-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 2rem;
          font-size: 0.95rem;
          color: var(--light-brown);
          font-style: italic;
        }

        .thankyou-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid var(--beige);
          border-top-color: var(--brown);
          border-radius: 50%;
          animation: thankyou-spin 0.8s linear infinite;
        }

        @keyframes thankyou-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .thankyou-button {
          padding: 12px 25px;
          background-color: var(--dark-brown);
          color: var(--white);
          fontWeight: 700;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1.05rem;
          font-family: inherit;
          transition: background 0.3s ease, transform 0.2s ease;
          width: 100%;
        }

        .thankyou-button:hover {
          background-color: #3f3022;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(74, 47, 34, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ThankYou;