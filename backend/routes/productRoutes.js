import express from "express";
import {
  createProduct,
  getProductsByUser,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const productRoutes = express.Router();

// CREATE product
productRoutes.route("/createProduct").post(createProduct);

// GET products by user
productRoutes.route("/user/:userId").get(getProductsByUser);

// UPDATE product
productRoutes.route("/updateProduct/:id").put(updateProduct);

// DELETE product
productRoutes.route("/deleteProduct/:id").delete(deleteProduct);

export default productRoutes;
console.log("Loaded productController:", createProduct?.name);
