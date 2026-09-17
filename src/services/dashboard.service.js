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
  const inventoryCount = await prisma.inventory.count();
  const pendingQuotations = await prisma.quotation.count({ where: { status: { in: ["DRAFT", "SENT"] } } });
  const pendingOrders = await prisma.salesOrder.count({ where: { status: { in: ["CREATED", "RESERVED"] } } });
  const reservedInventory = await prisma.inventory.aggregate({ _sum: { reservedQuantity: true } });
  const dispatchedOrders = await prisma.salesOrder.count({ where: { status: "DISPATCHED" } });

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
    inventoryCount,
    pendingQuotations,
    pendingOrders,
    reservedInventory: reservedInventory._sum.reservedQuantity || 0,
    dispatchedOrders,
  };
};

module.exports = {
  getDashboard,
};