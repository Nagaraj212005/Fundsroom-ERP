const prisma = require("../config/prisma");

const findByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email }
    });
};

const findById = async (id) => {
    return prisma.user.findUnique({
        where: { id }
    });
};

const createUser = async (data) => {
    return prisma.user.create({
        data
    });
};

const getAllUsers = async () => {
  return prisma.user.findMany();
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  getAllUsers,
};