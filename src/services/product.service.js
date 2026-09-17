const productRepository = require("../repositories/product.repository");
const companyRepository = require("../repositories/company.repository");
const auditService = require("./audit.service");

const createProduct = async (data, userId) => {
  const company = await companyRepository.findCompanyById(data.companyId);

  if (!company) {
    throw new Error("Company not found.");
  }

  const product = await productRepository.createProduct(data);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "CREATE",
      "Product",
      product.id
    );
  }

  return product;
};

const getProducts = async () => {
  return await productRepository.getProducts();
};

const getProductById = async (id) => {
  return await productRepository.getProductById(id);
};

const updateProduct = async (id, data, userId) => {
  const product = await productRepository.updateProduct(id, data);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "UPDATE",
      "Product",
      product.id
    );
  }

  return product;
};

const deleteProduct = async (id, userId) => {
  await productRepository.deleteProduct(id);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "DELETE",
      "Product",
      id
    );
  }

  return true;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};