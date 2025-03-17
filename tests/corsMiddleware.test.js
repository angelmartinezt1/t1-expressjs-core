/* globals describe, expect, it, beforeEach, beforeEach, afterAll */
import { jest } from '@jest/globals'
import express from 'express'
import request from 'supertest'

describe('CORS Middleware', () => {
  const OLD_ENV = process.env
  let app

  beforeEach(() => {
    jest.resetModules() // Limpia el caché de módulos
    process.env = { ...OLD_ENV } // Crea una copia del entorno original

    // Limpia específicamente las variables de CORS para asegurar un entorno limpio
    delete process.env.CORS_ORIGIN
    delete process.env.CORS_METHODS
    delete process.env.CORS_HEADERS
    delete process.env.CORS_CREDENTIALS
  })

  afterAll(() => {
    process.env = OLD_ENV // Restaura el entorno original
  })

  // Función auxiliar para configurar la aplicación con las variables de entorno actuales
  const setupApp = async () => {
    // Importa el middleware dinámicamente después de configurar las variables de entorno
    const { corsMiddleware } = await import('../src/middleware/corsMiddleware.js')

    app = express()
    app.use(corsMiddleware)
    app.get('/test', (req, res) => res.send('OK'))

    return app
  }

  it('should allow requests from allowed origins', async () => {
    // Configura las variables de entorno
    process.env.CORS_ORIGIN = 'http://example.com'

    // Configura la app con las nuevas variables
    await setupApp()

    const response = await request(app)
      .get('/test')
      .set('Origin', 'http://example.com')

    expect(response.headers['access-control-allow-origin']).toBe('http://example.com')
  })

  it('should deny requests from disallowed origins', async () => {
    process.env.CORS_ORIGIN = 'http://allowed.com'
    await setupApp()

    const response = await request(app)
      .get('/test')
      .set('Origin', 'http://forbidden.com')

    expect(response.headers['access-control-allow-origin']).not.toBe('http://forbidden.com')
  })

  it('should allow multiple origins if configured', async () => {
    process.env.CORS_ORIGIN = 'http://example.com,http://another.com'
    await setupApp()

    const response = await request(app)
      .get('/test')
      .set('Origin', 'http://another.com')

    expect(response.headers['access-control-allow-origin']).toBe('http://example.com,http://another.com')
  })

  it('should allow credentials when enabled', async () => {
    process.env.CORS_CREDENTIALS = 'true'
    await setupApp()

    const response = await request(app)
      .get('/test')
      .set('Origin', 'http://example.com')

    expect(response.headers['access-control-allow-credentials']).toBe('true')
  })

  it('should use default methods if none specified', async () => {
    await setupApp()

    const response = await request(app)
      .options('/test')
      .set('Origin', 'http://example.com')
      .set('Access-Control-Request-Method', 'GET')

    expect(response.headers['access-control-allow-methods']).toContain('GET')
    expect(response.headers['access-control-allow-methods']).toContain('POST')
  })
})
