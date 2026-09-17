const express = require("express");

const router = express.Router();

const saleItemController = require("../controllers/saleItem.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "SALES_USER"),
  saleItemController.createSaleItem
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "SALES_USER"),
  saleItemController.getAllSaleItems
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "SALES_USER"),
  saleItemController.getSaleItemById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  saleItemController.updateSaleItem
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  saleItemController.deleteSaleItem
);

module.exports = router;
