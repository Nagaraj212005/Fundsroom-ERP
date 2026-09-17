const departmentRepository = require("../repositories/department.repository");
const companyRepository = require("../repositories/company.repository");
const auditService = require("./audit.service");

const createDepartment = async (data, userId) => {
  const { name, companyId } = data;

  const company = await companyRepository.getCompanyById(companyId);

  if (!company) {
    throw new Error("Company not found.");
  }

  const existingDepartment =
    await departmentRepository.getDepartmentByNameAndCompany(name, companyId);

  if (existingDepartment) {
    throw new Error("Department already exists.");
  }

  const department = await departmentRepository.createDepartment({
    name,
    companyId,
  });

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "CREATE",
      "Department",
      department.id
    );
  }

  return department;
};

const getDepartments = async () => {
  return await departmentRepository.getDepartments();
};

const getDepartmentById = async (id) => {
  return await departmentRepository.getDepartmentById(id);
};

const updateDepartment = async (id, data, userId) => {
  const department = await departmentRepository.updateDepartment(id, data);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "UPDATE",
      "Department",
      department.id
    );
  }

  return department;
};

const deleteDepartment = async (id, userId) => {
  await departmentRepository.deleteDepartment(id);

  if (userId) {
    await auditService.createAuditLog(
      userId,
      "DELETE",
      "Department",
      id
    );
  }

  return true;
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};