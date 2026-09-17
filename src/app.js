const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth.routes");
const companyRoutes = require("./routes/company.routes");
const userRoutes = require("./routes/user.routes");
const departmentRoutes = require("./routes/department.routes");
const employeeRoutes = require("./routes/employee.routes");
const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const leadRoutes = require("./routes/lead.routes");
const saleRoutes = require("./routes/sale.routes");
const saleItemRoutes = require("./routes/saleItem.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const auditRoutes = require("./routes/audit.routes");
const caseStudyRoutes = require("./routes/caseStudy.routes");
const reportRoutes = require("./routes/report.routes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FundsRoom ERP API is running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/sale-items", saleItemRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api", caseStudyRoutes);
app.use("/api/reports", reportRoutes);

module.exports = app;