import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useUserData } from "./UserDataContext";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// =====================================================
// API URL
// =====================================================
import API_URL from "../api";
Modal.setAppElement("#root");

const Cart = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    updateQuantity,
  } = useUserData();

  const navigate = useNavigate();

  // Modal & Payment State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Coupon State
  const [coupon, setCoupon] = useState("");
  const [discountRate, setDiscountRate] = useState(0);

  // Customer Details State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // =====================================================
  // PRICE CONVERTER
  // =====================================================
  const priceNumber = (price) => {
    if (typeof price === "number") return price;
    return Number(String(price || "").replace(/[₹,\s]/g, "")) || 0;
  };

  // =====================================================
  // CALCULATIONS
  // =====================================================
  const subtotal = cart.reduce((sum, product) => {
    const quantity = Number(product.quantity) || 1;
    return sum + priceNumber(product.price) * quantity;
  }, 0);

  const discount = subtotal * discountRate;
  const taxable = subtotal - discount;
  const gst = Number((taxable * 0.05).toFixed(2));
  
  // Free shipping for orders ₹1000+
  const shipping = taxable > 0 && taxable < 1000 ? 99 : 0;
  
  const grand = Number((taxable + gst + shipping).toFixed(2));

  // =====================================================
  // HANDLERS
  // =====================================================
  const increment = (id, currentQty) => updateQuantity(id, currentQty + 1);
  const decrement = (id, currentQty) => currentQty > 1 && updateQuantity(id, currentQty - 1);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (code === "HAVEN25") {
      setDiscountRate(0.25);
      toast.success("🎉 HAVEN25 applied – 25% OFF!", { position: "bottom-right" });
    } else {
      setDiscountRate(0);
      toast.error("❌ Invalid coupon code", { position: "bottom-right" });
    }
  };

  const clear = () => {
    if (!window.confirm("Clear the entire cart?")) return;
    clearCart();
    setCoupon("");
    setDiscountRate(0);
    toast.info("🛒 Cart cleared", { position: "bottom-right" });
  };

  // =====================================================
  // CREATE ORDER
  // =====================================================
  const createOrder = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("⚠️ Please fill in Name, Phone, and Address.");
      setLoading(false);
      return;
    }

    if (!cart.length) {
      toast.error("🛒 Cart is empty");
      setLoading(false);
      return;
    }

    const orderData = {
      customerName: name,
      email: email,
      phone: phone,
      address: address,
      items: cart.map((item) => ({
        productId: item.id || item._id,
        name: item.name,
        price: priceNumber(item.price),
        quantity: Number(item.quantity) || 1,
        image: item.image || "",
      })),
      subtotal,
      discount,
      gst,
      shipping,
      totalAmount: grand,
      paymentMethod,
      status: "Pending",
    };

    try {
      const response = await axios.post(`${API_URL}/admin/orders`, orderData);
      
      console.log("✅ Order created:", response.data);

      toast.success(
        paymentMethod === "cod"
          ? "🛍️ Order placed successfully!"
          : "✅ Payment successful and order placed!"
      );

      clearCart();
      setIsModalOpen(false);
      setCoupon("");
      setDiscountRate(0);
      setPaymentMethod("card");

      setTimeout(() => {
        navigate("/thankyou");
      }, 800);
    } catch (error) {
      console.error("❌ Order creation error:", error);
      toast.error(
        error.response?.data?.message || "❌ Unable to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAYMENT FLOW
  // =====================================================
  const pay = () => {
    if (!cart.length) {
      toast.error("🛒 Cart is empty");
      return;
    }

    setLoading(true);

    if (paymentMethod === "cod") {
      createOrder();
      return;
    }

    toast.info(`Processing ${paymentMethod.toUpperCase()} payment...`);

    // Simulated Gateway Delay
    setTimeout(() => {
      createOrder();
    }, 1200);
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="cart-container">
      <ToastContainer />

      <h1 className="cart-heading">Your Cart 🛒</h1>

      {!cart.length ? (
        <div className="empty-container">
          <div className="empty-icon">📦</div>
          <h2>Your cart is empty.</h2>
          <p>Add some beautiful HavenHaus pieces to get started!</p>
          <button className="primary-btn continue-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          
          {/* ==================== LEFT: CART ITEMS ==================== */}
          <div className="cart-items">
            {cart.map((item) => {
              const itemId = item.id || item._id;
              const quantity = Number(item.quantity) || 1;
              const itemTotal = priceNumber(item.price) * quantity;

              return (
                <div key={itemId} className="cart-card">
                  <div className="cart-image-wrapper">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="image-placeholder">📦</div>
                    )}
                  </div>

                  <div className="cart-info">
                    <h4>{item.name}</h4>
                    <p className="cart-tagline">{item.tagline || "Premium HavenHaus product"}</p>
                    <p className="cart-price">
                      ₹{priceNumber(item.price).toLocaleString("en-IN")}
                    </p>

                    <div className="cart-actions">
                      <div className="qty-controls">
                        <button type="button" onClick={() => decrement(itemId, quantity)}><FaMinus /></button>
                        <span>{quantity}</span>
                        <button type="button" onClick={() => increment(itemId, quantity)}><FaPlus /></button>
                      </div>
                      
                      <div className="item-total">
                        Total: <strong>₹{itemTotal.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    className="trash-btn"
                    onClick={() => removeFromCart(itemId)}
                    title="Remove from cart"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>

          {/* ==================== RIGHT: SUMMARY ==================== */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="coupon-box">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter HAVEN25"
                disabled={discountRate > 0}
              />
              <button onClick={applyCoupon} disabled={discountRate > 0 || !coupon.trim()}>
                {discountRate > 0 ? "Applied" : "Apply"}
              </button>
            </div>

            <div className="summary-details">
              <p><span>Subtotal</span> <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></p>
              
              {discountRate > 0 && (
                <p className="discount-text">
                  <span>Discount (25%)</span> 
                  <span>-₹{discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </p>
              )}

              <p><span>GST (5%)</span> <span>₹{gst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></p>
              
              <p className={!shipping ? "free-text" : ""}>
                <span>Shipping</span> 
                <span>{shipping ? `₹${shipping}` : "Free 🚚"}</span>
              </p>
            </div>

            <div className="grand-total">
              <span>Grand Total</span>
              <span>₹{grand.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="summary-buttons">
              <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
                Proceed to Checkout
              </button>
              <button className="secondary-btn" onClick={clear}>
                Clear Cart
              </button>
            </div>
          </div>

        </div>
      )}

      {/* =================================================
          CHECKOUT MODAL
      ================================================= */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => !loading && setIsModalOpen(false)}
        overlayClassName="overlay"
        className="checkout-modal"
        shouldCloseOnOverlayClick={!loading}
        ariaHideApp={false}
      >
        <div className="modal-header">
          <h2>Complete Your Order</h2>
          <button className="close-btn" onClick={() => !loading && setIsModalOpen(false)}>×</button>
        </div>

        <div className="modal-body">
          {/* LEFT SIDE: ORDER RECAP & SHIPPING DETAILS */}
          <div className="checkout-left-column">
            <div className="modal-recap">
              <h4>📋 Order Recap</h4>
              <ul className="modal-item-list">
                {cart.map((item) => {
                  const itemId = item.id || item._id;
                  const qty = Number(item.quantity) || 1;
                  const total = priceNumber(item.price) * qty;
                  return (
                    <li key={itemId}>
                      <span>{item.name} × {qty}</span>
                      <span>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="modal-sub-summary">
                <p><span>Subtotal:</span> ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                {discountRate > 0 && <p><span>Discount:</span> -₹{discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>}
                <p><span>GST (5%):</span> ₹{gst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                <p><span>Shipping:</span> {shipping ? `₹${shipping}` : "Free"}</p>
              </div>
            </div>

            <div className="checkout-form">
              <h3>Shipping Details</h3>
              <input type="text" placeholder="Full Name *" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="tel" placeholder="Phone Number (10 digits) *" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength="10" />
              <textarea placeholder="Complete Delivery Address *" value={address} onChange={(e) => setAddress(e.target.value)} rows="3" />
            </div>
          </div>

          {/* RIGHT SIDE: PAYMENT & PLACEMENT */}
          <div className="checkout-payment">
            <h3>Payment Method</h3>
            <label className="radio-label">
              <input type="radio" value="card" checked={paymentMethod === "card"} onChange={(e) => setPaymentMethod(e.target.value)} />
              Credit / Debit Card 💳
            </label>
            <label className="radio-label">
              <input type="radio" value="upi" checked={paymentMethod === "upi"} onChange={(e) => setPaymentMethod(e.target.value)} />
              UPI Transfer 📱
            </label>
            <label className="radio-label">
              <input type="radio" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} />
              Cash on Delivery 💵
            </label>
            
            <div className="modal-grand-total">
              Amount Payable: <strong>₹{grand.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
            </div>

            <button className="primary-btn full-width" onClick={pay} disabled={loading}>
              {loading ? "Processing Securely..." : paymentMethod === "cod" ? "Place Order (COD)" : "Pay Now & Order"}
            </button>
          </div>
        </div>
      </Modal>

      {/* =================================================
          STYLES (HavenHaus Theme Synchronized)
      ================================================= */}
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
          --green: #55745a;
          --shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        * { box-sizing: border-box; }

        .cart-container {
          padding: 40px 20px;
          max-width: 1200px;
          margin: auto;
          background: var(--white);
          min-height: 100vh;
          font-family: "Times New Roman", Times, serif;
          color: var(--black);
        }

        .cart-heading {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 40px;
          color: var(--dark-brown);
        }

        /* EMPTY STATE */
        .empty-container {
          text-align: center;
          padding: 60px 20px;
          color: var(--gray);
        }
        .empty-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 20px;
          border-radius: 50%;
          background: var(--cream);
          border: 1px solid var(--beige);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          color: var(--light-brown);
        }
        .empty-container h2 {
          color: var(--dark-brown);
          margin-bottom: 10px;
        }
        .continue-btn { margin-top: 20px; }

        /* LAYOUT */
        .cart-layout {
          display: flex;
          gap: 30px;
          align-items: flex-start;
        }
        .cart-items {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .cart-summary {
          flex: 1;
          background: var(--cream);
          border: 1px solid var(--beige);
          border-radius: 20px;
          padding: 30px;
          position: sticky;
          top: 30px;
          box-shadow: var(--shadow);
        }

        /* CART CARDS */
        .cart-card {
          background: var(--white);
          border: 1px solid var(--beige);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          gap: 20px;
          align-items: center;
          box-shadow: var(--shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }
        .cart-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(74, 47, 34, 0.08);
        }
        .cart-image-wrapper {
          width: 120px;
          height: 120px;
          flex-shrink: 0;
        }
        .cart-image-wrapper img, .image-placeholder {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid var(--beige);
        }
        .image-placeholder {
          background: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
        }
        .cart-info {
          flex: 1;
        }
        .cart-info h4 {
          margin: 0 0 5px;
          font-size: 1.3rem;
          color: var(--dark-brown);
        }
        .cart-tagline {
          margin: 0 0 8px;
          font-size: 0.9rem;
          color: var(--gray);
        }
        .cart-price {
          font-weight: 700;
          color: var(--brown);
          font-size: 1.1rem;
          margin: 0 0 15px;
        }
        .cart-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .qty-controls {
          display: flex;
          align-items: center;
          gap: 15px;
          background: var(--cream);
          border: 1px solid var(--beige);
          border-radius: 25px;
          padding: 5px 15px;
        }
        .qty-controls button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--dark-brown);
          display: flex;
          align-items: center;
          font-size: 12px;
        }
        .qty-controls span {
          font-weight: 700;
          color: var(--black);
          min-width: 20px;
          text-align: center;
        }
        .item-total {
          color: var(--gray);
          font-size: 0.95rem;
        }
        .item-total strong {
          color: var(--dark-brown);
          font-size: 1.1rem;
        }
        .trash-btn {
          background: #f9ecea;
          color: var(--red);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: absolute;
          top: 20px;
          right: 20px;
        }
        .trash-btn:hover {
          background: var(--red);
          color: white;
          transform: scale(1.05);
        }

        /* SUMMARY */
        .cart-summary h3 {
          margin: 0 0 20px;
          font-size: 1.5rem;
          color: var(--dark-brown);
          border-bottom: 2px solid var(--beige);
          padding-bottom: 10px;
        }
        .coupon-box {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
        }
        .coupon-box input {
          flex: 1;
          padding: 10px 15px;
          border: 1px solid var(--beige);
          border-radius: 25px;
          font-family: inherit;
          outline: none;
        }
        .coupon-box input:focus { border-color: var(--brown); }
        .coupon-box button {
          background: var(--dark-brown);
          color: white;
          border: none;
          border-radius: 25px;
          padding: 0 20px;
          cursor: pointer;
          font-family: inherit;
          font-weight: 700;
        }
        .coupon-box button:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .summary-details p {
          display: flex;
          justify-content: space-between;
          margin: 12px 0;
          color: var(--gray);
          font-size: 1.05rem;
        }
        .summary-details p span:last-child {
          font-weight: 700;
          color: var(--black);
        }
        .discount-text span { color: var(--green) !important; }
        .free-text span:last-child { color: var(--green) !important; }

        .grand-total {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          padding-top: 15px;
          border-top: 2px solid var(--beige);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--dark-brown);
        }

        .summary-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* BUTTONS */
        .primary-btn {
          background: var(--dark-brown);
          color: var(--white);
          border: none;
          padding: 14px 25px;
          border-radius: 25px;
          font-family: inherit;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }
        .primary-btn:hover:not(:disabled) {
          background: #3f3022;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(74, 47, 34, 0.2);
        }
        .primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .primary-btn.full-width { width: 100%; margin-top: 20px; }

        .secondary-btn {
          background: transparent;
          color: var(--red);
          border: 1px solid var(--red);
          padding: 12px 25px;
          border-radius: 25px;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .secondary-btn:hover { background: #f9ecea; }

        /* MODAL */
        .overlay {
          background: rgba(23, 19, 16, 0.68);
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(4px);
        }
        .checkout-modal {
          background: var(--white);
          width: 100%;
          max-width: 900px;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 60px rgba(23, 19, 16, 0.25);
          border: 1px solid var(--beige);
          outline: none;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid var(--beige);
          padding-bottom: 15px;
        }
        .modal-header h2 { margin: 0; color: var(--dark-brown); font-size: 2rem; }
        .close-btn {
          background: var(--cream);
          border: 1px solid var(--beige);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 22px;
          cursor: pointer;
          color: var(--brown);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close-btn:hover { background: var(--beige); }
        
        .modal-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        .checkout-left-column, .checkout-payment {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .modal-recap {
          background: var(--cream);
          border: 1px solid var(--beige);
          border-radius: 15px;
          padding: 15px;
        }
        .modal-recap h4 { margin: 0 0 10px; color: var(--dark-brown); }
        .modal-item-list {
          list-style: none;
          padding: 0;
          margin: 0 0 10px 0;
          max-height: 120px;
          overflow-y: auto;
        }
        .modal-item-list li {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 5px;
          color: var(--gray);
        }
        .modal-sub-summary p {
          display: flex;
          justify-content: space-between;
          margin: 4px 0;
          font-size: 0.9rem;
          color: var(--gray);
        }

        .checkout-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .checkout-form h3, .checkout-payment h3 {
          margin: 0;
          color: var(--brown);
          font-size: 1.2rem;
        }
        .checkout-form input, .checkout-form textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid var(--beige);
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.95rem;
          background: var(--cream);
          outline: none;
          transition: border 0.3s ease;
        }
        .checkout-form input:focus, .checkout-form textarea:focus {
          border-color: var(--brown);
          background: var(--white);
        }
        
        .radio-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          border: 1px solid var(--beige);
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.3s ease;
          font-weight: 600;
          color: var(--black);
        }
        .radio-label:hover { background: var(--cream); }
        .radio-label input[type="radio"] { accent-color: var(--brown); width: 18px; height: 18px; }
        
        .modal-grand-total {
          margin-top: auto;
          background: var(--cream);
          padding: 15px;
          border-radius: 12px;
          text-align: center;
          font-size: 1.1rem;
          color: var(--gray);
          border: 1px dashed var(--beige);
        }
        .modal-grand-total strong {
          display: block;
          font-size: 1.6rem;
          color: var(--dark-brown);
          margin-top: 3px;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .cart-layout { flex-direction: column; }
          .cart-summary { width: 100%; position: static; }
          .modal-body { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .cart-card { flex-direction: column; text-align: center; }
          .cart-actions { flex-direction: column; gap: 15px; }
          .trash-btn { top: 10px; right: 10px; }
        }
      `}</style>
    </div>
  );
};

export default Cart;