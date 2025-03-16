/* globals describe, expect, it */
import ResponseBuilder from '../src/utils/responseBuilder.js'

describe('ResponseBuilder', () => {
  it('should generate a success response', () => {
    const response = ResponseBuilder.success('Success message', { key: 'value' })

    expect(response).toHaveProperty('metadata')
    expect(response.metadata.success).toBe(true)
    expect(response.metadata.message).toBe('Success message')
    expect(response.metadata).toHaveProperty('timestamp')
    expect(response.metadata).toHaveProperty('executionTime', null)
    expect(response).toHaveProperty('data')
    expect(response.data).toEqual({ key: 'value' })
  })

  it('should generate an error response', () => {
    const response = ResponseBuilder.error('Error message', 400)

    expect(response).toHaveProperty('metadata')
    expect(response.metadata.success).toBe(false)
    expect(response.metadata.message).toBe('Error message')
    expect(response.metadata).toHaveProperty('timestamp')
    expect(response.metadata).toHaveProperty('executionTime', null)
    expect(response).toHaveProperty('data', null)
    expect(response).toHaveProperty('statusCode', 400)
  })
})
