const companyRepository = require("../repositories/company.repository");
const auditService = require("./audit.service");

const createCompany = async (companyData, userId) => {
  if (
    new Date(companyData.agreementStart) >=
    new Date(companyData.agreementEnd)
  ) {
    throw new Error("Agreement end date must be after the start date.");
  }

  const company = await companyRepository.createCompany(companyData);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "CREATE",
      "Company",
      company.id
    );
  }

  return company;
};

const getCompanies = async () => {
  return await companyRepository.getCompanies();
};

const getCompanyById = async (id) => {
  return await companyRepository.getCompanyById(id);
};

const updateCompany = async (id, companyData, userId) => {
  if (
    companyData.agreementStart &&
    companyData.agreementEnd &&
    new Date(companyData.agreementStart) >=
    new Date(companyData.agreementEnd)
  ) {
    throw new Error("Agreement end date must be after the start date.");
  }

  const company = await companyRepository.updateCompany(id, companyData);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "UPDATE",
      "Company",
      company.id
    );
  }

  return company;
};

const deleteCompany = async (id, userId) => {
  await companyRepository.deleteCompany(id);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "DELETE",
      "Company",
      id
    );
  }

  return true;
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};