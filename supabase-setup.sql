-- ============================================================
-- Jalankan SQL ini di Supabase > SQL Editor
-- ============================================================

-- Jadual permohonan tidak hadir
CREATE TABLE permohonan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guru_nama TEXT NOT NULL,
  tarikh_mula DATE NOT NULL,
  tarikh_tamat DATE NOT NULL,
  masa_mula TIME NOT NULL,
  masa_tamat TIME NOT NULL,
  kelas TEXT NOT NULL,
  sebab TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'diluluskan', 'ditolak')),
  catatan_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Benarkan akses tanpa login (anon key)
ALTER TABLE permohonan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benarkan semua operasi" ON permohonan
  FOR ALL USING (true) WITH CHECK (true);
