import cors from 'cors'

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: process.env.CORS_HEADERS || 'Content-Type,Authorization',
  credentials: Boolean(process.env.CORS_CREDENTIALS === 'true'),
  optionsSuccessStatus: 204
}

export const corsMiddleware = cors(corsOptions)
