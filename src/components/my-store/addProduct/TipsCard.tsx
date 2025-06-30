import React, { FC } from 'react'
import { Lightbulb } from './Icon';


const TipsCard: FC<{ activeField: string | null }> = ({ activeField }) => {
    let title = 'Informasi & Bantuan';
    let content: React.ReactNode = (<p className="text-xs text-gray-500">Arahkan kursor ke input untuk melihat tips yang relevan.</p>);

    switch (activeField) {
        case 'photo':
            title = 'Tips Foto & Video Produk';
            content = (
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                    <li>Gunakan foto dengan cahaya cukup & background jelas.</li>
                    <li>Rasio foto 1:1 (persegi). Ukuran video maks 30MB.</li>
                    <li>Hindari teks atau watermark pada foto utama.</li>
                    <li>Tunjukkan produk dari berbagai sudut.</li>
                </ul>
            );
            break;
        case 'productName':
            title = 'Tips Nama Produk';
            content = (
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                    <li>Gunakan format: <strong>Merek + Jenis Produk + Keterangan</strong>.</li>
                    <li>Contoh: <i>Baju Sasirangan Idola Kemeja Pria Lengan Panjang.</i></li>
                    <li>Pastikan produk tidak melanggar kebijakan.</li>
                </ul>
            );
            break;
        case 'description':
            title = 'Tips Deskripsi Produk';
            content = (
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                    <li>Jelaskan detail produk secara lengkap.</li>
                    <li>Sebutkan keunggulan dan bahan yang digunakan.</li>
                    <li>Tambahkan informasi ukuran (size chart) jika ada.</li>
                    <li>Gunakan paragraf agar mudah dibaca.</li>
                </ul>
            );
            break;
        case 'category':
            title = 'Tips Kategori Produk';
            content = (
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                    <li>Pilih kategori yang paling spesifik dan relevan.</li>
                    <li>Kategori yang tepat membantu pembeli menemukan produk Anda.</li>
                    <li>Kesalahan kategori dapat menyebabkan produk sulit ditemukan.</li>
                </ul>
            );
            break;
        case 'specs':
            title = 'Tips Spesifikasi';
            content = (
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                    <li>Isi semua atribut yang tersedia dengan akurat.</li>
                    <li>Spesifikasi lengkap meningkatkan kepercayaan pembeli.</li>
                    <li>Informasi seperti Merek dan Negara Asal sangat penting.</li>
                </ul>
            );
            break;
        case 'sales-info':
        case 'variations':
            title = 'Tips Informasi Penjualan';
            content = (
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                    <li>Atur harga yang kompetitif.</li>
                    <li>Gunakan variasi untuk produk dengan banyak pilihan (misal: warna, ukuran).</li>
                    <li>Pastikan stok selalu update untuk menghindari pembatalan.</li>
                    <li>SKU (Kode Variasi) membantu Anda mengelola stok.</li>
                </ul>
            );
            break;
        case 'shipping':
            title = 'Tips Pengiriman';
            content = (
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                    <li>Timbang berat produk setelah dikemas (termasuk bubble wrap/kardus).</li>
                    <li>Kesalahan berat dapat menyebabkan selisih ongkos kirim.</li>
                    <li>Ukur dimensi paket untuk menghitung berat volumetrik.</li>
                    <li>Aktifkan asuransi untuk produk bernilai tinggi.</li>
                </ul>
            );
            break;
        case 'lainnya':
            title = 'Tips Lainnya';
            content = (
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                    <li>Jujur mengenai kondisi produk (Baru atau Pernah Dipakai).</li>
                    <li>SKU Induk digunakan untuk mengelompokkan produk yang sama.</li>
                    <li>Gunakan fitur &quot;Jadwal Ditampilkan &quot; untuk meluncurkan produk di waktu tertentu.</li>
                </ul>
            );
            break;
        default:
            break;
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
                <h3 className="font-semibold mb-2 text-blue-600">{title}</h3>
                <Lightbulb className="text-yellow-400" size={20} />
            </div>
            {content}
        </div>
    );
};



export default TipsCard