import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../api";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Password confirmation
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    // Password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "${API_URL}/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            data.error ||
            "Signup failed. Please try again."
        );
        return;
      }

      setSuccess("Account created successfully!");

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Signup error:", err);

      setError(
        "Cannot connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>
          Create Account
        </h1>

        <form
          onSubmit={handleSignup}
          style={styles.form}
        >
          {/* Error Message */}
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={styles.success}>
              {success}
            </div>
          )}

          {/* Name */}
          <label style={styles.label}>
            Name
          </label>

          <input
            type="text"
            required
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            style={styles.input}
            placeholder="Enter your name"
            disabled={loading}
          />

          {/* Email */}
          <label style={styles.label}>
            Email Address
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={styles.input}
            placeholder="Enter your email"
            disabled={loading}
          />

          {/* Password */}
          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={styles.input}
            placeholder="Create a password"
            disabled={loading}
            minLength={6}
          />

          {/* Confirm Password */}
          <label style={styles.label}>
            Confirm Password
          </label>

          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            style={styles.input}
            placeholder="Confirm your password"
            disabled={loading}
            minLength={6}
          />

          {/* Signup Button */}
          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Sign Up"}
          </button>

          {/* Login Link */}
          <p style={styles.footer}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={styles.link}
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#F7F3EF",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
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
  },

  title: {
    marginBottom: "2rem",
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "800",
    color: "#4A2F22",
  },

  form: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    marginBottom: "0.5rem",
    fontWeight: "700",
    color: "#8B6B55",
    fontSize: "0.95rem",
    letterSpacing: "0.5px",
  },

  input: {
    padding: "12px 15px",
    marginBottom: "1.5rem",
    border: "1px solid #EDE4DC",
    borderRadius: "12px",
    fontSize: "1rem",
    outline: "none",
    backgroundColor: "#F7F3EF",
    fontFamily: '"Times New Roman", Times, serif',
    color: "#171310",
  },

  error: {
    color: "#a64b42",
    backgroundColor: "#f9ecea",
    border: "1px solid #e7c7c3",
    padding: "0.75rem",
    borderRadius: "10px",
    marginBottom: "1rem",
    fontWeight: "600",
    fontSize: "0.9rem",
    textAlign: "center",
  },

  success: {
    color: "#55745a",
    backgroundColor: "#e5efe6",
    border: "1px solid #c7d9c9",
    padding: "0.75rem",
    borderRadius: "10px",
    marginBottom: "1rem",
    fontWeight: "600",
    fontSize: "0.9rem",
    textAlign: "center",
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
    marginBottom: "1.5rem",
    fontFamily: '"Times New Roman", Times, serif',
    transition: "background 0.3s ease, transform 0.2s ease",
  },

  footer: {
    textAlign: "center",
    fontSize: "0.95rem",
    color: "#66615D",
    margin: 0,
  },

  link: {
    color: "#6F4E37",
    textDecoration: "none",
    fontWeight: "700",
  },
};

export default Signup;