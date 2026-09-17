const employeeRepository = require("../repositories/employee.repository");
const companyRepository = require("../repositories/company.repository");
const departmentRepository = require("../repositories/department.repository");
const userRepository = require("../repositories/user.repository");
const auditService = require("./audit.service");

const createEmployee = async (data, userId) => {
  if (!data.companyId) {
    throw new Error("Company ID is required.");
  }

  if (!data.departmentId) {
    throw new Error("Department ID is required.");
  }

  if (!data.userId) {
    throw new Error("User ID is required.");
  }

  const company = await companyRepository.getCompanyById(data.companyId);
  if (!company) {
    throw new Error("Company not found.");
  }

  const department = await departmentRepository.getDepartmentById(data.departmentId);
  if (!department) {
    throw new Error("Department not found.");
  }

  if (department.companyId !== data.companyId) {
    throw new Error("Department does not belong to the selected company.");
  }

  const user = await userRepository.findById(data.userId);
  if (!user) {
    throw new Error("User not found.");
  }

  if (user.companyId && user.companyId !== data.companyId) {
    throw new Error("User does not belong to the selected company.");
  }

  const employee = await employeeRepository.createEmployee(data);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "CREATE",
      "Employee",
      employee.id
    );
  }

  return employee;
};

const getAllEmployees = async () => {
  return await employeeRepository.getAllEmployees();
};

const getEmployeeById = async (id) => {
  return await employeeRepository.getEmployeeById(id);
};

const updateEmployee = async (id, data, userId) => {
  const employee = await employeeRepository.updateEmployee(id, data);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "UPDATE",
      "Employee",
      employee.id
    );
  }

  return employee;
};

const deleteEmployee = async (id, userId) => {
  await employeeRepository.deleteEmployee(id);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "DELETE",
      "Employee",
      id
    );
  }

  return true;
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};