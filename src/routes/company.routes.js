const express = require("express");
const router = express.Router();

const companyController = require("../controllers/company.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Create Company
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  companyController.createCompany
);

// Get All Companies
router.get(
  "/",
  authMiddleware,
  companyController.getCompanies
);

// Get Company By ID
router.get(
  "/:id",
  authMiddleware,
  companyController.getCompanyById
);

// Update Company
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  companyController.updateCompany
);

// Delete Company
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  companyController.deleteCompany
);

module.exports = router;