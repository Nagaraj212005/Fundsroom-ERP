const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const controller = require("../controllers/report.controller");

const router = express.Router();
router.use(authMiddleware);
router.get("/search/:resource", controller.search);
router.get("/sales", controller.report("getSalesReport"));
router.get("/customers", controller.report("getCustomerReport"));
router.get("/inventory", controller.report("getInventoryReport"));
router.get("/employee-sales", controller.report("getEmployeeSalesReport"));
router.get("/revenue", controller.report("getRevenueReport"));
module.exports = router;
