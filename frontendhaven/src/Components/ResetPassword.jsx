import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8082/reset-password",
        {
          email,
          newPassword,
        }
      );

      if (response.data.success) {
        alert("Password reset successful!");
        navigate("/login");
      } else {
        alert("Reset failed: " + response.data.message);
      }
    } catch (err) {
      console.error("Reset password error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleReset} style={styles.formCard}>
        <h2 style={styles.title}>Reset Password</h2>

        {/* Email */}
        <label htmlFor="email" style={styles.label}>
          Email Address
        </label>

        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={styles.input}
        />

        {/* New Password */}
        <label htmlFor="newPassword" style={styles.label}>
          New Password
        </label>

        <input
          id="newPassword"
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          style={styles.input}
        />

        {/* Confirm Password */}
        <label htmlFor="confirmPassword" style={styles.label}>
          Confirm Password
        </label>

        <input
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          style={styles.input}
        />

        {/* Reset Button */}
        <button type="submit" style={styles.button}>
          Reset Password
        </button>

        {/* Back to Login */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          style={styles.backButton}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F3EF",
    padding: "2rem",
    boxSizing: "border-box",
    fontFamily: '"Times New Roman", Times, serif',
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    padding: "3rem",
    borderRadius: "20px",
    border: "1px solid #EDE4DC",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
    width: "100%",
    maxWidth: "420px",
    boxSizing: "border-box",
  },

  title: {
    marginBottom: "2rem",
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "800",
    color: "#4A2F22",
  },

  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "700",
    color: "#8B6B55",
    fontSize: "0.95rem",
    letterSpacing: "0.5px",
  },

  input: {
    display: "block",
    padding: "12px 15px",
    marginBottom: "1.5rem",
    border: "1px solid #EDE4DC",
    borderRadius: "12px",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    backgroundColor: "#F7F3EF",
    fontFamily: '"Times New Roman", Times, serif',
    color: "#171310",
  },

  button: {
    padding: "12px",
    backgroundColor: "#4A2F22",
    color: "white",
    fontWeight: "700",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "1.05rem",
    width: "100%",
    fontFamily: '"Times New Roman", Times, serif',
    transition: "background 0.3s ease, transform 0.2s ease",
    marginBottom: "1rem",
  },

  backButton: {
    padding: "12px",
    backgroundColor: "transparent",
    color: "#6F4E37",
    fontWeight: "700",
    border: "1px solid #6F4E37",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "1.05rem",
    width: "100%",
    fontFamily: '"Times New Roman", Times, serif',
    transition: "background 0.3s ease",
  },
};

export default ResetPassword;