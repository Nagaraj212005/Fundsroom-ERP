const departmentService = require("../services/department.service");

const createDepartment = async (req, res) => {
  try {
    const department = await departmentService.createDepartment(
      req.body,
      req.user?.id
    );

    return res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: department,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await departmentService.getDepartments();

    return res.status(200).json({
      success: true,
      message: "Departments retrieved successfully.",
      data: departments,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Department retrieved successfully.",
      data: department,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const department = await departmentService.updateDepartment(
      req.params.id,
      req.body,
      req.user?.id
    );

    return res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      data: department,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await departmentService.deleteDepartment(
      req.params.id,
      req.user?.id
    );

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully.",
      data: department,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};