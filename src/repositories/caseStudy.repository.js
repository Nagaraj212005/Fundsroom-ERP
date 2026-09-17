const prisma = require("../config/prisma");

const includes = {
  inventory: { product: true },
  enquiry: { customer: true, employee: true, items: { include: { product: true } } },
  quotation: { customer: true, employee: true, items: { include: { product: true } }, salesOrder: true },
  salesOrder: { quotation: { include: { items: { include: { product: true } } } }, reservations: { include: { inventory: { include: { product: true } } } }, dispatch: true },
  reservation: { salesOrder: true, inventory: { include: { product: true } } },
  dispatch: { salesOrder: true },
};

const model = (name) => prisma[name];
const findAll = (name) => model(name).findMany({ include: includes[name] });
const findById = (name, id) => model(name).findUnique({ where: { id }, include: includes[name] });
const create = (name, data) => model(name).create({ data, include: includes[name] });
const update = (name, id, data) => model(name).update({ where: { id }, data, include: includes[name] });
const remove = (name, id) => model(name).delete({ where: { id } });

module.exports = { findAll, findById, create, update, remove, prisma };
