const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employee.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Create Employee
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  employeeController.createEmployee
);

// Get All Employees
router.get("/", authMiddleware, employeeController.getAllEmployees);

// Get Employee By ID
router.get("/:id", authMiddleware, employeeController.getEmployeeById);

// Update Employee
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  employeeController.updateEmployee
);

// Delete Employee
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  employeeController.deleteEmployee
);

module.exports = router;