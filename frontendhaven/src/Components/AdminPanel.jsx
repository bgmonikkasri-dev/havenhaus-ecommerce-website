import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import API_URL from "../api";

const colors = {
  black: "#171310",
  darkBrown: "#4A2F22",
  brown: "#6F4E37",
  lightBrown: "#8B6B55",
  cream: "#F7F3EF",
  beige: "#EDE4DC",
  white: "#FFFFFF",
  gray: "#66615D",
};

const emptyProduct = {
  name: "",
  tagline: "",
  price: "",
  category: "Home",
  stock: 0,
  rating: 4.5,
  reviews: 0,
  badge: "",
  image: "",
  description: "",
};

const AdminPanel = () => {
  // =====================================================
  // AUTHENTICATION STATE
  // =====================================================
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem("havenhaus_admin_auth") === "true";
  });
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // =====================================================
  // MAIN APP STATE
  // =====================================================
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [activeSection, setActiveSection] = useState("dashboard");

  const [showProductModal, setShowProductModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingContact, setEditingContact] = useState(null);

  const [productForm, setProductForm] = useState({
    ...emptyProduct,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // =====================================================
  // ADMIN LOGIN HANDLER
  // =====================================================
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    // Secure Admin credentials for HavenHaus
    if (adminUsername.trim() === "admin" && adminPassword === "admin123") {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem("havenhaus_admin_auth", "true");
    } else {
      setLoginError("Invalid admin username or password.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem("havenhaus_admin_auth");
    setAdminUsername("");
    setAdminPassword("");
  };

  // =====================================================
  // FETCH DATA
  // =====================================================
  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchData();
    }
  }, [isAdminAuthenticated]);

  const fetchData = async () => {
    setError("");

    try {
      const results = await Promise.allSettled([
        axios.get(`${API_URL}/admin/users`),
        axios.get(`${API_URL}/admin/contacts`),
        axios.get(`${API_URL}/admin/products`),
        axios.get(`${API_URL}/admin/orders`),
      ]);

      // USERS
      if (results[0].status === "fulfilled") {
        const data = results[0].value.data;
        if (Array.isArray(data)) setUsers(data);
        else if (Array.isArray(data?.users)) setUsers(data.users);
        else setUsers([]);
      } else {
        setUsers([]);
      }

      // CONTACTS
      if (results[1].status === "fulfilled") {
        const data = results[1].value.data;
        if (Array.isArray(data)) setContacts(data);
        else if (Array.isArray(data?.contacts)) setContacts(data.contacts);
        else setContacts([]);
      } else {
        setContacts([]);
      }

      // PRODUCTS
      if (results[2].status === "fulfilled") {
        const data = results[2].value.data;
        if (Array.isArray(data)) setProducts(data);
        else if (Array.isArray(data?.products)) setProducts(data.products);
        else setProducts([]);
      } else {
        setProducts([]);
      }

      // ORDERS
      if (results[3].status === "fulfilled") {
        const data = results[3].value.data;
        if (Array.isArray(data)) setOrders(data);
        else if (Array.isArray(data?.orders)) setOrders(data.orders);
        else setOrders([]);
      } else {
        setOrders([]);
      }

      const failedRequests = results.filter((r) => r.status === "rejected");
      if (failedRequests.length === results.length) {
        setError(
          "Unable to connect to the HavenHaus server. Make sure the backend is running on port 8082."
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load admin data.");
    }
  };

  // =====================================================
  // STATISTICS
  // =====================================================
  const totalCustomers = users.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;

  const totalRevenue = useMemo(() => {
    return orders.reduce((total, order) => {
      const amount =
        Number(order?.totalAmount) ||
        Number(order?.total) ||
        Number(order?.amount) ||
        0;
      return total + amount;
    }, 0);
  }, [orders]);

  // =====================================================
  // FILTERS
  // =====================================================
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const text = [
      product?.name,
      product?.category,
      product?.tagline,
      product?.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return text.includes(normalizedSearch);
  });

  const filteredUsers = users.filter((user) => {
    const text = [user?.name, user?.email]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return text.includes(normalizedSearch);
  });

  const filteredOrders = orders.filter((order) => {
    const text = [
      order?._id,
      order?.id,
      order?.email,
      order?.name,
      order?.customerName,
      order?.status,
      order?.paymentMethod,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return text.includes(normalizedSearch);
  });

  const filteredContacts = contacts.filter((contact) => {
    const text = [contact?.name, contact?.email, contact?.message]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return text.includes(normalizedSearch);
  });

  // =====================================================
  // HELPERS (Robust Customer Name & Email Mapping)
  // =====================================================
  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getId = (item) => item?._id || item?.id || "";
  const getOrderId = (order) => order?._id || order?.id || "unknown";

  const getOrderAmount = (order) => {
    return (
      Number(order?.totalAmount) ||
      Number(order?.total) ||
      Number(order?.amount) ||
      0
    );
  };

  const formatPaymentMethod = (method) => {
    switch (String(method || "").toLowerCase()) {
      case "upi": return "UPI";
      case "cod": return "COD";
      case "card": return "CARD";
      case "debit":
      case "debit card": return "DEBIT CARD";
      case "credit":
      case "credit card": return "CREDIT CARD";
      default: return method || "COD";
    }
  };

  // Fixed mapping for customer name across various schema types
  const getCustomerName = (order) => {
    return (
      order?.customerName ||
      order?.name ||
      order?.customer?.name ||
      order?.shippingDetails?.name ||
      "Valued Customer"
    );
  };

  // Fixed mapping for customer email across various schema types
  const getCustomerEmail = (order) => {
    return (
      order?.email ||
      order?.customerEmail ||
      order?.customer?.email ||
      order?.shippingDetails?.email ||
      "Not Provided"
    );
  };

  const getStatusClass = (status) => {
    const normalized = String(status || "Pending").trim().toLowerCase();
    const statusMap = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return statusMap[normalized] || "Pending";
  };

  // =====================================================
  // USER ACTIONS
  // =====================================================
  const openUserEdit = (user) => {
    setEditingUser({ ...user });
    setShowUserModal(true);
  };

  const saveUser = async () => {
    if (!editingUser?.name?.trim() || !editingUser?.email?.trim()) {
      alert("Name and Email are required.");
      return;
    }

    try {
      setLoading(true);
      const id = editingUser._id || editingUser.id;
      if (!id) {
        alert("User ID is missing.");
        return;
      }

      await axios.put(`${API_URL}/admin/users/${id}`, {
        name: editingUser.name.trim(),
        email: editingUser.email.trim(),
      });

      setShowUserModal(false);
      setEditingUser(null);
      await fetchData();
      alert("User updated successfully.");
    } catch (err) {
      console.error("Update user error:", err);
      alert(err.response?.data?.message || "Unable to update user.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (user) => {
    const id = user?._id || user?.id;
    if (!id) return;
    if (!window.confirm(`Delete user "${user?.name || "this user"}"?`)) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/admin/users/${id}`);
      await fetchData();
      alert("User deleted successfully.");
    } catch (err) {
      console.error("Delete user error:", err);
      alert(err.response?.data?.message || "Unable to delete user.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CONTACT ACTIONS
  // =====================================================
  const openContactEdit = (contact) => {
    setEditingContact({ ...contact });
    setShowContactModal(true);
  };

  const saveContact = async () => {
    if (
      !editingContact?.name?.trim() ||
      !editingContact?.email?.trim() ||
      !editingContact?.message?.trim()
    ) {
      alert("Name, Email and Message are required.");
      return;
    }

    try {
      setLoading(true);
      const id = editingContact._id || editingContact.id;
      if (!id) return;

      await axios.put(`${API_URL}/admin/contacts/${id}`, {
        name: editingContact.name.trim(),
        email: editingContact.email.trim(),
        message: editingContact.message.trim(),
      });

      setShowContactModal(false);
      setEditingContact(null);
      await fetchData();
      alert("Contact message updated successfully.");
    } catch (err) {
      console.error("Update contact error:", err);
      alert(err.response?.data?.message || "Unable to update contact.");
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (contact) => {
    const id = contact?._id || contact?.id;
    if (!id) return;
    if (!window.confirm("Delete this contact message?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/admin/contacts/${id}`);
      await fetchData();
      alert("Contact message deleted successfully.");
    } catch (err) {
      console.error("Delete contact error:", err);
      alert(err.response?.data?.message || "Unable to delete contact.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PRODUCT ACTIONS
  // =====================================================
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ ...emptyProduct });
    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product?.name || "",
      tagline: product?.tagline || "",
      price: product?.price ?? "",
      category: product?.category || "Home",
      stock: product?.stock ?? 0,
      rating: product?.rating ?? 4.5,
      reviews: product?.reviews ?? 0,
      badge: product?.badge || "",
      image: product?.image || "",
      description: product?.description || "",
    });
    setShowProductModal(true);
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProduct = async () => {
    const safeName = (productForm.name || "").trim();
    const safeTagline = (productForm.tagline || "").trim();
    const safeBadge = (productForm.badge || "").trim();
    const safeImage = (productForm.image || "").trim();
    const safeDescription = (productForm.description || "").trim();

    if (!safeName) {
      alert("Product name is required.");
      return;
    }

    if (productForm.price === "" || Number(productForm.price) < 0) {
      alert("Enter a valid product price.");
      return;
    }

    if (Number(productForm.stock) < 0) {
      alert("Stock cannot be negative.");
      return;
    }

    if (Number(productForm.rating) < 0 || Number(productForm.rating) > 5) {
      alert("Rating must be between 0 and 5.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...productForm,
        name: safeName,
        tagline: safeTagline,
        badge: safeBadge,
        image: safeImage,
        description: safeDescription,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        rating: Number(productForm.rating),
        reviews: Number(productForm.reviews),
      };

      if (editingProduct) {
        const id = editingProduct._id || editingProduct.id;
        if (!id) {
          alert("Product ID is missing.");
          return;
        }

        await axios.put(`${API_URL}/admin/products/${id}`, payload);
        alert("Product updated successfully.");
      } else {
        await axios.post(`${API_URL}/admin/products`, payload);
        alert("Product added successfully.");
      }

      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ ...emptyProduct });
      await fetchData();
    } catch (err) {
      console.error("Product error:", err);
      alert(err.response?.data?.message || "Unable to save product.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (product) => {
    const id = product?._id || product?.id;
    if (!id) return;
    if (!window.confirm(`Delete "${product?.name || "this product"}"?`)) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/admin/products/${id}`);
      await fetchData();
      alert("Product deleted successfully.");
    } catch (err) {
      console.error("Delete product error:", err);
      alert(err.response?.data?.message || "Unable to delete product.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ORDER ACTIONS
  // =====================================================
  const updateOrderStatus = async (order, status) => {
    const id = getOrderId(order);
    if (!id || id === "unknown") return;

    try {
      setLoading(true);
      await axios.put(`${API_URL}/admin/orders/${id}`, { status });
      await fetchData();
      alert(`Order status changed to ${status}.`);
    } catch (err) {
      console.error("Order update error:", err);
      alert(err.response?.data?.message || "Unable to update order status.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SIDEBAR NAV CONFIG
  // =====================================================
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "products", label: "Products", icon: "▣" },
    { id: "orders", label: "Orders", icon: "🛒" },
    { id: "customers", label: "Customers", icon: "♙" },
    { id: "contacts", label: "Messages", icon: "✉" },
  ];

  const pageTitles = {
    dashboard: "Dashboard",
    products: "Product Management",
    orders: "Order Management",
    customers: "Customer Management",
    contacts: "Customer Messages",
  };

  // =====================================================
  // CONDITIONAL RENDER: ADMIN LOGIN GATEWAY
  // =====================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-logo">H</div>
          <h2>HavenHaus Admin</h2>
          <p>Please enter your secure credentials to manage the store.</p>

          <form onSubmit={handleAdminLogin} className="admin-login-form">
            {loginError && <div className="error-box"><span>!</span> {loginError}</div>}
            
            <div className="form-group">
              <label>Admin Username</label>
              <input
                type="text"
                required
                placeholder="Enter username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Admin Password</label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="primary-btn full-width">
              Sign In to Admin Portal
            </button>
          </form>
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
            --red: #a64b42;
          }
          * { box-sizing: border-box; }
          .admin-login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--cream);
            font-family: "Times New Roman", Times, serif;
            padding: 20px;
          }
          .admin-login-card {
            background: var(--white);
            border: 1px solid var(--beige);
            border-radius: 20px;
            padding: 40px;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 10px 30px rgba(74, 47, 34, 0.08);
            text-align: center;
          }
          .admin-login-logo {
            width: 60px;
            height: 60px;
            margin: 0 auto 15px;
            border: 1px solid rgba(74, 47, 34, 0.4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            background: var(--cream);
            color: var(--dark-brown);
          }
          .admin-login-card h2 {
            margin: 0 0 8px;
            color: var(--dark-brown);
            font-size: 24px;
            font-weight: 800;
          }
          .admin-login-card p {
            margin: 0 0 25px;
            color: var(--gray);
            font-size: 13px;
          }
          .admin-login-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
            text-align: left;
          }
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .form-group label {
            font-size: 11px;
            font-weight: 700;
            color: var(--light-brown);
            letter-spacing: 0.8px;
          }
          .form-group input {
            padding: 12px 15px;
            border: 1px solid var(--beige);
            border-radius: 12px;
            background: var(--cream);
            font-family: inherit;
            font-size: 14px;
            outline: none;
          }
          .form-group input:focus {
            border-color: var(--brown);
            background: var(--white);
          }
          .primary-btn {
            background: var(--dark-brown);
            color: var(--white);
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 700;
            font-family: inherit;
            transition: all 0.3s ease;
          }
          .primary-btn.full-width {
            width: 100%;
            margin-top: 10px;
          }
          .primary-btn:hover {
            background: #3f3022;
          }
          .error-box {
            background: #f7e5e3;
            color: var(--red);
            border: 1px solid #e7c7c3;
            padding: 10px;
            border-radius: 8px;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .error-box span {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--red);
            color: var(--white);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 10px;
          }
        `}</style>
      </div>
    );
  }

  // =====================================================
  // RENDER: SECURE ADMIN PORTAL
  // =====================================================
  return (
    <div className="admin-layout">
      {/* =================================================
          SIDEBAR
      ================================================= */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="logo-mark">H</div>
          <div className="logo-text">
            <h2>HavenHaus</h2>
            <span>ADMIN PORTAL</span>
          </div>
        </div>

        <div className="sidebar-label">MANAGEMENT</div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveSection(item.id);
                setSearchTerm("");
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {activeSection === item.id && <span className="active-line" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button type="button" className="refresh-btn" onClick={fetchData} disabled={loading}>
            <span>↻</span>
            <span>Refresh Data</span>
          </button>
          <button type="button" className="logout-btn" onClick={handleAdminLogout}>
            <span>🚪</span>
            <span>Admin Logout</span>
          </button>
          <div className="admin-footer">
            <span className="online-dot" /> Secure Session Active
          </div>
        </div>
      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}
      <main className="admin-main">
        {/* HEADER */}
        <header className="admin-header">
          <div className="header-content">
            <div className="breadcrumb">
              HAVENHAUS <span>/</span> ADMIN
            </div>
            <h1>{pageTitles[activeSection]}</h1>
            <p>Manage your HavenHaus home appliance store with total control.</p>
          </div>

          {activeSection !== "dashboard" && (
            <div className="search-wrapper">
              <span>⌕</span>
              <input
                className="search-input"
                type="text"
                placeholder={`Search ${activeSection}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </header>

        {error && (
          <div className="error-box">
            <span>!</span> {error}
          </div>
        )}

        {/* =================================================
            DASHBOARD
        ================================================= */}
        {activeSection === "dashboard" && (
          <section>
            <div className="welcome-banner">
              <div>
                <span className="eyebrow">HAVENHAUS OVERVIEW</span>
                <h2>Welcome back, Administrator.</h2>
                <p>Here's what's happening across your store today.</p>
              </div>
              <div className="banner-symbol">H</div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">♙</div>
                <div className="stat-content">
                  <span>TOTAL CUSTOMERS</span>
                  <strong>{totalCustomers}</strong>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">▣</div>
                <div className="stat-content">
                  <span>TOTAL PRODUCTS</span>
                  <strong>{totalProducts}</strong>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-content">
                  <span>TOTAL ORDERS</span>
                  <strong>{totalOrders}</strong>
                </div>
              </div>
              <div className="stat-card revenue">
                <div className="stat-icon">₹</div>
                <div className="stat-content">
                  <span>TOTAL REVENUE</span>
                  <strong>₹{formatCurrency(totalRevenue)}</strong>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              {/* RECENT ORDERS */}
              <div className="dashboard-card">
                <div className="card-heading">
                  <div>
                    <span className="card-eyebrow">SALES</span>
                    <h2>Recent Orders</h2>
                  </div>
                  <button type="button" className="view-all-btn" onClick={() => setActiveSection("orders")}>
                    View All →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🛒</div>
                    <h3>No orders yet</h3>
                    <p>Customer orders will appear here.</p>
                  </div>
                ) : (
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>ORDER</th>
                          <th>CUSTOMER</th>
                          <th>TOTAL</th>
                          <th>PAYMENT</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order, index) => {
                          const id = getOrderId(order);
                          const amount = getOrderAmount(order);
                          const status = order?.status || "Pending";
                          return (
                            <tr key={id || `recent-order-${index}`}>
                              <td>
                                <strong className="order-id">#{String(id).slice(-8)}</strong>
                              </td>
                              <td>{getCustomerName(order)}</td>
                              <td className="amount">₹{amount.toLocaleString("en-IN")}</td>
                              <td>
                                <span className="payment-badge">{formatPaymentMethod(order?.paymentMethod)}</span>
                              </td>
                              <td>
                                <span className={`status ${getStatusClass(status)}`}>{status}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* STORE OVERVIEW */}
              <div className="dashboard-card overview-card">
                <div className="card-heading">
                  <div>
                    <span className="card-eyebrow">STORE</span>
                    <h2>Overview</h2>
                  </div>
                </div>
                <div className="overview-list">
                  <div className="overview-row">
                    <span>Products in Store</span>
                    <strong>{totalProducts}</strong>
                  </div>
                  <div className="overview-row">
                    <span>Registered Customers</span>
                    <strong>{totalCustomers}</strong>
                  </div>
                  <div className="overview-row">
                    <span>Orders Received</span>
                    <strong>{totalOrders}</strong>
                  </div>
                  <div className="overview-row">
                    <span>Contact Messages</span>
                    <strong>{contacts.length}</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            PRODUCTS
        ================================================= */}
        {activeSection === "products" && (
          <section className="content-section">
            <div className="section-toolbar">
              <div>
                <span className="section-eyebrow">INVENTORY</span>
                <h2>Products</h2>
                <p>Add, edit, delete and manage your HavenHaus inventory.</p>
              </div>
              <button type="button" className="primary-btn" onClick={openAddProduct}>
                <span>+</span> Add Product
              </button>
            </div>

            <div className="table-card">
              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">▣</div>
                  <h3>No products found</h3>
                  <p>Add your first HavenHaus product.</p>
                  <button type="button" className="primary-btn empty-btn" onClick={openAddProduct}>
                    + Add Product
                  </button>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>PRODUCT</th>
                        <th>CATEGORY</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>RATING</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product, index) => {
                        const id = getId(product) || `product-${index}`;
                        return (
                          <tr key={id}>
                            <td>
                              <div className="product-cell">
                                <div className="product-img-wrapper">
                                  {product?.badge && <span className="product-table-badge">{product.badge}</span>}
                                  {product?.image ? (
                                    <img
                                      src={product.image}
                                      alt={product?.name || "Product"}
                                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                  ) : (
                                    <div className="product-placeholder">▣</div>
                                  )}
                                </div>
                                <div className="product-info-col">
                                  <strong>{product?.name || "Unnamed Product"}</strong>
                                  <small className="tagline-text">{product?.tagline || ""}</small>
                                  <small className="desc-text">{product?.description || ""}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="category-badge">{product?.category || "Uncategorized"}</span>
                            </td>
                            <td className="amount">₹{Number(product?.price || 0).toLocaleString("en-IN")}</td>
                            <td>
                              <span className={Number(product?.stock || 0) <= 5 ? "stock low" : "stock"}>
                                {product?.stock ?? 0}
                              </span>
                            </td>
                            <td>
                              <span className="rating">★ {product?.rating ?? 0}</span>
                            </td>
                            <td>
                              <div className="action-buttons-wrapper">
                                <button
                                  type="button"
                                  className="small-btn edit"
                                  onClick={() => openEditProduct(product)}
                                  title="Edit product"
                                >
                                  ✎
                                </button>
                                <button
                                  type="button"
                                  className="small-btn delete"
                                  onClick={() => deleteProduct(product)}
                                  title="Delete product"
                                >
                                  ×
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =================================================
            ORDERS (Fixed Customer Name & Email Display)
        ================================================= */}
        {activeSection === "orders" && (
          <section className="content-section">
            <div className="section-toolbar">
              <div>
                <span className="section-eyebrow">SALES</span>
                <h2>Orders</h2>
                <p>Track and update customer orders.</p>
              </div>
            </div>

            <div className="table-card">
              {filteredOrders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🛒</div>
                  <h3>No orders found</h3>
                  <p>Orders will appear here when customers place orders.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>ORDER ID</th>
                        <th>CUSTOMER</th>
                        <th>EMAIL</th>
                        <th>AMOUNT</th>
                        <th>PAYMENT</th>
                        <th>STATUS</th>
                        <th>UPDATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, index) => {
                        const id = getOrderId(order);
                        const amount = getOrderAmount(order);
                        const status = order?.status || "Pending";
                        return (
                          <tr key={id || `order-${index}`}>
                            <td><strong className="order-id">#{String(id).slice(-8)}</strong></td>
                            <td><strong>{getCustomerName(order)}</strong></td>
                            <td className="email-cell">{getCustomerEmail(order)}</td>
                            <td className="amount">₹{amount.toLocaleString("en-IN")}</td>
                            <td><span className="payment-badge">{formatPaymentMethod(order?.paymentMethod)}</span></td>
                            <td><span className={`status ${getStatusClass(status)}`}>{status}</span></td>
                            <td>
                              <select
                                value={status}
                                onChange={(e) => updateOrderStatus(order, e.target.value)}
                                className="status-select"
                                disabled={loading}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =================================================
            CUSTOMERS
        ================================================= */}
        {activeSection === "customers" && (
          <section className="content-section">
            <div className="section-toolbar">
              <div>
                <span className="section-eyebrow">ACCOUNTS</span>
                <h2>Customers</h2>
                <p>Manage registered HavenHaus customers.</p>
              </div>
            </div>

            <div className="table-card">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan="4" className="table-empty">No customers found.</td></tr>
                    ) : (
                      filteredUsers.map((user, index) => {
                        const id = getId(user) || `user-${index}`;
                        return (
                          <tr key={id}>
                            <td><span className="id-badge">{String(id).slice(-8)}</span></td>
                            <td><strong>{user?.name || "-"}</strong></td>
                            <td className="email-cell">{user?.email || "-"}</td>
                            <td>
                              <div className="action-buttons-wrapper">
                                <button type="button" className="small-btn edit" onClick={() => openUserEdit(user)}>✎</button>
                                <button type="button" className="small-btn delete" onClick={() => deleteUser(user)}>×</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            CONTACTS
        ================================================= */}
        {activeSection === "contacts" && (
          <section className="content-section">
            <div className="section-toolbar">
              <div>
                <span className="section-eyebrow">SUPPORT</span>
                <h2>Customer Messages</h2>
                <p>View and manage contact enquiries.</p>
              </div>
            </div>

            <div className="table-card">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>MESSAGE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.length === 0 ? (
                      <tr><td colSpan="5" className="table-empty">No contact messages found.</td></tr>
                    ) : (
                      filteredContacts.map((contact, index) => {
                        const id = getId(contact) || `contact-${index}`;
                        return (
                          <tr key={id}>
                            <td><span className="id-badge">{String(id).slice(-8)}</span></td>
                            <td><strong>{contact?.name || "-"}</strong></td>
                            <td className="email-cell">{contact?.email || "-"}</td>
                            <td className="message-cell">{contact?.message || "-"}</td>
                            <td>
                              <div className="action-buttons-wrapper">
                                <button type="button" className="small-btn edit" onClick={() => openContactEdit(contact)}>✎</button>
                                <button type="button" className="small-btn delete" onClick={() => deleteContact(contact)}>×</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* =================================================
          PRODUCT MODAL
      ================================================= */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => { if (!loading) setShowProductModal(false); }}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">PRODUCT</span>
                <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
              </div>
              <button type="button" className="close-btn" onClick={() => setShowProductModal(false)} disabled={loading}>×</button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Product Name *</label>
                <input name="name" value={productForm.name} onChange={handleProductChange} placeholder="Product name" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={productForm.category} onChange={handleProductChange}>
                  <option value="Home">Home</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bath & Laundry">Bath & Laundry</option>
                  <option value="Devotion">Devotion</option>
                  <option value="Gifting">Gifting</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input type="number" min="0" name="price" value={productForm.price} onChange={handleProductChange} placeholder="1499" />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="number" min="0" name="stock" value={productForm.stock} onChange={handleProductChange} />
              </div>
              <div className="form-group">
                <label>Rating (0-5)</label>
                <input type="number" min="0" max="5" step="0.1" name="rating" value={productForm.rating} onChange={handleProductChange} />
              </div>
              <div className="form-group">
                <label>Reviews Count</label>
                <input type="number" min="0" name="reviews" value={productForm.reviews} onChange={handleProductChange} />
              </div>
              <div className="form-group full">
                <label>Tagline</label>
                <input name="tagline" value={productForm.tagline} onChange={handleProductChange} placeholder="Short product tagline" />
              </div>
              <div className="form-group full">
                <label>Badge</label>
                <input name="badge" value={productForm.badge} onChange={handleProductChange} placeholder="e.g. Best Seller" />
              </div>
              <div className="form-group full">
                <label>Image URL</label>
                <input name="image" value={productForm.image} onChange={handleProductChange} placeholder="https://..." />
              </div>
              <div className="form-group full">
                <label>Description</label>
                <textarea name="description" value={productForm.description} onChange={handleProductChange} rows="4" placeholder="Product description" />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="secondary-btn" onClick={() => setShowProductModal(false)} disabled={loading}>Cancel</button>
              <button type="button" className="primary-btn" onClick={saveProduct} disabled={loading}>
                {loading ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          USER MODAL
      ================================================= */}
      {showUserModal && editingUser && (
        <div className="modal-overlay" onClick={() => { if (!loading) setShowUserModal(false); }}>
          <div className="admin-modal small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">CUSTOMER</span>
                <h2>Edit Customer</h2>
              </div>
              <button type="button" className="close-btn" onClick={() => setShowUserModal(false)} disabled={loading}>×</button>
            </div>
            <div className="form-group">
              <label>Name</label>
              <input value={editingUser.name || ""} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={editingUser.email || ""} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary-btn" onClick={() => setShowUserModal(false)} disabled={loading}>Cancel</button>
              <button type="button" className="primary-btn" onClick={saveUser} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          CONTACT MODAL
      ================================================= */}
      {showContactModal && editingContact && (
        <div className="modal-overlay" onClick={() => { if (!loading) setShowContactModal(false); }}>
          <div className="admin-modal small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">SUPPORT</span>
                <h2>Edit Message</h2>
              </div>
              <button type="button" className="close-btn" onClick={() => setShowContactModal(false)} disabled={loading}>×</button>
            </div>
            <div className="form-group">
              <label>Name</label>
              <input value={editingContact.name || ""} onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={editingContact.email || ""} onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows="5" value={editingContact.message || ""} onChange={(e) => setEditingContact({ ...editingContact, message: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary-btn" onClick={() => setShowContactModal(false)} disabled={loading}>Cancel</button>
              <button type="button" className="primary-btn" onClick={saveContact} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          LOADING OVERLAY
      ================================================= */}
      {loading && (
        <div className="loading-overlay">
          <div className="loader" />
          <span>Processing...</span>
        </div>
      )}

      {/* =================================================
          STYLES (Synchronized with HavenHaus Premium CSS)
      ================================================= */}
      <style>{`
        * { box-sizing: border-box; }
        
        :root {
          --black: ${colors.black};
          --dark-brown: ${colors.darkBrown};
          --brown: ${colors.brown};
          --light-brown: ${colors.lightBrown};
          --cream: ${colors.cream};
          --beige: ${colors.beige};
          --white: ${colors.white};
          --gray: ${colors.gray};
          --green: #55745a;
          --red: #a64b42;
          --shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        body { margin: 0; background: var(--cream); }
        button, input, select, textarea { font-family: "Times New Roman", Times, serif; }

        .admin-layout {
          min-height: 100vh;
          display: flex;
          background: var(--cream);
          color: var(--black);
          font-family: "Times New Roman", Times, serif;
        }

        /* SIDEBAR */
        .admin-sidebar {
          width: 255px;
          min-height: 100vh;
          background: var(--black);
          color: var(--white);
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          z-index: 100;
        }
        .admin-logo {
          padding: 28px 22px;
          display: flex;
          align-items: center;
          gap: 13px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }
        .logo-mark {
          width: 46px;
          height: 46px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          background: rgba(255, 255, 255, 0.08);
        }
        .logo-text h2 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.3px; }
        .logo-text span { display: block; margin-top: 4px; font-size: 9px; letter-spacing: 2px; opacity: 0.65; }
        .sidebar-label { padding: 27px 22px 10px; font-size: 9px; letter-spacing: 2px; font-weight: 700; color: rgba(255, 255, 255, 0.45); }
        .admin-nav { padding: 5px 12px; display: flex; flex-direction: column; gap: 4px; }
        .nav-item {
          width: 100%; border: none; background: transparent; color: rgba(255, 255, 255, 0.68);
          padding: 13px 15px; border-radius: 8px; text-align: left; font-size: 14px;
          cursor: pointer; display: flex; align-items: center; gap: 13px; position: relative; transition: all 0.25s ease;
        }
        .nav-item:hover, .nav-item.active { background: rgba(255, 255, 255, 0.13); color: var(--white); }
        .nav-icon { width: 22px; text-align: center; font-size: 17px; opacity: 0.9; }
        .nav-label { flex: 1; }
        .active-line { position: absolute; right: 0; top: 8px; bottom: 8px; width: 3px; background: var(--light-brown); border-radius: 3px 0 0 3px; }
        .sidebar-bottom { margin-top: auto; padding: 18px 15px 20px; display: flex; flex-direction: column; gap: 8px; }
        .refresh-btn, .logout-btn {
          width: 100%; padding: 10px 13px; border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05); color: var(--white); border-radius: 8px;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; transition: 0.2s ease;
        }
        .refresh-btn:hover, .logout-btn:hover { background: rgba(255, 255, 255, 0.12); }
        .admin-footer { display: flex; justify-content: center; align-items: center; gap: 7px; color: rgba(255, 255, 255, 0.45); font-size: 10px; margin-top: 8px; }
        .online-dot { width: 6px; height: 6px; background: #89a98d; border-radius: 50%; }

        /* MAIN CONTENT */
        .admin-main { margin-left: 255px; width: calc(100% - 255px); min-height: 100vh; padding: 35px 40px; }
        .admin-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 25px; margin-bottom: 30px; }
        .breadcrumb { display: flex; gap: 8px; font-size: 9px; letter-spacing: 2px; color: var(--light-brown); font-weight: 700; margin-bottom: 9px; }
        .breadcrumb span { opacity: 0.4; }
        .admin-header h1 { margin: 0 0 6px; font-size: 30px; font-weight: 800; color: var(--dark-brown); }
        .admin-header p { margin: 0; color: var(--gray); font-size: 13px; }
        .search-wrapper { width: 280px; height: 43px; display: flex; align-items: center; gap: 8px; background: var(--white); border: 1px solid var(--beige); border-radius: 20px; padding: 0 15px; }
        .search-wrapper > span { font-size: 20px; color: var(--gray); }
        .search-input { width: 100%; border: none; outline: none; background: transparent; font-size: 13px; color: var(--black); }

        /* DASHBOARD ELEMENTS */
        .welcome-banner { background: linear-gradient(110deg, var(--beige), var(--cream)); border: 1px solid var(--beige); border-radius: 20px; padding: 25px 30px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; }
        .eyebrow, .section-eyebrow, .card-eyebrow, .modal-eyebrow { font-size: 9px; letter-spacing: 2px; font-weight: 700; color: var(--light-brown); }
        .welcome-banner h2 { margin: 6px 0 5px; font-size: 24px; font-weight: 700; color: var(--dark-brown); }
        .welcome-banner p { margin: 0; font-size: 13px; color: var(--gray); }
        .banner-symbol { width: 75px; height: 75px; border: 1px solid rgba(74, 47, 34, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 34px; color: var(--brown); background: rgba(255, 255, 255, 0.25); }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 22px; }
        .stat-card { background: var(--white); border: 1px solid var(--beige); border-radius: 20px; padding: 20px; display: flex; align-items: center; gap: 15px; box-shadow: var(--shadow); }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: var(--cream); color: var(--brown); font-size: 20px; border: 1px solid var(--beige); flex-shrink: 0; }
        .stat-content span { display: block; font-size: 9px; letter-spacing: 1.2px; color: var(--gray); margin-bottom: 6px; font-weight: 700; }
        .stat-content strong { font-size: 23px; font-weight: 700; color: var(--dark-brown); }

        .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 18px; }
        .dashboard-card, .table-card { background: var(--white); border: 1px solid var(--beige); border-radius: 20px; box-shadow: var(--shadow); padding: 23px; }
        .card-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .card-heading h2 { margin: 5px 0 0; font-size: 20px; font-weight: 700; color: var(--dark-brown); }
        .view-all-btn { border: none; background: transparent; color: var(--light-brown); font-size: 12px; font-weight: 700; cursor: pointer; }
        .overview-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid var(--beige); font-size: 13px; }
        .overview-row:last-child { border-bottom: none; }
        .overview-row span { color: var(--gray); }
        .overview-row strong { color: var(--dark-brown); font-size: 15px; }

        /* BUTTONS */
        .primary-btn { background: var(--dark-brown); color: var(--white); border: none; padding: 11px 20px; border-radius: 25px; cursor: pointer; font-size: 13px; font-weight: 700; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 7px; }
        .primary-btn:hover { background: #3f3022; transform: translateY(-1px); }
        .primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .secondary-btn { background: var(--cream); color: var(--dark-brown); border: 1px solid var(--beige); padding: 11px 20px; border-radius: 25px; cursor: pointer; font-size: 13px; font-weight: 700; }
        .secondary-btn:hover { background: var(--beige); }

        /* TABLES */
        .table-wrapper { width: 100%; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { background: var(--cream); color: var(--gray); font-size: 9px; letter-spacing: 1.2px; font-weight: 700; text-align: left; padding: 14px 12px; border-bottom: 1px solid var(--beige); }
        td { padding: 14px 12px; border-bottom: 1px solid var(--beige); font-size: 13px; color: var(--gray); vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tbody tr:hover { background: #fdfbf9; }

        /* PRODUCT CELLS */
        .product-cell { display: flex; align-items: center; gap: 15px; min-width: 250px; }
        .product-img-wrapper { position: relative; width: 60px; height: 60px; flex-shrink: 0; }
        .product-img-wrapper img, .product-placeholder { width: 100%; height: 100%; border-radius: 10px; object-fit: cover; border: 1px solid var(--beige); }
        .product-placeholder { background: var(--cream); display: flex; align-items: center; justify-content: center; font-size: 19px; color: var(--light-brown); }
        .product-table-badge { position: absolute; top: -5px; left: -5px; background: #65350f; color: #fff; padding: 3px 6px; border-radius: 8px; font-size: 8px; font-weight: 700; z-index: 2; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
        
        .product-info-col { display: flex; flex-direction: column; gap: 3px; max-width: 250px; }
        .product-info-col strong { color: var(--dark-brown); font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tagline-text { color: var(--brown); font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 11px; }
        .desc-text { color: var(--gray); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 11px; opacity: 0.8; }

        .amount { font-weight: 700; color: var(--dark-brown); }
        .category-badge { display: inline-block; padding: 5px 10px; border-radius: 12px; background: var(--cream); border: 1px solid var(--beige); color: var(--light-brown); font-size: 10px; font-weight: 700; }
        .id-badge { font-size: 11px; color: var(--gray); background: var(--cream); padding: 5px 8px; border-radius: 8px; font-weight: bold; }
        .order-id { color: var(--brown); font-size: 12px; }
        .rating { color: var(--brown); font-weight: 700; }
        .stock { font-weight: 700; color: var(--green); }
        .stock.low { color: var(--red); }

        .action-buttons-wrapper { display: flex; gap: 5px; }
        .small-btn { border: 1px solid transparent; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; font-size: 16px; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
        .small-btn.edit { background: var(--beige); color: var(--brown); }
        .small-btn.delete { background: #f9ecea; color: var(--red); }
        .small-btn:hover { transform: translateY(-2px); border-color: var(--light-brown); }

        /* STATUS BADGES */
        .status { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; white-space: nowrap; }
        .status.Pending { background: var(--beige); color: var(--brown); }
        .status.Processing { background: #e7edf3; color: #526d83; }
        .status.Shipped { background: #eee8f5; color: #705487; }
        .status.Delivered { background: #e5efe6; color: #4e7355; }
        .status.Cancelled { background: #f7e5e3; color: var(--red); }
        .status-select { padding: 6px 10px; border: 1px solid var(--beige); border-radius: 15px; background: var(--white); color: var(--black); cursor: pointer; outline: none; font-size: 11px; }

        /* EMPTY STATES */
        .empty-state { text-align: center; padding: 50px 20px; color: var(--gray); }
        .empty-icon { width: 58px; height: 58px; margin: 0 auto 14px; border-radius: 50%; background: var(--cream); border: 1px solid var(--beige); display: flex; align-items: center; justify-content: center; font-size: 23px; color: var(--light-brown); }
        .empty-state h3 { color: var(--dark-brown); font-size: 18px; font-weight: 700; margin: 0 0 6px; }

        /* MODALS */
        .modal-overlay { position: fixed; inset: 0; background: rgba(23, 19, 16, 0.68); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; padding: 20px; z-index: 1000; }
        .admin-modal { background: var(--white); width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; border-radius: 20px; padding: 30px; box-shadow: 0 20px 60px rgba(23, 19, 16, 0.25); border: 1px solid var(--beige); }
        .admin-modal.small { max-width: 460px; }
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .modal-header h2 { margin: 5px 0 0; font-size: 24px; font-weight: 700; color: var(--dark-brown); }
        .close-btn { background: var(--cream); border: 1px solid var(--beige); width: 36px; height: 36px; border-radius: 50%; font-size: 22px; cursor: pointer; color: var(--brown); display: flex; align-items: center; justify-content: center; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group.full { grid-column: 1 / -1; }
        .form-group label { font-size: 11px; letter-spacing: 0.8px; font-weight: 700; color: var(--light-brown); }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px 15px; border: 1px solid var(--beige); border-radius: 12px; background: #fafafa; color: var(--black); font-family: "Times New Roman", Times, serif; font-size: 14px; outline: none; transition: 0.3s ease; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--brown); background: #fff; box-shadow: 0 0 0 3px rgba(111, 78, 55, 0.1); }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--beige); }

        .loading-overlay { position: fixed; inset: 0; background: rgba(247, 243, 239, 0.82); backdrop-filter: blur(3px); z-index: 3000; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--dark-brown); font-size: 13px; font-weight: 600; }
        .loader { width: 40px; height: 40px; border: 3px solid var(--beige); border-top-color: var(--brown); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminPanel;