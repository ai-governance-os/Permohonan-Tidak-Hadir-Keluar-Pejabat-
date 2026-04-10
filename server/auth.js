import crypto from 'node:crypto'

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || 'CHB9008'
}

function getSessionSecret() {
  return process.env.SESSION_SECRET || getAdminPassword()
}

function toBase64Url(value) {
  return Buffer.from(value).toString('base64url')
}

function createSignature(payload) {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64url')
}

export function verifyAdminPassword(password) {
  return password === getAdminPassword()
}

export function issueAdminToken() {
  const payload = toBase64Url(JSON.stringify({
    peranan: 'admin',
    exp: Date.now() + (1000 * 60 * 60 * 12),
  }))

  const signature = createSignature(payload)
  return `${payload}.${signature}`
}

export function verifyAdminToken(token) {
  if (!token || !token.includes('.')) return false

  const [payload, signature] = token.split('.')
  const expected = createSignature(payload)

  if (!signature || signature.length !== expected.length) {
    return false
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return false
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return parsed?.peranan === 'admin' && Number(parsed?.exp) > Date.now()
  } catch {
    return false
  }
}

export function getBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || ''
  if (!header.startsWith('Bearer ')) return ''
  return header.slice(7)
}
