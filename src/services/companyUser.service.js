const bcrypt = require("bcrypt");

const companyUserRepository = require("../repositories/companyUser.repository");

// Create Company Admin
const createCompanyAdmin = async (userData) => {
  const { fullName, email, password, companyId } = userData;

  // Check if company exists
  const company = await companyUserRepository.findCompanyById(companyId);

  if (!company) {
    throw new Error("Company not found.");
  }

  // Check if email already exists
  const existingUser = await companyUserRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create admin user
  return companyUserRepository.createUser({
    fullName,
    email,
    passwordHash,
    role: "ADMIN",
    companyId,
  });
};

module.exports = {
  createCompanyAdmin,
};