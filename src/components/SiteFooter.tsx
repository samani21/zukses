import React, { FC } from "react";

const SiteFooter: FC = () => {
  /* --- Daftar kategori persis seperti di desain (3 kolom) --- */
  const col1 = [
    "Pakaian Wanita",
    "Pakaian Pria",
    "Elektronik",
    "Perawatan & Kecantikan",
    "Handphone & Aksesoris",
    "Fashion Muslim",
    "Perlengkapan Rumah",
    "Sepatu Pria",
    "Sepatu Wanita",
  ];

  const col2 = [
    "Alat Tulis",
    "Buku & Majalah",
    "Komputer & Aksesoris",
    "Mobil",
    "Sepeda Motor",
    "Tas Wanita",
    "Tas Pria",
    "Jam Tangan",
  ];

  const col3 = [
    "Ibu & Bayi",
    "Fashion Bayi & Anak",
    "Olahraga & Outdoor",
    "Makanan & Minuman",
    "Audio",
    "Koper & Tas Travel",
    "Aksesoris Fashion",
    "Hewan Peliharaan",
    "Kamera & Drone",
    "Kesehatan",
  ];

  return (
    <footer className="bg-white pt-12 pb-16 text-gray-800">
      <div className="container mx-auto px-4">

        <section className="max-w-5xl mb-10">
          <h3 className="font-semibold text-lg mb-2">
            Nikmati Mudahnya Jual Beli di Zukses
          </h3>
          <p className="text-sm leading-relaxed mb-6">
            Zukses adalah platform mobile asli Indonesia yang menghadirkan
            pengalaman jual beli online yang mudah, aman, dan menyenangkan
            langsung dari ponsel Anda. Nikmati berbagai penawaran menarik,
            serta kemudahan dalam mendaftarkan produk jualan dan berbelanja
            kapan pun dan di mana pun. Bergabunglah bersama jutaan pengguna
            lainnya dan rasakan transaksi yang praktis dan terpercaya dengan
            Zukses. Transaksi aman, peluang tanpa batas. Mulai sekarang bersama
            Zukses!
          </p>

          <h3 className="font-semibold text-lg mb-2">
            Temukan segala kebutuhanmu dengan harga terbaik hanya di Zukses.
          </h3>
          <p className="text-sm leading-relaxed">
            Zukses adalah pusat perbelanjaan online yang menghadirkan pengalaman
            belanja modern, di mana kamu bisa mengikuti penjual favorit dan
            mendapatkan update produk terbaru secara langsung. Nikmati kemudahan
            berbagi produk melalui media sosial hanya dengan satu klik—baik
            untuk promosi barang jualanmu maupun membagikan temuan menarik
            kepada teman. <br />
            Berbelanja di Zukses lebih aman dan nyaman. <br />
            Cek rating dan ulasan toko secara transparan untuk menemukan penjual
            terpercaya. Kami berkomitmen untuk selalu menjaga keamanan setiap
            transaksi demi kenyamanan seluruh pengguna.
          </p>
        </section>

        {/* ---------- BAGIAN BAWAH (GRID) ---------- */}
        <div className="grid md:grid-cols-12 gap-10">
          {/* KOLON KATEGORI */}
          <div className="md:col-span-7">
            <h4 className="font-semibold text-base mb-4">Kategori</h4>
            <div className="grid grid-cols-3 gap-x-8">
              {[col1, col2, col3].map((list, idx) => (
                <ul key={idx} className="space-y-1 text-sm">
                  {list.map((item) => (
                    <li key={item} className="whitespace-nowrap">
                      {item}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          {/* KOLON KANAN */}
          <div className="md:col-span-5 space-y-6">
            <h2 className="text-3xl font-semibold">Zukses</h2>

            <div>
              <p className="text-sm font-semibold mb-2">
                Download Aplikasi Zukses di&nbsp;:
              </p>
              <div className="flex items-center space-x-4">
                <img
                  src="/icon/Google_Play_Store_badge_EN.svg.webp"
                  alt="Google Play"
                  className="h-12"
                />
                <img
                  src="/icon/apple_apps_store.png"
                  alt="App Store"
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold">Punya Pertanyaan? :</p>
              <p className="text-sm font-semibold leading-relaxed">
                Hubungi Layanan Pelanggan Kami <br />
                085&nbsp;394&nbsp;333&nbsp;301
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
