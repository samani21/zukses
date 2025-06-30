export const variationNameRecommendations = ['Warna', 'Ukuran', 'Model', 'Bahan'];
export const variationOptionRecommendations: { [key: string]: string[] } = {
  'Warna': ['Merah', 'Oranye', 'Kuning', 'Hijau', 'Biru', 'Ungu', 'Merah Muda', 'Hijau Tua', 'Biru Muda', 'Hitam', 'Putih', 'Abu-abu'],
  'Ukuran': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'All Size'],
  'Model': ['Lengan Panjang', 'Lengan Pendek', 'Tanpa Lengan', 'Crop Top'],
  'Bahan': ['Katun', 'Poliester', 'Sutra', 'Denim', 'Kulit']
};

export const tooltips: Record<string, string> = {
  photo: "Gunakan foto rasio 1:1, background jelas, dan pencahayaan cukup. Tunjukkan produk dari berbagai sudut.",
  video: "Video maksimal 30MB. Tunjukkan cara penggunaan atau detail produk yang tidak terlihat di foto.",
  productName: "Gunakan format: Merek + Jenis Produk + Keterangan. Contoh: Baju Sasirangan Idola Kemeja Pria.",
  category: "Pilih kategori yang paling spesifik untuk membantu pembeli menemukan produk Anda.",
  description: "Jelaskan detail, keunggulan, bahan, dan sertakan tabel ukuran (size chart) jika perlu.",
  specifications: "Isi semua atribut dengan akurat. Spesifikasi lengkap meningkatkan kepercayaan pembeli.",
  variations: "Gunakan untuk produk dengan banyak pilihan (misal: warna, ukuran). SKU membantu Anda mengelola stok.",
  shipping: "Timbang berat produk setelah dikemas. Ukur dimensi paket untuk menghindari selisih ongkos kirim.",
  preorder: "Aktifkan jika Anda butuh waktu lebih dari 2 hari untuk menyiapkan produk.",
  condition: "Jujur mengenai kondisi produk Anda, apakah 'Baru' atau 'Pernah Dipakai'.",
  parentSku: "Gunakan SKU Induk untuk mengelompokkan produk yang sama dengan variasi berbeda."
};
