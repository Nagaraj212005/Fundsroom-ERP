const prisma = require("../config/prisma");

// Find company by ID
const findCompanyById = async (companyId) => {
  return prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });
};

// Find user by email
const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

// Create new company admin
const createUser = async (userData) => {
  return prisma.user.create({
    data: userData,
  });
};

module.exports = {
  findCompanyById,
  findUserByEmail,
  createUser,
};