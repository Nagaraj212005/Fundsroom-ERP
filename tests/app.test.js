const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../src/app");

const request = (path) => new Promise((resolve, reject) => {
  const server = app.listen(0, () => {
    const port = server.address().port;
    http.get({ host: "127.0.0.1", port, path }, (res) => {
      res.resume();
      res.on("end", () => { server.close(); resolve(res.statusCode); });
    }).on("error", (error) => { server.close(); reject(error); });
  });
});

test("root endpoint is available", async () => {
  assert.equal(await request("/"), 200);
});

test("case-study routes require authentication", async () => {
  assert.equal(await request("/api/inventory"), 401);
  assert.equal(await request("/api/quotations"), 401);
  assert.equal(await request("/api/sales-orders"), 401);
});

const prisma = require("../src/config/prisma");
const caseStudyService = require("../src/services/caseStudy.service");

const getFixtures = async () => {
  const customer = await prisma.customer.findFirst();
  const employee = await prisma.employee.findFirst();
  const product = await prisma.product.findFirst();
  assert.ok(customer && employee && product, "Seed customer, employee, and product records before running tests.");
  return { customer, employee, product };
};

const unique = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

test("quotation total is calculated by the backend", async () => {
  const { customer, employee, product } = await getFixtures();
  const quotation = await caseStudyService.create("quotation", {
    quotationNumber: unique("TEST-QT"),
    customerId: customer.id,
    employeeId: employee.id,
    discount: 500,
    gst: 18,
    items: [{ productId: product.id, quantity: 2, unitPrice: 55000 }],
  });

  try {
    assert.equal(quotation.subtotal, 110000);
    assert.equal(quotation.grandTotal, 129210);
  } finally {
    await prisma.quotation.delete({ where: { id: quotation.id } });
  }
});

test("draft and rejected quotations cannot create sales orders", async () => {
  const { customer, employee } = await getFixtures();
  const quotationIds = [];

  try {
    for (const status of ["DRAFT", "REJECTED"]) {
      const quotation = await prisma.quotation.create({
        data: {
          quotationNumber: unique(`TEST-${status}`),
          customerId: customer.id,
          employeeId: employee.id,
          status,
        },
      });
      quotationIds.push(quotation.id);
      await assert.rejects(
        caseStudyService.createSalesOrder({ orderNumber: unique("TEST-SO"), quotationId: quotation.id }),
        new RegExp("Only accepted quotations")
      );
    }
  } finally {
    for (const id of quotationIds) await prisma.quotation.delete({ where: { id } });
  }
});

test("one quotation cannot create duplicate sales orders", async () => {
  const { customer, employee } = await getFixtures();
  const quotation = await prisma.quotation.create({
    data: {
      quotationNumber: unique("TEST-ACCEPTED"),
      customerId: customer.id,
      employeeId: employee.id,
      status: "ACCEPTED",
    },
  });
  let order;

  try {
    order = await caseStudyService.createSalesOrder({ orderNumber: unique("TEST-SO"), quotationId: quotation.id });
    await assert.rejects(
      caseStudyService.createSalesOrder({ orderNumber: unique("TEST-SO"), quotationId: quotation.id }),
      new RegExp("already exists")
    );
  } finally {
    if (order) await prisma.salesOrder.delete({ where: { id: order.id } });
    await prisma.quotation.delete({ where: { id: quotation.id } });
  }
});

test("reservation beyond available inventory is rejected", async () => {
  const { customer, employee, product } = await getFixtures();
  const temporaryProduct = await prisma.product.create({
    data: {
      productCode: unique("TEST-PRODUCT"),
      name: "Test product",
      price: 10,
      stock: 1,
      companyId: customer.companyId,
    },
  });
  const inventory = await prisma.inventory.create({
    data: { productId: temporaryProduct.id, physicalQuantity: 1, reservedQuantity: 0, availableQuantity: 1 },
  });
  const quotation = await prisma.quotation.create({
    data: {
      quotationNumber: unique("TEST-RESERVE-QT"),
      customerId: customer.id,
      employeeId: employee.id,
      status: "ACCEPTED",
      subtotal: product.price,
      discount: 0,
      gst: 0,
      grandTotal: product.price,
      items: { create: [{ productId: product.id, quantity: 1, unitPrice: product.price, subtotal: product.price }] },
    },
  });
  const order = await caseStudyService.createSalesOrder({ orderNumber: unique("TEST-RESERVE-SO"), quotationId: quotation.id });

  try {
    await assert.rejects(
      caseStudyService.createReservation({ salesOrderId: order.id, inventoryId: inventory.id, quantity: 2 }),
      new RegExp("Cannot reserve beyond available stock")
    );
    const unchanged = await prisma.inventory.findUnique({ where: { id: inventory.id } });
    assert.equal(unchanged.availableQuantity, 1);
  } finally {
    await prisma.salesOrder.delete({ where: { id: order.id } });
    await prisma.quotation.delete({ where: { id: quotation.id } });
    await prisma.inventory.delete({ where: { id: inventory.id } });
    await prisma.product.delete({ where: { id: temporaryProduct.id } });
  }
});

test("protected case-study routes reject unauthenticated requests", async () => {
  assert.equal(await request("/api/inventory"), 401);
  assert.equal(await request("/api/quotations"), 401);
  assert.equal(await request("/api/sales-orders"), 401);
});
