const saleItemRepository = require("../repositories/saleItem.repository");
const saleRepository = require("../repositories/sale.repository");
const productRepository = require("../repositories/product.repository");
const auditService = require("./audit.service");

const validateItem = async (data, existingItem = null) => {
  const saleId = data.saleId || existingItem?.saleId;
  const productId = data.productId || existingItem?.productId;
  const quantity = data.quantity ?? existingItem?.quantity;
  const price = data.price ?? existingItem?.price;

  if (!saleId) {
    throw new Error("Sale is required.");
  }

  if (!productId) {
    throw new Error("Product is required.");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }

  if (typeof price !== "number" || price < 0) {
    throw new Error("Price must be greater than or equal to zero.");
  }

  const sale = await saleRepository.findById(saleId);
  if (!sale) {
    throw new Error("Sale not found.");
  }

  const product = await productRepository.getProductById(productId);
  if (!product) {
    throw new Error("Product not found.");
  }

  return {
    saleId,
    productId,
    quantity,
    price,
    subtotal: quantity * price,
  };
};

const createSaleItem = async (data, userId) => {
  const itemData = await validateItem(data);
  const saleItem = await saleItemRepository.createSaleItem(itemData);

  await auditService.createAuditLog(userId, "CREATE", "SaleItem", saleItem.id);

  return saleItem;
};

const getAllSaleItems = async () => {
  return saleItemRepository.findAll();
};

const getSaleItemById = async (id) => {
  return saleItemRepository.findById(id);
};

const updateSaleItem = async (id, data, userId) => {
  const existingItem = await saleItemRepository.findById(id);
  if (!existingItem) {
    throw new Error("SaleItem not found.");
  }

  const itemData = await validateItem(data, existingItem);
  const saleItem = await saleItemRepository.updateSaleItem(id, itemData);

  await auditService.createAuditLog(userId, "UPDATE", "SaleItem", saleItem.id);

  return saleItem;
};

const deleteSaleItem = async (id, userId) => {
  const existingItem = await saleItemRepository.findById(id);
  if (!existingItem) {
    throw new Error("SaleItem not found.");
  }

  await saleItemRepository.deleteSaleItem(id);
  await auditService.createAuditLog(userId, "DELETE", "SaleItem", id);

  return true;
};

module.exports = {
  createSaleItem,
  getAllSaleItems,
  getSaleItemById,
  updateSaleItem,
  deleteSaleItem,
};
