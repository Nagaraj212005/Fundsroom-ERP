const prisma = require("../config/prisma");

const createLead = async (data) => {
    return prisma.lead.create({
        data,
        include: {
            company: true,
            assignedTo: true
        }
    });
};

const getAllLeads = async () => {
    return prisma.lead.findMany({
        include: {
            company: true,
            assignedTo: true
        }
    });
};

const getLeadById = async (id) => {
    return prisma.lead.findUnique({
        where: { id },
        include: {
            company: true,
            assignedTo: true
        }
    });
};

const updateLead = async (id, data) => {
    return prisma.lead.update({
        where: { id },
        data,
        include: {
            company: true,
            assignedTo: true
        }
    });
};

const deleteLead = async (id) => {
    return prisma.lead.delete({
        where: { id }
    });
};

module.exports = {
    createLead,
    getAllLeads,
    getLeadById,
    updateLead,
    deleteLead
};