const prisma = require("../config/prisma");

const createEmployee = async (data) => {
  return prisma.employee.create({
    data,
    include: {
      company: true,
      department: true,
      user: true,
    },
  });
};

const getAllEmployees = async () => {
  return prisma.employee.findMany({
    include: {
      company: true,
      department: true,
      user: true,
    },
  });
};

const getEmployeeById = async (id) => {
  return prisma.employee.findUnique({
    where: { id },
    include: {
      company: true,
      department: true,
      user: true,
    },
  });
};

const updateEmployee = async (id, data) => {
  return prisma.employee.update({
    where: { id },
    data,
    include: {
      company: true,
      department: true,
      user: true,
    },
  });
};

const deleteEmployee = async (id) => {
  return prisma.employee.delete({
    where: { id },
  });
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};