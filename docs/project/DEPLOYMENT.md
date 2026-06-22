# Deployment

## Durum (2026-06-22)

| Bileşen | Durum | URL |
|---------|-------|-----|
| Frontend (Vercel) | Canlı | https://pawdock-ten.vercel.app |
| Backend (Railway) | Beklemede | Railway günlük servis oluşturma limiti (25/gün) |
| PostgreSQL (Railway) | Sağlandı | pawdock projesi içinde internal |

Backend servisi oluşturulamadı: Railway hesabı günlük 25 servis limitine ulaştı. PostgreSQL servisi başarıyla oluşturuldu. Limit sıfırlandığında `Retry Provision` workflow'u otomatik olarak backend servisini oluşturacaktır (her 6 saatte bir + manuel tetikleme).

## Frontend URL

- https://pawdock-ten.vercel.app (Vercel production)
- https://pawdock.vercel.app (alias)

## Backend URL (hedef)

- https://pawdock-backend-production.up.railway.app/api

## Environment Variables

### Frontend (Vercel)

- NEXT_PUBLIC_API_URL=https://pawdock-backend-production.up.railway.app/api

### Backend (Railway)

- DATABASE_URL (Railway PostgreSQL internal: postgres.railway.internal)
- JWT_SECRET
- FRONTEND_URL=https://pawdock-ten.vercel.app
- PORT=8080

## Demo Account

Email: demo@pawdock.com.tr

Password: demo123456

## Manuel Backend Sağlama

Actions → **Retry Provision** → Run workflow

Veya main branch'e push sonrası CI provision job'u otomatik çalışır.

## Railway Proje Bilgisi

- Project ID: `5ab28ddc-f452-4943-8710-2f20d1361b73`
- PostgreSQL Service ID: `8e255498-5307-40b6-bc87-599fa741286f`
- Backend Service: henüz oluşturulmadı (limit)
