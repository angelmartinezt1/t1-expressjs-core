import cors from 'cors'

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || '*', // Permitir múltiples orígenes separados por comas
  methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: process.env.CORS_HEADERS || 'Content-Type,Authorization',
  credentials: process.env.CORS_CREDENTIALS === 'true', // Convertir string a boolean
  optionsSuccessStatus: 204
}

export const corsMiddleware = cors(corsOptions)
