const repository = require("../repositories/report.repository");

const search = (resource, query = "", page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc") => {
  const parsedPage = Math.max(1, Number(page));
  const parsedLimit = Math.min(100, Math.max(1, Number(limit)));
  if (!/^[a-zA-Z0-9_]+$/.test(sortBy) || !["asc", "desc"].includes(sortOrder)) throw new Error("Invalid sorting options.");
  return repository.search(resource, query, parsedPage, parsedLimit, sortBy, sortOrder);
};

module.exports = {
  search,
  getSalesReport: repository.salesReport,
  getCustomerReport: repository.customerReport,
  getInventoryReport: repository.inventoryReport,
  getEmployeeSalesReport: repository.employeeSalesReport,
  getRevenueReport: repository.revenueReport,
};
