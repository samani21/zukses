import DateTimePicker from 'components/DateTimePicker';
import { Modal } from 'components/Modal';
import CropModal from 'components/my-store/addProduct/CropModal';
import CategorySelector from 'components/my-store/product/CategorySelector';
import { formatRupiahNoRP } from 'components/Rupiah';
import { Camera, Video, Pencil, Trash2, ChevronRight, Move, CheckCircle, ImageIcon, Plus, X } from 'lucide-react';
import type { NextPage } from 'next';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import React, { useEffect, useRef, useState } from 'react';
import Get from 'services/api/Get';
import { Category } from 'services/api/product';
import { Response } from 'services/api/types';
const IconLabel = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    {icon}
    <span>{text}</span>
  </div>
);

// Komponen untuk kartu di sidebar kiri
const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-[10px] shadow-sm border border-[#DDDDDD] w-[236px]">
    {
      title === "Rekomendasi" &&
      <div className='h-[38px] flex items-center '>
        <h3 className="font-bold text-white text-[16px] rounded-tr-[10px] rounded-tl-[10px] py-2  px-4 bg-[#00AA5B] w-full h-full">{title}</h3>
      </div>
    }
    <div className="space-y-2 p-4 text-[#333333] text-[14px]">
      {children}
    </div>
  </div >
);


// Komponen input dengan label dan character counter
const TextInput = ({ label, placeholder, maxLength, value, setValue, required = false }: { label: string, placeholder: string, maxLength: number, value: string, setValue: (val: string) => void, required?: boolean }) => (
  <div>
    <label className="text-[#333333] font-bold text-[14px]">
      {required && <span className="text-red-500">*</span>} {label}
    </label>
    <div className="relative mt-1">
      <input
        type="text"
        className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] text-[#555555] text-[14px]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxLength}
      />
      <span className="absolute bottom-2 right-3 text-xs text-gray-400">
        {value.length}/{maxLength}
      </span>
    </div>
  </div>
);

const TextAreaInput = ({
  label,
  placeholder,
  maxLength,
  value,
  setValue,
  required = false,
}: {
  label: string,
  placeholder: string,
  maxLength: number,
  value: string,
  setValue: (val: string) => void,
  required?: boolean
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fungsi untuk menyesuaikan tinggi textarea
  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset dulu
      textarea.style.height = Math.min(textarea.scrollHeight, 480) + 'px'; // Maks 480px (30 baris)
    }
  };

  useEffect(() => {
    autoResize();
  }, [value]);

  return (
    <div>
      <label className="text-[#333333] font-bold text-[14px]">
        {required && <span className="text-red-500">*</span>} {label}
      </label>
      <div className="relative mt-1">
        <textarea
          ref={textareaRef}
          className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] text-[#555555] text-[14px] overflow-hidden"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          maxLength={maxLength}
          rows={4} // default tinggi awal (misal 4 baris)
          style={{ resize: 'none', maxHeight: '480px', overflowY: 'auto', }} // maksimal 30 baris, tidak bisa di-resize
        />
        <span className="absolute bottom-2 right-3 text-xs text-gray-400">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};


// Komponen untuk Radio Button
const RadioGroup = ({ label, name, options, required = false }: { label: string, name: string, options: string[], required?: boolean }) => {
  const [selectedValue, setSelectedValue] = useState(options[0]);
  return (
    <div>
      <label className="block text-[14px] font-bold text-[#333333] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center space-x-6">
        {options.map(option => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={selectedValue === option}
              onChange={() => setSelectedValue(option)}
              className="hidden"
            />
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors 
      ${selectedValue === option ? 'border-[#660077]' : 'border-gray-400'}`}
            >
              {selectedValue === option && (
                <div className="w-2 h-2 rounded-full bg-[#660077]"></div>
              )}
            </div>
            <span className={`
              text-[14px] text-[#333333] ${selectedValue === option ? 'font-bold' : 'font-normal'}
            `}>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

interface Variation {
  name: string;
  options: string[];
}

interface VariantRowData {
  price: string;
  stock: string;
  discount: string;
  discountPercent: string;
  image?: File;
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
}

// Komponen Utama Halaman
const AddProductPage: NextPage = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [showDimensionTable, setShowDimensionTable] = useState(false);
  const [isVariant, setIsVariant] = useState<boolean>(false);
  // const variations = [
  //   { color: 'Merah', sizes: ['Besar', 'Sedang', 'Kecil'] },
  //   { color: 'Oranye', sizes: ['Besar', 'Sedang', 'Kecil'] },
  // ];
  const [activeTipKey, setActiveTipKey] = useState('default');

  const [selectedImages, setSelectedImages] = useState<File[]>([]);  //foto produk 1-10
  const [promoImage, setPromoImage] = useState<File | null>(null); //foto produk promosi
  const [videoFile, setVideoFile] = useState<File | null>(null); //video produk
  const [category, setCategory] = useState('');
  const promoInputRef = useRef<HTMLInputElement | null>(null);
  const [cropModalImage, setCropModalImage] = useState<string | null>(null);
  const [cropCallback, setCropCallback] = useState<((file: File) => void) | null>(null);
  const tipsChecklist = {
    'Tambah min. 1 Foto': selectedImages.length >= 1,
    'Tambah 1 Foto Promosi': promoImage !== null,
    'Tambahkan Video': videoFile !== null,
    'Nama 25+ karakter': productName.length >= 25,
    'Deskripsi 100+ karakter': description.length >= 100,
  };
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [tempCategory, setTempCategory] = useState(category);
  const [idCategorie, setIdCategorie] = useState<number | undefined>();
  console.log('idCategorie', idCategorie)
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [categoryApiError, setCategoryApiError] = useState<string | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);

  //variasi
  const [variations, setVariations] = useState<Variation[]>([
    { name: '', options: [''] },
  ]);

  console.log('variations', variations)
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const [globalPrice, setGlobalPrice] = useState('');
  const [globalStock, setGlobalStock] = useState('');
  const [globalDiscount, setGlobalDiscount] = useState('');
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState('');
  const [variantData, setVariantData] = useState<VariantRowData[]>([]); // [ [row0], [row1], ... ]
  const [globalWeight, setGlobalWeight] = useState('');
  const [globalLength, setGlobalLength] = useState('');
  const [globalWidth, setGlobalWidth] = useState('');
  const [globalHeight, setGlobalHeight] = useState('');

  const applyGlobalToAll = () => {
    const combinations = buildCombinationTable();
    const updatedData = combinations.flatMap(variation =>
      variation.sizes.map(() => ({
        price: globalPrice,
        stock: globalStock,
        discount: globalDiscount,
        discountPercent: globalDiscountPercent,
      }))
    );
    setVariantData(updatedData);
  };

  const handleDragStart = (index: number) => {
    setDragStartIndex(index);
  };

  const handleDrop = (varIndex: number, dropIndex: number) => {
    if (dragStartIndex === null || dragStartIndex === dropIndex) return;

    const updated = [...variations];
    const movedItem = updated[varIndex].options[dragStartIndex];
    updated[varIndex].options.splice(dragStartIndex, 1);
    updated[varIndex].options.splice(dropIndex, 0, movedItem);

    setVariations(updated);
    setDragStartIndex(null);
  };

  const handleAddVariation = () => {
    if (variations.length < 2) {
      setVariations([...variations, { name: '', options: [''] }]);
    }
  };

  const handleRemoveVariation = (index: number) => {
    const updatedVariations = [...variations];
    updatedVariations.splice(index, 1);
    setVariations(updatedVariations);
  };

  const handleVariationNameChange = (index: number, value: string) => {
    const updated = [...variations];
    updated[index].name = value;
    setVariations(updated);
  };

  const handleOptionChange = (varIndex: number, optIndex: number, value: string) => {
    const updated = [...variations];
    updated[varIndex].options[optIndex] = value;

    // Cek: Jika terakhir & user ngetik, tambah input baru
    const options = updated[varIndex].options;
    const isLast = optIndex === options.length - 1;

    if (isLast && value.trim() !== '') {
      options.push('');
    }

    // Hapus trailing kosong lebih dari 1
    if (
      options.length >= 2 &&
      options[options.length - 1].trim() === '' &&
      options[options.length - 2].trim() === ''
    ) {
      options.pop();
    }

    setVariations(updated);
  };


  const handleDeleteOption = (varIndex: number, optIndex: number) => {
    const updated = [...variations];
    const options = updated[varIndex].options;

    // Hapus hanya jika lebih dari 1 opsi
    if (options.length > 1) {
      options.splice(optIndex, 1);
    } else {
      options[0] = '';
    }

    setVariations(updated);
  };

  const buildCombinationTable = () => {
    const var1 = variations[0]?.options.filter(opt => opt.trim() !== '') || [];
    let var2 = variations[1]?.options.filter(opt => opt.trim() !== '');

    if (!var2 || var2.length === 0) {
      var2 = ['']; // fallback satu elemen kosong agar tetap render row
    }

    return var1.map(color => ({
      color,
      sizes: var2
    }));
  };


  useEffect(() => {
    setVariantData([]);
  }, [variations]);

  const handleVariantImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setCropModalImage(reader.result as string);
        setCropCallback(() => (croppedFile: File) => {
          const updated = [...variantData];
          updated[index] = {
            ...updated[index],
            image: croppedFile
          };
          setVariantData(updated);
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const applyDimensionToAll = () => {
    const updated = buildCombinationTable().flatMap(variation =>
      variation.sizes.map(() => ({
        weight: globalWeight,
        length: globalLength,
        width: globalWidth,
        height: globalHeight,
        price: '',
        stock: '',
        discount: '',
        discountPercent: '',
      }))
    );
    setVariantData(updated);
  };


  //categorie
  const handleConfirmCategory = () => { setCategory(tempCategory); setCategoryModalOpen(false); };

  //image
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    if (selectedImages.length >= 10) {
      alert('Maksimal 10 gambar');
      return;
    }

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setCropModalImage(reader.result as string);
        setCropCallback(() => (file: File) => {
          setSelectedImages((prev) => [...prev, file]);
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSelectPromoImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setCropModalImage(reader.result as string);
        setCropCallback(() => (croppedFile: File) => {
          setPromoImage(croppedFile);
        });
      }
    };
    reader.readAsDataURL(file);

    // Reset agar bisa upload ulang gambar dengan nama sama
    e.target.value = '';
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    }
  };

  useEffect(() => {
    // const dataString = localStorage.getItem('shopProfile');
    // if (dataString) {
    //   const parsedData = JSON.parse(dataString);
    //   setShopProfile(parsedData)
    // }
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const res = await Get<Response>('zukses', `category/show`);
        if (res?.status === 'success' && Array.isArray(res.data)) {
          setApiCategories(res.data as Category[]);
        } else {
          setCategoryApiError("Gagal mengambil data kategori.");
        }
      } catch (error) {
        setCategoryApiError("Gagal memuat kategori.");
        console.error(error);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);
  // ... setelah deklarasi state
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


  return (
    <MyStoreLayout>
      <div className="min-h-screen font-sans mt-[-10px]">
        <main className="px-0 pb-[120px]">
          <p className='text-[#52357B] font-bold text-[16px] mb-1'>Toko Saya</p>
          <div className="flex items-center  text-gray-500 mb-4">
            <span className='text-[14px] text-[#333333] cursor-pointer' onClick={() => window.location.href = '/my-store'}>Dashboard</span>
            <ChevronRight className="w-[25px] h-[25px] text-[#333333] mx-1" />
            <span className='text-[14px] text-[#333333] cursor-pointer' onClick={() => window.location.href = '/my-store/product'}>Produk Saya</span>
            <ChevronRight className="w-[25px] h-[25px] text-[#333333] mx-1" />
            <span className="font-bold text-[14px] text-[#333333] ">Tambah Produk</span>
          </div>

          <div className="flex items-start gap-10 relative">
            {/* Kolom Kiri */}
            <aside className="lg:col-span-1 space-y-6 sticky top-6 pr-2">
              <InfoCard title="Rekomendasi">
                {Object.entries(tipsChecklist).map(([label, isDone]) => (
                  <IconLabel
                    key={label}
                    icon={
                      isDone
                        ? <CheckCircle className="w-4 h-4 text-green-500" />
                        : <CheckCircle className="w-4 h-5 text-[#000000]" />
                    }
                    text={label}
                  />
                ))}
              </InfoCard>


              <InfoCard title="Tips Foto dan Video Produk">
                {tipsContent[activeTipKey]}
              </InfoCard>
            </aside>

            {/* Kolom Kanan - Form Utama */}
            <div className="lg:col-span-2 mt-2">
              <h1 className="font-bold text-[20px] text-[#483AA0] mb-4">Informasi Produk</h1>

              <div className="rounded-lg mb-6">
                <div
                  onMouseEnter={() => setActiveTipKey('photo')}
                  onMouseLeave={() => setActiveTipKey('default')}>
                  <label className="text-[#333333] font-bold text-[14px] ml-[-2px]">
                    <span className="text-red-500">*</span> Foto Produk
                  </label>
                  <div className="mt-1">
                    <ul className="text-[12px] text-[#555555] list-disc list-inside mb-4">
                      <li style={{ letterSpacing: "-2%" }}>Upload Foto 1:1</li>
                      <li className=''>Foto Produk yang baik akan meningkatkan minat belanja Pembeli.</li>
                    </ul>
                    {/* Preview Gambar */}
                    <div className="flex flex-wrap gap-2 mt-2 ">
                      {selectedImages.map((img, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(img)}
                          alt={`preview-${index}`}
                          className="w-[80px] h-[80px] object-cover border rounded"
                        />
                      ))}
                      <label className="flex flex-col items-center justify-center w-[80px] h-[80px] border-2 border-[#BBBBBB] rounded-[5px] text-center cursor-pointer hover:bg-gray-50">
                        <Camera className="w-[29px] h-[29px] mb-1 text-[#7952B3]" />
                        <span className="text-[12px] text-[#333333]">Tambah</span>
                        <span className="text-[12px] text-[#333333]">{selectedImages.length}/10</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleSelectImage}
                        />
                      </label>
                    </div>

                  </div>
                </div>
                <div className='mt-4'
                  onMouseEnter={() => setActiveTipKey('promoPhoto')}
                  onMouseLeave={() => setActiveTipKey('default')}>
                  <label className="text-[#333333] font-bold text-[14px] ml-[-2px]">
                    <span className="text-red-500">*</span> Foto Produk Promosi
                  </label>
                  <div className="mt-1">
                    <ul className="text-[12px] text-[#555555] list-disc list-inside mb-4">
                      <li style={{ letterSpacing: "-2%" }}>Upload Foto 1:1</li>
                      <li className=''>Foto Produk Promosi untuk menampilkan dihasil pencarian SEO</li>
                    </ul>
                    <div
                      className="flex flex-col items-center justify-center w-[80px] h-[80px] border-2 border-[#BBBBBB] rounded-[5px] text-center cursor-pointer hover:bg-gray-50"
                      onClick={() => promoInputRef.current?.click()}
                    >
                      {promoImage ? (
                        // Jika sudah ada gambar, tampilkan preview
                        <img
                          src={URL.createObjectURL(promoImage)}
                          alt="Promo Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // Jika belum ada, tampilkan ikon kamera dan teks
                        <>
                          <Camera className="w-[29px] h-[29px] mb-1 text-[#7952B3]" />
                          <span className="text-[12px] text-[#333333]">Tambahkan</span>
                          <span className="text-[12px] text-[#333333]">0/1</span>
                        </>
                      )}
                      <input
                        ref={promoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleSelectPromoImage}
                        className="hidden"
                      />
                    </div>

                  </div>
                </div>
                <hr className="my-6 border-[#CCCCCC]" />

                <div
                  onMouseEnter={() => setActiveTipKey('video')}
                  onMouseLeave={() => setActiveTipKey('default')}>
                  <label className="text-[#333333] font-bold text-[14px]">
                    Video Produk
                  </label>
                  <div className="flex items-start space-x-6 mt-1">
                    {/* Hidden input */}
                    <input
                      type="file"
                      id="video-upload"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />

                    {/* Label to trigger file input */}
                    <label htmlFor="video-upload">
                      {videoFile ? (
                        <video
                          src={URL.createObjectURL(videoFile)}
                          className="w-[160px] h-[160px] object-cover rounded-[5px]"
                          controls
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-[80px] h-[80px] border-2 border-[#BBBBBB] rounded-[5px] text-center cursor-pointer hover:bg-gray-50">
                          <Video className="w-[29px] h-[29px] text-[#7952B3] mb-1" />
                          <span className="text-[12px] text-[#333333]">Tambahkan Video</span>
                        </div>
                      )}
                    </label>
                    <ul className="text-[12px] text-gray-500 list-disc list-inside">
                      <li>File video maks. harus 30Mb dengan resolusi tidak melebihi 1280 x 1280px.</li>
                      <li>Durasi: 10-60detik</li>
                      <li>Format: MP4</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <div
                  onMouseEnter={() => setActiveTipKey('name')}
                  onMouseLeave={() => setActiveTipKey('default')}>
                  <TextInput label="Nama Produk" placeholder="Masukkan Nama Produk" maxLength={255} value={productName} setValue={setProductName} required />
                </div>
                <div className="mt-[-15px] rounded-md text-[12px] text-[#333333]">
                  <span className="font-bold text-[14px]">Tips!. </span> Masukkan Nama Merek + Tipe Produk + Fitur Produk (Bahan, Warna, Ukuran, Variasi)
                </div>
                <div
                  onMouseEnter={() => setActiveTipKey('category')}
                  onMouseLeave={() => setActiveTipKey('default')}>
                  <label className="text-[#333333] font-bold text-[14px]">
                    <span className="text-red-500">*</span> Kategori
                  </label>
                  <div className="flex items-center border border-[#AAAAAA] rounded-[5px] mt-1" onClick={() => { setTempCategory(category); setCategoryModalOpen(true); }}>
                    <div className="w-full px-3 py-2 text-[#555555] text-[14px]">
                      {category || "Pilih Kategori Produk"}
                    </div>
                    <button className="ml-2 p-2 text-gray-600 hover:bg-gray-100 rounded-md">
                      <Pencil className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div
                  onMouseEnter={() => setActiveTipKey('description')}
                  onMouseLeave={() => setActiveTipKey('default')}>
                  <TextAreaInput label="Deskripsi / Spesifikasi Produk" placeholder="Jelaskan secara detil mengenai produkmu" maxLength={3000} value={description} setValue={setDescription} required />
                </div>
                <div
                  onMouseEnter={() => setActiveTipKey('brand')}
                  onMouseLeave={() => setActiveTipKey('default')}>
                  <TextInput label="Merek Produk" placeholder="Masukkan Merek Produkmu" maxLength={255} value={brand} setValue={setBrand} />
                </div>
                <div
                  onMouseEnter={() => setActiveTipKey('brand')}
                  onMouseLeave={() => setActiveTipKey('default')}>
                  <label className="block text-[#333333] font-bold text-[14px] mb-0.5"><span className="text-red-500">*</span> Negara Asal</label>
                  <select className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] text-[#555555] text-[14px] mt-1"><option>Pilih Negara Asal</option><option>Indonesia</option></select>
                </div>

              </div>

              {/* Variasi Produk */}
              <div
                onMouseEnter={() => setActiveTipKey('variation')}
                onMouseLeave={() => setActiveTipKey('default')} >
                <div className="">
                  <div className='flex items-center justify-left gap-3'>
                    <div className='w-[12px] h-[12px] bg-[#52357B] rounded-lg' />
                    <h2 className="text-[14px] font-bold text-[#333333]">Variasi Produk</h2>
                  </div>
                  <div className='flex jusity-left items-center gap-4 mt-3'>
                    {
                      isVariant ?
                        <button className='border border-[#52357B] rounded-[5px] w-[175px] h-[35px] flex items-center px-2 justify-center' onClick={() => setIsVariant(false)}>
                          <Plus className='text-[#52357B] h-[22px] w-[22px]' />
                          <span className='text-[#52357B] text-[14px] font-semibold'>Tanpa Variasi</span>
                        </button> :
                        <button className='border border-[#52357B] rounded-[5px] w-[175px] h-[35px] flex items-center px-2' onClick={() => setIsVariant(true)}>
                          <Plus className='text-[#52357B] h-[22px] w-[22px]' />
                          <span className='text-[#52357B] text-[14px] font-semibold'>Tambahkan Variasi</span>
                        </button>
                    }
                    <div className='w-1/2 text-[14px]'>
                      Tambahkan Variasi Produk jika produk memiliki beberapa pilihan, seperti <span className='text-[#52357B] font-bold'> warna, ukuran, kapasitas, dan lainnya.</span>
                    </div>
                  </div>
                  {
                    isVariant ? <div className='mt-4'>
                      {variations.map((variation, varIndex) => (
                        <div key={varIndex} className="border border-gray-200 rounded-md p-4 space-y-4 mb-4">
                          <div className='flex justify-between items-center gap-4'>
                            <div className="grid grid-cols-[100px_1fr] items-center gap-4 w-1/2">
                              <label className="text-[14px] font-bold text-[#333333]">Variasi {varIndex + 1}</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={variation.name}
                                  onChange={(e) => handleVariationNameChange(varIndex, e.target.value)}
                                  placeholder="Ketik atau Pilih"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                                <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                                  {variation.name.length}/20
                                </span>
                              </div>
                            </div>
                            {
                              variations?.length > 1 &&
                              <div onClick={() => handleRemoveVariation(varIndex)} className=' cursor-pointer'>
                                <X className='w-[24px] h-[24px] text text-gray-500' />
                              </div>
                            }
                          </div>
                          <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                            <label className="text-[14px] font-bold text-[#333333] pt-2">Opsi</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                              {variation.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  draggable
                                  onDragStart={() => handleDragStart(optIndex)}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={() => handleDrop(varIndex, optIndex)}
                                  className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(varIndex, optIndex, e.target.value)}
                                    placeholder="Ketik atau Pilih"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  />
                                  <div className="p-2 text-gray-500 hover:text-gray-700 cursor-move">
                                    <Move className="w-4 h-4" />
                                  </div>
                                  <div
                                    className="p-2 text-gray-500 hover:text-red-600"
                                    onClick={() => handleDeleteOption(varIndex, optIndex)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      {variations.length < 2 && (
                        <div className='flex justif-left items-center gap-3'>
                          <button
                            type="button"
                            onClick={handleAddVariation}
                            className="bg-white  text-[#52357B] border border-[#52357B] px-4 py-2 rounded-[5px] text-[14px] font-semibold flex items-center justify-center gap-1"
                          >
                            <Plus className='h-[22px] w-[22px]' />
                            Tambah Variasi 2
                          </button>
                          <div className='w-[508px] text-[14px] text-[#33333]'>
                            Tambahkan Variasi 2 jika setiap produk memiliki variasi lanjutan berdasarkan Variasi 1, misalnya:<span className='font-bold text-[#52357B]'> Merah Besar, Merah Kecil, atau Merah Sedang.</span>
                          </div>
                        </div>
                      )}</div> :
                      <div className="flex items-center gap-4 items-end mt-4"
                        onMouseEnter={() => setActiveTipKey('priceStock')}
                        onMouseLeave={() => setActiveTipKey('default')}>
                        <div className="col-span-12 sm:col-span-5">
                          <label className="block text-[14px] font-bold text-[#333333] mb-1.5">
                            <span className="text-red-500">*</span> Harga Produk</label>
                          <div className="flex rounded-[5px] border border-[#AAAAAA] bg-white">
                            <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                            <input type="text" placeholder="Harga" className="flex-1 block w-full px-3 py-2 border-0 rounded-none focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]" />
                            <div className="flex items-center border-l border-gray-300">
                              <input type="text" placeholder="Stock" className="w-24 px-3 py-2 border-0 rounded-r-md focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]" value={0} />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12 sm:col-span-3">
                          <label className="block ext-[14px] font-bold text-[#333333] mb-1.5">
                            <span className="text-red-500">*</span> Harga Diskon</label>
                          <div className="flex rounded-[5px] border border-[#AAAAAA] border-r-0 bg-white">
                            <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                            <input type="text" placeholder="Harga Diskon" className="flex-1 block w-full rounded-none rounded-r-md focus:outline-none border-gray-300 px-3 py-2 placeholder:text-[#AAAAAA]" />
                          </div>
                        </div>
                        <div className="col-span-12 sm:col-span-2 ml-[-20px]">
                          <label className="block ext-[14px] font-bold text-[#333333] mb-1.5">
                            <span className="text-red-500">*</span> Persen Diskon</label>
                          <input type="text" placeholder="Persen" className="w-full px-3 py-2 border border-[#AAAAAA] rounded-tr-[5px] focus:outline-none rounded-br-[5px] rounded-l-none placeholder:text-[#AAAAAA]" />
                        </div>
                      </div>
                  }
                </div>
              </div>

              {
                isVariant &&
                <div className="mb-6 mt-2">
                  <div className="flex items-center gap-4 items-end" onMouseEnter={() => setActiveTipKey('priceStock')}
                    onMouseLeave={() => setActiveTipKey('default')}>
                    <div className="col-span-12 sm:col-span-5">
                      <label className="block text-[14px] font-bold text-[#333333] mb-1.5">Harga Produk</label>
                      <div className="flex rounded-[5px] border border-[#AAAAAA] bg-white">
                        <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                        <input type="text" placeholder="Harga" className="flex-1 block w-full px-3 py-2 border-0 rounded-none focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]" value={formatRupiahNoRP(globalPrice)} onChange={(e) => setGlobalPrice(e.target.value)} />
                        <div className="flex items-center border-l border-gray-300">
                          <input type="text" placeholder="Stock" className="w-24 px-3 py-2 border-0 rounded-r-md focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]" value={globalStock} onChange={(e) => setGlobalStock(e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-3">
                      <label className="block ext-[14px] font-bold text-[#333333] mb-1.5">Harga Diskon</label>
                      <div className="flex rounded-[5px] border border-[#AAAAAA] border-r-0 bg-white">
                        <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                        <input type="text" placeholder="Harga Diskon" className="flex-1 block w-full rounded-none rounded-r-md focus:outline-none border-gray-300 px-3 py-2 placeholder:text-[#AAAAAA]" value={formatRupiahNoRP(globalDiscount)} onChange={(e) => setGlobalDiscount(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-2 ml-[-20px]">
                      <label className="block ext-[14px] font-bold text-[#333333] mb-1.5">Persen Diskon</label>
                      <input type="text" placeholder="Persen" className="w-full px-3 py-2 border border-[#AAAAAA] rounded-tr-[5px] focus:outline-none rounded-br-[5px] rounded-l-none placeholder:text-[#AAAAAA]" value={globalDiscountPercent} onChange={(e) => setGlobalDiscountPercent(e.target.value)} />
                    </div>

                    <div className="col-span-12 sm:col-span-2">
                      <button className="w-[150px] bg-[#52357B] h-[42px] rounded-[5px] text-white font-semibold text-[14px] py-2 hover:bg-purple-800 transition duration-200" onClick={applyGlobalToAll}>Terapkan kesemua</button>
                    </div>
                  </div>
                </div>
              }

              <div className="overflow-x-auto"
                onMouseEnter={() => setActiveTipKey('variation')}
                onMouseLeave={() => setActiveTipKey('default')}>
                {
                  variations[0]?.name &&
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#EEEEEE] border border-[#AAAAAA]">
                      <tr>
                        {
                          variations[0]?.name &&
                          <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                            {variations[0]?.name}
                          </th>
                        }
                        {
                          variations[1]?.name &&
                          <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                            {variations[1]?.name}
                          </th>
                        }

                        <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                          Harga
                        </th>
                        <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                          Stok
                        </th>
                        <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                          Harga Diskon
                        </th>
                        <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider text-center align-middle">
                          Persen Diskon
                        </th>
                      </tr>
                    </thead>


                    <tbody className="bg-white divide-y divide-gray-200">
                      {buildCombinationTable().map((variation, vIndex) =>
                        variation.sizes.map((size, sIndex) => {
                          const index = vIndex * variation.sizes.length + sIndex;
                          const rowData = variantData[index] || { price: '', stock: '', discount: '', discountPercent: '' };

                          return (
                            <tr key={`${vIndex}-${sIndex}`} className="border border-[#AAAAAA]">
                              {sIndex === 0 &&
                                variation.color !== '' && (
                                  <td
                                    className="px-4 py-4 whitespace-nowrap align-top"
                                    rowSpan={variation.sizes.length}
                                  >
                                    <div className="grid justify-center">
                                      <span className="text-center w-full text-[#333333] text-[14px]">
                                        {variation.color}
                                      </span>
                                      <div className="flex justify-center mt-2">
                                        {rowData.image ? (
                                          <div>
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              onChange={(e) => handleVariantImageUpload(index, e)}
                                              id={`variant-img-${index}`}
                                            />
                                            <label htmlFor={`variant-img-${index}`} className=" mt-1 cursor-pointer">
                                              <img
                                                src={URL.createObjectURL(rowData.image)}
                                                alt="Varian"
                                                className="w-[60px] h-[60px] object-cover border rounded-[5px]"
                                              />
                                            </label>
                                          </div>
                                        ) : (
                                          <div className="w-[60px] h-[60px] flex items-center justify-center border border-[#BBBBBB] rounded-[5px] bg-white">
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              onChange={(e) => handleVariantImageUpload(index, e)}
                                              id={`variant-img-${index}`}
                                            />
                                            <label htmlFor={`variant-img-${index}`} className="text-xs text-blue-600 mt-1 cursor-pointer">
                                              <ImageIcon className="w-[48px] h-[48px] text-[#000000]" />
                                            </label>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                )}

                              {variations[1]?.name && (
                                <td className="px-4 py-4 text-[14px] text-[#333333] border border-[#AAAAAA]" align="center">
                                  {size || '-'}
                                </td>
                              )}

                              <td className="px-4 py-4 border border-[#AAAAAA]">
                                <div className="flex items-center border border-[#AAAAAA] rounded-[5px] px-1">
                                  <span className="text-[15px] text-[#555555] mr-2">Rp</span>
                                  <input
                                    type="text"
                                    placeholder="Harga"
                                    className="w-full p-1 placeholder:text-[#AAAAAA] text-[15px] focus:outline-none focus:ring-0 focus:border-none"
                                    value={formatRupiahNoRP(rowData.price)}
                                    onChange={(e) => {
                                      const newData = [...variantData];
                                      newData[index] = { ...rowData, price: e.target.value };
                                      setVariantData(newData);
                                    }}
                                  />
                                </div>
                              </td>

                              <td className="px-4 py-4 border border-[#AAAAAA] text-center align-middle" width={100}>
                                <input
                                  type="text"
                                  placeholder="Stock"
                                  className="w-full p-1 border border-[#AAAAAA] rounded-[5px] placeholder:text-[#AAAAAA] text-[15px] text-center focus:outline-none focus:ring-0"
                                  value={rowData.stock}
                                  onChange={(e) => {
                                    const newData = [...variantData];
                                    newData[index] = { ...rowData, stock: e.target.value };
                                    setVariantData(newData);
                                  }}
                                />
                              </td>

                              <td className="px-4 py-4 border border-[#AAAAAA]">
                                <div className="flex items-center border border-[#AAAAAA] rounded-[5px] px-1">
                                  <span className="text-[15px] text-[#555555] mr-2">Rp</span>
                                  <input
                                    type="text"
                                    placeholder="Harga"
                                    className="w-full p-1 placeholder:text-[#AAAAAA] text-[15px] focus:outline-none focus:ring-0 focus:border-none"
                                    value={formatRupiahNoRP(rowData.discount)}
                                    onChange={(e) => {
                                      const newData = [...variantData];
                                      newData[index] = { ...rowData, discount: e.target.value };
                                      setVariantData(newData);
                                    }}
                                  />
                                </div>
                              </td>

                              <td className="px-4 py-4 border border-[#AAAAAA] text-center align-middle" width={155}>
                                <input
                                  type="text"
                                  placeholder="Persen"
                                  className="w-full p-1 border border-[#AAAAAA] rounded-[5px] placeholder:text-[#AAAAAA] text-[15px] text-center focus:outline-none focus:ring-0"
                                  value={rowData.discountPercent}
                                  onChange={(e) => {
                                    const newData = [...variantData];
                                    newData[index] = { ...rowData, discountPercent: e.target.value };
                                    setVariantData(newData);
                                  }}
                                />
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>



                  </table>
                }
              </div>

              {/* Info Tambahan */}
              <div className="mb-6 mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  onMouseEnter={() => setActiveTipKey('purchaseLimit')}
                  onMouseLeave={() => setActiveTipKey('default')}>
                  <div>
                    <label className="text-[#333333] font-bold text-[14px]">
                      <span className="text-red-500">*</span>  Min. Jumlah Pembelian
                    </label>
                    <input type="number" defaultValue="1" className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] text-[17px] text-[#333333] mt-4" />
                  </div>
                  <div>
                    <label className="text-[#333333] font-bold text-[14px]">
                      <span className="text-red-500">*</span>  Maks. Jumlah Pembelian
                    </label>
                    <input type="number" defaultValue="1000" className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] text-[17px] text-[#333333] mt-4" />
                  </div>
                </div>

                <div className='mt-[-15px]'
                  onMouseEnter={() => setActiveTipKey('weightDimension')}
                  onMouseLeave={() => setActiveTipKey('default')}>
                  <label className="text-[#333333] font-bold text-[14px]">
                    Berat dan Dimensi Produk
                  </label>
                  <div className="flex items-center gap-3 mt-4">
                    <div className='border rounded-[5px] px-4 border-[#AAAAAA] h-[40px]'>
                      <input type="text" placeholder="Berat" className="w-24 p-2 placeholder:text-[#AAAAAA] text-[15px]  focus:outline-none focus:ring-0 focus:border-none" value={globalWeight}
                        onChange={(e) => setGlobalWeight(e.target.value)} />
                      <span className="text-[15px] text-[#555555]">Gr</span>
                    </div>
                    <div className='border rounded-[5px] px-4 border-[#AAAAAA] h-[40px]'>
                      <input type="text" placeholder="Lebar" className="w-24 p-2 placeholder:text-[#AAAAAA] text-[15px] w-[70px] focus:outline-none focus:ring-0 focus:border-none"
                        value={globalWidth} onChange={(e) => setGlobalWidth(e.target.value)} />
                      <span className="text-[15px] text-[#AAAAAA] mr-[20px]">|</span>
                      <input type="text" placeholder="Panjang" className="w-24 p-2 placeholder:text-[#AAAAAA] text-[15px] w-[70px] focus:outline-none focus:ring-0 focus:border-none"
                        value={globalLength} onChange={(e) => setGlobalLength(e.target.value)} />
                      <span className="text-[15px] text-[#AAAAAA] mr-[20px]">|</span>
                      <input type="text" placeholder="Tinggi" className="w-24 p-2 placeholder:text-[#AAAAAA] text-[15px] w-[70px] focus:outline-none focus:ring-0 focus:border-none  focus:outline-none focus:ring-0 focus:border-none"
                        value={globalHeight} onChange={(e) => setGlobalHeight(e.target.value)} />
                      <span className="text-[15px] text-[#AAAAAA] mr-[20px]">|</span>
                      <span className="text-[15px] text-[#555555]">Cm</span>
                    </div>
                    {
                      isVariant &&
                      <div>
                        <button className="bg-[#52357B] text-white px-4 py-2 rounded-md text-[15px] font-[500] hover:bg-purple-800 transition duration-200 ml-auto"
                          onClick={applyDimensionToAll}>
                          Terapkan kesemua
                        </button>
                      </div>
                    }
                  </div>
                  {
                    isVariant &&
                    <div className="mt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={showDimensionTable}
                          onChange={() => setShowDimensionTable(!showDimensionTable)}
                          className="h-5 w-5 accent-[#52357B] text-white focus:ring-[#52357B]"

                        />
                        <span className="text-[14px] text-[#333333] font-bold">Berat & Dimensi berbeda untuk tiap variasi?</span>
                      </label>
                    </div>
                  }
                </div>
                {variations[0]?.name && showDimensionTable && (
                  <div className="overflow-x-auto mt-4"
                    onMouseEnter={() => setActiveTipKey('weightDimension')}
                    onMouseLeave={() => setActiveTipKey('default')}>
                    <table className="w-full">
                      <thead className="bg-[#EEEEEE] border border-[#AAAAAA]">
                        <tr>
                          {variations[0]?.options.filter(opt => opt.trim() !== '').length > 0 && (
                            <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                              {variations[0]?.name || 'Variasi 1'}
                            </th>
                          )}

                          {variations[1]?.options.filter(opt => opt.trim() !== '').length > 0 && (
                            <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                              {variations[1]?.name || 'Variasi 2'}
                            </th>
                          )}

                          <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                            Berat
                          </th>
                          <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                            Ukuran
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {buildCombinationTable().map((variation, vIndex) =>
                          variation.sizes.map((size, sIndex) => {
                            const rowData = variantData[sIndex] || {};
                            return (
                              <tr key={`${vIndex}-${sIndex}`} className="border border-[#AAAAAA]">
                                {sIndex === 0 && variation.color !== '' && (
                                  <td
                                    className="px-4 py-4 align-middle border border-[#AAAAAA] align-top text-center"
                                    rowSpan={variation.sizes.length}
                                  >
                                    <span className="font-medium text-gray-900 text-[14px]">{variation.color}</span>
                                  </td>
                                )}
                                {variations[1]?.name && (
                                  <td className="px-4 py-4 whitespace-nowrap text-[14px] text-[#333333] align-middle border border-[#AAAAAA] text-center" width={100}>
                                    {size || ''}
                                  </td>
                                )}

                                {/* Berat */}
                                <td className="px-4 py-4 border border-[#AAAAAA]" width={150}>
                                  <div className="flex items-center border border-[#AAAAAA] rounded-[5px] px-3">
                                    <input
                                      type="text"
                                      placeholder="Berat"
                                      value={rowData.weight || ''}
                                      onChange={(e) => {
                                        const updated = [...variantData];
                                        updated[sIndex] = { ...rowData, weight: e.target.value };
                                        setVariantData(updated);
                                      }}
                                      className="w-full p-1.5 text-[14px] focus:outline-none focus:ring-0 focus:border-none"
                                    />
                                    <span className="text-[14px] text-gray-500 ml-2">gr</span>
                                  </div>
                                </td>

                                {/* Dimensi */}
                                <td className="px-4 py-4 border border-[#AAAAAA]">
                                  <div className="border rounded-[5px] px-4 border-[#AAAAAA] h-[40px] flex items-center justify-between gap-2">
                                    <input type="text" placeholder="Lebar" className="w-16 placeholder:text-[#AAAAAA] text-[14px] focus:outline-none placeholder:text-center"
                                      value={rowData.width || ''}
                                      onChange={(e) => {
                                        const updated = [...variantData];
                                        updated[sIndex] = { ...rowData, width: e.target.value };
                                        setVariantData(updated);
                                      }} />
                                    <p className="text-[#AAAAAA]">|</p>
                                    <input type="text" placeholder="Panjang" className="w-16 placeholder:text-[#AAAAAA] text-[14px] focus:outline-none placeholder:text-center"
                                      value={rowData.length || ''}
                                      onChange={(e) => {
                                        const updated = [...variantData];
                                        updated[sIndex] = { ...rowData, length: e.target.value };
                                        setVariantData(updated);
                                      }} />
                                    <p className="text-[#AAAAAA]">|</p>
                                    <input type="text" placeholder="Tinggi" className="w-16 placeholder:text-[#AAAAAA] text-[14px] focus:outline-none placeholder:text-center"
                                      value={rowData.height || ''}
                                      onChange={(e) => {
                                        const updated = [...variantData];
                                        updated[sIndex] = { ...rowData, height: e.target.value };
                                        setVariantData(updated);
                                      }} />
                                    <p className="text-[#AAAAAA]">|</p>
                                    <p className="text-[#555555]">Cm</p>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>

                    </table>
                  </div>
                )}
                <div onMouseEnter={() => setActiveTipKey('dangerousGoods')}
                  onMouseLeave={() => setActiveTipKey('default')}>

                  <RadioGroup label="Produk Berbahaya?" name="dangerous" options={['Tidak', 'Mengandung Baterai / Magnet / Cairan / Bahan Mudah Terbakar']} />
                </div>
                <div onMouseEnter={() => setActiveTipKey('preorder')}
                  onMouseLeave={() => setActiveTipKey('default')}>

                  <RadioGroup label="Pre Order" name="preorder" options={['Tidak', 'Ya']} />
                </div>
                <div onMouseEnter={() => setActiveTipKey('condition')}
                  onMouseLeave={() => setActiveTipKey('default')}>

                  <RadioGroup label="Kondisi" name="condition" options={['Baru', 'Bekas Dipakai']} required />
                </div>

                <div onMouseEnter={() => setActiveTipKey('sku')}
                  onMouseLeave={() => setActiveTipKey('default')}>
                  <label className="text-[#333333] font-bold text-[14px]">
                    SKU Induk
                  </label>
                  <input type="text" placeholder="Masukkan kode unik untuk setiap produk agar mudah dilacak dan dikelola di sistem." className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div className="mt-[-15px] text-[14px] text-[#333333]">
                  Masukkan kode unik untuk setiap produk agar mudah dilacak dan dikelola di sistem.
                </div>

                <div className='mt-[-10px]'>
                  <div onMouseEnter={() => setActiveTipKey('cod')}
                    onMouseLeave={() => setActiveTipKey('default')}>
                    <label className="text-[#333333] font-bold text-[14px]">
                      Pembayaran di Tempat (COD)
                    </label>
                    <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-md">
                      <input id="cod" type="checkbox" defaultChecked className="h-5 w-5 accent-[#52357B] text-white focus:ring-[#52357B]" />
                      <div className='mt-[-5px]'>
                        <label htmlFor="cod" className="font-bold text-[14px] text-[#333333]">Aktifkan COD</label>
                        <p className="text-[14px] text-[#333333]">Izinkan pembeli untuk membayar secara tunai saat produk diterima. Dengan mengaktifkan COD, Anda setuju dengan syarat & ketentuan yang berlaku.</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative" onMouseEnter={() => setActiveTipKey('schedule')}
                    onMouseLeave={() => setActiveTipKey('default')}>
                    <label className="text-[#333333] font-bold text-[14px]">
                      Jadwal Ditampilkan
                    </label>
                    <div className='mt-2'>
                      <DateTimePicker />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="bg-white flex justify-between items-center sticky bottom-0 p-4" style={{
                boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.25)'
              }}>
                <button className="text-[#52357B] text-[14px] font-semibold h-[32px] rounded-[5px] border w-[124px] border-[#52357B] font-medium hover:underline">Kembali</button>
                <div className="flex items-center space-x-2">
                  <button className="text-[#52357B] text-[14px] font-semibold h-[32px] rounded-[5px] border w-[160px] border-[#52357B] font-medium hover:underline">Simpan & Arsipkan</button>
                  <button className="text-white bg-[#52357B] text-[14px] font-semibold h-[32px] rounded-[5px] border w-[160px] border-[#52357B] font-medium hover:bg-purple-800 transition duration-200">Simpan & Tampilkan</button>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
      {cropModalImage && cropCallback && (
        <CropModal
          imageSrc={cropModalImage}
          onClose={() => setCropModalImage(null)}
          onCropComplete={(file) => {
            cropCallback(file);
            setCropModalImage(null);
          }}
        />
      )}
      <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)}>
        <CategorySelector onSelectCategory={setTempCategory} initialCategory={category} categories={apiCategories} isLoading={categoryLoading} error={categoryApiError} setIdCategorie={setIdCategorie} setCategoryModalOpen={setCategoryModalOpen} handleConfirmCategory={handleConfirmCategory} />
      </Modal>

    </MyStoreLayout>
  );
};

export default AddProductPage;
