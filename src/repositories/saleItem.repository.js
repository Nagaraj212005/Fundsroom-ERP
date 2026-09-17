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

const createSaleItemWithStock = async (data) => {
  return prisma.$transaction(async (tx) => {
    const stockUpdate = await tx.product.updateMany({
      where: { id: data.productId, stock: { gte: data.quantity } },
      data: { stock: { decrement: data.quantity } },
    });

    if (stockUpdate.count !== 1) {
      throw new Error("Insufficient product stock.");
    }

    return tx.saleItem.create({
      data,
      include,
    });
  });
};

const updateSaleItemWithStock = async (id, data) => {
  return prisma.$transaction(async (tx) => {
    const existingItem = await tx.saleItem.findUnique({ where: { id } });
    if (!existingItem) {
      throw new Error("SaleItem not found.");
    }

    if (existingItem.productId === data.productId) {
      const quantityDelta = data.quantity - existingItem.quantity;
      if (quantityDelta > 0) {
        const stockUpdate = await tx.product.updateMany({
          where: { id: data.productId, stock: { gte: quantityDelta } },
          data: { stock: { decrement: quantityDelta } },
        });
        if (stockUpdate.count !== 1) {
          throw new Error("Insufficient product stock.");
        }
      } else if (quantityDelta < 0) {
        await tx.product.update({
          where: { id: data.productId },
          data: { stock: { increment: Math.abs(quantityDelta) } },
        });
      }
    } else {
      await tx.product.update({
        where: { id: existingItem.productId },
        data: { stock: { increment: existingItem.quantity } },
      });
      const stockUpdate = await tx.product.updateMany({
        where: { id: data.productId, stock: { gte: data.quantity } },
        data: { stock: { decrement: data.quantity } },
      });
      if (stockUpdate.count !== 1) {
        throw new Error("Insufficient product stock.");
      }
    }

    return tx.saleItem.update({ where: { id }, data, include });
  });
};

const deleteSaleItemWithStock = async (id) => {
  return prisma.$transaction(async (tx) => {
    const item = await tx.saleItem.findUnique({ where: { id } });
    if (!item) {
      throw new Error("SaleItem not found.");
    }
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
    return tx.saleItem.delete({ where: { id } });
  });
};

module.exports = {
  createSaleItem,
  findAll,
  findById,
  updateSaleItem,
  deleteSaleItem,
  createSaleItemWithStock,
  updateSaleItemWithStock,
  deleteSaleItemWithStock,
};
