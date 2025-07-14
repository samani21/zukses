import { useTipsStore } from 'components/stores/tipsStore';

const tipsContent: { [key: string]: React.ReactNode } = {
    default: (
        <>
            <p className="font-semibold text-gray-800">Selamat Datang di Halaman Tambah Produk!</p>
            <p>Arahkan mouse Anda ke setiap kolom isian untuk mendapatkan tips & trik agar produk Anda semakin menarik bagi pembeli.</p>
        </>
    ),
    photo: (
        <>
            <h4 className="font-bold text-gray-800">Tips Foto Produk Utama</h4>
            <p>Gunakan foto resolusi tinggi dengan background polos (putih/abu-abu).</p>
            <p>Tampilkan produk dari berbagai sisi: depan, belakang, samping, dan detail penting.</p>
            <p>Pastikan pencahayaan cukup agar warna produk sesuai aslinya.</p>
        </>
    ),
    promoPhoto: (
        <>
            <h4 className="font-bold text-gray-800">Tips Foto Promosi (SEO)</h4>
            <p>Foto ini adalah &apos;wajah&apos; produk Anda di hasil pencarian. Gunakan foto paling menarik yang membuat orang ingin klik.</p>
            <p>Pastikan produk terlihat jelas bahkan saat gambar ditampilkan dalam ukuran kecil.</p>
        </>
    ),
    video: (
        <>
            <h4 className="font-bold text-gray-800">Tips Video Produk</h4>
            <p>Durasi ideal: 15-30 detik untuk menjaga perhatian pembeli.</p>
            <p>Tunjukkan cara penggunaan, keunggulan, atau detail produk yang tidak terlihat di foto.</p>
            <p>Gunakan format video vertikal (seperti Reels/Shorts) agar lebih mobile-friendly.</p>
        </>
    ),
    name: (
        <>
            <h4 className="font-bold text-gray-800">Tips Nama Produk</h4>
            <p>Gunakan formula: <strong>Merek + Model/Tipe + Spesifikasi Utama + Ukuran/Warna</strong>.</p>
            <p>Contoh: &qout;Sasirangan Khas Banjarmasin - Kemeja Pria Lengan Panjang Katun - Motif Naga, Hitam&qout;.</p>
            <p>Nama yang jelas membantu produk mudah ditemukan.</p>
        </>
    ),
    category: (
        <>
            <h4 className="font-bold text-gray-800">Tips Memilih Kategori</h4>
            <p>Pilih kategori yang paling spesifik. Ini membantu pembeli yang serius untuk menemukan produk Anda.</p>
            <p>Hindari kategori &apos;Lainnya&apos; jika tidak terpaksa. Kategori yang akurat meningkatkan visibilitas produk.</p>
        </>
    ),
    description: (
        <>
            <h4 className="font-bold text-gray-800">Tips Deskripsi Produk</h4>
            <p>Jelaskan fitur dan manfaat produk secara rinci. Apa masalah yang bisa diselesaikan oleh produk Anda?</p>
            <p>Sertakan spesifikasi lengkap: bahan, dimensi, berat, dan apa saja yang didapat dalam paket.</p>
            <p>Gunakan paragraf pendek dan poin-poin agar mudah dibaca.</p>
        </>
    ),
    brand: (
        <>
            <h4 className="font-bold text-gray-800">Tips Merek Produk</h4>
            <p>Isi dengan merek resmi jika ada. Jika produk Anda buatan sendiri (handmade), Anda bisa gunakan nama toko Anda.</p>
            <p>Konsistensi dalam penamaan merek akan membangun kepercayaan pelanggan.</p>
        </>
    ),
    variation: (
        <>
            <h4 className="font-bold text-gray-800">Tips Variasi Produk</h4>
            <p>Gunakan nama variasi yang umum seperti &apos;Warna&apos; atau &apos;Ukuran&apos;.</p>
            <p>Untuk Opsi, berikan nama yang jelas. Contoh: &apos;Merah Maroon&apos;, &apos;Biru Dongker&apos;, atau &apos;L&apos;, &apos;XL&apos;.</p>
            <p>Jangan lupa upload foto untuk setiap variasi warna agar pembeli tidak ragu.</p>
        </>
    ),
    priceStock: (
        <>
            <h4 className="font-bold text-gray-800">Tips Harga & Stok</h4>
            <p>Lakukan riset harga kompetitor. Tetapkan harga yang bersaing namun tetap menguntungkan.</p>
            <p>Pastikan jumlah stok yang diinput sesuai dengan stok fisik di gudang Anda untuk menghindari pembatalan pesanan.</p>
        </>
    ),
    weightDimension: (
        <>
            <h4 className="font-bold text-gray-800">Tips Berat & Dimensi</h4>
            <p>Masukkan berat produk <strong>setelah dikemas</strong> (termasuk bubble wrap/kardus).</p>
            <p>Data yang akurat sangat penting untuk perhitungan ongkos kirim otomatis agar tidak ada selisih.</p>
        </>
    ),
    purchaseLimit: (
        <>
            <h4 className="font-bold text-gray-800">Tips Min/Maks Pembelian</h4>
            <p>Atur jumlah pembelian minimum jika Anda menargetkan penjualan grosir.</p>
            <p>Atur jumlah maksimum untuk produk edisi terbatas atau saat promo besar untuk mencegah penimbunan.</p>
        </>
    ),
    dangerousGoods: (
        <>
            <h4 className="font-bold text-gray-800">Tips Produk Berbahaya</h4>
            <p>Pilih &apos;Ya&apos; jika produk mengandung baterai, magnet, cairan, atau aerosol.</p>
            <p>Informasi ini penting bagi kurir untuk penanganan khusus agar paket Anda aman sampai tujuan.</p>
        </>
    ),
    preorder: (
        <>
            <h4 className="font-bold text-gray-800">Tips Pre-Order</h4>
            <p>Aktifkan fitur ini hanya jika Anda benar-benar butuh waktu lebih untuk membuat produk (misal: custom).</p>
            <p>Tetapkan waktu pengerjaan yang realistis (lebih baik lebih cepat dari janji) agar reputasi toko terjaga.</p>
        </>
    ),
    condition: (
        <>
            <h4 className="font-bold text-gray-800">Tips Kondisi Produk</h4>
            <p>Jujurlah mengenai kondisi produk. &apos;Baru&apos; berarti belum pernah dipakai sama sekali.</p>
            <p>Jika &apos;Bekas&apos;, jelaskan secara detail kekurangannya di deskripsi untuk membangun kepercayaan.</p>
        </>
    ),
    sku: (
        <>
            <h4 className="font-bold text-gray-800">Tips SKU Induk</h4>
            <p>SKU (Stock Keeping Unit) adalah kode unik internal Anda untuk melacak produk.</p>
            <p>Buat format yang mudah Anda pahami. Contoh: KMJ-FLNL-MRH-L (Kemeja-Flanel-Merah-L).</p>
        </>
    ),
    cod: (
        <>
            <h4 className="font-bold text-gray-800">Tips Pembayaran di Tempat (COD)</h4>
            <p>Mengaktifkan COD dapat menjangkau lebih banyak pembeli, terutama di Banjarmasin.</p>
            <p>Namun, waspadai risiko paket retur (dikembalikan). Pastikan Anda siap menanggung ongkos kirim jika itu terjadi.</p>
        </>
    ),
    schedule: (
        <>
            <h4 className="font-bold text-gray-800">Tips Jadwal Ditampilkan</h4>
            <p>Jadwalkan produk untuk tayang pada jam ramai, seperti jam makan siang (12:00-13:00 WITA) atau malam hari (19:00-21:00 WITA).</p>
            <p>Ini bisa meningkatkan visibilitas awal untuk produk baru Anda.</p>
        </>
    )
};


export default function TipsCard() {
    const tipKey = useTipsStore((state) => state.tipKey);

    return (
        <div className="bg-white rounded-[10px] shadow-sm border border-[#DDDDDD] w-[236px]">
            <div className="space-y-2 p-4 text-[#333333] text-[14px]">
                {tipsContent[tipKey] || tipsContent['default']}
            </div>
        </div>
    );
}