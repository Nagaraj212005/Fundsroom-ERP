const express = require("express");

const router = express.Router();

const saleController = require("../controllers/sale.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "SALES_USER"),
  saleController.createSale
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "SALES_USER"),
  saleController.getAllSales
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "SALES_USER"),
  saleController.getSaleById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  saleController.updateSale
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  saleController.deleteSale
);

module.exports = router;