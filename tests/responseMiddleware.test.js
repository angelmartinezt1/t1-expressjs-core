/* globals describe, expect, it */
import express from 'express'
import request from 'supertest'
import responseMiddleware from '../src/middleware/responseMiddleware.js'

const app = express()
app.use(express.json())
app.use(responseMiddleware)

// Ruta de prueba que usa el middleware
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
    expect(response.body.metadata).toHaveProperty('executionTime', null)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toEqual({ key: 'value' })
  })

  it('should handle error responses', async () => {
    app.get('/error', (req, res) => {
      res.sendResponse(500, 'Internal Server Error')
    })

    const response = await request(app).get('/error')

    expect(response.status).toBe(500)
    expect(response.body.metadata.success).toBe(false)
    expect(response.body.metadata.message).toBe('Internal Server Error')
  })
})
