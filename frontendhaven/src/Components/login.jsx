import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8082/login",
        {
          email: email.trim(),
          password,
        }
      );

      if (response.data.success) {
        const user = response.data.user;

        // Save login information
        if (rememberMe) {
          localStorage.setItem(
            "loggedInUser",
            JSON.stringify(user)
          );
        } else {
          sessionStorage.setItem(
            "loggedInUser",
            JSON.stringify(user)
          );
        }

        // Send user information to parent component
        if (typeof onLogin === "function") {
          onLogin(user);
        }

        alert("Login successful!");

        // Go to home page
        navigate("/");
      } else {
        setError(
          response.data.message || "Invalid email or password."
        );
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Invalid email or password."
        );
      } else if (err.request) {
        setError(
          "Cannot connect to the server. Please make sure the backend is running."
        );
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>
          Login to HavenHaus
        </h1>

        <form onSubmit={handleLogin} style={styles.form}>
          <label style={styles.label}>
            Email Address
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="Enter your email"
          />

          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter your password"
          />

          <div style={styles.options}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
                style={styles.checkbox}
              />
              <span>Remember Me</span>
            </label>

            <Link
              to="/reset-password"
              style={styles.forgot}
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <p style={styles.error}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={styles.link}
          >
            Sign up
          </Link>
        </div>
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

  options: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
    color: "#66615D",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  },

  checkbox: {
    accentColor: "#6F4E37",
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },

  forgot: {
    color: "#6F4E37",
    textDecoration: "none",
    fontWeight: "600",
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
  },

  link: {
    color: "#6F4E37",
    textDecoration: "none",
    fontWeight: "700",
  },
};

export default Login;