const express = require("express");

const router = express.Router();

const leadController = require("../controllers/lead.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Create Lead (Admin & Sales User)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "SALES_USER"),
  leadController.createLead
);

// Get All Leads
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "SALES_USER"),
  leadController.getAllLeads
);

// Get Lead By ID
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "SALES_USER"),
  leadController.getLeadById
);

// Update Lead
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "SALES_USER"),
  leadController.updateLead
);

// Delete Lead (Admin Only)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  leadController.deleteLead
);

module.exports = router;