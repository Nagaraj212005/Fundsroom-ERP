const express = require("express");
const router = express.Router();

const auditController = require("../controllers/audit.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  auditController.getAllAuditLogs
);

module.exports = router;