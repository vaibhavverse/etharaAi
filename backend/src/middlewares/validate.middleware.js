import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        return next(new ApiError(400, "Validation Error", errorMessages));
      }
      return next(new ApiError(500, "Internal Server Error"));
    }
  };
};
