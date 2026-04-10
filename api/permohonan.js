import { randomUUID } from 'node:crypto'
import { getBearerToken, verifyAdminToken } from '../server/auth.js'
import { isDatabaseConfigured, query } from '../server/db.js'
import { parseBody, sendError, sendJson } from '../server/http.js'

function normalizeRow(row) {
  return {
    ...row,
    catatan_admin: row.catatan_admin || '',
  }
}

function requireAdmin(req, res) {
  const token = getBearerToken(req)
  if (!verifyAdminToken(token)) {
    sendError(res, 401, 'Sesi admin tidak sah atau telah tamat.')
    return false
  }

  return true
}

function validatePermohonan(body) {
  const requiredFields = [
    'guru_nama',
    'tarikh_mula',
    'tarikh_tamat',
    'masa_mula',
    'masa_tamat',
    'kelas',
    'sebab',
  ]

  for (const field of requiredFields) {
    if (!String(body[field] || '').trim()) {
      return `Medan ${field} diperlukan.`
    }
  }

  if (body.tarikh_tamat < body.tarikh_mula) {
    return 'Tarikh tamat tidak boleh lebih awal daripada tarikh mula.'
  }

  return ''
}

export default async function handler(req, res) {
  if (!isDatabaseConfigured()) {
    return sendError(res, 500, 'Pangkalan data belum dikonfigurasikan pada Vercel.')
  }

  try {
    if (req.method === 'GET') {
      const guruNama = String(req.query.guru_nama || '').trim()

      if (guruNama) {
        const result = await query(
          'SELECT * FROM permohonan WHERE guru_nama = $1 ORDER BY created_at DESC',
          [guruNama],
        )

        return sendJson(res, 200, {
          success: true,
          data: result.rows.map(normalizeRow),
        })
      }

      if (!requireAdmin(req, res)) return

      const result = await query('SELECT * FROM permohonan ORDER BY created_at DESC')
      return sendJson(res, 200, {
        success: true,
        data: result.rows.map(normalizeRow),
      })
    }

    if (req.method === 'POST') {
      const body = parseBody(req)
      const validationError = validatePermohonan(body)

      if (validationError) {
        return sendError(res, 400, validationError)
      }

      const result = await query(
        `
          INSERT INTO permohonan (
            id,
            guru_nama,
            tarikh_mula,
            tarikh_tamat,
            masa_mula,
            masa_tamat,
            kelas,
            sebab,
            status,
            catatan_admin
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'menunggu', '')
          RETURNING *
        `,
        [
          randomUUID(),
          String(body.guru_nama).trim(),
          body.tarikh_mula,
          body.tarikh_tamat,
          body.masa_mula,
          body.masa_tamat,
          String(body.kelas).trim(),
          String(body.sebab).trim(),
        ],
      )

      return sendJson(res, 201, {
        success: true,
        data: normalizeRow(result.rows[0]),
      })
    }

    if (req.method === 'PATCH') {
      if (!requireAdmin(req, res)) return

      const id = String(req.query.id || '').trim()
      const body = parseBody(req)
      const status = String(body.status || '').trim()
      const catatan = String(body.catatan_admin || '')

      if (!id) {
        return sendError(res, 400, 'ID permohonan diperlukan.')
      }

      if (!['menunggu', 'diluluskan', 'ditolak'].includes(status)) {
        return sendError(res, 400, 'Status tidak sah.')
      }

      const result = await query(
        `
          UPDATE permohonan
          SET status = $2, catatan_admin = $3, updated_at = NOW()
          WHERE id = $1
          RETURNING *
        `,
        [id, status, catatan],
      )

      if (!result.rowCount) {
        return sendError(res, 404, 'Permohonan tidak ditemui.')
      }

      return sendJson(res, 200, {
        success: true,
        data: normalizeRow(result.rows[0]),
      })
    }

    return sendError(res, 405, 'Kaedah tidak dibenarkan.')
  } catch (error) {
    console.error('API permohonan error:', error)
    return sendError(res, 500, 'Ralat pelayan semasa memproses permohonan.')
  }
}
