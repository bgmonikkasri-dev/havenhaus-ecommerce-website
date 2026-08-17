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

// Images
import wallclock from "../images/gif1.jpeg";
import painting from "../images/gif2.jpeg";
import rug from "../images/gif3.webp";
import macrameWall from "../images/gif4.webp";
import moonLamp from "../images/gif5.jpeg";
import aromaDiffuser from "../images/gif6.jpeg";
import lantern from "../images/gif7.jpg";
import galaxyProjector from "../images/gif8.jpg";

const API_URL = "http://localhost:8082";

/* =====================================================
   STATIC GIFTING PRODUCTS
===================================================== */

const staticGiftingProducts = [
  {
    id: "static-1",
    name: "Timeless Oak Wall Clock",
    tagline: "Bring vintage charm with every tick",
    price: 1299,
    rating: 4.8,
    reviews: 134,
    badge: "🔥 Best Seller",
    image: wallclock,
    category: "Gifting",
  },
  {
    id: "static-2",
    name: "Aurora Abstract Canvas",
    tagline: "Breathe life into your walls with vibrant hues",
    price: 2499,
    rating: 4.7,
    reviews: 98,
    badge: "🖼️ Art Lover's Pick",
    image: painting,
    category: "Gifting",
  },
  {
    id: "static-3",
    name: "Heritage Woven Rug",
    tagline: "Handwoven comfort to elevate any room",
    price: 2799,
    rating: 4.6,
    reviews: 65,
    badge: "🔥 Top Rated",
    image: rug,
    category: "Gifting",
  },
  {
    id: "static-4",
    name: "Boho Macrame Wall Hanging",
    tagline: "Handwoven elegance for an earthy bohemian touch",
    price: 1299,
    rating: 4.8,
    reviews: 120,
    badge: "🧵 Artisan Crafted",
    image: macrameWall,
    category: "Gifting",
  },
  {
    id: "static-5",
    name: "Glowing Moon Night Lamp",
    tagline: "A magical moonlight glow for your room ambiance",
    price: 899,
    rating: 4.9,
    reviews: 180,
    badge: "🌕 Trending Now",
    image: moonLamp,
    category: "Gifting",
  },
  {
    id: "static-6",
    name: "Mystic Aroma Diffuser",
    tagline: "Aromatic mist with mood lighting for a spa-like experience",
    price: 1499,
    rating: 4.6,
    reviews: 140,
    badge: "🌬️ Zen Favorite",
    image: aromaDiffuser,
    category: "Gifting",
  },
  {
    id: "static-7",
    name: "Antique Lantern Decor",
    tagline: "Rustic charm for your indoor or balcony lighting",
    price: 799,
    rating: 4.7,
    reviews: 100,
    badge: "🪔 Vintage Vibe",
    image: lantern,
    category: "Gifting",
  },
  {
    id: "static-8",
    name: "Galaxy Projector Light",
    tagline: "Transform ceilings into dreamy galaxies",
    price: 2299,
    rating: 4.9,
    reviews: 230,
    badge: "✨ Most Loved",
    image: galaxyProjector,
    category: "Gifting",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Gifting = () => {
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
    fetchGiftingProducts();
  }, []);

  const fetchGiftingProducts = async () => {
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
       * Only show products belonging to Gifting.
       * IMPORTANT: Admin Panel must save the category as "Gifting"
       */
      const giftingProductsFromBackend = products.filter(
        (product) =>
          String(product.category || "")
            .trim()
            .toLowerCase() === "gifting"
      );

      setBackendProducts(giftingProductsFromBackend);

      console.log(
        "Gifting products from backend:",
        giftingProductsFromBackend
      );
    } catch (error) {
      console.error(
        "Unable to fetch gifting products:",
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

  const allGiftingProducts = [
    ...staticGiftingProducts,
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

    const productId = product._id || product.id;
    const alreadyAdded = wishlist.some(
      (item) => (item.id || item._id) === productId
    );

    if (alreadyAdded) {
      toast.info(`${product.name} is already in your wishlist.`, {
        position: "bottom-right",
      });
    } else {
      toast.success(`${product.name} added to wishlist!`, {
        position: "bottom-right",
      });
    }
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
    <div className="gifting-container">

      <h1 className="gifting-heading">
        Home Décor & Gifting 🎁
      </h1>

      <p className="gifting-subtitle">
        Thoughtful décor and beautiful gifts to make every space special.
      </p>

      {/* LOADING */}

      {loading && (
        <div className="loading-products">
          <div className="product-loader"></div>
          <p>Loading gifting collection...</p>
        </div>
      )}

      {/* PRODUCTS */}

      {!loading && (
        <div className="gifting-grid">

          {allGiftingProducts.map((product) => {
            const productId = product._id || product.id;

            return (
              <div
                className="gifting-card"
                key={productId}
              >

                {/* BADGE */}
                {product.badge && (
                  <span className="gifting-badge">
                    {product.badge}
                  </span>
                )}

                {/* IMAGE */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={`Image of ${product.name}`}
                    className="gifting-image"
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
                <h2 className="gifting-name">
                  {product.name}
                </h2>

                {/* TAGLINE */}
                <p className="gifting-tagline">
                  {product.tagline ||
                    "Perfect gifts for your loved ones"}
                </p>

                {/* PRICE */}
                <p className="gifting-price">
                  {formatPrice(product.price)}
                </p>

                {/* RATING */}
                <div
                  className="gifting-rating"
                  aria-label={`Rating: ${
                    product.rating || 0
                  } of 5`}
                >
                  {renderRating(product.rating)}

                  <span className="gifting-rating-number">
                    {Number(product.rating || 0).toFixed(1)}
                  </span>

                  <span className="gifting-review">
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
                <div className="gifting-buttons">

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="gifting-button"
                  >
                    <FaShoppingCart />
                    Add
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWishlist(product)}
                    className="gifting-button"
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
                    className="gifting-button"
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

      {!loading && allGiftingProducts.length === 0 && (
        <div className="empty-products">
          <div>📦</div>
          <h2>No products found</h2>
          <p>Add a Gifting product from the Admin Panel.</p>
        </div>
      )}

      {/* =================================================
          PRODUCT MODAL
      ================================================= */}

      <Modal
        isOpen={Boolean(modalProduct)}
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

            <p className="modal-tagline">{modalProduct.tagline}</p>

            <p className="gifting-price">
              {formatPrice(modalProduct.price)}
            </p>

            <div className="gifting-rating" style={{justifyContent: 'center', margin: '10px 0'}}>
              {renderRating(modalProduct.rating)}
              <span className="gifting-rating-number" style={{marginLeft: '8px'}}>
                {Number(modalProduct.rating || 0).toFixed(1)} / 5
              </span>
            </div>

            <p className="gifting-review" style={{marginBottom: '20px'}}>
              {modalProduct.reviews || 0} customer reviews
            </p>

            <p>
              {modalProduct.description ||
                "Premium quality product from HavenHaus."}
            </p>

            <button
              type="button"
              onClick={() => setModalProduct(null)}
              className="gifting-button"
              style={{marginTop: '20px'}}
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
        .gifting-container {
          padding: 40px 20px;
          max-width: 1200px;
          margin: auto;
          background: #ffffff;
          min-height: 100vh;
        }

        .gifting-heading {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 10px;
          color: #574430;
        }

        .gifting-subtitle {
          text-align: center;
          color: #666;
          font-size: 1rem;
          margin-bottom: 40px;
        }

        .gifting-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(250px, 1fr)
          );
          gap: 30px;
        }

        .gifting-card {
          background: #fff;
          border: 1px solid #574430;
          border-radius: 20px;
          padding: 20px;
          text-align: center;
          position: relative;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .gifting-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .gifting-image,
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

        .gifting-badge {
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

        .gifting-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #222;
          margin: 10px 0;
        }

        .gifting-tagline {
          font-size: 1rem;
          color: #555;
          min-height: 45px;
        }

        .gifting-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: #574430;
          margin: 10px 0;
        }

        .gifting-rating {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin: 10px 0 15px;
          flex-wrap: wrap;
        }

        .gifting-rating-number {
          font-weight: 600;
          color: #dd6b20;
          font-size: 1rem;
        }

        .gifting-review {
          font-size: 0.8rem;
          color: #000;
        }

        .quantity-label {
          margin-bottom: 8px;
          display: block;
          font-weight: 600;
          color: #333;
        }

        .quantity-input {
          width: 60px;
          margin-left: 8px;
          padding: 4px;
          border: 1px solid #ccc;
          border-radius: 6px;
          text-align: center;
        }

        .gifting-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }

        .gifting-button {
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

        .gifting-button:hover {
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
          animation: gifting-spin 0.8s linear infinite;
        }

        @keyframes gifting-spin {
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
          .gifting-container {
            padding: 25px 15px;
          }

          .gifting-heading {
            font-size: 2rem;
            margin-bottom: 20px;
          }

          .gifting-subtitle {
            margin-bottom: 30px;
          }

          .gifting-grid {
            grid-template-columns: 1fr;
          }

          .gifting-image {
            height: 240px;
          }
        }
      `}</style>
    </div>
  );
};

export default Gifting;