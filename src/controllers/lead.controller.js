const leadService = require("../services/lead.service");

const createLead = async (req, res) => {
  try {
    const lead = await leadService.createLead(
      req.body,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Lead created successfully.",
      data: lead,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllLeads = async (req, res) => {
  try {
    const leads = await leadService.getAllLeads();

    return res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await leadService.updateLead(
      req.params.id,
      req.body,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully.",
      data: lead,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    await leadService.deleteLead(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
};