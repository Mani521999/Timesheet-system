import Joi from "joi";
import { sendResponse } from "../utills/index.js";

/**
 * Common Joi validation handler
 */
const validateRequest = (schema) => (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      const errors = error.details.reduce((acc, detail) => {
        const key =
          detail.context?.label ||
          (detail.path.length ? detail.path.join(".") : "error");

        acc[key] = detail.message.replace(/"/g, "");
        return acc;
      }, {});

      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Validation error",
        errors,
      });
    }

    req.body = value;
    next();
  } catch (err) {
    console.error("Validation middleware error:", err);
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Server validation error",
      errors: {},
    });
  }
};


export const timesheetValidation = validateRequest(
  Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name is required",
    }),

    companyName: Joi.string().required().messages({
      "string.empty": "Company name is required",
    }),

    date: Joi.date().max("now").required().messages({
      "date.max": "Future dates are not allowed",
      "any.required": "Date is required",
    }),

    punchIn: Joi.string().required().messages({
      "string.empty": "Punch In is required",
    }),

    punchOut: Joi.string().required().messages({
      "string.empty": "Punch Out is required",
    }),
  })
);


export const updateTimesheetValidation = validateRequest(
  Joi.object({
    name: Joi.string().optional(),
    companyName: Joi.string().optional(),

    date: Joi.date().max("now").optional().messages({
      "date.max": "Future dates are not allowed",
    }),

    punchIn: Joi.string().optional(),
    punchOut: Joi.string().optional(),
  })
    .and("punchIn", "punchOut")
    .messages({
      "object.and": "Punch In and Punch Out must be provided together",
    })
);
