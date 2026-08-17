
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8082";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/orders`);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        throw new Error(
          data.message || "Unable to load orders"
        );
      }
    } catch (err) {
      console.error("❌ My Orders error:", err);

      setError(
        "Unable to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // FORMAT PAYMENT METHOD
  // =====================================================

  const formatPaymentMethod = (method) => {
    if (method === "upi") return "UPI";
    if (method === "cod") return "Cash on Delivery";
    if (method === "card") return "Card";

    return method || "Unknown";
  };

  // =====================================================
  // PAYMENT ICON
  // =====================================================

  const getPaymentIcon = (method) => {
    if (method === "upi") return "📱";
    if (method === "cod") return "💵";
    if (method === "card") return "💳";

    return "💳";
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";

      case "Confirmed":
        return "status-confirmed";

      case "Processing":
        return "status-processing";

      case "Shipped":
        return "status-shipped";

      case "Delivered":
        return "status-delivered";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "";
    }
  };

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <div className="my-orders-page">
          <div className="orders-loading">
            <div className="loading-spinner"></div>

            <h3>Loading your orders...</h3>

            <p>
              Please wait while we fetch your HavenHaus
              orders.
            </p>
          </div>
        </div>
      </>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <>
        <style>{styles}</style>

        <div className="my-orders-page">
          <div className="orders-error">
            <div className="error-icon">⚠️</div>

            <h2>Something went wrong</h2>

            <p>{error}</p>

            <button
              className="retry-button"
              onClick={fetchOrders}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <>
      <style>{styles}</style>

      <div className="my-orders-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="orders-header">
          <p className="orders-subtitle">
            HAVENHAUS
          </p>

          <h1>My Orders</h1>

          <p className="orders-description">
            View and track all your HavenHaus purchases.
          </p>
        </section>

        {/* =================================================
            NO ORDERS
        ================================================= */}

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">
              📦
            </div>

            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders with
              HavenHaus yet.
            </p>

            <a
              href="/"
              className="shop-button"
            >
              Continue Shopping
            </a>
          </div>
        ) : (

          /* =================================================
             ORDERS
          ================================================= */

          <section className="orders-container">

            {/* Orders count */}

            <div className="orders-count">
              <span>
                {orders.length}
              </span>

              {" "}

              {orders.length === 1
                ? "Order"
                : "Orders"}
            </div>

            {/* =================================================
                ORDER CARDS
            ================================================= */}

            {orders.map((order) => (

              <article
                className="order-card"
                key={order._id}
              >

                {/* =================================================
                    ORDER HEADER
                ================================================= */}

                <div className="order-top">

                  <div className="order-information">

                    <p className="order-label">
                      ORDER ID
                    </p>

                    <h3 className="order-id">
                      #{order._id}
                    </h3>

                    <p className="order-date">
                      {formatDate(order.createdAt)}
                      {" • "}
                      {formatTime(order.createdAt)}
                    </p>

                  </div>

                  <span
                    className={`order-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    <span className="status-dot"></span>

                    {order.status}
                  </span>

                </div>

                {/* =================================================
                    PRODUCTS
                ================================================= */}

                <div className="order-products">

                  {order.items.map(
                    (item, index) => (

                      <div
                        className="order-product"
                        key={`${order._id}-${item.productId}-${index}`}
                      >

                        {/* Product image */}

                        <div className="product-image-wrapper">

                          <img
                            src={item.image}
                            alt={item.name}
                            className="product-image"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";

                              event.currentTarget.parentElement.classList.add(
                                "image-fallback"
                              );
                            }}
                          />

                          <span className="image-fallback-icon">
                            🪑
                          </span>

                        </div>

                        {/* Product details */}

                        <div className="product-details">

                          <h4>
                            {item.name}
                          </h4>

                          <p className="product-quantity">
                            Quantity:{" "}
                            {item.quantity}
                          </p>

                          <p className="product-unit-price">
                            ₹
                            {formatCurrency(
                              item.price
                            )}
                            {" "}each
                          </p>

                        </div>

                        {/* Product total */}

                        <div className="product-total">

                          ₹
                          {formatCurrency(
                            Number(item.price) *
                              Number(item.quantity)
                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

                {/* =================================================
                    ORDER SUMMARY
                ================================================= */}

                <div className="order-summary">

                  <div className="summary-row">

                    <span>
                      Subtotal
                    </span>

                    <span>
                      ₹
                      {formatCurrency(
                        order.subtotal
                      )}
                    </span>

                  </div>

                  {Number(order.discount) > 0 && (

                    <div className="summary-row discount-row">

                      <span>
                        Discount
                      </span>

                      <span>
                        -₹
                        {formatCurrency(
                          order.discount
                        )}
                      </span>

                    </div>

                  )}

                  <div className="summary-row">

                    <span>
                      GST
                    </span>

                    <span>
                      ₹
                      {formatCurrency(
                        order.gst
                      )}
                    </span>

                  </div>

                  <div className="summary-row">

                    <span>
                      Shipping
                    </span>

                    <span
                      className={
                        Number(order.shipping) === 0
                          ? "free-shipping"
                          : ""
                      }
                    >
                      {Number(order.shipping) === 0
                        ? "FREE"
                        : `₹${formatCurrency(
                            order.shipping
                          )}`}
                    </span>

                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-row total-row">

                    <span>
                      Total
                    </span>

                    <span>
                      ₹
                      {formatCurrency(
                        order.totalAmount
                      )}
                    </span>

                  </div>

                </div>

                {/* =================================================
                    ORDER FOOTER
                ================================================= */}

                <div className="order-footer">

                  <div className="payment-info">

                    <div className="payment-icon">
                      {getPaymentIcon(
                        order.paymentMethod
                      )}
                    </div>

                    <div>

                      <p className="payment-label">
                        PAYMENT METHOD
                      </p>

                      <p className="payment-method">
                        {formatPaymentMethod(
                          order.paymentMethod
                        )}
                      </p>

                    </div>

                  </div>

                  <div className="footer-status">

                    <span className="footer-status-label">
                      ORDER STATUS
                    </span>

                    <span
                      className={`order-status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      <span className="status-dot"></span>

                      {order.status}
                    </span>

                  </div>

                </div>

              </article>

            ))}

          </section>

        )}

      </div>
    </>
  );
}

// =====================================================
// ALL CSS IS INSIDE THIS FILE
// =====================================================

const styles = `

/* =====================================================
   PAGE
===================================================== */

.my-orders-page {
  min-height: 100vh;
  background: #f8f7f4;
  padding: 70px 7%;
  font-family: "Times New Roman", serif;
  color: #2f2f2f;
  box-sizing: border-box;
}

/* =====================================================
   HEADER
===================================================== */

.orders-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 50px;
}

.orders-subtitle {
  margin: 0 0 10px;
  font-size: 13px;
  letter-spacing: 4px;
  font-weight: bold;
  color: #3aafa9;
}

.orders-header h1 {
  margin: 0;
  font-size: 48px;
  font-weight: 500;
  letter-spacing: 1px;
  color: #222;
}

.orders-description {
  margin: 15px 0 0;
  font-size: 17px;
  color: #777;
  line-height: 1.6;
}

/* =====================================================
   ORDERS CONTAINER
===================================================== */

.orders-container {
  max-width: 1050px;
  margin: 0 auto;
}

.orders-count {
  font-size: 16px;
  color: #666;
  margin-bottom: 18px;
}

.orders-count span {
  font-weight: bold;
  color: #222;
}

/* =====================================================
   ORDER CARD
===================================================== */

.order-card {
  background: #ffffff;
  border: 1px solid #e6e3dc;
  border-radius: 16px;
  margin-bottom: 28px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.order-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 38px rgba(0, 0, 0, 0.08);
}

/* =====================================================
   ORDER TOP
===================================================== */

.order-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 27px 30px;
  border-bottom: 1px solid #eeeae3;
  background: #fdfcf9;
}

.order-label {
  margin: 0 0 7px;
  font-size: 11px;
  letter-spacing: 2px;
  font-weight: bold;
  color: #999;
}

.order-id {
  margin: 0;
  font-family: Arial, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  word-break: break-all;
}

.order-date {
  margin: 8px 0 0;
  font-size: 14px;
  color: #888;
}

/* =====================================================
   STATUS
===================================================== */

.order-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 15px;
  border-radius: 50px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.status-pending {
  background: #fff4d8;
  color: #9a6b00;
}

.status-pending .status-dot {
  background: #d99b00;
}

.status-confirmed {
  background: #e7f1ff;
  color: #2765a5;
}

.status-confirmed .status-dot {
  background: #4385c5;
}

.status-processing {
  background: #eee9ff;
  color: #6445a5;
}

.status-processing .status-dot {
  background: #7657bd;
}

.status-shipped {
  background: #e6f4f3;
  color: #287d78;
}

.status-shipped .status-dot {
  background: #3aafa9;
}

.status-delivered {
  background: #e5f5e9;
  color: #28733d;
}

.status-delivered .status-dot {
  background: #3e9a58;
}

.status-cancelled {
  background: #fde8e8;
  color: #a33a3a;
}

.status-cancelled .status-dot {
  background: #c94b4b;
}

/* =====================================================
   PRODUCTS
===================================================== */

.order-products {
  padding: 8px 30px;
}

.order-product {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 22px 0;
  border-bottom: 1px solid #f0ede7;
}

.order-product:last-child {
  border-bottom: none;
}

/* =====================================================
   PRODUCT IMAGE
===================================================== */

.product-image-wrapper {
  width: 100px;
  height: 100px;
  flex: 0 0 100px;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f1ec;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-fallback-icon {
  display: none;
  font-size: 30px;
}

.image-fallback .image-fallback-icon {
  display: block;
}

/* =====================================================
   PRODUCT DETAILS
===================================================== */

.product-details {
  flex: 1;
  min-width: 0;
}

.product-details h4 {
  margin: 0 0 9px;
  font-size: 20px;
  font-weight: 500;
  color: #2c2c2c;
}

.product-quantity {
  margin: 0 0 5px;
  font-size: 14px;
  color: #777;
}

.product-unit-price {
  margin: 0;
  font-size: 14px;
  color: #888;
}

.product-total {
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #222;
  white-space: nowrap;
}

/* =====================================================
   SUMMARY
===================================================== */

.order-summary {
  max-width: 500px;
  margin-left: auto;
  padding: 24px 30px;
  border-top: 1px solid #eeeae3;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  font-size: 15px;
  color: #666;
}

.summary-row span:last-child {
  font-family: Arial, sans-serif;
  color: #333;
}

.discount-row {
  color: #32947f;
}

.discount-row span:last-child {
  color: #32947f;
}

.free-shipping {
  color: #32947f !important;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: #ddd8ce;
  margin: 12px 0;
}

.total-row {
  padding-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #222;
}

.total-row span:last-child {
  font-size: 20px;
  color: #222;
}

/* =====================================================
   FOOTER
===================================================== */

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 30px;
  background: #faf9f6;
  border-top: 1px solid #eeeae3;
}

.payment-info {
  display: flex;
  align-items: center;
  gap: 13px;
}

.payment-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e4e0d8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}

.payment-label {
  margin: 0 0 3px;
  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 1.5px;
  font-weight: bold;
  color: #999;
}

.payment-method {
  margin: 0;
  font-size: 15px;
  color: #333;
}

.footer-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-status-label {
  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 1.5px;
  font-weight: bold;
  color: #aaa;
}

/* =====================================================
   LOADING
===================================================== */

.orders-loading {
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.orders-loading h3 {
  margin: 20px 0 5px;
  font-size: 22px;
  font-weight: 500;
}

.orders-loading p {
  margin: 0;
  color: #888;
  font-size: 15px;
}

.loading-spinner {
  width: 45px;
  height: 45px;
  border: 4px solid #e2e0da;
  border-top-color: #3aafa9;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =====================================================
   ERROR
===================================================== */

.orders-error {
  max-width: 500px;
  min-height: 450px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.orders-error h2 {
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 500;
}

.orders-error p {
  margin: 0 0 25px;
  color: #777;
}

.retry-button {
  border: none;
  background: #3aafa9;
  color: white;
  padding: 12px 28px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-family: "Times New Roman", serif;
  transition: background 0.2s ease;
}

.retry-button:hover {
  background: #2d918c;
}

/* =====================================================
   NO ORDERS
===================================================== */

.no-orders {
  max-width: 600px;
  margin: 50px auto;
  background: white;
  border: 1px solid #e6e3dc;
  border-radius: 16px;
  padding: 70px 30px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
}

.no-orders-icon {
  font-size: 55px;
  margin-bottom: 15px;
}

.no-orders h2 {
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 500;
}

.no-orders p {
  margin: 0 0 25px;
  color: #777;
}

.shop-button {
  display: inline-block;
  padding: 12px 28px;
  background: #3aafa9;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 15px;
  transition: background 0.2s ease;
}

.shop-button:hover {
  background: #2d918c;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 768px) {

  .my-orders-page {
    padding: 45px 5%;
  }

  .orders-header {
    margin-bottom: 35px;
  }

  .orders-header h1 {
    font-size: 38px;
  }

  .orders-description {
    font-size: 15px;
  }

  .order-top {
    padding: 22px 20px;
    gap: 15px;
  }

  .order-status {
    font-size: 11px;
    padding: 7px 11px;
  }

  .order-products {
    padding: 5px 20px;
  }

  .order-product {
    gap: 15px;
  }

  .product-image-wrapper {
    width: 80px;
    height: 80px;
    flex-basis: 80px;
  }

  .product-details h4 {
    font-size: 17px;
  }

  .product-total {
    font-size: 14px;
  }

  .order-summary {
    padding: 20px;
  }

  .order-footer {
    padding: 20px;
  }

  .footer-status-label {
    display: none;
  }
}

@media (max-width: 520px) {

  .my-orders-page {
    padding: 35px 4%;
  }

  .orders-header h1 {
    font-size: 32px;
  }

  .order-top {
    flex-direction: column;
  }

  .order-top > .order-status {
    align-self: flex-start;
  }

  .order-product {
    display: grid;
    grid-template-columns: 75px 1fr;
    gap: 13px;
  }

  .product-image-wrapper {
    width: 75px;
    height: 75px;
    flex-basis: auto;
  }

  .product-total {
    grid-column: 2;
    justify-self: start;
  }

  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }

  .footer-status {
    width: 100%;
    justify-content: space-between;
  }

  .order-summary {
    max-width: none;
  }

  .order-id {
    max-width: 250px;
  }

}

`;

export default MyOrders;

