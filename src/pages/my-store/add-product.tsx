import DateTimePicker from 'components/DateTimePicker';
import Loading from 'components/Loading';
import { Modal } from 'components/Modal';
import CropModal from 'components/my-store/addProduct/CropModal';
import TipsCard from 'components/my-store/addProduct/TipsCard';
import CategorySelector from 'components/my-store/product/CategorySelector';
import { formatRupiahNoRP } from 'components/Rupiah';
import Snackbar from 'components/Snackbar';
import { useTipsStore } from 'components/stores/tipsStore';
import { Camera, Video, Pencil, Trash2, ChevronRight, Move, CheckCircle, ImageIcon, Plus, X } from 'lucide-react';
import type { NextPage } from 'next';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import React, { useEffect, useRef, useState } from 'react';
import Get from 'services/api/Get';
import Post from 'services/api/Post';
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
  const setTipKey = useTipsStore((s) => s.setTipKey);

  const [snackbar, setSnackbar] = useState<{ message: string; type?: 'success' | 'error' | 'info'; isOpen: boolean; }>({ message: '', type: 'info', isOpen: false });
  const [loading, setLoading] = useState<boolean>(false);
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
  const variationSuggestions = ['Warna', 'Ukuran', 'Model', 'Bahan'];
  const [showSuggestionIndex, setShowSuggestionIndex] = useState<number | null>(null);
  const optionSuggestions: { [key: string]: string[] } = {
    Warna: ['Merah', 'Kuning', 'Biru', 'Hijau', 'Hitam', 'Putih'],
    Ukuran: ['S', 'M', 'L', 'XL', 'XXL'],
    Model: ['Lengan Panjang', 'Lengan Pendek'],
    Bahan: ['Katun', 'Poliester', 'Linen'],
  };
  const [showOptionSuggestIndex, setShowOptionSuggestIndex] = useState<string | null>(null);

  const [variations, setVariations] = useState<Variation[]>([
    { name: '', options: [''] },
  ]);
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
  console.log('variantData', variantData)
  //jadwal ditampilkan 
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [scheduleError, setScheduleError] = useState('');

  const validateScheduleDate = (date: Date | null) => {
    if (!date) {
      setScheduleError('');
      return;
    }

    const now = new Date();
    const minTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 jam
    const maxTime = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // +90 hari

    if (date < minTime || date > maxTime) {
      setScheduleError('Jadwal yang dibuat melebihi rentang yang diperbolehkan. Rentang waktu: 1 jam setelah waktu saat ini - 90 hari ke depan');
    } else {
      setScheduleError('');
    }
  };

  const applyGlobalToAll = () => {
    const combinations = buildCombinationTable();

    const updatedData = combinations.flatMap((variation, vIndex) =>
      variation.sizes.map((_, sIndex) => {
        const index = vIndex * variation.sizes.length + sIndex;
        const existing = variantData[index] || {};

        return {
          ...existing,
          price: globalPrice,
          stock: globalStock,
          discount: globalDiscount,
          discountPercent: globalDiscountPercent,
        };
      })
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

    // Cek nama variasi lain
    const otherIndex = index === 0 ? 1 : 0;
    const otherName = variations[otherIndex]?.name?.toLowerCase();

    // Jangan ubah jika sama
    if (value.toLowerCase() === otherName) return;

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

  const handleVariantImageUpload = (clickedIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setCropModalImage(reader.result as string);
        setCropCallback(() => (croppedFile: File) => {
          const combinations = buildCombinationTable();
          const updated = [...variantData];

          // Cari kombinasi warna yang sesuai dengan index yang diklik
          let currentFlatIndex = 0;
          let selectedColor = '';
          for (const variation of combinations) {
            for (const size of variation.sizes) {
              if (currentFlatIndex === clickedIndex) {
                selectedColor = variation.color;
              }
              currentFlatIndex++;
            }
          }

          // Simpan image ke semua kombinasi yang punya warna sama
          currentFlatIndex = 0;
          for (const variation of combinations) {
            for (const size of variation.sizes) {
              if (variation.color === selectedColor) {
                updated[currentFlatIndex] = {
                  ...updated[currentFlatIndex],
                  image: croppedFile,
                };
              }
              currentFlatIndex++;
            }
          }

          setVariantData(updated);
        });
      }
    };

    reader.readAsDataURL(file);
  };


  const applyDimensionToAll = () => {
    const combinations = buildCombinationTable();

    const updatedData = combinations.flatMap((variation, vIndex) =>
      variation.sizes.map((_, sIndex) => {
        const index = vIndex * variation.sizes.length + sIndex;
        const existing = variantData[index] || {};

        return {
          ...existing,
          weight: globalWeight,
          length: globalLength,
          width: globalWidth,
          height: globalHeight,
        };
      })
    );

    setVariantData(updatedData);
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

  const handleSave = async (status: 'PUBLISHED' | 'ARCHIVED') => {
    setLoading(true)
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('description', description);
    formData.append('idCategorie', String(idCategorie));
    formData.append('status', status);
    formData.append('scheduledDate', scheduleDate?.toISOString() || '');

    selectedImages.forEach((img) => formData.append('productPhotos[]', img));
    if (promoImage) formData.append('promoImage', promoImage);
    if (videoFile) formData.append('videoFile', videoFile);

    formData.append('isVariationActive', isVariant ? '1' : '0');
    if (isVariant) {
      formData.append('variations', JSON.stringify(variations));
      formData.append('productVariants', JSON.stringify(variantData));
      variantData.forEach((v, index) => {
        if (v.image) formData.append(`variant_images[${index}]`, v.image);
      });
    }

    // jika tidak pakai variasi
    if (!isVariant) {
      formData.append('price', globalPrice);
      formData.append('stock', globalStock);
      formData.append('discount', globalDiscount);
      formData.append('discountPercent', globalDiscountPercent);
    }

    formData.append('weight', globalWeight);
    formData.append('length', globalLength);
    formData.append('width', globalWidth);
    formData.append('height', globalHeight);

    try {
      const res = await Post<Response>('zukses', `product`, formData);
      if (res?.data?.status === 'success') {
        setLoading(false)
        setSnackbar({ message: 'Produk berhasil disimpan!', type: 'success', isOpen: true });
        window.location.href = '/my-store/product'
        localStorage.removeItem('EditProduct');
      }
    } catch (error) {
      setLoading(false)
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan produk.');
    }
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

              <TipsCard />

            </aside>

            {/* Kolom Kanan - Form Utama */}
            <div className="lg:col-span-2 mt-2">
              <h1 className="font-bold text-[20px] text-[#483AA0] mb-4">Informasi Produk</h1>

              <div className="rounded-lg mb-6">
                <div
                  onMouseEnter={() => setTipKey('photo')}
                  onMouseLeave={() => setTipKey('default')}>
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
                  onMouseEnter={() => setTipKey('promoPhoto')}
                  onMouseLeave={() => setTipKey('default')}>
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
                  onMouseEnter={() => setTipKey('video')}
                  onMouseLeave={() => setTipKey('default')}>
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
                  onMouseEnter={() => setTipKey('name')}
                  onMouseLeave={() => setTipKey('default')}>
                  <TextInput label="Nama Produk" placeholder="Masukkan Nama Produk" maxLength={255} value={productName} setValue={setProductName} required />
                </div>
                <div className="mt-[-15px] rounded-md text-[12px] text-[#333333]">
                  <span className="font-bold text-[14px]">Tips!. </span> Masukkan Nama Merek + Tipe Produk + Fitur Produk (Bahan, Warna, Ukuran, Variasi)
                </div>
                <div
                  onMouseEnter={() => setTipKey('category')}
                  onMouseLeave={() => setTipKey('default')}>
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
                  onMouseEnter={() => setTipKey('description')}
                  onMouseLeave={() => setTipKey('default')}>
                  <TextAreaInput label="Deskripsi / Spesifikasi Produk" placeholder="Jelaskan secara detil mengenai produkmu" maxLength={3000} value={description} setValue={setDescription} required />
                </div>
                <div
                  onMouseEnter={() => setTipKey('brand')}
                  onMouseLeave={() => setTipKey('default')}>
                  <TextInput label="Merek Produk" placeholder="Masukkan Merek Produkmu" maxLength={255} value={brand} setValue={setBrand} />
                </div>
                <div
                  onMouseEnter={() => setTipKey('brand')}
                  onMouseLeave={() => setTipKey('default')}>
                  <label className="block text-[#333333] font-bold text-[14px] mb-0.5"><span className="text-red-500">*</span> Negara Asal</label>
                  <select className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] text-[#555555] text-[14px] mt-1"><option>Pilih Negara Asal</option><option>Indonesia</option></select>
                </div>

              </div>

              {/* Variasi Produk */}
              <div
                onMouseEnter={() => setTipKey('variation')}
                onMouseLeave={() => setTipKey('default')} >
                <div className="">
                  <div className='flex items-center justify-left gap-3'>
                    <div className="relative w-[12px] h-[12px] ml-1">
                      {/* Lingkaran luar - ping */}
                      <span className="absolute inset-0 m-auto h-full w-full rounded-full bg-[#52357B] opacity-75 animate-ping-custom" />

                      {/* Lingkaran dalam - tetap */}
                      <span className="absolute inset-0 m-auto h-[12px] w-[12px] rounded-full bg-[#52357B]" />
                    </div>
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
                                <div className="relative">
                                  <div className="relative w-full">
                                    <input
                                      type="text"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                      placeholder="Ketik atau pilih"
                                      value={variation.name}
                                      onChange={(e) => handleVariationNameChange(varIndex, e.target.value)}
                                      onFocus={() => setShowSuggestionIndex(varIndex)}
                                      onBlur={() => setTimeout(() => setShowSuggestionIndex(null), 200)} // biar gak hilang pas klik
                                    />
                                    {showSuggestionIndex === varIndex &&
                                      variationSuggestions.some(s => s.toLowerCase().includes(variation.name.toLowerCase())) && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                                          <div className="text-[12px] text-gray-500 px-3 py-1 border-b border-gray-200">Nilai yang direkomendasikan</div>
                                          {variationSuggestions
                                            .filter(s =>
                                              s.toLowerCase().includes(variation.name.toLowerCase()) &&
                                              s.toLowerCase() !== (variations[varIndex === 0 ? 1 : 0]?.name?.toLowerCase())
                                            )
                                            .map((suggestion) => (
                                              <div
                                                key={suggestion}
                                                className="px-3 py-2 text-[14px] text-[#333] hover:bg-gray-100 cursor-pointer"
                                                onPointerDown={() => handleVariationNameChange(varIndex, suggestion)}
                                              >
                                                {suggestion}
                                              </div>
                                            ))}
                                        </div>
                                      )}

                                  </div>

                                </div>

                                <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                                  {variation.name.length}/20
                                </span>
                              </div>
                            </div>
                            {
                              variations?.length > 1 ?
                                <div onClick={() => handleRemoveVariation(varIndex)} className=' cursor-pointer'>
                                  <X className='w-[24px] h-[24px] text text-gray-500' />
                                </div> :
                                <div onClick={() => setIsVariant(false)} className=' cursor-pointer'>
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
                                  <div className="relative w-full">
                                    <div className="relative w-full">
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(varIndex, optIndex, e.target.value)}
                                        placeholder="Ketik atau Pilih"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        onFocus={() => setShowOptionSuggestIndex(`${varIndex}-${optIndex}`)}
                                        onBlur={() => setTimeout(() => setShowOptionSuggestIndex(null), 200)} // biar bisa diklik suggestion-nya
                                      />
                                      {showOptionSuggestIndex === `${varIndex}-${optIndex}` &&
                                        (optionSuggestions[variations[varIndex].name] || [])
                                          .some(s => s.toLowerCase().includes(option.toLowerCase())) && (
                                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                                            <div className="text-[12px] text-gray-500 px-3 py-1 border-b border-gray-200">Nilai yang direkomendasikan</div>
                                            {optionSuggestions[variations[varIndex].name]
                                              .filter(s => s.toLowerCase().includes(option.toLowerCase()))
                                              .map((suggestion) => (
                                                <div
                                                  key={suggestion}
                                                  className="px-3 py-2 text-[14px] text-[#333] hover:bg-gray-100 cursor-pointer"
                                                  onPointerDown={() => handleOptionChange(varIndex, optIndex, suggestion)}
                                                >
                                                  {suggestion}
                                                </div>
                                              ))}
                                          </div>
                                        )}
                                    </div>

                                  </div>

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
                      <div className="flex items-center gap-4 items-end mt-4 w-[75%]"
                        onMouseEnter={() => setTipKey('priceStock')}
                        onMouseLeave={() => setTipKey('default')}>
                        <div className="col-span-12 sm:col-span-5">
                          <label className="block text-[14px] font-bold text-[#333333] mb-1.5">
                            <span className="text-red-500">*</span>
                            Harga Produk
                          </label>
                          <div className="flex rounded-l-[5px] border border-[#AAAAAA] bg-white">
                            <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                            <input type="text" placeholder="Harga" className="flex-1 block w-full px-3 py-2 border-0 rounded-none focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]" />
                          </div>
                        </div>
                        <div className="col-span-12 sm:col-span-5 ml-[-20px]">
                          <label className="block text-[14px] font-bold text-[#333333] mb-1.5">
                            <span className="text-red-500">*</span>
                            Stok
                          </label>
                          <div className="flex items-center border border-[#AAAAAA] bg-white rounded-r-[5px]">
                            <input type="text" placeholder="Stock" className="w-24 px-3 py-2 border-0 focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]" value={0} />
                          </div>
                        </div>
                        <div className="col-span-12 sm:col-span-3">
                          <label className="block text-[14px] font-bold text-[#333333] mb-1.5">
                            <span className="text-red-500">*</span> Harga Diskon</label>
                          <div className="flex rounded-[5px] border border-[#AAAAAA] bg-white">
                            <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                            <input type="text" placeholder="Harga Diskon" className="flex-1 block w-full rounded-none rounded-[5px] focus:outline-none border-gray-300 px-3 py-2 placeholder:text-[#AAAAAA]" />
                          </div>
                        </div>
                        <div className="col-span-12 sm:col-span-2 w-1/4">
                          <label className="block text-[14px] font-bold text-[#333333] mb-1.5">
                            <span className="text-red-500">*</span> Persen Diskon</label>
                          <input type="text" placeholder="Persen" className="px-3 py-2 border border-[#AAAAAA] rounded-[5px] focus:outline-none placeholder:text-[#AAAAAA] w-[85px]" />
                        </div>
                      </div>
                  }
                </div>
              </div>
              {
                isVariant &&
                <div className="mb-6 mt-2">
                  <div className="flex items-center gap-4 items-end " onMouseEnter={() => setTipKey('priceStock')}
                    onMouseLeave={() => setTipKey('default')}>
                    <div className="col-span-12 sm:col-span-5 ">
                      <label className="block text-[14px] font-bold text-[#333333] mb-1.5">

                        Harga Produk
                      </label>
                      <div className="flex rounded-l-[5px] border border-[#AAAAAA] bg-white">
                        <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                        <input type="text" placeholder="Harga" className="flex-1 block w-full px-3 py-2 border-0 rounded-none focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]" value={formatRupiahNoRP(globalPrice)} onChange={(e) => setGlobalPrice(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-5 ml-[-20px] ">
                      <label className="block text-[14px] font-bold text-[#333333] mb-1.5">

                        Stok
                      </label>
                      <div className="flex items-center border border-[#AAAAAA] bg-white rounded-r-[5px]">
                        <input type="text" placeholder="Stock" className="w-24 px-3 py-2 border-0 focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]" value={globalStock || 0} onChange={(e) => setGlobalStock(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-3">
                      <label className="block text-[14px] font-bold text-[#333333] mb-1.5">
                        Harga Diskon</label>
                      <div className="flex rounded-[5px] border border-[#AAAAAA] bg-white">
                        <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                        <input type="text" placeholder="Harga Diskon" className="flex-1 block w-full rounded-none rounded-[5px] focus:outline-none border-gray-300 px-3 py-2 placeholder:text-[#AAAAAA]" value={formatRupiahNoRP(globalDiscount)} onChange={(e) => setGlobalDiscount(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-2">
                      <label className="block text-[14px] font-bold text-[#333333] mb-1.5 w-[200px]">
                        Persen Diskon</label>
                      <div className='flex items-center gap-3'>
                        <input type="text" placeholder="Persen" className="px-3 py-2 border border-[#AAAAAA] rounded-[5px] focus:outline-none placeholder:text-[#AAAAAA] w-[85px]" value={globalDiscountPercent} onChange={(e) => setGlobalDiscountPercent(e.target.value)} />
                        {
                          variations[0]?.options[0] != '' &&
                          <div className="col-span-12 sm:col-span-2">
                            <button className="w-[155px] bg-[#52357B] h-[42px] rounded-[5px] text-white font-semibold text-[14px] py-2 hover:bg-purple-800 transition duration-200" onClick={applyGlobalToAll}>Terapkan kesemua</button>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }

              <div className="overflow-x-auto"
                onMouseEnter={() => setTipKey('variation')}
                onMouseLeave={() => setTipKey('default')}>
                {
                  variations[0]?.name && isVariant &&
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
              <div className="mb-6 space-y-6 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  onMouseEnter={() => setTipKey('purchaseLimit')}
                  onMouseLeave={() => setTipKey('default')}>
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
                  onMouseEnter={() => setTipKey('weightDimension')}
                  onMouseLeave={() => setTipKey('default')}>
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
                      isVariant && variations[0]?.options[0] != '' &&
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
                {variations[0]?.name && showDimensionTable && isVariant && (
                  <div className="overflow-x-auto mt-4"
                    onMouseEnter={() => setTipKey('weightDimension')}
                    onMouseLeave={() => setTipKey('default')}>
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
                <div onMouseEnter={() => setTipKey('dangerousGoods')}
                  onMouseLeave={() => setTipKey('default')}>

                  <RadioGroup label="Produk Berbahaya?" name="dangerous" options={['Tidak', 'Mengandung Baterai / Magnet / Cairan / Bahan Mudah Terbakar']} />
                </div>
                <div onMouseEnter={() => setTipKey('preorder')}
                  onMouseLeave={() => setTipKey('default')}>

                  <RadioGroup label="Pre Order" name="preorder" options={['Tidak', 'Ya']} />
                </div>
                <div onMouseEnter={() => setTipKey('condition')}
                  onMouseLeave={() => setTipKey('default')}>

                  <RadioGroup label="Kondisi" name="condition" options={['Baru', 'Bekas Dipakai']} required />
                </div>

                <div onMouseEnter={() => setTipKey('sku')}
                  onMouseLeave={() => setTipKey('default')}>
                  <label className="text-[#333333] font-bold text-[14px]">
                    SKU Induk
                  </label>
                  <input type="text" placeholder="Masukkan kode unik untuk setiap produk agar mudah dilacak dan dikelola di sistem." className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div className="mt-[-15px] text-[14px] text-[#333333]">
                  Masukkan kode unik untuk setiap produk agar mudah dilacak dan dikelola di sistem.
                </div>

                <div className='mt-[-10px]'>
                  <div onMouseEnter={() => setTipKey('cod')}
                    onMouseLeave={() => setTipKey('default')}>
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
                  <div className="relative" onMouseEnter={() => setTipKey('schedule')}
                    onMouseLeave={() => setTipKey('default')}>
                    <label className="text-[#333333] font-bold text-[14px]">
                      Jadwal Ditampilkan
                    </label>
                    <div className='mt-2'>
                      <DateTimePicker
                        value={scheduleDate}
                        onChange={(date) => {
                          setScheduleDate(date);
                          validateScheduleDate(date);
                        }}
                      />
                    </div>
                    {scheduleError && (
                      <div className='w-[508px] text-[14px] text-[#FF0000] mt-1'>
                        {scheduleError}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="bg-white flex justify-between items-center sticky bottom-0 p-4" style={{
                boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.25)'
              }}>
                <button className="text-[#52357B] text-[14px] font-semibold h-[32px] rounded-[5px] border w-[124px] border-[#52357B] font-medium hover:underline">Kembali</button>
                <div className="flex items-center space-x-2">
                  <button className="text-[#52357B] text-[14px] font-semibold h-[32px] rounded-[5px] border w-[160px] border-[#52357B] font-medium hover:underline" onClick={() => handleSave('ARCHIVED')}>Simpan & Arsipkan</button>
                  <button className="text-white bg-[#52357B] text-[14px] font-semibold h-[32px] rounded-[5px] border w-[160px] border-[#52357B] font-medium hover:bg-purple-800 transition duration-200" onClick={() => handleSave('PUBLISHED')}>Simpan & Tampilkan</button>
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
      {
        snackbar.isOpen && (
          <Snackbar
            message={snackbar.message}
            type={snackbar.type}
            isOpen={snackbar.isOpen}
            onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
          />
        )
      }
      {loading && <Loading />}
    </MyStoreLayout>
  );
};

export default AddProductPage;
