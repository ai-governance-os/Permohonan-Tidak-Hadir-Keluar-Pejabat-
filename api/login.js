import { issueAdminToken, verifyAdminPassword } from '../server/auth.js'
import { sendError, sendJson, parseBody } from '../server/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Kaedah tidak dibenarkan.')
  }

  const { password = '' } = parseBody(req)

  if (!verifyAdminPassword(password)) {
    return sendError(res, 401, 'Kata laluan admin tidak betul.')
  }

  return sendJson(res, 200, {
    success: true,
    data: {
      nama: 'Admin',
      peranan: 'admin',
      token: issueAdminToken(),
    },
  })
}
