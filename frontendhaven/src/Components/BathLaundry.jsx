import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaRegHeart,
  FaHeart,
  FaShoppingCart,
  FaEye,
} from "react-icons/fa";

import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useUserData } from "./UserDataContext";

// Bath & Laundry images
import bathGel from "../images/bat1.jpg";
import bathSalt from "../images/bat2.jpg";
import bodyScrub from "../images/bat3.jpg";
import bathBomb from "../images/bat4.jpg";
import laundryDetergent from "../images/bat5.jpg";
import fabricSoftener from "../images/bat6.jpg";
import stainRemover from "../images/bat7.jpg";
import washingPowder from "../images/bat8.jpg";

import API_URL from "../api";

/* =====================================================
   STATIC BATH & LAUNDRY PRODUCTS
===================================================== */

const staticBathProducts = [
  {
    id: "static-1",
    name: "Gold-Plated Jewellery Stand",
    tagline: "A chic home for your sparkle ✨",
    price: 699,
    rating: 4.5,
    reviews: 210,
    badge: "💖 Staff Favorite",
    image: bathGel,
    category: "Bath & Laundry",
  },
  {
    id: "static-2",
    name: "Premium Vanity Mirror",
    tagline: "Reflect style every morning 🪞",
    price: 999,
    rating: 4.7,
    reviews: 145,
    badge: "💫 Mirror Magic",
    image: bathSalt,
    category: "Bath & Laundry",
  },
  {
    id: "static-3",
    name: "Steel Shower Organizer",
    tagline: "Declutter your shower corner 🧴",
    price: 799,
    rating: 4.4,
    reviews: 178,
    badge: "🧼 Neat Freak Approved",
    image: bodyScrub,
    category: "Bath & Laundry",
  },
  {
    id: "static-4",
    name: "Compact Vanity Cabinet",
    tagline: "Storage that doesn’t steal space 🚿",
    price: 5249,
    rating: 4.6,
    reviews: 95,
    badge: "🚪 Space Saver",
    image: bathBomb,
    category: "Bath & Laundry",
  },
  {
    id: "static-5",
    name: "Foldable Laundry Bin",
    tagline: "Laundry day made classy 🧺",
    price: 399,
    rating: 4.8,
    reviews: 310,
    badge: "🔥 Hot Pick",
    image: laundryDetergent,
    category: "Bath & Laundry",
  },
  {
    id: "static-6",
    name: "2-Tier Drying Stand",
    tagline: "Dry smart, save space 🌬️",
    price: 2329,
    rating: 4.5,
    reviews: 200,
    badge: "📏 Smart Design",
    image: fabricSoftener,
    category: "Bath & Laundry",
  },
  {
    id: "static-7",
    name: "Luxury Resin Bath Set (4pc)",
    tagline: "Elegance in every corner 🛁",
    price: 579,
    rating: 4.3,
    reviews: 120,
    badge: "💼 Budget Luxury",
    image: stainRemover,
    category: "Bath & Laundry",
  },
  {
    id: "static-8",
    name: "Mirror Cabinet Combo",
    tagline: "Your essentials, hidden in plain sight 🔍",
    price: 12349,
    rating: 4.7,
    reviews: 220,
    badge: "🆕 Just In!",
    image: washingPowder,
    category: "Bath & Laundry",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const BathLaundry = () => {
  const {
    addToCart,
    addToWishlist,
    wishlist,
  } = useUserData();

  const [backendProducts, setBackendProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState(null);
  const [quantities, setQuantities] = useState({});

  /* =====================================================
     FETCH PRODUCTS FROM BACKEND
  ===================================================== */

  useEffect(() => {
    fetchBathProducts();
  }, []);

  const fetchBathProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/admin/products`
      );

      const data = response.data;

      let products = [];

      if (Array.isArray(data)) {
        products = data;
      } else if (Array.isArray(data.products)) {
        products = data.products;
      }

      /*
       * Only show products belonging to Bath & Laundry.
       * IMPORTANT: Admin Panel must save the category as "Bath & Laundry"
       */
      const bathProductsFromBackend = products.filter(
        (product) =>
          String(product.category || "")
            .trim()
            .toLowerCase() === "bath & laundry"
      );

      setBackendProducts(bathProductsFromBackend);

      console.log(
        "Bath & Laundry products from backend:",
        bathProductsFromBackend
      );
    } catch (error) {
      console.error(
        "Unable to fetch Bath & Laundry products:",
        error
      );

      toast.error(
        "Unable to load products from server."
      );

      setBackendProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     COMBINE STATIC + BACKEND PRODUCTS
  ===================================================== */

  const allBathProducts = [
    ...staticBathProducts,
    ...backendProducts,
  ];

  /* =====================================================
     FORMAT PRICE
  ===================================================== */

  const formatPrice = (price) => {
    const numericPrice = Number(
      String(price || 0).replace(/[₹,]/g, "")
    );

    return `₹${numericPrice.toLocaleString("en-IN")}`;
  };

  /* =====================================================
     QUANTITY
  ===================================================== */

  const handleQuantityChange = (id, value) => {
    let qty = Number(value);

    if (isNaN(qty) || qty < 1) {
      qty = 1;
    } else if (qty > 99) {
      qty = 99;
    }

    setQuantities((prev) => ({
      ...prev,
      [id]: qty,
    }));
  };

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const handleAddToCart = (product) => {
    const productId = product._id || product.id;
    const quantity = quantities[productId] || 1;

    const cartProduct = {
      ...product,
      id: productId, // Standardize id for context
      price: Number(
        String(product.price || 0).replace(/₹|,/g, "")
      ),
    };

    addToCart(cartProduct, quantity);

    toast.success(
      `${product.name} (x${quantity}) added to cart!`,
      {
        position: "bottom-right",
      }
    );
  };

  /* =====================================================
     WISHLIST
  ===================================================== */

  const handleWishlist = (product) => {
    addToWishlist(product);

    toast.success(
      `${product.name} added to wishlist!`,
      {
        position: "bottom-right",
      }
    );
  };

  const isInWishlist = (id) => {
    return wishlist.some(
      (item) => (item.id || item._id) === id
    );
  };

  /* =====================================================
     RATING
  ===================================================== */

  const renderRating = (rating) => {
    const numericRating = Number(rating) || 0;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating - fullStars >= 0.5;

    return (
      <>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <FaStar key={i} color="#f6ad55" />;
          }

          if (i === fullStars && hasHalfStar) {
            return <FaStarHalfAlt key={i} color="#f6ad55" />;
          }

          return <FaRegStar key={i} color="#e2e8f0" />;
        })}
      </>
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="bath-container">

      <h1 className="bath-heading">
        Bath & Laundry Collection 🛁
      </h1>

      {/* LOADING */}

      {loading && (
        <div className="loading-products">
          <div className="product-loader"></div>
          <p>Loading collection...</p>
        </div>
      )}

      {/* PRODUCTS */}

      {!loading && (
        <div className="bath-grid">

          {allBathProducts.map((product) => {
            const productId = product._id || product.id;

            return (
              <div
                className="bath-card"
                key={productId}
              >

                {/* BADGE */}
                {product.badge && (
                  <span className="bath-badge">
                    {product.badge}
                  </span>
                )}

                {/* IMAGE */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={`Image of ${product.name}`}
                    className="bath-image"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="image-placeholder">
                    📦
                  </div>
                )}

                {/* NAME */}
                <h2 className="bath-name">
                  {product.name}
                </h2>

                {/* TAGLINE */}
                <p className="bath-tagline">
                  {product.tagline ||
                    "Quality products for your home"}
                </p>

                {/* PRICE */}
                <p className="bath-price">
                  {formatPrice(product.price)}
                </p>

                {/* RATING */}
                <div
                  className="bath-rating"
                  aria-label={`Rating: ${
                    product.rating || 0
                  } of 5`}
                >
                  {renderRating(product.rating)}

                  <span className="bath-rating-number">
                    {Number(product.rating || 0).toFixed(1)}
                  </span>

                  <span className="bath-review">
                    ({product.reviews || 0} reviews)
                  </span>
                </div>

                {/* QUANTITY */}
                <label
                  htmlFor={`qty-${productId}`}
                  className="quantity-label"
                >
                  Quantity:
                  <input
                    id={`qty-${productId}`}
                    type="number"
                    min="1"
                    max="99"
                    value={quantities[productId] || 1}
                    onChange={(e) =>
                      handleQuantityChange(
                        productId,
                        e.target.value
                      )
                    }
                    className="quantity-input"
                  />
                </label>

                {/* BUTTONS */}
                <div className="bath-buttons">

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="bath-button"
                  >
                    <FaShoppingCart />
                    Add
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWishlist(product)}
                    className="bath-button"
                  >
                    {isInWishlist(productId) ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )}
                    Wishlist
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalProduct(product)}
                    className="bath-button"
                  >
                    <FaEye />
                    View
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* NO PRODUCTS */}

      {!loading && allBathProducts.length === 0 && (
        <div className="empty-products">
          <div>📦</div>
          <h2>No products found</h2>
          <p>Add a Bath & Laundry product from the Admin Panel.</p>
        </div>
      )}

      {/* =================================================
          PRODUCT MODAL
      ================================================= */}

      <Modal
        isOpen={!!modalProduct}
        onRequestClose={() => setModalProduct(null)}
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        {modalProduct && (
          <div className="modal-content">

            {modalProduct.image && (
              <img
                src={modalProduct.image}
                alt={modalProduct.name}
                className="modal-image"
              />
            )}

            <h2>{modalProduct.name}</h2>

            <p>{modalProduct.tagline}</p>

            <p className="bath-price">
              {formatPrice(modalProduct.price)}
            </p>

            <p>
              ⭐ {Number(modalProduct.rating || 0).toFixed(1)} / 5
            </p>

            <p>
              {modalProduct.description ||
                "Premium quality product from HavenHaus."}
            </p>

            <button
              type="button"
              onClick={() => setModalProduct(null)}
              className="bath-button"
            >
              Close
            </button>

          </div>
        )}
      </Modal>

      <ToastContainer />

      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`
        .bath-container {
          padding: 40px 20px;
          max-width: 1200px;
          margin: auto;
          background: #ffffff;
          min-height: 100vh;
        }

        .bath-heading {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 40px;
          color: #574430;
        }

        .bath-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(250px, 1fr)
          );
          gap: 30px;
        }

        .bath-card {
          background: #fff;
          border: 1px solid #574430;
          border-radius: 20px;
          padding: 20px;
          text-align: center;
          position: relative;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .bath-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .bath-image,
        .image-placeholder {
          width: 100%;
          height: 250px;
          object-fit: cover;
          border-radius: 15px;
          margin-bottom: 10px;
        }

        .image-placeholder {
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
        }

        .bath-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #65350f;
          color: #fff;
          padding: 5px 10px;
          border-radius: 15px;
          font-weight: 600;
          font-size: 0.8rem;
          z-index: 2;
        }

        .bath-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #222;
        }

        .bath-tagline {
          font-size: 1rem;
          color: #555;
          min-height: 45px;
        }

        .bath-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: #574430;
        }

        .bath-rating {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin: 10px 0;
          flex-wrap: wrap;
        }

        .bath-rating-number {
          font-weight: 600;
          color: #dd6b20;
          font-size: 1rem;
        }

        .bath-review {
          font-size: 0.8rem;
          color: #000;
        }

        .quantity-label {
          margin-bottom: 8px;
          display: block;
          font-weight: 600;
        }

        .quantity-input {
          width: 60px;
          margin-left: 8px;
          padding: 6px;
          border: 1px solid #ccc;
          border-radius: 5px;
          text-align: center;
        }

        .bath-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }

        .bath-button {
          background: #574430;
          color: #fff;
          border: none;
          border-radius: 25px;
          padding: 10px;
          font-weight: 500;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease;
        }

        .bath-button:hover {
          background: #3e3021;
        }

        .modal {
          background: #fff;
          padding: 30px;
          max-width: 400px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          margin: auto;
          border-radius: 20px;
          text-align: center;
          outline: none;
        }

        .modal-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .modal-image {
          width: 100%;
          max-height: 300px;
          object-fit: cover;
          border-radius: 15px;
          margin-bottom: 20px;
        }

        .overlay {
          background: rgba(0, 0, 0, 0.5);
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-products {
          text-align: center;
          padding: 60px;
          color: #574430;
        }

        .product-loader {
          width: 40px;
          height: 40px;
          margin: auto;
          border: 4px solid #ddd;
          border-top-color: #574430;
          border-radius: 50%;
          animation: bath-spin 0.8s linear infinite;
        }

        @keyframes bath-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .empty-products {
          text-align: center;
          padding: 60px 20px;
          color: #777;
        }

        .empty-products div {
          font-size: 50px;
          margin-bottom: 10px;
        }

        .empty-products h2 {
          color: #574430;
        }

        @media (max-width: 600px) {
          .bath-container {
            padding: 25px 15px;
          }

          .bath-heading {
            font-size: 2rem;
          }

          .bath-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BathLaundry;