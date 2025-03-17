export default function notFoundMiddleware (req, res, next) {
  res.sendResponse(404, `Route ${req.originalUrl} not found`)
}
