const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const controller = require("../controllers/caseStudy.controller");

const router = express.Router();
const admin = [authMiddleware, roleMiddleware("ADMIN")];
const access = [authMiddleware, roleMiddleware("ADMIN", "SALES_USER")];

const registerCrud = (path, name, middleware) => {
  router.post(path, ...middleware, controller.create(name));
  router.get(path, ...access, controller.getAll(name));
  router.get(`${path}/:id`, ...access, controller.getById(name));
  router.put(`${path}/:id`, ...admin, controller.update(name));
  router.delete(`${path}/:id`, ...admin, controller.remove(name));
};

registerCrud("/inventory", "inventory", admin);
registerCrud("/enquiries", "enquiry", access);
registerCrud("/quotations", "quotation", access);
registerCrud("/sales-orders", "salesOrder", access);
registerCrud("/inventory-reservations", "reservation", access);
registerCrud("/dispatches", "dispatch", admin);

module.exports = router;
