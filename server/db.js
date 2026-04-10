import pg from 'pg'

const { Pool } = pg

function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ''
  )
}

function needsSsl(connectionString) {
  return connectionString && !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1')
}

const connectionString = getConnectionString()

if (!globalThis.__permohonanPool) {
  globalThis.__permohonanPool = connectionString
    ? new Pool({
        connectionString,
        ssl: needsSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
      })
    : null
}

const pool = globalThis.__permohonanPool

let schemaPromise

export function isDatabaseConfigured() {
  return Boolean(connectionString && pool)
}

export async function ensureSchema() {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_URL atau POSTGRES_URL belum ditetapkan.')
  }

  if (!schemaPromise) {
    schemaPromise = pool.query(`
      CREATE TABLE IF NOT EXISTS permohonan (
        id TEXT PRIMARY KEY,
        guru_nama TEXT NOT NULL,
        tarikh_mula DATE NOT NULL,
        tarikh_tamat DATE NOT NULL,
        masa_mula TEXT NOT NULL,
        masa_tamat TEXT NOT NULL,
        sebab TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'menunggu',
        catatan_admin TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_permohonan_created_at ON permohonan (created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_permohonan_guru_nama ON permohonan (guru_nama);
      CREATE INDEX IF NOT EXISTS idx_permohonan_status ON permohonan (status);
    `)
  }

  await schemaPromise
}

export async function query(text, params = []) {
  await ensureSchema()
  return pool.query(text, params)
}
