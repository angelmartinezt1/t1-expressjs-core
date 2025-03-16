/* globals describe, expect, it */
import express from 'express'
import request from 'supertest'
import executionTime from '../src/middleware/executionTime.js'
import responseMiddleware from '../src/middleware/responseMiddleware.js'

const app = express()
app.use(executionTime())
app.use(responseMiddleware)

app.get('/test', (req, res) => {
  res.sendResponse(200, 'Execution time test successful', { example: 'data' })
})

describe('executionTime middleware', () => {
  it('should add executionTime to metadata', async () => {
    const response = await request(app).get('/test')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('metadata')
    expect(response.body.metadata).toHaveProperty('executionTime')

    // ✅ Validar que executionTime tenga el formato correcto (ej: "123.45ms")
    expect(response.body.metadata.executionTime).toMatch(/^\d+\.\d+ms$/)
  })

  it('should add X-Response-Time header', async () => {
    const response = await request(app).get('/test')

    expect(response.status).toBe(200)
    expect(response.headers).toHaveProperty('x-response-time')
    expect(response.headers['x-response-time']).toMatch(/^\d+\.\d+ms$/)
  })

  it('should ensure executionTime is not null', async () => {
    const response = await request(app).get('/test')

    expect(response.status).toBe(200)
    expect(response.body.metadata.executionTime).not.toBeNull()
  })
})
