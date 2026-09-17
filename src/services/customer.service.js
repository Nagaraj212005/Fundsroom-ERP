const customerRepository = require("../repositories/customer.repository");
const companyRepository = require("../repositories/company.repository");
const auditService = require("./audit.service");

const createCustomer = async (data, userId) => {
  const company = await companyRepository.findCompanyById(data.companyId);

  if (!company) {
    throw new Error("Company not found.");
  }

  const customer = await customerRepository.createCustomer(data);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "CREATE",
      "Customer",
      customer.id
    );
  }

  return customer;
};

const getCustomers = async () => {
  return await customerRepository.getCustomers();
};

const getCustomerById = async (id) => {
  return await customerRepository.getCustomerById(id);
};

const updateCustomer = async (id, data, userId) => {
  const customer = await customerRepository.updateCustomer(id, data);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "UPDATE",
      "Customer",
      customer.id
    );
  }

  return customer;
};

const deleteCustomer = async (id, userId) => {
  await customerRepository.deleteCustomer(id);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "DELETE",
      "Customer",
      id
    );
  }

  return true;
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};