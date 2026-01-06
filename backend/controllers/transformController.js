import { deepFlatten, sendResponse } from "../utills/index.js";

// Task 4: Flatten Employee JSON
export const flattenEmployee = (req, res) => {
    try {
        const employees = req.body;

        const output = employees.map((emp) => {
            const {
                id,
                name,
                education = {},
                address,
                Exp = []
            } = emp;

            const flat = {
                id,
                name,
                education_10th: education["10th"],
                education_12th: education["12th"],
                education_UG: education["UG"],
                education_PG: education["PG"],
                address
            };

            Exp.forEach((exp, index) => {
                flat[`Exp_${index + 1}_Company_Name`] = exp["Company Name"];
                flat[`Exp_${index + 1}_Year`] = exp["Year"];
            });

            return flat;
        });

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            data: output
        });

    } catch (error) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            error: "Error flattening employee data"
        });
    }
};

// Task 5: Dynamic Recursive Flattening
export const flattenProducts = (req, res) => {
    try {
        const { products = [] } = req.body;

        const flattened = products.map(product => deepFlatten(product));

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            data: flattened
        });

    } catch (error) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            error: "Error flattening product data"
        });
    }
};