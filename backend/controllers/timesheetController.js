import Timesheet from "../models/Timesheet.js";
import * as XLSX from "xlsx";
import { calculateHours, sendResponse } from "../utills/index.js";

/**
 * CREATE TIMESHEET
 */
export const createTimesheet = async (req, res) => {
    try {
        const { punchIn, punchOut } = req.body

        const totalHours = calculateHours(punchIn, punchOut);
        req.body['totalHours'] = totalHours

        const record = await Timesheet.create(req.body);

        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Timesheet created successfully",
            data: record,
        });
    } catch (error) {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            error: error.message || "Failed to create timesheet",
        });
    }
};

/**
 * IMPORT TIMESHEET (CSV / EXCEL)
 */
export const importTimesheet = async (req, res) => {
    try {
        if (!req.file) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                error: "File is required",
            });
        }

        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        if (!data.length) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                error: "Uploaded file is empty",
            });
        }

        await Timesheet.insertMany(data);

        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Timesheet imported successfully",
        });
    } catch (error) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            error: error.message || "Import failed",
        });
    }
};

/**
 * GET TIMESHEETS (FILTER + PAGINATION)
 */
export const getTimesheets = async (req, res) => {
    try {
        let query = {};
        const {
            name,
            companyName,
            startDate,
            endDate,
            page = 1,
            limit = 5,
        } = req.query;

        if (name) query.name = name;
        if (companyName) query.companyName = companyName;

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const skip = (page - 1) * limit;
        console.log("query", query);

        const data = await Timesheet.find(query)
            .limit(Number(limit))
            .skip(skip)
            .sort({ date: -1 });

        const total = await Timesheet.countDocuments(query);

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Timesheets fetched successfully",
            data,
            meta: {
                totalRecords: total,
                totalPages: Math.ceil(total / limit),
                currentPage: Number(page),
            },
        });
    } catch (error) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            error: error.message || "Failed to fetch timesheets",
        });
    }
};

/**
 * UPDATE TIMESHEET
 */
export const updateTimesheet = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        const updatedRecord = await Timesheet.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedRecord) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Record not found",
                errors: {},
            });
        }

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Timesheet updated successfully",
            data: updatedRecord,
        });
    } catch (error) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message || "Update failed",
        });
    }
};




/**
 * DELETE TIMESHEET
 */
export const deleteTimesheet = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await Timesheet.findById(id);
        if (!record) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                error: "Record not found"
            });
        }

        await Timesheet.findByIdAndDelete(id);

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Timesheet deleted successfully"
        });
    } catch (error) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            error: error.message || "Delete failed",
        });
    }
};
