const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

const CategorySchema = new mongoose.Schema({
  name: String,
  description: String,
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: Date,
  status: String,
});

const OrderDetailSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  price: Number,
});

// Crear los modelos
const Product = mongoose.model("Product", ProductSchema);
const Category = mongoose.model("Category", CategorySchema);
const User = mongoose.model("User", UserSchema);
const Order = mongoose.model("Order", OrderSchema);
const OrderDetail = mongoose.model("OrderDetail", OrderDetailSchema);

module.exports = mongoose.model = {
  Product,
  Category,
  User,
  Order,
  OrderDetail,
};
