const service = require("../services/caseStudy.service");

const messages = {
  inventory: "Inventory", enquiry: "Enquiry", quotation: "Quotation",
  salesOrder: "Sales order", reservation: "Inventory reservation", dispatch: "Dispatch",
};

const create = (name) => async (req, res) => {
  try {
    const data = name === "salesOrder" ? await service.createSalesOrder(req.body, req.user.id) : name === "reservation" ? await service.createReservation(req.body, req.user.id) : name === "dispatch" ? await service.createDispatch(req.body, req.user.id) : await service.create(name, req.body, req.user.id);
    return res.status(201).json({ success: true, message: `${messages[name]} created successfully.`, data });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const getAll = (name) => async (req, res) => {
  try { return res.status(200).json({ success: true, data: await service.getAll(name) }); }
  catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const getById = (name) => async (req, res) => {
  try {
    const data = await service.getById(name, req.params.id);
    if (!data) return res.status(404).json({ success: false, message: `${messages[name]} not found.` });
    return res.status(200).json({ success: true, data });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const update = (name) => async (req, res) => {
  try { return res.status(200).json({ success: true, message: `${messages[name]} updated successfully.`, data: await service.update(name, req.params.id, req.body, req.user.id) }); }
  catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const remove = (name) => async (req, res) => {
  try { await service.remove(name, req.params.id, req.user.id); return res.status(200).json({ success: true, message: `${messages[name]} deleted successfully.` }); }
  catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

module.exports = { create, getAll, getById, update, remove };
