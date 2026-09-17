const repository = require("../repositories/caseStudy.repository");
const auditService = require("./audit.service");

const definitions = {
  inventory: { model: "inventory", resource: "Inventory" },
  enquiry: { model: "enquiry", resource: "Enquiry" },
  quotation: { model: "quotation", resource: "Quotation" },
  salesOrder: { model: "salesOrder", resource: "SalesOrder" },
  reservation: { model: "reservation", resource: "InventoryReservation" },
  dispatch: { model: "dispatch", resource: "Dispatch" },
};

const number = (value, name, minimum = 0) => {
  if (typeof value !== "number" || value < minimum) {
    throw new Error(`${name} must be greater than or equal to ${minimum}.`);
  }
  return value;
};

const related = async (name, id) => {
  const record = await repository.findById(name, id);
  if (!record) throw new Error(`${definitions[name].resource} not found.`);
  return record;
};

const prepare = async (name, data) => {
  if (name === "inventory") {
    number(data.physicalQuantity, "Physical quantity");
    number(data.reservedQuantity, "Reserved quantity");
    if (data.reservedQuantity > data.physicalQuantity) throw new Error("Reserved quantity cannot exceed physical quantity.");
    return { ...data, availableQuantity: data.physicalQuantity - data.reservedQuantity };
  }

  if (name === "enquiry") {
    if (!data.customerId || !data.employeeId || !data.enquiryNumber) throw new Error("Enquiry number, customer and employee are required.");
    return data;
  }

  if (name === "quotation") {
    if (!data.quotationNumber || !data.customerId || !data.employeeId) throw new Error("Quotation number, customer and employee are required.");
    const items = data.items || [];
    const preparedItems = items.map((item) => {
      number(item.quantity, "Quantity", 1);
      number(item.unitPrice, "Unit price");
      return { productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice, subtotal: item.quantity * item.unitPrice };
    });
    const subtotal = preparedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = number(data.discount || 0, "Discount");
    const gst = number(data.gst || 0, "GST");
    const taxable = Math.max(0, subtotal - discount);
    return { ...data, items: undefined, subtotal, discount, gst, grandTotal: taxable + (taxable * gst) / 100, preparedItems };
  }

  return data;
};

const create = async (name, data, userId) => {
  const definition = definitions[name];
  const prepared = await prepare(name, data);
  let record;
  if (name === "quotation" && prepared.preparedItems) {
    const { preparedItems, ...quotation } = prepared;
    record = await repository.create(name, { ...quotation, items: { create: preparedItems } });
  } else if (name === "enquiry" && prepared.items) {
    const { items, ...enquiry } = prepared;
    record = await repository.create(name, { ...enquiry, items: { create: items } });
  } else {
    record = await repository.create(name, prepared);
  }
  if (userId) await auditService.createAuditLog(userId, "CREATE", definition.resource, record.id);
  return record;
};

const getAll = (name) => repository.findAll(name);
const getById = (name, id) => repository.findById(name, id);

const update = async (name, id, data, userId) => {
  const definition = definitions[name];
  const existing = await related(name, id);
  const prepared = await prepare(name, name === "inventory" ? {
    physicalQuantity: data.physicalQuantity ?? existing.physicalQuantity,
    reservedQuantity: data.reservedQuantity ?? existing.reservedQuantity,
    productId: data.productId ?? existing.productId,
  } : data);
  delete prepared.items;
  delete prepared.preparedItems;
  const record = await repository.update(name, id, prepared);
  if (userId) await auditService.createAuditLog(userId, "UPDATE", definition.resource, id);
  return record;
};

const remove = async (name, id, userId) => {
  const definition = definitions[name];
  await related(name, id);
  await repository.remove(name, id);
  if (userId) await auditService.createAuditLog(userId, "DELETE", definition.resource, id);
  return true;
};

const createSalesOrder = async (data, userId) => {
  const quotation = await repository.prisma.quotation.findUnique({ where: { id: data.quotationId }, include: { items: true } });
  if (!quotation) throw new Error("Quotation not found.");
  if (quotation.status !== "ACCEPTED") throw new Error("Only accepted quotations can become sales orders.");
  const existing = await repository.prisma.salesOrder.findUnique({ where: { quotationId: data.quotationId } });
  if (existing) throw new Error("A sales order already exists for this quotation.");
  return create("salesOrder", data, userId);
};

const createReservation = async (data, userId) => {
  const order = await repository.prisma.salesOrder.findUnique({ where: { id: data.salesOrderId }, include: { quotation: { include: { items: true } } } });
  if (!order) throw new Error("Sales order not found.");
  const inventory = await repository.prisma.inventory.findUnique({ where: { id: data.inventoryId } });
  if (!inventory) throw new Error("Inventory not found.");
  const quantity = number(data.quantity, "Reservation quantity", 1);
  const result = await repository.prisma.$transaction(async (tx) => {
    const updatedInventory = await tx.inventory.updateMany({
      where: { id: data.inventoryId, availableQuantity: { gte: quantity } },
      data: { reservedQuantity: { increment: quantity }, availableQuantity: { decrement: quantity } },
    });
    if (updatedInventory.count !== 1) throw new Error("Cannot reserve beyond available stock.");
    const reservation = await tx.inventoryReservation.create({ data: { salesOrderId: data.salesOrderId, inventoryId: data.inventoryId, quantity }, include: { inventory: true, salesOrder: true } });
    await tx.salesOrder.update({ where: { id: data.salesOrderId }, data: { status: "RESERVED" } });
    return reservation;
  });
  if (userId) await auditService.createAuditLog(userId, "CREATE", "InventoryReservation", result.id);
  return result;
};

const createDispatch = async (data, userId) => {
  const order = await repository.prisma.salesOrder.findUnique({ where: { id: data.salesOrderId }, include: { reservations: true, dispatch: true } });
  if (!order) throw new Error("Sales order not found.");
  if (order.status === "CANCELLED") throw new Error("Cannot dispatch a cancelled order.");
  if (order.dispatch) throw new Error("Sales order has already been dispatched.");
  const result = await repository.prisma.$transaction(async (tx) => {
    const dispatch = await tx.dispatch.create({ data: { salesOrderId: data.salesOrderId, dispatchDate: data.dispatchDate ? new Date(data.dispatchDate) : new Date() }, include: { salesOrder: true } });
    for (const reservation of order.reservations) {
      await tx.inventory.update({ where: { id: reservation.inventoryId }, data: { physicalQuantity: { decrement: reservation.quantity }, reservedQuantity: { decrement: reservation.quantity } } });
    }
    await tx.salesOrder.update({ where: { id: data.salesOrderId }, data: { status: "DISPATCHED" } });
    return dispatch;
  });
  if (userId) await auditService.createAuditLog(userId, "CREATE", "Dispatch", result.id);
  return result;
};

module.exports = { create, getAll, getById, update, remove, createSalesOrder, createReservation, createDispatch };
