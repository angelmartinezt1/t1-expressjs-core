export default function errorHandlerMiddleware (err, req, res, next) {
  console.error(`❌ Error: ${err.message || 'Unknown error'}`, err)

  const statusCode = err.status || 500
  const message = err.message || 'Internal Server Error'

  res.sendResponse(statusCode, message, null)
}
