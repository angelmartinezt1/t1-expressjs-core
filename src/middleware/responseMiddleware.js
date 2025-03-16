export default function responseMiddleware(req, res, next) {
  res.sendResponse = (statusCode, message, data = null, pagination = null) => {
    const response = {
      metadata: {
        success: statusCode >= 200 && statusCode < 300,
        message,
        timestamp: new Date().toISOString(),
        executionTime: null
      },
      data,
    };

    if (pagination) {
      response.pagination = pagination;
    }

    res.status(statusCode).json(response);
  };

  next();
}
