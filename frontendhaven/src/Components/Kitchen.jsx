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

// Kitchen & Dining images
import kpan from "../images/din1.jpg";
import kpot from "../images/din2.jpg";
import kknife from "../images/din3.jpg";
import kcuttingboard from "../images/din4.jpg";
import kspoon from "../images/din5.jpg";
import kblender from "../images/din6.jpg";
import kgrinder from "../images/din7.jpg";
import kmixer from "../images/din8.jpeg";

import API_URL from "../api";

/* =====================================================
   STATIC KITCHEN PRODUCTS
===================================================== */

const staticKitchenProducts = [
  {
    id: "static-1",
    name: "Organiza Jar Set (18 pcs)",
    tagline: "Stackable clarity jars for smart storage",
    price: 1299,
    rating: 4.5,
    reviews: 200,
    badge: "🔥 Best Seller",
    image: kpan,
    category: "Kitchen",
  },
  {
    id: "static-2",
    name: "Grandeur 8-Seater Dining",
    tagline: "Spacious, sleek & rust-resistant elegance",
    price: 17999,
    rating: 4.3,
    reviews: 145,
    badge: "🍽️ Family Favorite",
    image: kpot,
    category: "Kitchen",
  },
  {
    id: "static-3",
    name: "VelvetTouch Dining Bench",
    tagline: "Plush comfort with sturdy modern flair",
    price: 1899,
    rating: 4.7,
    reviews: 210,
    badge: "⭐ Must Have",
    image: kknife,
    category: "Kitchen",
  },
  {
    id: "static-4",
    name: "Marbella Marble Sideboard",
    tagline: "Chic storage with eco-friendly style",
    price: 10199,
    rating: 4.4,
    reviews: 90,
    badge: "🧱 Compact Chic",
    image: kcuttingboard,
    category: "Kitchen",
  },
  {
    id: "static-5",
    name: "Arco Dining Chairs (Set of 2)",
    tagline: "Ergonomic design with sleek silhouette",
    price: 1339,
    rating: 4.2,
    reviews: 75,
    badge: "🪑 Style Pair",
    image: kspoon,
    category: "Kitchen",
  },
  {
    id: "static-6",
    name: "GlidePro Serving Trolley",
    tagline: "Host effortlessly with this mobile charm",
    price: 1569,
    rating: 4.6,
    reviews: 320,
    badge: "🌟 Fan Favorite",
    image: kblender,
    category: "Kitchen",
  },
  {
    id: "static-7",
    name: "SpinDeck 3-Tier Organizer",
    tagline: "360° rotating rack for instant access",
    price: 1700,
    rating: 4.1,
    reviews: 85,
    badge: "🌀 Space Saver",
    image: kgrinder,
    category: "Kitchen",
  },
  {
    id: "static-8",
    name: "Cascade 2-Tier Dish Rack",
    tagline: "Drain-free drying with modern flow",
    price: 999,
    rating: 4.5,
    reviews: 150,
    badge: "✨ New Arrival",
    image: kmixer,
    category: "Kitchen",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Kitchen = () => {
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
    fetchKitchenProducts();
  }, []);

  const fetchKitchenProducts = async () => {
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
       * Only show products belonging to Kitchen.
       * IMPORTANT: Admin Panel must save the category as "Kitchen"
       */
      const kitchenProductsFromBackend = products.filter(
        (product) =>
          String(product.category || "")
            .trim()
            .toLowerCase() === "kitchen"
      );

      setBackendProducts(kitchenProductsFromBackend);

      console.log(
        "Kitchen products from backend:",
        kitchenProductsFromBackend
      );
    } catch (error) {
      console.error(
        "Unable to fetch kitchen products:",
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

  const allKitchenProducts = [
    ...staticKitchenProducts,
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
      id: productId, // standardize id
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
    <div className="kitchen-container">

      <h1 className="kitchen-heading">
        Kitchen Essentials 🍳
      </h1>

      {/* LOADING */}

      {loading && (
        <div className="loading-products">
          <div className="product-loader"></div>
          <p>Loading kitchen products...</p>
        </div>
      )}

      {/* PRODUCTS */}

      {!loading && (
        <div className="kitchen-grid">

          {allKitchenProducts.map((product) => {
            const productId = product._id || product.id;

            return (
              <div
                className="kitchen-card"
                key={productId}
              >

                {/* BADGE */}
                {product.badge && (
                  <span className="kitchen-badge">
                    {product.badge}
                  </span>
                )}

                {/* IMAGE */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={`Image of ${product.name}`}
                    className="kitchen-image"
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
                <h2 className="kitchen-name">
                  {product.name}
                </h2>

                {/* TAGLINE */}
                <p className="kitchen-tagline">
                  {product.tagline ||
                    "Quality products for your home"}
                </p>

                {/* PRICE */}
                <p className="kitchen-price">
                  {formatPrice(product.price)}
                </p>

                {/* RATING */}
                <div
                  className="kitchen-rating"
                  aria-label={`Rating: ${
                    product.rating || 0
                  } of 5`}
                >
                  {renderRating(product.rating)}

                  <span className="kitchen-rating-number">
                    {Number(product.rating || 0).toFixed(1)}
                  </span>

                  <span className="kitchen-review">
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
                <div className="kitchen-buttons">

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="kitchen-button"
                  >
                    <FaShoppingCart />
                    Add
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWishlist(product)}
                    className="kitchen-button"
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
                    className="kitchen-button"
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

      {!loading && allKitchenProducts.length === 0 && (
        <div className="empty-products">
          <div>📦</div>
          <h2>No kitchen products found</h2>
          <p>Add a Kitchen product from the Admin Panel.</p>
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

            <p className="kitchen-price">
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
              className="kitchen-button"
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
        .kitchen-container {
          padding: 40px 20px;
          max-width: 1200px;
          margin: auto;
          background: #ffffff;
          min-height: 100vh;
        }

        .kitchen-heading {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 40px;
          color: #574430;
        }

        .kitchen-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(250px, 1fr)
          );
          gap: 30px;
        }

        .kitchen-card {
          background: #fff;
          border: 1px solid #574430;
          border-radius: 20px;
          padding: 20px;
          text-align: center;
          position: relative;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .kitchen-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .kitchen-image,
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

        .kitchen-badge {
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

        .kitchen-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #222;
        }

        .kitchen-tagline {
          font-size: 1rem;
          color: #555;
          min-height: 45px;
        }

        .kitchen-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: #574430;
        }

        .kitchen-rating {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin: 10px 0;
          flex-wrap: wrap;
        }

        .kitchen-rating-number {
          font-weight: 600;
          color: #dd6b20;
          font-size: 1rem;
        }

        .kitchen-review {
          font-size: 0.8rem;
          color: #000;
        }

        .quantity-label {
          margin-bottom: 8px;
          display: block;
        }

        .quantity-input {
          width: 60px;
          margin-left: 8px;
          padding: 4px;
        }

        .kitchen-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }

        .kitchen-button {
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
          transition:
            background 0.3s ease,
            color 0.3s ease;
        }

        .kitchen-button:hover {
          background: #d2c4c4;
          color: #000;
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
          animation: kitchen-spin 0.8s linear infinite;
        }

        @keyframes kitchen-spin {
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
          .kitchen-container {
            padding: 25px 15px;
          }

          .kitchen-heading {
            font-size: 2rem;
          }

          .kitchen-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Kitchen;