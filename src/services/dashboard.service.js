const prisma = require("../config/prisma");

const getDashboard = async () => {
  const totalCompanies = await prisma.company.count();
  const totalDepartments = await prisma.department.count();
  const totalUsers = await prisma.user.count();
  const totalEmployees = await prisma.employee.count();
  const totalCustomers = await prisma.customer.count();
  const totalProducts = await prisma.product.count();
  const totalLeads = await prisma.lead.count();
  const totalSales = await prisma.sale.count();

  const totalRevenue = await prisma.sale.aggregate({
    _sum: {
      totalAmount: true,
    },
  });

  return {
    totalCompanies,
    totalDepartments,
    totalUsers,
    totalEmployees,
    totalCustomers,
    totalProducts,
    totalLeads,
    totalSales,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
  };
};

module.exports = {
  getDashboard,
};