const companyService = require("../services/company.service");

const createCompany = async (req, res) => {
  try {
    const company = await companyService.createCompany(
      req.body,
      req.user?.id
    );

    return res.status(201).json({
      success: true,
      message: "Company created successfully.",
      data: company,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await companyService.getCompanies();

    return res.status(200).json({
      success: true,
      message: "Companies retrieved successfully.",
      data: companies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Company retrieved successfully.",
      data: company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const company = await companyService.updateCompany(
      req.params.id,
      req.body,
      req.user?.id
    );

    return res.status(200).json({
      success: true,
      message: "Company updated successfully.",
      data: company,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await companyService.deleteCompany(
      req.params.id,
      req.user?.id
    );

    return res.status(200).json({
      success: true,
      message: "Company deleted successfully.",
      data: company,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};