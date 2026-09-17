const prisma = require("../config/prisma");

const search = async (resource, query, page, limit, sortBy, sortOrder) => {
  const skip = (page - 1) * limit;
  const orderBy = { [sortBy]: sortOrder };
  const configs = {
    customers: { model: prisma.customer, where: { OR: [{ name: { contains: query, mode: "insensitive" } }, { customerCode: { contains: query, mode: "insensitive" } }] } },
    employees: { model: prisma.employee, where: { OR: [{ employeeCode: { contains: query, mode: "insensitive" } }, { designation: { contains: query, mode: "insensitive" } }] } },
    products: { model: prisma.product, where: { OR: [{ name: { contains: query, mode: "insensitive" } }, { productCode: { contains: query, mode: "insensitive" } }] } },
    sales: { model: prisma.sale, where: { saleNumber: { contains: query, mode: "insensitive" } } },
    quotations: { model: prisma.quotation, where: { quotationNumber: { contains: query, mode: "insensitive" } } },
  };
  const config = configs[resource];
  if (!config) throw new Error("Unsupported search resource.");
  const [data, total] = await prisma.$transaction([config.model.findMany({ where: config.where, skip, take: limit, orderBy }), config.model.count({ where: config.where })]);
  return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const salesReport = () => prisma.sale.findMany({ include: { customer: true, employee: true, items: true }, orderBy: { createdAt: "desc" } });
const customerReport = () => prisma.customer.findMany({ include: { sales: true } });
const inventoryReport = () => prisma.inventory.findMany({ include: { product: true } });
const employeeSalesReport = () => prisma.employee.findMany({ include: { sales: true } });
const revenueReport = () => prisma.sale.aggregate({ _sum: { totalAmount: true }, _count: { id: true } });

module.exports = { search, salesReport, customerReport, inventoryReport, employeeSalesReport, revenueReport };
