# Permohonan Tidak Hadir / Keluar Pejabat

Aplikasi React + Vite yang disederhanakan untuk deploy terus dari GitHub ke Vercel tanpa Supabase.

## Ringkasan

- Login guru menggunakan nama penuh.
- Login admin menggunakan kata laluan dari `VITE_ADMIN_PASSWORD`.
- Semua data permohonan disimpan dalam `localStorage` browser.
- Sesuai untuk demo, kegunaan pada satu peranti, atau aliran kerja yang tidak memerlukan pangkalan data luaran.

## Penting

Versi ini tidak menggunakan backend. Ini bermaksud:

- Data hanya wujud dalam browser dan peranti yang sama.
- Jika tukar browser, tukar peranti, atau padam site data, rekod akan hilang.
- Untuk kegunaan ramai pengguna secara serentak, kita perlu tambah backend kemudian.

## Jalankan Secara Tempatan

```bash
npm install
npm run dev
```

## Environment Variable

Salin `.env.example` kepada `.env.local` jika mahu tukar kata laluan admin:

```bash
VITE_ADMIN_PASSWORD=CHB9008
```

## Deploy Ke Vercel

1. Push repo ini ke GitHub.
2. Import repo tersebut ke Vercel.
3. Set `Framework Preset` kepada `Vite`.
4. Tambah environment variable `VITE_ADMIN_PASSWORD` jika mahu ubah kata laluan admin.
5. Deploy.

`vercel.json` telah disediakan supaya route seperti `/guru` dan `/admin` boleh dibuka terus di Vercel.
