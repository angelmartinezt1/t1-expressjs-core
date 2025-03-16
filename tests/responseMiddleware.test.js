/* globals describe, expect, it */
import express from 'express'
import request from 'supertest'
import executionTime from '../src/middleware/executionTime.js'
import responseMiddleware from '../src/middleware/responseMiddleware.js'

const app = express()
app.use(executionTime())
app.use(responseMiddleware)

app.get('/test', (req, res) => {
  res.sendResponse(200, 'Test successful', { key: 'value' })
})

describe('responseMiddleware', () => {
  it('should return a structured response with metadata', async () => {
    const response = await request(app).get('/test')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('metadata')
    expect(response.body.metadata).toHaveProperty('success', true)
    expect(response.body.metadata).toHaveProperty('message', 'Test successful')
    expect(response.body.metadata).toHaveProperty('timestamp')
    expect(response.body.metadata).toHaveProperty('executionTime') // ✅ Solo validar que existe

    // Validar que executionTime tiene el formato correcto (ej: "123.45ms")
    expect(response.body.metadata.executionTime).toMatch(/^\d+\.\d{2}ms$/)
  })

  it('should ensure executionTime is not null', async () => {
    const response = await request(app).get('/test')

    expect(response.status).toBe(200)
    expect(response.body.metadata.executionTime).not.toBeNull()
  })
})
