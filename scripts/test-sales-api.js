const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const baseUrl = 'http://localhost:5000';

async function api(method, path, token, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(baseUrl + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: res.status, data };
}

async function ensureTestData() {
  const company = await prisma.company.upsert({
    where: { gstNumber: 'GST-SALES-TEST-1' },
    create: {
      companyName: 'Sales Test Co',
      gstNumber: 'GST-SALES-TEST-1',
      email: 'sales@test.com',
      phone: '9999999999',
      address: 'Test Address',
      contactPerson: 'Sales Owner',
      agreementStart: new Date('2025-01-01T00:00:00.000Z'),
      agreementEnd: new Date('2027-01-01T00:00:00.000Z'),
    },
    update: {},
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@fundsroom.com' },
    create: {
      fullName: 'System Administrator',
      email: 'admin@fundsroom.com',
      passwordHash: await bcrypt.hash('Admin@123', 10),
      role: 'ADMIN',
      isActive: true,
      companyId: company.id,
    },
    update: { companyId: company.id },
  });

  let dept = await prisma.department.findFirst({
    where: { companyId: company.id, name: 'Sales' },
  });

  if (!dept) {
    dept = await prisma.department.create({
      data: { name: 'Sales', companyId: company.id },
    });
  }

  const salesUser = await prisma.user.upsert({
    where: { email: 'sales.user@test.com' },
    create: {
      fullName: 'Sales Tester',
      email: 'sales.user@test.com',
      passwordHash: await bcrypt.hash('Sales@123', 10),
      role: 'SALES_USER',
      isActive: true,
      companyId: company.id,
      departmentId: dept.id,
    },
    update: { companyId: company.id, departmentId: dept.id },
  });

  const employee = await prisma.employee.upsert({
    where: { employeeCode: 'EMP-SALES-001' },
    create: {
      employeeCode: 'EMP-SALES-001',
      designation: 'Sales Executive',
      salary: 50000,
      companyId: company.id,
      departmentId: dept.id,
      userId: salesUser.id,
      joiningDate: new Date('2025-01-15T00:00:00.000Z'),
    },
    update: {},
  });

  const customer = await prisma.customer.upsert({
    where: { customerCode: 'CUST-SALES-001' },
    create: {
      customerCode: 'CUST-SALES-001',
      name: 'Test Customer',
      email: 'customer@test.com',
      phone: '1234567890',
      companyName: 'Test Customer Ltd',
      address: 'Customer Street',
      companyId: company.id,
    },
    update: {},
  });

  const product = await prisma.product.upsert({
    where: { productCode: 'PROD-SALES-001' },
    create: {
      productCode: 'PROD-SALES-001',
      name: 'Sales Test Product',
      description: 'Test product for sales audit',
      price: 250,
      stock: 30,
      companyId: company.id,
    },
    update: { stock: 30 },
  });

  return {
    companyId: company.id,
    adminId: admin.id,
    employeeId: employee.id,
    customerId: customer.id,
    productId: product.id,
  };
}

async function main() {
  const ids = await ensureTestData();

  const login = await api('POST', '/api/auth/login', null, {
    email: 'admin@fundsroom.com',
    password: 'Admin@123',
  });

  console.log('LOGIN_STATUS', login.status);
  console.log('LOGIN_BODY', JSON.stringify(login.data));

  const token = login.data && login.data.data && login.data.data.token;
  if (!token) {
    throw new Error('Login failed: token missing');
  }

  const createSale = await api('POST', '/api/sales', token, {
    saleNumber: 'S-TEST-1001',
    customerId: ids.customerId,
    employeeId: ids.employeeId,
    items: [{ productId: ids.productId, quantity: 2 }],
  });

  console.log('CREATE_SALE_STATUS', createSale.status);
  console.log('CREATE_SALE_BODY', JSON.stringify(createSale.data));

  const saleId = createSale.data && createSale.data.data && createSale.data.data.id;
  if (!saleId) {
    throw new Error('Create sale failed: no sale id returned');
  }

  const getAllSales = await api('GET', '/api/sales', token);
  console.log('GET_ALL_SALES_STATUS', getAllSales.status);
  console.log('GET_ALL_SALES_BODY', JSON.stringify(getAllSales.data));

  const getOneSale = await api('GET', `/api/sales/${saleId}`, token);
  console.log('GET_ONE_SALE_STATUS', getOneSale.status);
  console.log('GET_ONE_SALE_BODY', JSON.stringify(getOneSale.data));

  const updateSale = await api('PUT', `/api/sales/${saleId}`, token, {
    saleNumber: 'S-TEST-UPDATE-1001',
    customerId: ids.customerId,
    employeeId: ids.employeeId,
    totalAmount: 600,
  });

  console.log('UPDATE_SALE_STATUS', updateSale.status);
  console.log('UPDATE_SALE_BODY', JSON.stringify(updateSale.data));

  const deleteSale = await api('DELETE', `/api/sales/${saleId}`, token);
  console.log('DELETE_SALE_STATUS', deleteSale.status);
  console.log('DELETE_SALE_BODY', JSON.stringify(deleteSale.data));

  const audit = await api('GET', '/api/audit', token);
  console.log('AUDIT_STATUS', audit.status);

  const saleLogs = (audit.data && audit.data.data || []).filter(item => item.resource === 'Sale');
  console.log('SALE_AUDIT_LOGS', JSON.stringify(saleLogs.slice(0, 20)));

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('SCRIPT_ERROR', error.message || error);
  process.exit(1);
});
