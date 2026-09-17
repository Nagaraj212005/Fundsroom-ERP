const saleService = require("../services/sale.service");

const createSale = async (req, res) => {
  try {
    const sale = await saleService.createSale(
      req.body,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Sale created successfully.",
      data: sale,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllSales = async (req, res) => {
  try {
    const sales = await saleService.getAllSales();

    return res.status(200).json({
      success: true,
      data: sales,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSaleById = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: sale,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSale = async (req, res) => {
  try {
    const sale = await saleService.updateSale(
      req.params.id,
      req.body,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Sale updated successfully.",
      data: sale,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSale = async (req, res) => {
  try {
    await saleService.deleteSale(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Sale deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
};