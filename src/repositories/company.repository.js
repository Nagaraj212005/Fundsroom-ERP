const prisma = require("../config/prisma");

const createCompany = async (companyData) => {
  return prisma.company.create({
    data: companyData,
  });
};

const getCompanies = async () => {
  return prisma.company.findMany();
};

const getCompanyById = async (id) => {
  return prisma.company.findUnique({
    where: { id },
  });
};

const findCompanyById = async (id) => {
  return prisma.company.findUnique({
    where: { id },
  });
};

const updateCompany = async (id, companyData) => {
  return prisma.company.update({
    where: { id },
    data: companyData,
  });
};

const deleteCompany = async (id) => {
  return prisma.company.delete({
    where: { id },
  });
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  findCompanyById,
  updateCompany,
  deleteCompany,
};