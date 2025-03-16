export default function responseMiddleware (req, res, next) {
  res.sendResponse = (statusCode, message, data = null, pagination = null) => {
    const metadata = {
      success: statusCode >= 200 && statusCode < 300,
      message,
      timestamp: new Date().toISOString(),
      executionTime: res.locals.executionTime || '0.00ms'
    }

    const responseBody = { metadata, data }

    if (pagination) {
      responseBody.pagination = pagination
    }

    res.status(statusCode).json(responseBody)
  }

  next()
}
