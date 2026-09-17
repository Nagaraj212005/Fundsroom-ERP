const bcrypt = require("bcrypt");
const userRepository = require("../repositories/user.repository");
const companyRepository = require("../repositories/company.repository");

const createUser = async (userData) => {
  const { fullName, email, password, role, companyId } = userData;

  // Check if email already exists
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  // Check if company exists
  const company = await companyRepository.getCompanyById(companyId);

  if (!company) {
    throw new Error("Company not found.");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  return await userRepository.createUser({
    fullName,
    email,
    passwordHash,
    role,
    companyId,
  });
};

const getAllUsers = async () => {
  return userRepository.getAllUsers();
};

module.exports = {
  createUser,
  getAllUsers,
};