'use strict'

import onHeaders from 'on-headers'

export default function executionTime (options = {}) {
  if (typeof options === 'number') {
    options = { digits: options }
  }

  const { digits = 3, header = 'X-Response-Time', suffix = true } = options

  const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
  }

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
    })

    res.on('finish', () => {
      const durationInMilliseconds = getDurationInMilliseconds(startAt)
      console.log(`${req.method} ${req.originalUrl} [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`)
    })

    res.on('close', () => {
      const durationInMilliseconds = getDurationInMilliseconds(startAt)
      console.log(`${req.method} ${req.originalUrl} [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`)
    })

    // Interceptar res.json() para incluir executionTime en la respuesta JSON
    const originalJson = res.json
    res.json = function (body) {
      const durationInMilliseconds = getDurationInMilliseconds(startAt)
      let formattedTime = durationInMilliseconds.toFixed(digits)

      if (suffix) {
        formattedTime += 'ms'
      }

      res.locals.executionTime = formattedTime

      // Add to response body
      if (typeof body === 'object' && body !== null) {
        body.metadata = body.metadata || {}
        body.metadata.executionTime = formattedTime
      }

      return originalJson.call(this, body)
    }

    next()
  }
}
