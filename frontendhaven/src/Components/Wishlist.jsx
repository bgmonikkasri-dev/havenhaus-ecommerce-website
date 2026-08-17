import React from "react";
import { useUserData } from "./UserDataContext";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
  const {
    wishlist,
    removeFromWishlist,
    addToCart,
  } = useUserData();

  /* Move wishlist item to cart and remove from wishlist */
  const handleMoveToCart = (item) => {
    const itemId = item.id || item._id;
    
    // Standardize price as a number
    const numericPrice = Number(
      String(item.price || 0).replace(/[₹,]/g, "")
    );

    const cartItem = {
      ...item,
      id: itemId,
      price: numericPrice,
    };

    addToCart(cartItem, 1);
    removeFromWishlist(itemId);

    toast.success(`${item.name} moved to cart!`, {
      position: "bottom-right",
    });
  };

  return (
    <div className="wishlist-container">
      <ToastContainer />

      {/* Heading */}
      <h1 className="wishlist-heading">
        Your Wishlist ❤️
      </h1>

      {/* Empty Wishlist */}
      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <div className="empty-icon">💔</div>
          <h2>Your wishlist is empty</h2>
          <p>
            Start adding some amazing HavenHaus appliances!
          </p>
        </div>
      ) : (
        /* Wishlist Items */
        <div className="wishlist-items">
          {wishlist.map((item) => {
            const itemId = item.id || item._id;
            const numericPrice = Number(
              String(item.price || 0).replace(/[₹,]/g, "")
            );

            return (
              <div
                className="wishlist-card"
                key={itemId}
              >
                {/* Product Image */}
                <div className="wishlist-image-wrapper">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="image-placeholder">📦</div>
                  )}
                </div>

                {/* Product Information */}
                <div className="wishlist-info">
                  <h3>{item.name}</h3>

                  <p className="wishlist-tagline">
                    {item.tagline ||
                      item.description ||
                      "Quality appliance for your home"}
                  </p>

                  <div className="wishlist-price">
                    ₹{numericPrice.toLocaleString("en-IN")}
                  </div>

                  {item.rating && (
                    <div className="wishlist-rating">
                      ⭐ {Number(item.rating).toFixed(1)}
                      {item.reviews && (
                        <span className="wishlist-review">
                          {" "}
                          ({item.reviews} reviews)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="wishlist-buttons">
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(item)}
                    className="wishlist-cart-btn"
                    aria-label={`Move ${item.name} to cart`}
                  >
                    <FaShoppingCart />
                    Move to Cart
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      removeFromWishlist(itemId);
                      toast.info(`${item.name} removed from wishlist`, {
                        position: "bottom-right",
                      });
                    }}
                    className="wishlist-remove-btn"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <FaTrash />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HavenHaus Theme Styles */}
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

        .wishlist-container {
          padding: 40px 20px;
          max-width: 1000px;
          margin: auto;
          min-height: 100vh;
          font-family: "Times New Roman", Times, serif;
          background: var(--white);
          color: var(--black);
        }

        .wishlist-heading {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 40px;
          color: var(--dark-brown);
        }

        .wishlist-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .wishlist-card {
          background: var(--white);
          border: 1px solid var(--beige);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: var(--shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }

        .wishlist-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(74, 47, 34, 0.08);
        }

        .wishlist-image-wrapper {
          width: 120px;
          height: 120px;
          flex-shrink: 0;
        }

        .wishlist-image-wrapper img,
        .image-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 12px;
          object-fit: cover;
          border: 1px solid var(--beige);
        }

        .image-placeholder {
          background: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
        }

        .wishlist-info {
          flex: 1;
        }

        .wishlist-info h3 {
          margin: 0 0 5px;
          font-size: 1.3rem;
          color: var(--dark-brown);
        }

        .wishlist-tagline {
          margin: 0 0 8px;
          font-size: 0.95rem;
          color: var(--gray);
          line-height: 1.4;
        }

        .wishlist-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--brown);
        }

        .wishlist-rating {
          margin-top: 6px;
          font-size: 0.95rem;
          color: #dd6b20;
          font-weight: 600;
        }

        .wishlist-review {
          color: var(--gray);
          font-weight: normal;
          font-size: 0.85rem;
        }

        .wishlist-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 150px;
        }

        .wishlist-cart-btn,
        .wishlist-remove-btn {
          padding: 10px 16px;
          font-size: 0.95rem;
          font-weight: 700;
          border-radius: 25px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .wishlist-cart-btn {
          background: var(--dark-brown);
          color: var(--white);
          border: none;
        }

        .wishlist-cart-btn:hover {
          background: #3f3022;
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(74, 47, 34, 0.2);
        }

        .wishlist-remove-btn {
          background: transparent;
          color: var(--red);
          border: 1px solid var(--red);
        }

        .wishlist-remove-btn:hover {
          background: #f9ecea;
        }

        /* Empty Wishlist */
        .wishlist-empty {
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
        }

        .wishlist-empty h2 {
          color: var(--dark-brown);
          margin-bottom: 10px;
          font-size: 1.8rem;
        }

        .wishlist-empty p {
          font-size: 1.1rem;
          color: var(--gray);
        }

        /* Mobile */
        @media (max-width: 650px) {
          .wishlist-container {
            padding: 30px 15px;
          }

          .wishlist-heading {
            font-size: 2rem;
          }

          .wishlist-card {
            flex-direction: column;
            text-align: center;
          }

          .wishlist-image-wrapper {
            width: 150px;
            height: 150px;
          }

          .wishlist-buttons {
            width: 100%;
          }

          .wishlist-info {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Wishlist;