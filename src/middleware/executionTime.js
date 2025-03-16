'use strict'

import onHeaders from 'on-headers'

export default function executionTime (options = {}) {
  if (typeof options === 'number') {
    options = { digits: options }
  }

  const { digits = 3, header = 'X-Response-Time', suffix = true } = options

  return function executionTimeMiddleware (req, res, next) {
    const startAt = process.hrtime()

    onHeaders(res, function calculateExecutionTime () {
      const diff = process.hrtime(startAt)
      const time = diff[0] * 1e3 + diff[1] * 1e-6
      let formattedTime = time.toFixed(digits)

      if (suffix) {
        formattedTime += 'ms'
      }

      res.setHeader(header, formattedTime)
      res.locals.executionTime = formattedTime // 🔥 Exponer en res.locals
    })

    // Interceptar res.json() para incluir executionTime en la respuesta JSON
    const originalJson = res.json
    res.json = function (body) {
      if (typeof body === 'object' && body !== null) {
        body.metadata = body.metadata || {}
        body.metadata.executionTime = res.locals.executionTime || '0.00ms'
      }
      return originalJson.call(this, body)
    }

    next()
  }
}
