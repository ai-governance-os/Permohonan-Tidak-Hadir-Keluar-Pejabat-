export function sendJson(res, statusCode, payload) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.status(statusCode).json(payload)
}

export function sendError(res, statusCode, message) {
  return sendJson(res, statusCode, { success: false, error: message })
}

export function parseBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }

  return req.body
}
