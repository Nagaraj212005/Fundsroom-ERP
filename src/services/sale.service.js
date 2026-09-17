const prisma = require("../config/prisma");

const saleRepository = require("../repositories/sale.repository");
const customerRepository = require("../repositories/customer.repository");
const employeeRepository = require("../repositories/employee.repository");
const productRepository = require("../repositories/product.repository");
const auditService = require("./audit.service");

const createSale = async (data, userId) => {
  const items = data.items || [];

  if (items.length === 0 && (typeof data.totalAmount !== "number" || data.totalAmount < 0)) {
    throw new Error("Total amount must be greater than or equal to zero.");
  }

  // Check Customer
  const customer = await customerRepository.getCustomerById(data.customerId);

  if (!customer) {
    throw new Error("Customer not found.");
  }

  // Check Employee
  const employee = await employeeRepository.getEmployeeById(data.employeeId);

  if (!employee) {
    throw new Error("Employee not found.");
  }

  // Calculate Total Amount
  let totalAmount = items.length === 0 ? data.totalAmount : 0;

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Quantity must be greater than zero.");
    }

    const product = await productRepository.getProductById(item.productId);

    if (!product) {
      throw new Error(`Product ${item.productId} not found.`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`${product.name} is out of stock.`);
    }

    item.price = product.price;
    item.subtotal = product.price * item.quantity;

    totalAmount += item.subtotal;
  }

  const sale = await prisma.$transaction(async (tx) => {
    // Create Sale
    const createdSale = await tx.sale.create({
      data: {
        saleNumber: data.saleNumber,
        customerId: data.customerId,
        employeeId: data.employeeId,
        totalAmount,

        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          })),
        },
      },

      include: {
        customer: true,
        employee: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Reduce Product Stock
    for (const item of items) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return createdSale;
  });

  // Create Audit Log
  await auditService.createAuditLog(userId, "CREATE", "Sale", sale.id);

  return sale;
};

const getAllSales = async () => {
  return await saleRepository.findAll();
};

const getSaleById = async (id) => {
  return await saleRepository.findById(id);
};

const updateSale = async (id, data, userId) => {
  const existingSale = await saleRepository.findById(id);
  if (!existingSale) {
    throw new Error("Sale not found.");
  }

  if (data.customerId) {
    const customer = await customerRepository.getCustomerById(data.customerId);
    if (!customer) {
      throw new Error("Customer not found.");
    }
  }

  if (data.employeeId) {
    const employee = await employeeRepository.getEmployeeById(data.employeeId);
    if (!employee) {
      throw new Error("Employee not found.");
    }
  }

  if (data.totalAmount !== undefined &&
      (typeof data.totalAmount !== "number" || data.totalAmount < 0)) {
    throw new Error("Total amount must be greater than or equal to zero.");
  }

  const sale = await saleRepository.updateSale(id, data);

  await auditService.createAuditLog(userId, "UPDATE", "Sale", sale.id);

  return sale;
};

const deleteSale = async (id, userId) => {
  const existingSale = await saleRepository.findById(id);
  if (!existingSale) {
    throw new Error("Sale not found.");
  }

  await saleRepository.deleteSale(id);

  await auditService.createAuditLog(userId, "DELETE", "Sale", id);

  return true;
};

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
};