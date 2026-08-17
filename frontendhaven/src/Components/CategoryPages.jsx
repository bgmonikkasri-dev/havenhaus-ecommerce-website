import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CategoryPage = () => {
  const { categoryName } = useParams(); // gets 'Bedroom', 'Kitchen', etc. from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("${API_URL}/loginproducts");
        const allProducts = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];

        // Dynamic Filter: matches whatever category is in the URL route
        const filtered = allProducts.filter(
          (item) => item.category?.toLowerCase() === categoryName?.toLowerCase()
        );

        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  return (
    <div className="category-container">
      <h1>{categoryName} Collection</h1>
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found in {categoryName}.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image || "/placeholder.jpg"} alt={product.name} />
              <h3>{product.name}</h3>
              <p>₹{Number(product.price).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;