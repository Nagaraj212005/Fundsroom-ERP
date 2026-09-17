const prisma = require("../config/prisma");

const createProduct = async (data) => {
  return prisma.product.create({
    data,
  });
};

const getProducts = async () => {
  return prisma.product.findMany({
    include: {
      company: true,
    },
  });
};

const getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      company: true,
    },
  });
};

const updateProduct = async (id, data) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

const deleteProduct = async (id) => {
  return prisma.product.delete({
    where: { id },
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};