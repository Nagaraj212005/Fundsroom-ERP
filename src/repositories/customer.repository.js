const prisma = require("../config/prisma");

const createCustomer = async (data) => {
  return prisma.customer.create({
    data,
  });
};

const getCustomers = async () => {
  return prisma.customer.findMany({
    include: {
      company: true,
    },
  });
};

const getCustomerById = async (id) => {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      company: true,
    },
  });
};

const updateCustomer = async (id, data) => {
  return prisma.customer.update({
    where: { id },
    data,
  });
};

const deleteCustomer = async (id) => {
  return prisma.customer.delete({
    where: { id },
  });
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};