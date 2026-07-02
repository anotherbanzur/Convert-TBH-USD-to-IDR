# TBH USD ke IDR

Ekstensi Chrome Manifest V3 untuk mengubah harga USD menjadi Rupiah pada
`taskbarhero.wiki`. Ekstensi memproses harga yang sudah ada dan harga baru yang
dimuat secara dinamis.

Paket siap unggah ke Chrome Web Store tersedia di folder `dist`. Materi listing,
justifikasi izin, dan petunjuk aset terdapat di `STORE_LISTING.md`.

## Instalasi

1. Buka `chrome://extensions` di Google Chrome.
2. Aktifkan **Developer mode** di kanan atas.
3. Klik **Load unpacked**.
4. Pilih folder proyek ini.
5. Buka atau refresh halaman `https://taskbarhero.wiki/market`.

Klik ikon ekstensi untuk menyalakan/mematikan konversi, memilih kurs otomatis,
atau memasukkan kurs manual.

## Kurs

- Mode otomatis mengambil kurs USD/IDR dari Frankfurter dan memperbaruinya
  setiap enam jam.
- Jika jaringan/API gagal, kurs terakhir yang tersimpan tetap digunakan.
- Kurs awal sebelum pembaruan pertama adalah Rp16.250 per USD.
- Perubahan kurs dan sakelar diterapkan langsung pada tab wiki yang terbuka.

Ekstensi hanya mengubah tampilan di browser. Data dan transaksi Steam Market
tidak diubah.
