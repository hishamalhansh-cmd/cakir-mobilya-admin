# Çakir Mobilya - Cloudflare Pages Admin Projesi

Bu proje:
- Cloudflare Pages üzerinde çalışır
- Pages Functions kullanır
- D1 ile veri tutar
- R2 ile görsel saklar
- /admin üzerinden yönetim paneli sunar

## İçerik
- `public/` : site ve admin arayüzü
- `functions/` : Cloudflare Pages Functions API
- `schema.sql` : D1 tabloları
- `wrangler.toml` : proje ayarları

## Gerekli Bağlantılar
Cloudflare Project -> Settings -> Bindings
- D1 binding adı: `DB`
- R2 binding adı: `IMAGES`

## D1
Önce `schema.sql` içeriğini D1 Console içine çalıştır.

## Admin giriş
- Kullanıcı adı: `Hisham`
- Şifre: `Hisham33`

## Önemli
Bu ilk sürümde:
- giriş çerezi imzalıdır
- admin sayfası /admin.html
- API uçları /api altında çalışır
- site ana sayfası verileri API'den okuyabilir

## Yayınlama
1. Bu klasörü bilgisayara indir
2. Cloudflare Pages projesi oluştur
3. Bu projeyi yükle
4. D1 ve R2 binding ekle
5. Deploy et

## Sonraki adım
İstersen mevcut tasarladığımız görsel ana sayfayı bu yeni sisteme tam entegre edebiliriz.


## Hazır değerler
- D1 Database ID eklendi
- AUTH_SECRET eklendi
