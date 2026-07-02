# Materi Chrome Web Store

## Nama

TBH USD ke IDR

## Ringkasan singkat

Konversi harga USD ke Rupiah secara otomatis di halaman Market Wiki Taskbar Hero.

## Deskripsi

TBH USD ke IDR membantu pemain Indonesia membaca harga pada halaman Market
Taskbar Hero Wiki tanpa menghitung nilai Rupiah secara manual.

Fitur:

- Mengubah harga USD menjadi IDR langsung pada halaman wiki.
- Menangani harga baru yang muncul saat halaman dimuat secara dinamis.
- Memperbarui kurs USD/IDR secara otomatis setiap enam jam.
- Menyediakan kurs manual jika Anda ingin memakai nilai sendiri.
- Dapat dinyalakan atau dimatikan dari popup ekstensi.
- Mengembalikan harga asli saat konversi dimatikan.

Ekstensi hanya mengubah tampilan harga di browser. Ekstensi tidak mengubah data
Wiki, harga Steam Market, maupun transaksi pengguna.

## Kategori

Tools

## Bahasa

Bahasa Indonesia

## Single purpose

Mengonversi tampilan harga USD menjadi IDR pada situs Taskbar Hero Wiki.

## Justifikasi izin

- `storage`: menyimpan status aktif, pilihan kurs otomatis/manual, kurs terakhir,
  dan waktu pembaruan secara lokal.
- `alarms`: memperbarui kurs otomatis setiap enam jam.
- Akses `taskbarhero.wiki`: membaca dan mengubah teks harga yang terlihat pada
  situs agar ditampilkan dalam Rupiah.
- Akses `api.frankfurter.dev`: mengambil satu nilai kurs USD/IDR melalui HTTPS.

## Remote code

Pilih **No, I am not using remote code**. Semua JavaScript berada di dalam
paket. Respons API hanya berupa data JSON kurs dan tidak pernah dieksekusi.

## Penggunaan data

Ekstensi tidak mengumpulkan, menjual, atau membagikan data pengguna. Pengaturan
disimpan lokal melalui `chrome.storage.local`. Tidak ada analytics, akun,
cookie pelacakan, atau server milik pengembang.

## Aset unggahan

- Ikon ekstensi: `icons/icon128.png` sudah berada dalam ZIP.
- Screenshot: `store-assets/screenshot-1280x800.png`.
- Small promo tile: `store-assets/promo-440x280.png`.
- Privacy policy: publikasikan `PRIVACY_POLICY.md` pada URL HTTPS publik, lalu
  masukkan URL tersebut di tab Privacy.
