const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/department.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Create Department
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  departmentController.createDepartment
);

// Get All Departments
router.get(
  "/",
  authMiddleware,
  departmentController.getDepartments
);

// Get Department By ID
router.get(
  "/:id",
  authMiddleware,
  departmentController.getDepartmentById
);

// Update Department
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  departmentController.updateDepartment
);

// Delete Department
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  departmentController.deleteDepartment
);

module.exports = router;