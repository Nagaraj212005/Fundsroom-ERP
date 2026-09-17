const express = require("express");

const router = express.Router();

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  productController.createProduct
);

router.get("/", authMiddleware, productController.getProducts);

router.get("/:id", authMiddleware, productController.getProductById);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  productController.deleteProduct
);

module.exports = router;