require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const sendAdminNotification = require("./Mailer");

const app = express();

// =====================================================
// CONFIG
// =====================================================

const PORT = process.env.PORT || 8082;

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/havenhaus";

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

mongoose.connection.on("error", (error) => {
  console.error("❌ MongoDB error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

// =====================================================
// USER SCHEMA
// =====================================================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

// =====================================================
// CONTACT SCHEMA
// =====================================================

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

// =====================================================
// PRODUCT SCHEMA
// =====================================================

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    brand: {
      type: String,
      default: "HavenHaus",
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    bestSeller: {
      type: Boolean,
      default: false,
    },

    offer: {
      type: Boolean,
      default: false,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

// =====================================================
// ORDER ITEM SCHEMA
// =====================================================

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// ORDER SCHEMA
// =====================================================

const orderSchema = new mongoose.Schema(
  {
    // ==========================================
    // CUSTOMER DETAILS
    // ==========================================
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // ORDER DETAILS
    // ==========================================
    items: {
      type: [orderItemSchema],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    gst: {
      type: Number,
      required: true,
    },

    shipping: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "cod"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

// =====================================================
// HELPER - VALIDATE OBJECT ID
// =====================================================

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
  res.status(200).send("HavenHaus backend is up!");
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HavenHaus API is running",
    database:
      mongoose.connection.readyState === 1
        ? "MongoDB connected"
        : "MongoDB disconnected",
  });
});

// =====================================================
// AUTH - SIGNUP
// =====================================================

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Provide name, email & password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("❌ Signup error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// =====================================================
// AUTH - LOGIN
// =====================================================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const loggedInUser = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    if (typeof sendAdminNotification === "function") {
      sendAdminNotification(loggedInUser).catch((error) => {
        console.error("❌ Mailer error:", error);
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: loggedInUser,
    });
  } catch (error) {
    console.error("❌ Login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =====================================================
// RESET PASSWORD
// =====================================================

app.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Provide email & newPassword",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =====================================================
// CONTACT
// =====================================================

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Message received",
      id: contact._id,
    });
  } catch (error) {
    console.error("❌ Contact error:", error);

    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
});

// =====================================================
// ================= PRODUCT APIs ======================
// =====================================================

app.get("/products", async (req, res) => {
  try {
    const { category, featured, bestSeller, offer } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (bestSeller !== undefined) {
      filter.bestSeller = bestSeller === "true";
    }

    if (offer !== undefined) {
      filter.offer = offer === "true";
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("❌ Client products error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("❌ Client single product error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch product",
    });
  }
});

app.get("/admin/products", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("❌ Admin get products error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
});

app.get("/admin/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("❌ Get product error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch product",
    });
  }
});

app.post("/admin/products", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      stock,
      brand,
      rating,
      featured,
      bestSeller,
      offer,
      discount,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product name and price are required",
      });
    }

    const product = await Product.create({
      name: String(name).trim(),
      description: description || "",
      price: Number(price),
      category: category || "General",
      image: image || "",
      stock: Number(stock) || 0,
      brand: brand || "HavenHaus",
      rating: Number(rating) || 0,
      featured: Boolean(featured),
      bestSeller: Boolean(bestSeller),
      offer: Boolean(offer),
      discount: Number(discount) || 0,
    });

    console.log(`✅ Product created: ${product._id}`);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Create product error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create product",
    });
  }
});

async function updateProduct(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const updateData = { ...req.body };

    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }

    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
    }

    if (updateData.rating !== undefined) {
      updateData.rating = Number(updateData.rating);
    }

    if (updateData.discount !== undefined) {
      updateData.discount = Number(updateData.discount);
    }

    if (updateData.name !== undefined) {
      updateData.name = String(updateData.name).trim();
    }

    if (updateData.category !== undefined) {
      updateData.category = String(updateData.category).trim();
    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    console.log(`✅ Product ${id} updated`);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Update product error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update product",
    });
  }
}

app.put("/admin/products/:id", updateProduct);
app.patch("/admin/products/:id", updateProduct);

app.delete("/admin/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const deletedProduct =
      await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    console.log(`🗑️ Product ${id} deleted`);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete product error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete product",
    });
  }
});

// =====================================================
// ==================== ORDER APIs =====================
// =====================================================

app.post("/admin/orders", async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      address,
      items,
      subtotal,
      discount,
      gst,
      shipping,
      totalAmount,
      paymentMethod,
      status,
    } = req.body;

    if (!customerName || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Customer name, phone, and address are required",
      });
    }

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    const order = await Order.create({
      customerName: String(customerName).trim(),
      email: email ? String(email).trim() : "",
      phone: String(phone).trim(),
      address: String(address).trim(),
      items,
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      gst: Number(gst) || 0,
      shipping: Number(shipping) || 0,
      totalAmount: Number(totalAmount) || 0,
      paymentMethod,
      status: status || "Pending",
    });

    console.log(`✅ Order created: ${order._id}`);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,
      order,
    });
  } catch (error) {
    console.error("❌ Order creation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create order",
    });
  }
});

app.get("/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("❌ Get orders error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
    });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("❌ Customer orders error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
    });
  }
});

app.get("/admin/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("❌ Get order error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch order",
    });
  }
});

async function updateOrder(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (
      req.body.status &&
      !allowedStatuses.includes(req.body.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const updatedOrder =
      await Order.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log(`✅ Order ${id} updated`);

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Update order error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update order",
    });
  }
}

app.put("/admin/orders/:id", updateOrder);
app.patch("/admin/orders/:id", updateOrder);

app.patch(
  "/admin/orders/:id/status",
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });
      }

      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      const updatedOrder =
        await Order.findByIdAndUpdate(
          id,
          { status },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      console.log(
        `✅ Order ${id} status changed to ${status}`
      );

      res.status(200).json({
        success: true,
        message: "Order status updated",
        order: updatedOrder,
      });
    } catch (error) {
      console.error(
        "❌ Update order status error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Unable to update order status",
      });
    }
  }
);

app.delete("/admin/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const deletedOrder =
      await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log(`🗑️ Order ${id} deleted`);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete order error:", error);

    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
});

// =====================================================
// ===================== USER APIs =====================
// =====================================================

app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find(
      {},
      {
        password: 0,
      }
    ).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("❌ Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
});

app.get("/admin/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(
      id,
      {
        password: 0,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("❌ Get user error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch user",
    });
  }
});

async function updateUser(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const updateData = {};

    if (req.body.name !== undefined) {
      updateData.name = String(
        req.body.name
      ).trim();
    }

    if (req.body.email !== undefined) {
      updateData.email = String(
        req.body.email
      )
        .trim()
        .toLowerCase();
    }

    const updatedUser =
      await User.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
          select: "-password",
        }
      );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(`✅ User ${id} updated`);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Update user error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to update user",
    });
  }
}

app.put("/admin/users/:id", updateUser);
app.patch("/admin/users/:id", updateUser);

app.delete("/admin/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const deletedUser =
      await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(`🗑️ User ${id} deleted`);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete user error:", error);

    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
});

// =====================================================
// ================== CONTACT APIs =====================
// =====================================================

app.get("/admin/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("❌ Get contacts error:", error);

    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
});

app.delete(
  "/admin/contacts/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid contact ID",
        });
      }

      const deletedContact =
        await Contact.findByIdAndDelete(id);

      if (!deletedContact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        });
      }

      console.log(`🗑️ Contact ${id} deleted`);

      res.status(200).json({
        success: true,
        message: "Contact deleted successfully",
      });
    } catch (error) {
      console.error(
        "❌ Delete contact error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Database error",
      });
    }
  }
);

app.put("/admin/contacts/:id", async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.json({ success: true, contact: updatedContact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  console.log(
    `❌ 404 - ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error(
    "❌ Unhandled server error:",
    error
  );

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log("");
  console.log("======================================");
  console.log("🏠 HAVENHAUS BACKEND");
  console.log("======================================");
  console.log(
    `🌐 Server: http://localhost:${PORT}`
  );
  console.log(
    `❤️ Health: http://localhost:${PORT}/api/health`
  );
  console.log(
    `🛍️ Client Products: http://localhost:${PORT}/products`
  );
  console.log(
    `📦 Admin Products: http://localhost:${PORT}/admin/products`
  );
  console.log(
    `🛒 Admin Orders: http://localhost:${PORT}/admin/orders`
  );
  console.log(
    `👤 Admin Users: http://localhost:${PORT}/admin/users`
  );
  console.log(
    `📩 Admin Contacts: http://localhost:${PORT}/admin/contacts`
  );
  console.log("======================================");
  console.log("");
});