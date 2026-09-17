const saleItemService = require("../services/saleItem.service");

const createSaleItem = async (req, res) => {
  try {
    const saleItem = await saleItemService.createSaleItem(req.body, req.user.id);

    return res.status(201).json({
      success: true,
      message: "SaleItem created successfully.",
      data: saleItem,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllSaleItems = async (req, res) => {
  try {
    const saleItems = await saleItemService.getAllSaleItems();

    return res.status(200).json({
      success: true,
      data: saleItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSaleItemById = async (req, res) => {
  try {
    const saleItem = await saleItemService.getSaleItemById(req.params.id);

    if (!saleItem) {
      return res.status(404).json({
        success: false,
        message: "SaleItem not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: saleItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSaleItem = async (req, res) => {
  try {
    const saleItem = await saleItemService.updateSaleItem(
      req.params.id,
      req.body,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "SaleItem updated successfully.",
      data: saleItem,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSaleItem = async (req, res) => {
  try {
    await saleItemService.deleteSaleItem(req.params.id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "SaleItem deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSaleItem,
  getAllSaleItems,
  getSaleItemById,
  updateSaleItem,
  deleteSaleItem,
};
