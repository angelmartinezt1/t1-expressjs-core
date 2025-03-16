export default class ResponseBuilder {
  static success (message, data = null, pagination = null) {
    return {
      metadata: {
        success: true,
        message,
        timestamp: new Date().toISOString(),
        executionTime: null // Campo preparado para el futuro
      },
      data,
      pagination
    }
  }

  static error (message, statusCode = 500) {
    return {
      metadata: {
        success: false,
        message,
        timestamp: new Date().toISOString(),
        executionTime: null
      },
      data: null,
      statusCode
    }
  }
}
