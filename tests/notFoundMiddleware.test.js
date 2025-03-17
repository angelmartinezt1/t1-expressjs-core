/* globals describe, expect, it */
import express from 'express'
import request from 'supertest'
import notFoundMiddleware from '../src/middleware/notFoundMiddleware.js'
import responseMiddleware from '../src/middleware/responseMiddleware.js'

const app = express()
app.use(express.json())
app.use(responseMiddleware)

// Aplicar el middleware después de todas las rutas
app.use(notFoundMiddleware)

describe('notFoundMiddleware', () => {
  it('should return 404 with structured response', async () => {
    const response = await request(app).get('/nonexistent-route')

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('metadata')
    expect(response.body.metadata).toHaveProperty('success', false)
    expect(response.body.metadata).toHaveProperty('message', 'Route /nonexistent-route not found')
    expect(response.body.metadata).toHaveProperty('timestamp')
    expect(response.body.metadata).toHaveProperty('executionTime')
  })
})
