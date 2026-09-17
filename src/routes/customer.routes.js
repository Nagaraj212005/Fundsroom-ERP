const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customer.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Create customer (ADMIN only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  customerController.createCustomer
);

// Get all customers
router.get(
  "/",
  authMiddleware,
  customerController.getCustomers
);

// Get customer by ID
router.get(
  "/:id",
  authMiddleware,
  customerController.getCustomerById
);

// Update customer
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  customerController.updateCustomer
);

// Delete customer
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  customerController.deleteCustomer
);

module.exports = router;