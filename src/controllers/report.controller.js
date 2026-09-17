const service = require("../services/report.service");

const report = (method) => async (req, res) => {
  try { return res.status(200).json({ success: true, data: await service[method]() }); }
  catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const search = async (req, res) => {
  try {
    const { resource } = req.params;
    const { q, page, limit, sortBy, sortOrder } = req.query;
    return res.status(200).json({ success: true, data: await service.search(resource, q, page, limit, sortBy, sortOrder) });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

module.exports = { search, report };
