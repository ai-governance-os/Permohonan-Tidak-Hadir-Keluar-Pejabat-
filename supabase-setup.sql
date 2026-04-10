-- ============================================================
-- LANGKAH 1: Jalankan SQL ini di Supabase SQL Editor
-- ============================================================

-- Jadual profil pengguna
CREATE TABLE profil (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nama TEXT NOT NULL,
  peranan TEXT NOT NULL CHECK (peranan IN ('guru', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jadual permohonan tidak hadir
CREATE TABLE permohonan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guru_id UUID REFERENCES profil(id) ON DELETE CASCADE NOT NULL,
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

-- ============================================================
-- LANGKAH 2: Aktifkan Row Level Security
-- ============================================================

ALTER TABLE profil ENABLE ROW LEVEL SECURITY;
ALTER TABLE permohonan ENABLE ROW LEVEL SECURITY;

-- Profil: pengguna boleh baca profil sendiri
CREATE POLICY "Baca profil sendiri" ON profil
  FOR SELECT USING (auth.uid() = id);

-- Permohonan: guru hanya boleh baca permohonan sendiri
CREATE POLICY "Guru baca permohonan sendiri" ON permohonan
  FOR SELECT USING (guru_id = auth.uid());

-- Permohonan: guru boleh hantar permohonan
CREATE POLICY "Guru hantar permohonan" ON permohonan
  FOR INSERT WITH CHECK (guru_id = auth.uid());

-- Permohonan: admin boleh baca semua
CREATE POLICY "Admin baca semua permohonan" ON permohonan
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profil WHERE id = auth.uid() AND peranan = 'admin')
  );

-- Permohonan: admin boleh kemaskini status
CREATE POLICY "Admin kemaskini permohonan" ON permohonan
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profil WHERE id = auth.uid() AND peranan = 'admin')
  );

-- ============================================================
-- LANGKAH 3: Trigger auto-buat profil selepas daftar
-- ============================================================

CREATE OR REPLACE FUNCTION buat_profil_baru()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profil (id, nama, peranan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nama', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'peranan', 'guru')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_buat_profil
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION buat_profil_baru();

-- ============================================================
-- LANGKAH 4: Daftar pengguna admin pertama secara manual
-- Guna Supabase Dashboard > Authentication > Add User
-- Kemudian jalankan:
-- UPDATE profil SET peranan = 'admin' WHERE nama = 'Nama Admin';
-- ============================================================
