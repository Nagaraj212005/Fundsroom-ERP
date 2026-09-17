const prisma = require("../config/prisma");

const createAuditLog = async (data) => {
  return prisma.auditLog.create({
    data,
  });
};

const findAll = async () => {
  return prisma.auditLog.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

module.exports = {
  createAuditLog,
  findAll,
};