
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

import smartMattress from "../images/bed1.webp";
import inverterAC from "../images/bed2.webp";
import sunriseClock from "../images/bed3.jpg";
import bedsideLamp from "../images/bed4.webp";
import aromaDiffuser from "../images/bed5.jpg";
import humidifier from "../images/bed6.jpg";
import spaceHeater from "../images/bed7.webp";
import airPurifier from "../images/bed8.jpg";

import API_URL from "../api";
/* =====================================================
   STATIC BEDROOM PRODUCTS
===================================================== */

const staticBedroomProducts = [
  {
    id: "static-1",
    name: "Regalia King Cot",
    tagline: "Majestic wooden design for royal dreams",
    price: 49599,
    rating: 4.8,
    reviews: 87,
    badge: "👑 Royal Comfort",
    image: smartMattress,
    category: "Bedroom",
  },
  {
    id: "static-2",
    name: "Vintage Retreat Chair",
    tagline: "Artisan-crafted wood with timeless elegance",
    price: 4199,
    rating: 4.6,
    reviews: 142,
    badge: "🪵 Handcrafted Charm",
    image: inverterAC,
    category: "Bedroom",
  },
  {
    id: "static-3",
    name: "CloudNest Luxe Mattress",
    tagline: "Sink into restful, orthopedic plush comfort",
    price: 18799,
    rating: 4.4,
    reviews: 231,
    badge: "🌙 Sleep Essential",
    image: sunriseClock,
    category: "Bedroom",
  },
  {
    id: "static-4",
    name: "Nocturne Bedside Library",
    tagline: "Compact elegance with space for nighttime reads",
    price: 7679,
    rating: 4.3,
    reviews: 163,
    badge: "📚 Reader's Pick",
    image: bedsideLamp,
    category: "Bedroom",
  },
  {
    id: "static-5",
    name: "Aurora Queen Bed",
    tagline: "Modern finesse meets serene wooden grace",
    price: 39299,
    rating: 4.5,
    reviews: 98,
    badge: "✨ Minimal Luxe",
    image: aromaDiffuser,
    category: "Bedroom",
  },
  {
    id: "static-6",
    name: "Mirage Sliding Wardrobe",
    tagline: "Sleek storage with smooth-slide elegance",
    price: 18199,
    rating: 4.5,
    reviews: 76,
    badge: "🚪 Space Saver",
    image: humidifier,
    category: "Bedroom",
  },
  {
    id: "static-7",
    name: "TerraNova 4-Door Cabinet",
    tagline: "Elegant walnut finish with quiet confidence",
    price: 12399,
    rating: 4.2,
    reviews: 54,
    badge: "🪞 Smart Storage",
    image: spaceHeater,
    category: "Bedroom",
  },
  {
    id: "static-8",
    name: "Alto Luxe Wardrobe",
    tagline: "Luxury storage redefining modern minimalism",
    price: 21339,
    rating: 4.7,
    reviews: 119,
    badge: "🏆 Bestseller",
    image: airPurifier,
    category: "Bedroom",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Bedroom = () => {
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
    fetchBedroomProducts();
  }, []);

  const fetchBedroomProducts = async () => {
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
       * Only show products belonging to Bedroom.
       *
       * IMPORTANT:
       * Your Admin Panel must save the category as:
       * "Bedroom"
       */

      const bedroomProductsFromBackend =
        products.filter(
          (product) =>
            String(product.category || "")
              .trim()
              .toLowerCase() === "bedroom"
        );

      setBackendProducts(
        bedroomProductsFromBackend
      );

      console.log(
        "Bedroom products from backend:",
        bedroomProductsFromBackend
      );
    } catch (error) {
      console.error(
        "Unable to fetch bedroom products:",
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

  const allBedroomProducts = [
    ...staticBedroomProducts,
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

  const handleQuantityChange = (
    id,
    value
  ) => {
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
    const quantity =
      quantities[product.id] || 1;

    const cartProduct = {
      ...product,

      /*
       * Make sure the price is a number
       * for the cart calculations.
       */
      price: Number(
        String(product.price || 0).replace(
          /₹|,/g,
          ""
        )
      ),
    };

    addToCart(
      cartProduct,
      quantity
    );

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
      (item) => item.id === id
    );
  };

  /* =====================================================
     RATING
  ===================================================== */

  const renderRating = (rating) => {
    const numericRating =
      Number(rating) || 0;

    const fullStars =
      Math.floor(numericRating);

    const hasHalfStar =
      numericRating - fullStars >= 0.5;

    return (
      <>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <FaStar
                key={i}
                color="#f6ad55"
              />
            );
          }

          if (
            i === fullStars &&
            hasHalfStar
          ) {
            return (
              <FaStarHalfAlt
                key={i}
                color="#f6ad55"
              />
            );
          }

          return (
            <FaRegStar
              key={i}
              color="#e2e8f0"
            />
          );
        })}
      </>
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="room-container">

      <h1 className="room-heading">
        Bedroom Comfort Collection 🛏️
      </h1>

      {/* LOADING */}

      {loading && (
        <div className="loading-products">
          <div className="product-loader"></div>
          <p>Loading bedroom products...</p>
        </div>
      )}

      {/* PRODUCTS */}

      {!loading && (
        <div className="room-grid">

          {allBedroomProducts.map(
            (product) => {

              const productId =
                product._id ||
                product.id;

              return (
                <div
                  className="room-card"
                  key={productId}
                >

                  {/* BADGE */}

                  {product.badge && (
                    <span className="room-badge">
                      {product.badge}
                    </span>
                  )}

                  {/* IMAGE */}

                  {product.image ? (
                    <img
                      src={product.image}
                      alt={`Image of ${
                        product.name
                      }`}
                      className="room-image"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="image-placeholder">
                      📦
                    </div>
                  )}

                  {/* NAME */}

                  <h2 className="room-name">
                    {product.name}
                  </h2>

                  {/* TAGLINE */}

                  <p className="room-tagline">
                    {product.tagline ||
                      "Quality products for your home"}
                  </p>

                  {/* PRICE */}

                  <p className="room-price">
                    {formatPrice(
                      product.price
                    )}
                  </p>

                  {/* RATING */}

                  <div
                    className="room-rating"
                    aria-label={`Rating: ${
                      product.rating || 0
                    } of 5`}
                  >

                    {renderRating(
                      product.rating
                    )}

                    <span className="room-rating-number">
                      {Number(
                        product.rating || 0
                      ).toFixed(1)}
                    </span>

                    <span className="room-review">
                      (
                      {product.reviews || 0}
                      {" "}
                      reviews)
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
                      value={
                        quantities[
                          productId
                        ] || 1
                      }
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

                  <div className="room-buttons">

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(
                          product
                        )
                      }
                      className="room-button"
                    >
                      <FaShoppingCart />
                      Add
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleWishlist(
                          product
                        )
                      }
                      className="room-button"
                    >
                      {isInWishlist(
                        productId
                      ) ? (
                        <FaHeart color="red" />
                      ) : (
                        <FaRegHeart />
                      )}

                      Wishlist
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setModalProduct(
                          product
                        )
                      }
                      className="room-button"
                    >
                      <FaEye />
                      View
                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* NO PRODUCTS */}

      {!loading &&
        allBedroomProducts.length === 0 && (
          <div className="empty-products">
            <div>📦</div>
            <h2>
              No bedroom products found
            </h2>
            <p>
              Add a Bedroom product from
              the Admin Panel.
            </p>
          </div>
        )}

      {/* =================================================
          PRODUCT MODAL
      ================================================= */}

      <Modal
        isOpen={!!modalProduct}
        onRequestClose={() =>
          setModalProduct(null)
        }
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >

        {modalProduct && (
          <div className="modal-content">

            {modalProduct.image && (
              <img
                src={modalProduct.image}
                alt={
                  modalProduct.name
                }
                className="modal-image"
              />
            )}

            <h2>
              {modalProduct.name}
            </h2>

            <p>
              {modalProduct.tagline}
            </p>

            <p className="room-price">
              {formatPrice(
                modalProduct.price
              )}
            </p>

            <p>
              ⭐{" "}
              {Number(
                modalProduct.rating || 0
              ).toFixed(1)}
              {" / 5"}
            </p>

            <p>
              {modalProduct.description ||
                "Premium quality product from HavenHaus."}
            </p>

            <button
              type="button"
              onClick={() =>
                setModalProduct(null)
              }
              className="room-button"
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

        .room-container {
          padding: 40px 20px;
          max-width: 1200px;
          margin: auto;
          background: #ffffff;
          min-height: 100vh;
        }

        .room-heading {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 40px;
          color: #574430;
        }

        .room-grid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fit,
              minmax(250px, 1fr)
            );
          gap: 30px;
        }

        .room-card {
          background: #fff;
          border: 1px solid #574430;
          border-radius: 20px;
          padding: 20px;
          text-align: center;
          position: relative;
          box-shadow:
            0 5px 15px
            rgba(0, 0, 0, 0.05);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .room-card:hover {
          transform: translateY(-5px);
          box-shadow:
            0 10px 25px
            rgba(0, 0, 0, 0.1);
        }

        .room-image,
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

        .room-badge {
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

        .room-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #222;
        }

        .room-tagline {
          font-size: 1rem;
          color: #555;
          min-height: 45px;
        }

        .room-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: #574430;
        }

        .room-rating {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin: 10px 0;
          flex-wrap: wrap;
        }

        .room-rating-number {
          font-weight: 600;
          color: #dd6b20;
          font-size: 1rem;
        }

        .room-review {
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

        .room-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }

        .room-button {
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

        .room-button:hover {
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
          background:
            rgba(0, 0, 0, 0.5);
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
          animation:
            bedroom-spin
            0.8s linear infinite;
        }

        @keyframes bedroom-spin {
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

          .room-container {
            padding: 25px 15px;
          }

          .room-heading {
            font-size: 2rem;
          }

          .room-grid {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </div>
  );
};

export default Bedroom;
