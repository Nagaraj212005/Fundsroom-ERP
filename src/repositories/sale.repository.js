const prisma = require("../config/prisma");

const createSale = async (data) => {
  return prisma.sale.create({
    data,
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
};

const findAll = async () => {
  return prisma.sale.findMany({
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
};

const findById = async (id) => {
  return prisma.sale.findUnique({
    where: { id },
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
};

const updateSale = async (id, data) => {
  return prisma.sale.update({
    where: { id },
    data,
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
};

const deleteSale = async (id) => {
  return prisma.sale.delete({
    where: { id },
  });
};

module.exports = {
  createSale,
  findAll,
  findById,
  updateSale,
  deleteSale,
};