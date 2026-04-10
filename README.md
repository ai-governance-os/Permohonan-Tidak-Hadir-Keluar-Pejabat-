# Permohonan Tidak Hadir / Keluar Pejabat

Aplikasi React + Vite untuk guru dan admin, deploy di Vercel, dengan data bersama merentas telefon menggunakan Vercel Functions + Postgres.

## Ringkasan

- Guru boleh log masuk dengan nama penuh dan menghantar permohonan.
- Admin log masuk dengan kata laluan yang disemak di server, bukan di frontend.
- Data disimpan dalam pangkalan data Postgres supaya semua pengguna nampak rekod yang sama.
- Tiada penggunaan Supabase.

## Seni Bina Ringkas

- Frontend: React + Vite
- Hosting: Vercel
- API: Vercel Functions dalam folder `api/`
- Database: Postgres melalui `DATABASE_URL` atau `POSTGRES_URL`

Kod ini sesuai jika anda mahu kekal dalam aliran `GitHub -> Vercel`, tetapi masih perlukan data dikongsi antara ramai pengguna dan banyak telefon.

## Environment Variables

Tetapkan di Vercel:

```bash
DATABASE_URL=postgres://user:password@host:5432/dbname
ADMIN_PASSWORD=CHB9008
SESSION_SECRET=tukar-kepada-rentetan-rahsia-yang-panjang
```

Nota:

- `DATABASE_URL` atau `POSTGRES_URL` diperlukan untuk simpan rekod.
- `ADMIN_PASSWORD` digunakan untuk log masuk admin.
- `SESSION_SECRET` digunakan untuk tandatangan token sesi admin.

## Jalankan Tempatan

Untuk frontend sahaja:

```bash
npm install
npm run dev
```

Untuk frontend + Vercel Functions sekali:

```bash
npm install
npm run dev:vercel
```

## Deploy Ke Vercel

1. Push repo ini ke GitHub.
2. Import repo ke Vercel.
3. Sambungkan pangkalan data Postgres dalam ekosistem Vercel atau tambah `DATABASE_URL` sendiri.
4. Tambah `ADMIN_PASSWORD` dan `SESSION_SECRET`.
5. Deploy.

`vercel.json` telah dikemas kini supaya route frontend seperti `/guru` dan `/admin` berfungsi, sambil mengekalkan `/api/*` untuk Vercel Functions.
