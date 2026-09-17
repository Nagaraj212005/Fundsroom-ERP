const auditService = require("../services/audit.service");

const getAllAuditLogs = async (req, res) => {
  try {
    const logs = await auditService.getAllAuditLogs();

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllAuditLogs,
};