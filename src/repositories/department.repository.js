const prisma = require("../config/prisma");

const createDepartment = async (departmentData) => {
  return prisma.department.create({
    data: departmentData,
  });
};

const getDepartments = async () => {
  return prisma.department.findMany({
    include: {
      company: true,
    },
  });
};

const getDepartmentById = async (id) => {
  return prisma.department.findUnique({
    where: { id },
    include: {
      company: true,
    },
  });
};

const updateDepartment = async (id, departmentData) => {
  return prisma.department.update({
    where: { id },
    data: departmentData,
  });
};

const deleteDepartment = async (id) => {
  return prisma.department.delete({
    where: { id },
  });
};

const getDepartmentByNameAndCompany = async (name, companyId) => {
  return prisma.department.findFirst({
    where: {
      name,
      companyId,
    },
  });
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  getDepartmentByNameAndCompany,
  updateDepartment,
  deleteDepartment,
};