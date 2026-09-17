const auditRepository = require("../repositories/audit.repository");

const createAuditLog = async (
  userId,
  action,
  resource,
  resourceId = null
) => {
  return auditRepository.createAuditLog({
    userId,
    action,
    resource,
    resourceId,
  });
};

const getAllAuditLogs = async () => {
  return auditRepository.findAll();
};

module.exports = {
  createAuditLog,
  getAllAuditLogs,
};