const leadRepository = require("../repositories/lead.repository");
const companyRepository = require("../repositories/company.repository");
const employeeRepository = require("../repositories/employee.repository");
const auditService = require("./audit.service");

const createLead = async (data, userId) => {
  const company = await companyRepository.getCompanyById(data.companyId);

  if (!company) {
    throw new Error("Company not found.");
  }

  if (data.assignedToId) {
    const employee = await employeeRepository.getEmployeeById(
      data.assignedToId
    );

    if (!employee) {
      throw new Error("Assigned employee not found.");
    }
  }

  const lead = await leadRepository.createLead(data);

  await auditService.createAuditLog(
    userId,
    "CREATE",
    "Lead",
    lead.id
  );

  return lead;
};

const getAllLeads = async () => {
  return await leadRepository.getAllLeads();
};

const getLeadById = async (id) => {
  return await leadRepository.getLeadById(id);
};

const updateLead = async (id, data, userId) => {
  if (data.companyId) {
    const company = await companyRepository.getCompanyById(data.companyId);

    if (!company) {
      throw new Error("Company not found.");
    }
  }

  if (data.assignedToId) {
    const employee = await employeeRepository.getEmployeeById(
      data.assignedToId
    );

    if (!employee) {
      throw new Error("Assigned employee not found.");
    }
  }

  const lead = await leadRepository.updateLead(id, data);

  await auditService.createAuditLog(
    userId,
    "UPDATE",
    "Lead",
    lead.id
  );

  return lead;
};

const deleteLead = async (id, userId) => {
  await leadRepository.deleteLead(id);

  await auditService.createAuditLog(
    userId,
    "DELETE",
    "Lead",
    id
  );

  return true;
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
};