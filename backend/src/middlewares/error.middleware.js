import { ApiError } from "../utils/ApiError.js";
import { config } from "../config/index.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof Error ? 400 : 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(config.env === "development" ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode).json(response);
};
