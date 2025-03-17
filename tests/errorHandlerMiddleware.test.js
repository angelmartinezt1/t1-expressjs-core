/* globals describe, expect, it */
import express from 'express'
import request from 'supertest'
import errorHandlerMiddleware from '../src/middleware/errorHandlerMiddleware.js'
import responseMiddleware from '../src/middleware/responseMiddleware.js'

const app = express()
app.use(express.json())
app.use(responseMiddleware)

app.get('/error', (req, res, next) => {
  next(new Error('Test error occurred'))
})

// Aplicar middleware de manejo de errores
app.use(errorHandlerMiddleware)

describe('errorHandlerMiddleware', () => {
  it('should return 500 for unhandled errors', async () => {
    const response = await request(app).get('/error')

    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('metadata')
    expect(response.body.metadata).toHaveProperty('success', false)
    expect(response.body.metadata).toHaveProperty('message', 'Test error occurred')
    expect(response.body.metadata).toHaveProperty('timestamp')
    expect(response.body.metadata).toHaveProperty('executionTime')
  })
})
