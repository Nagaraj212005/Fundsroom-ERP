const prisma = require("../config/prisma");

const include = {
  sale: true,
  product: true,
};

const createSaleItem = async (data) => {
  return prisma.saleItem.create({
    data,
    include,
  });
};

const findAll = async () => {
  return prisma.saleItem.findMany({
    include,
  });
};

const findById = async (id) => {
  return prisma.saleItem.findUnique({
    where: { id },
    include,
  });
};

const updateSaleItem = async (id, data) => {
  return prisma.saleItem.update({
    where: { id },
    data,
    include,
  });
};

const deleteSaleItem = async (id) => {
  return prisma.saleItem.delete({
    where: { id },
  });
};

module.exports = {
  createSaleItem,
  findAll,
  findById,
  updateSaleItem,
  deleteSaleItem,
};
