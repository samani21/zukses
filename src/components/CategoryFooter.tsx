import React, { FC, useEffect, useState } from 'react';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';

const zuksesLinks = [
  "Tentang Kami", "Edukasi", "Artikel", "Kebijakan Privaxy",
  "Mulai Berjualan", "Pusat Bantuan"
];

// Tipe untuk props komponen ListColumn
interface ListColumnProps {
  title?: string; // Judul bersifat opsional
  items: string[];
}


// Komponen untuk setiap kolom list, sekarang lebih fleksibel
const ListColumn: FC<ListColumnProps> = ({ title, items }) => (
  <div>
    {/* Bagian ini memastikan ada ruang untuk judul, menjaga semua list tetap sejajar */}
    <div className="h-8">
      {title && title != "Zukses" && <h4 className="font-semibold text-[21px] text-[#0D915E]" style={{ lineHeight: "22px", letterSpacing: "-0.04em" }}>{title}</h4>}
    </div>
    <ul className="space-y-2 text-xs text-gray-600">
      {items.map((item) => (
        <li key={item}>
          <a href="#" className="text-[#0D915E] text-[14px] hover:underline" style={{ lineHeight: "25px", letterSpacing: "-0.02em" }}>{item}</a>
        </li>
      ))}
    </ul>
  </div>
);

// Komponen Footer Utama
const CategoryFooter: FC = () => {
  const [category, setCategory] = useState<ListColumnProps[]>([]);
  const getCategory = async () => {
    // setLoading(true);
    const res = await Get<Response>('zukses', `category/list-array`);
    if (res?.status === 'success' && Array.isArray(res.data)) {
      const data = res?.data as ListColumnProps[];
      // setProducts(data);
      setCategory(data);
    } else {
      console.warn('Produk tidak ditemukan atau gagal diambil');

    }
    // setLoading(false);
  };

  useEffect(() => {
    getCategory();
  }, []);
  return (
    // Pastikan Tailwind CSS sudah terpasang di proyek Anda
    <div className="">
      <footer className="pt-10 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-1">

            {/* Render kolom kategori secara dinamis */}
            {category.map((col, index) => (
              <ListColumn key={index} title={col.title} items={col.items} />
            ))}

            {/* Kolom Zukses Links */}
            <ListColumn title="Zukses" items={zuksesLinks} />

            {/* Kolom Kanan: Logo, Download, dan Kontak */}
            <div className="space-y-6">
              <h2 className="text-[35px] font-semibold text-[#1073F7]" style={{
                letterSpacing: "-0.03em"
              }}>zukses</h2>

              <div>
                <p className="text-[15px] font-semibold text-[#333333] mb-2" style={{
                  letterSpacing: "-0.04em",
                  lineHeight: "22px"
                }}>
                  Download Aplikasi Zukses di :
                </p>
                <div className="flex gap-2 items-start space-y-2">
                  {/* Ganti 'src' dengan path gambar Anda yang sebenarnya */}
                  <a href="#">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
                      alt="Get it on Google Play"
                      className="h-9"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/120x36/black/white?text=Google+Play'; }}
                    />
                  </a>
                  <a href="#">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png"
                      alt="Download on the App Store"
                      className="h-9"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/120x36/black/white?text=App+Store'; }}
                    />
                  </a>
                </div>
              </div>
              <div className="space-y-1 text-[15px] font-semibold text-[#333333] mt-10 space-y-4" style={{
                letterSpacing: "-0.04em",
                lineHeight: "22px"
              }}>
                <p className="">Punya Pertanyaan? :</p>
                <p className="">
                  Hubungi Layanan Pelanggan Kami <br />
                  085 394 333 301
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CategoryFooter;
