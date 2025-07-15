import DateTimePicker from 'components/DateTimePicker';
import Loading from 'components/Loading';
import { Modal } from 'components/Modal';
import { ModalError } from 'components/ModalError';
import CropModal from 'components/my-store/addProduct/CropModal';
import ProductImageUploader from 'components/my-store/addProduct/ProductImageUploader';
import TipsCard from 'components/my-store/addProduct/TipsCard';
import VideoUploader from 'components/my-store/addProduct/VideoUploader';
import CategorySelector from 'components/my-store/product/CategorySelector';
import { formatRupiahNoRP } from 'components/Rupiah';
import Snackbar from 'components/Snackbar';
import { useTipsStore } from 'components/stores/tipsStore';
import { Pencil, Trash2, ChevronRight, Move, CheckCircle, ImageIcon, Plus, X, AlertTriangle } from 'lucide-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
const TextInput = ({ id, label, placeholder, maxLength, value, setValue, required = false }: { id?: string; label: string, placeholder: string, maxLength: number, value: string, setValue: (val: string) => void, required?: boolean }) => (
  <div id={id}>
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
        {value?.length}/{maxLength}
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
  id,
}: {
  label: string,
  placeholder: string,
  maxLength: number,
  value: string,
  setValue: (val: string) => void,
  required?: boolean
  id?: string
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
    <div id={id}>
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
          {value?.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

const RadioGroup = ({
  label,
  name,
  options,
  required = false,
  onChange,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  onChange?: (val: string) => void;
  defaultValue?: string;
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? options[0]);

  useEffect(() => {
    // isi ulang selectedValue saat defaultValue berubah (saat data edit dimuat ulang)
    if (defaultValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (onChange) onChange(selectedValue);
  }, [selectedValue]);

  return (
    <div>
      <label className="block text-[14px] font-bold text-[#333333] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center space-x-6">
        {options.map((option) => (
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
              {selectedValue === option && <div className="w-2 h-2 rounded-full bg-[#660077]"></div>}
            </div>
            <span
              className={`text-[14px] text-[#333333] ${selectedValue === option ? 'font-bold' : 'font-normal'
                }`}
            >
              {option}
            </span>
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
  image?: File | null;
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
}

type Specification = {
  name: string;
  value: string;
};

type CombinationItem = {
  price?: number | string;
  stock?: number | string;
  discount_price?: number | string;
  discount_percent?: number | string;
  weight?: number | string;
  length?: number | string;
  width?: number | string;
  height?: number | string;
  image?: string;
};


async function convertImageUrlToFile(url: string): Promise<File | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const filename = url.split('/').pop() || 'image.jpg';
    return new File([blob], filename, { type: blob.type });
  } catch {
    return null;
  }
}


// Komponen Utama Halaman
const AddProductPage: NextPage = () => {
  const router = useRouter()
  const params = router?.query;
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [showDimensionTable, setShowDimensionTable] = useState(false);
  const [isVariant, setIsVariant] = useState<boolean>(false);
  const [showPercentSuggest, setShowPercentSuggest] = useState(false);
  const [showPercentSuggestIndex, setShowPercentSuggestIndex] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  // const variations = [
  //   { color: 'Merah', sizes: ['Besar', 'Sedang', 'Kecil'] },
  //   { color: 'Oranye', sizes: ['Besar', 'Sedang', 'Kecil'] },
  // ];
  const setTipKey = useTipsStore((s) => s.setTipKey);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState<{ message: string; type?: 'success' | 'error' | 'info'; isOpen: boolean; }>({ message: '', type: 'info', isOpen: false });
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);  //foto produk 1-10
  const [promoImage, setPromoImage] = useState<File | null>(null); //foto produk promosi
  const [videoFile, setVideoFile] = useState<File | null>(null); //video produk
  const [category, setCategory] = useState('');
  const discountOptions = Array.from({ length: 14 }, (_, i) => (i + 1) * 5);

  const [cropModalImage, setCropModalImage] = useState<string | null>(null);
  const [cropCallback, setCropCallback] = useState<((file: File) => void) | null>(null);
  const tipsChecklist = {
    'Tambah min. 1 Foto': selectedImages?.length >= 1,
    'Tambah 1 Foto Promosi': promoImage !== null,
    'Tambahkan Video': videoFile !== null,
    'Nama 25+ karakter': productName?.length >= 25,
    'Deskripsi 100+ karakter': description?.length >= 100,
  };
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [tempCategory, setTempCategory] = useState(category);
  const [idCategorie, setIdCategorie] = useState<number | undefined>();
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
  const [globalStock, setGlobalStock] = useState('1');
  const [globalDiscount, setGlobalDiscount] = useState('');
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState('');
  const [variantData, setVariantData] = useState<VariantRowData[]>([]); // [ [row0], [row1], ... ]
  const [globalWeight, setGlobalWeight] = useState('');
  const [globalLength, setGlobalLength] = useState('');
  const [globalWidth, setGlobalWidth] = useState('');
  const [globalHeight, setGlobalHeight] = useState('');

  const [sku, setSku] = useState('');
  console.log(variantData)
  //jadwal ditampilkan 
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [schedule, setSchedule] = useState<string | ''>('');
  const [scheduleError, setScheduleError] = useState('');
  const [isHazardous, setIsHazardous] = useState('0');
  const [isProductPreOrder, setIsProductPreOrder] = useState('0');
  const [isUsed, setIsUsed] = useState('0');
  const [isCodEnabled, setIsCodEnabled] = useState('0');

  //pembelian
  const [minOrder, setMinOrder] = useState<number>(1);
  const [maxOrder, setMaxOrder] = useState<number>(1000);

  const [countryOrigin, setCountryOrigin] = useState('');

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const scrollToFirstError = (errors: { [key: string]: string }) => {
    const firstErrorKey = Object.keys(errors)[0];
    if (!firstErrorKey) return;

    // Coba temukan elemennya
    const element = document.getElementById(firstErrorKey);
    if (element) {
      // Gulir elemen ke tengah layar
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Beri highlight visual sementara (opsional tapi sangat membantu)
      element.style.transition = 'background-color 0.5s ease';
      element.style.backgroundColor = '#fff2f2'; // Warna highlight merah muda
      setTimeout(() => {
        element.style.backgroundColor = ''; // Hapus highlight setelah 2 detik
      }, 2000);
    }
  };
  useEffect(() => {
    if (scheduleDate) {
      const date = new Date(scheduleDate);

      const pad = (n: number) => n.toString().padStart(2, '0');

      // Ambil waktu lokal
      const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

      setSchedule(formattedDate);
    }
  }, [scheduleDate])

  useEffect(() => {
    // Membersihkan format rupiah dan memastikan nilai adalah angka
    const price = parseFloat(String(globalPrice).replace(/[^0-9]/g, '')) || 0;
    const percent = parseInt(globalDiscountPercent, 10) || 0;

    if (price > 0 && percent > 0) {
      const discountValue = price * (percent / 100);
      const finalPrice = price - discountValue;

      // Set harga diskon yang sudah dihitung
      setGlobalDiscount(String(finalPrice));
    } else {
      // Jika tidak ada diskon, kosongkan field harga diskon
      setGlobalDiscount('');
    }
  }, [globalPrice, globalDiscountPercent]);

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
        const index = vIndex * variation.sizes?.length + sIndex;
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
    if (variations?.length < 2) {
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
    const isLast = optIndex === options?.length - 1;

    if (isLast && value.trim() !== '') {
      options.push('');
    }

    // Hapus trailing kosong lebih dari 1
    if (
      options?.length >= 2 &&
      options[options?.length - 1].trim() === '' &&
      options[options?.length - 2].trim() === ''
    ) {
      options.pop();
    }

    setVariations(updated);
  };


  const handleDeleteOption = (varIndex: number, optIndex: number) => {
    const updated = [...variations];
    const options = updated[varIndex].options;

    // Hapus hanya jika lebih dari 1 opsi
    if (options?.length > 1) {
      options.splice(optIndex, 1);
    } else {
      options[0] = '';
    }

    setVariations(updated);
  };

  const buildCombinationTable = () => {
    const var1 = variations[0]?.options.filter(opt => opt.trim() !== '') || [];
    let var2 = variations[1]?.options.filter(opt => opt.trim() !== '');

    if (!var2 || var2?.length === 0) {
      var2 = ['']; // fallback satu elemen kosong agar tetap render row
    }

    return var1.map(color => ({
      color,
      sizes: var2
    }));
  };


  // useEffect(() => {

  //   setVariantData([]);
  // }, [variations,params]);

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
            for (let i = 0; i < variation.sizes?.length; i++) {
              if (currentFlatIndex === clickedIndex) {
                selectedColor = variation.color;
              }
              currentFlatIndex++;
            }
          }

          // Simpan image ke semua kombinasi yang punya warna sama
          currentFlatIndex = 0;
          for (const variation of combinations) {
            for (let i = 0; i < variation.sizes?.length; i++) {
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
        const index = vIndex * variation.sizes?.length + sIndex;
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

  const combinations = useMemo(() => {
    const var1 = variations[0]?.options.filter(opt => opt.trim() !== '') || [];
    let var2 = variations[1]?.options.filter(opt => opt.trim() !== '');

    if (!var2 || var2?.length === 0) {
      var2 = [''];
    }

    return var1.map(color => ({
      color,
      sizes: var2
    }));
  }, [variations]);

  //categorie
  const handleConfirmCategory = () => { setCategory(tempCategory); setCategoryModalOpen(false); };

  //image
  const handleSelectImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    if (selectedImages?.length >= 10) {
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
  }, [selectedImages?.length]);

  // const handleSelectPromoImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files || !e.target.files[0]) return;
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     if (reader.result) {
  //       setCropModalImage(reader.result as string);
  //       setCropCallback(() => (croppedFile: File) => {
  //         setPromoImage(croppedFile);
  //       });
  //     }
  //   };
  //   reader.readAsDataURL(file);
  // }, []);

  const handleVideoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setVideoFile(file ?? null);
  }, []);

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (selectedImages?.length === 0) newErrors.images = 'Minimal 1 gambar utama harus diunggah';
    if (!promoImage) newErrors.promo = 'Gambar promosi wajib diunggah';
    if (!productName.trim()) newErrors.productName = 'Nama produk wajib diisi';
    if (!category.trim()) newErrors.category = 'Kategori wajib dipilih';
    if (!description.trim()) newErrors.description = 'Deskripsi produk wajib diisi';
    if (!brand.trim()) newErrors.brand = 'Merek wajib dipilih';
    if (!countryOrigin.trim()) newErrors.countryOrigin = 'Negara asal wajib dipilih';
    if (!isVariant) {
      if (!globalPrice.trim()) newErrors.globalPrice = 'Harga wajib diisi';
      if (!globalStock.trim()) newErrors.globalStock = 'Stok wajib diisi';
      if (!globalHeight.trim() || !globalWeight.trim() || !globalWidth.trim() || !globalLength.trim()) newErrors.globalDelivry = 'Pengiriman wajib diisi';
    }
    if (isVariant) {
      const optionCount1 = variations[0]?.options?.length ?? 0;
      const optionCount2 = variations[1]?.options?.length ?? 0;

      const totalVariant = variations?.length > 1
        ? (optionCount1 - 1) + (optionCount2 - 1)
        : optionCount1 - 1;
      console.log(variantData?.length, totalVariant)
      if (!variantData || variantData?.length < totalVariant) {
        newErrors.variant = 'Harga dan stock tidak boleh kosong';
      }

      for (let i = 0; i < (variantData?.length ?? 0); i++) {
        if (!variantData[i]?.price) {
          newErrors[`variantPrice_${i}`] = 'Harga wajib diisi';
        }
        if (!variantData[i]?.stock) {
          newErrors[`variantStock_${i}`] = 'Stock wajib diisi';
        }
        if (!variantData[i]?.height) {
          newErrors[`variantHeight_${i}`] = 'Tinggi wajib diisi';
        }
        if (!variantData[i]?.length) {
          newErrors[`variantLength_${i}`] = 'Panjang wajib diisi';
        }
        if (!variantData[i]?.weight) {
          newErrors[`variantWeight_${i}`] = 'Berat wajib diisi';
        }
        if (!variantData[i]?.width) {
          newErrors[`variantWidth_${i}`] = 'Lebar wajib diisi';
        }
      }
    }
    if (!schedule.trim()) newErrors.schedule = 'Jadwal wajib dipilih';

    // videoFile tidak wajib

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async (status: 'PUBLISHED' | 'ARCHIVED') => {
    if (!validateForm()) {
      setErrors(currentErrors => {
        const firstErrorMessage = Object.values(currentErrors)[0];

        // 1. Tampilkan MODAL dengan pesan error pertama
        setErrorModalMessage(firstErrorMessage || 'Harap periksa kembali data yang Anda masukkan.');
        setIsErrorModalOpen(true);

        // 2. Gulir ke elemen yang error (logika ini tetap sama)
        scrollToFirstError(currentErrors);

        return currentErrors;
      });

      return; // Hentikan eksekusi
    }

    setLoading(true);
    const formData = new FormData();

    // Form input dasar
    formData.append('productName', productName);
    formData.append('description', description);
    formData.append('idCategorie', String(idCategorie));
    formData.append('parentSku', sku); // hardcoded karena input tidak tersedia
    formData.append('condition', 'Baru'); // sesuaikan dari radio jika diperlukan
    formData.append('scheduledDate', schedule || '');
    formData.append('status', status);

    // Opsi biner (sementara semua hardcoded sesuai contoh)
    formData.append('isHazardous', isHazardous);
    formData.append('isProductPreOrder', isProductPreOrder);
    formData.append('shippingInsurance', '0');
    formData.append('isVariationActive', isVariant ? '1' : '0');
    formData.append('shippingPerVariation', '0');
    formData.append('condition', isUsed);
    formData.append('isCodEnabled', isCodEnabled);
    formData.append('min_order', minOrder.toString());
    formData.append('max_order', maxOrder.toString());
    // Gambar & video
    selectedImages.forEach((img) => formData.append('productPhotos[]', img));
    if (videoFile) formData.append('productVideo', videoFile);
    if (promoImage) formData.append('productPromo', promoImage);


    if (isVariant) {
      formData.append('variations', JSON.stringify(variations)); // array of { name, options }

      const formattedVariants = variantData.map((variant, index) => {
        const combination: Record<string, string> = {};
        const flatIndex = index;

        // Pastikan kombinasi tersedia
        if (
          combinations?.length === 0 ||
          !combinations[0].sizes ||
          combinations[0].sizes?.length === 0
        ) {
          return null; // lewati jika tidak ada kombinasi
        }

        const colorIndex = Math.floor(flatIndex / combinations[0].sizes?.length);
        const sizeIndex = flatIndex % combinations[0].sizes?.length;

        const warna = combinations[colorIndex]?.color;
        const ukuran = combinations[colorIndex]?.sizes?.[sizeIndex];

        // Tambahkan kombinasi jika nama variasi dan nilai tersedia
        if (variations[0] && warna) combination[variations[0].name] = warna;
        if (variations[1] && ukuran) combination[variations[1].name] = ukuran;
        let discontPercent
        let discount
        if (variant.discountPercent > '0') {
          discontPercent = variant.discountPercent;
          discount = variant.discount;
        } else {
          discontPercent = 0;
          discount = variant?.price?.replace(/\./g, '')
        }
        return {
          id: Date.now() + index, // id sementara
          combination,
          price: variant?.price?.replace(/\./g, ''),
          stock: variant.stock,
          sku: variant.stock, // sementara pakai stock sebagai sku
          image: variant.image ? { preview: URL.createObjectURL(variant.image) } : null,
          weight: variant.weight,
          length: variant?.length,
          width: variant.width,
          height: variant.height,
          discount: discontPercent,
          discountPercent: discount,
        };
      }).filter(Boolean); // buang yang null (kombinasi kosong)

      formData.append('productVariants', JSON.stringify(formattedVariants));

      // Upload gambar jika ada
      variantData.forEach((v, i) => {
        if (v.image) {
          formData.append(`variant_images[${i}]`, v.image);
        }
      });
      formData.append('shippingWeight', String(variantData[0]?.weight ?? 0));
      formData.append('length', String(variantData[0]?.length ?? 0));
      formData.append('width', String(variantData[0]?.width ?? 0));
      formData.append('height', String(variantData[0]?.height ?? 0));
    } else {
      formData.append('price', globalPrice?.replace(/\./g, ''));
      formData.append('stock', globalStock);
      formData.append('shippingWeight', globalWeight);
      formData.append('length', globalLength);
      formData.append('width', globalWidth);
      formData.append('height', globalHeight);
      if (globalDiscountPercent > '0') {
        formData.append('price_discount', globalDiscount);
        formData.append('discount', globalDiscountPercent);
      } else {
        formData.append('price_discount', globalPrice?.replace(/\./g, ''));
        formData.append('discount', '0');
      }
    }

    // Berat & Dimensi
    formData.append('packageDimensions', JSON.stringify({
      length: globalLength,
      width: globalWidth,
      height: globalHeight,
    }));

    // Spesifikasi (sementara hardcoded, bisa diganti sesuai input UI)
    formData.append('specifications', JSON.stringify({
      Merek: brand,
      'Negara Asal': countryOrigin,
    }));

    try {
      const res = await Post<Response>('zukses', `product`, formData);
      if (res?.data?.status === 'success') {
        setLoading(false);
        setSnackbar({ message: 'Produk berhasil disimpan!', type: 'success', isOpen: true });
        window.location.href = '/my-store/product';
        localStorage.removeItem('EditProduct');
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan produk.');
    }
  };


  // Hapus gambar utama
  const handleRemoveMainImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Ganti gambar utama (dengan modal crop)
  const handleReplaceMainImage = (index: number, file: File) => {
    setCropModalImage(URL.createObjectURL(file)); // tampilkan gambar di modal crop

    // Simpan callback yang akan dipanggil setelah crop selesai
    setCropCallback(() => (croppedFile: File) => {
      setSelectedImages((prev) =>
        prev.map((img, i) => (i === index ? croppedFile : img))
      );
    });
  };

  // Ganti gambar promosi (dengan modal crop)
  const handleReplacePromoImage = (file: File) => {
    setCropModalImage(URL.createObjectURL(file));

    setCropCallback(() => (croppedFile: File) => {
      setPromoImage(croppedFile);
    });
  };

  // Hapus gambar promosi
  const handleRemovePromoImage = () => {
    setPromoImage(null);
  };

  useEffect(() => {
    if (params?.type === 'edit') {
      const dataString = localStorage.getItem('EditProduct');
      if (dataString) {
        try {
          const data = JSON.parse(dataString);

          setProductName(data.name || '');
          setSku(data.sku || '');
          setDescription(data.desc || '');
          const brand = (data.specifications as Specification[])?.find((s) => s.name === 'Merek')?.value || '';
          const origin = (data.specifications as Specification[])?.find((s) => s.name === 'Negara Asal')?.value || '';

          setBrand(brand);
          setCountryOrigin(origin);
          setMinOrder(data.min_purchase || 1);
          setMaxOrder(data.max_purchase || 1000);
          setIsUsed(String(data.is_used || 0));
          setIsCodEnabled(String(data.is_cod_enabled || 0));
          setIsProductPreOrder(String(data.delivery?.is_pre_order || '1'));
          setIsHazardous(String(data.delivery?.is_dangerous_product || 0));
          setCategory(data.category || '');
          setIdCategorie(data.category_id || undefined);
          setSelectedImages(data.media.map((m: { url: string }) => m.url));
          setPromoImage(data.image); // string
          const raw = data?.scheduled_date;
          if (raw) {
            const parsed = new Date(raw.replace(' ', 'T'));
            if (!isNaN(parsed.getTime())) {
              setScheduleDate(parsed);
              console.log(parsed)
            }
          }

          if (data?.variants && data?.variants.length > 0) {
            setIsVariant(true);

            const mappedVariants = data.variants.map((v: { variant: string; options: string[] }) => ({
              name: v.variant,
              options: v.options || [],
            }));
            setVariations(mappedVariants);
          }
          if (data.combinations) {
            const mapVariants = async () => {
              const formatted = await Promise.all(
                (data.combinations as CombinationItem[]).map(async (item) => ({
                  price: item.price?.toString() || '',
                  stock: item.stock?.toString() || '',
                  discount: item.discount_price?.toString() || '',
                  discountPercent: item.discount_percent?.toString() || '',
                  weight: item.weight?.toString() || '',
                  length: item.length?.toString() || '',
                  width: item.width?.toString() || '',
                  height: item.height?.toString() || '',
                  image: item.image ? await convertImageUrlToFile(item.image) : null,
                }))
              );

              console.log('edit', formatted);
              setVariantData(formatted);
            };

            mapVariants();
          }

          if (!data.variants || data.variants.length === 0) {
            setIsVariant(false);
            setGlobalPrice(data.price?.toString() || '');
            setGlobalStock(data.stock?.toString() || '');
            setGlobalDiscount(data.discount_price?.toString() || '');
            setGlobalDiscountPercent(data.discount_percent?.toString() || '');
            setGlobalWeight(data.delivery?.weight || '');
            setGlobalLength(data.delivery?.length || '');
            setGlobalWidth(data.delivery?.width || '');
            setGlobalHeight(data.delivery?.height || '');
          }
        } catch (err) {
          console.error('Failed to parse EditProduct from localStorage', err);
        }
      }
    }
  }, [params]);

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
                  <ProductImageUploader
                    selectedImages={selectedImages}
                    promoImage={promoImage}
                    onSelectMainImage={handleSelectImage}
                    onReplaceMainImage={handleReplaceMainImage}
                    onRemoveMainImage={handleRemoveMainImage}
                    onReplacePromoImage={handleReplacePromoImage} // bisa kirim ke modal crop juga
                    onRemovePromoImage={handleRemovePromoImage}
                    errorPromo={errors.promo}
                    errorImages={errors.images}
                  />
                </div>

                <hr className="my-6 border-[#CCCCCC]" />

                <div onMouseEnter={() => setTipKey('video')} onMouseLeave={() => setTipKey('default')}>
                  <VideoUploader videoFile={videoFile} onVideoChange={handleVideoChange} />
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <div
                  id="productName"
                  onMouseEnter={() => setTipKey('name')}
                  onMouseLeave={() => setTipKey('default')}>
                  <TextInput label="Nama Produk" placeholder="Masukkan Nama Produk" maxLength={255} value={productName} setValue={setProductName} required />
                  {errors.productName && (
                    <div className="text-red-500 text-sm mt-1">{errors.productName}</div>
                  )}

                </div>
                <div className="mt-[-15px] rounded-md text-[12px] text-[#333333]">
                  <span className="font-bold text-[14px]">Tips!. </span> Masukkan Nama Merek + Tipe Produk + Fitur Produk (Bahan, Warna, Ukuran, Variasi)
                </div>
                <div
                  id="category"
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
                  {errors.category && (
                    <div className="text-red-500 text-sm mt-1">{errors.category}</div>
                  )}
                </div>
                <div
                  id="description"
                  onMouseEnter={() => setTipKey('description')}
                  onMouseLeave={() => setTipKey('default')}>
                  <TextAreaInput label="Deskripsi / Spesifikasi Produk" placeholder="Jelaskan secara detil mengenai produkmu" maxLength={3000} value={description} setValue={setDescription} required />
                  {errors.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                </div>
                <div
                  id="brand"
                  onMouseEnter={() => setTipKey('brand')}
                  onMouseLeave={() => setTipKey('default')}>
                  <TextInput label="Merek Produk" placeholder="Masukkan Merek Produkmu" maxLength={255} value={brand} setValue={setBrand} />
                  {errors.brand && (
                    <div className="text-red-500 text-sm mt-1">{errors.brand}</div>
                  )}
                </div>
                <div
                  id="countryOrigin"
                  onMouseEnter={() => setTipKey('brand')}
                  onMouseLeave={() => setTipKey('default')}>
                  <label className="block text-[#333333] font-bold text-[14px] mb-0.5"><span className="text-red-500">*</span> Negara Asal</label>
                  <select className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] text-[#555555] text-[14px] mt-1" value={countryOrigin}
                    onChange={(e) => setCountryOrigin(e.target.value)}>
                    <option>Pilih Negara Asal</option>
                    <option>Indonesia</option>
                  </select>
                </div>
                {errors.countryOrigin && (
                  <div className="text-red-500 text-sm mt-1">{errors.countryOrigin}</div>
                )}

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
                                  {variation.name?.length}/20
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
                                          .filter(suggestion =>
                                            suggestion.toLowerCase().includes(option.toLowerCase()) && // 1. Filter berdasarkan ketikan (tetap ada)
                                            !variation.options.includes(suggestion)                     // 2. HANYA tampilkan jika belum ada di daftar opsi yang dipilih
                                          )?.length > 0 && (
                                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                                            <div className="text-[12px] text-gray-500 px-3 py-1 border-b border-gray-200">Nilai yang direkomendasikan</div>
                                            {(optionSuggestions[variations[varIndex].name] || [])
                                              .filter(suggestion =>
                                                suggestion.toLowerCase().includes(option.toLowerCase()) &&
                                                !variation.options.includes(suggestion)
                                              )
                                              .map((suggestion) => (
                                                <div
                                                  key={suggestion}
                                                  className="px-3 py-2 text-[14px] text-[#333] hover:bg-gray-100 cursor-pointer"
                                                  onPointerDown={() => handleOptionChange(varIndex, optIndex, suggestion)}
                                                >
                                                  {suggestion}
                                                </div>
                                              ))
                                            }
                                          </div>
                                        )
                                      }
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

                      {variations?.length < 2 && (
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
                      <>
                        <div
                          id="globalPrice"
                          className="flex items-center gap-4 items-end mt-4 w-[75%]"
                          onMouseEnter={() => setTipKey('priceStock')}
                          onMouseLeave={() => setTipKey('default')}>
                          <div className="col-span-12 sm:col-span-5">
                            <label className="block text-[14px] font-bold text-[#333333] mb-1.5">
                              <span className="text-red-500">*</span>
                              Harga Produk
                            </label>
                            <div className="flex rounded-l-[5px] border border-[#AAAAAA] bg-white">
                              <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                              <input type="text" placeholder="Harga" className="flex-1 block w-full px-3 py-2 border-0 rounded-none focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]"
                                value={formatRupiahNoRP(globalPrice)}
                                onChange={(e) => setGlobalPrice(e.target.value)} />
                            </div>
                          </div>
                          <div className="col-span-12 sm:col-span-5 ml-[-20px]">
                            <label className="block text-[14px] font-bold text-[#333333] mb-1.5">
                              <span className="text-red-500">*</span>
                              Stok
                            </label>
                            <div className="flex items-center border border-[#AAAAAA] bg-white rounded-r-[5px]">
                              <input type="number" placeholder="Stock" className="w-24 px-3 py-2 border-0 focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]"
                                value={globalStock}
                                onChange={(e) => setGlobalStock(e.target.value)} />
                            </div>
                          </div>
                          <div className="col-span-1 w-1/4">
                            <label className="block text-[14px] font-bold text-[#333333] mb-1.5">
                              Persen Diskon
                            </label>
                            <div className="relative">
                              <div className="relative">
                                <input
                                  type="number"
                                  placeholder="Diskon (%)"
                                  className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] focus:outline-none h-[42px]"
                                  value={globalDiscountPercent}
                                  onChange={(e) => setGlobalDiscountPercent(e.target.value)}
                                  onFocus={() => setShowPercentSuggest(true)}
                                  onBlur={() => setTimeout(() => setShowPercentSuggest(false), 200)}
                                />
                                {showPercentSuggest && (
                                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-[150px] overflow-auto">
                                    {discountOptions
                                      .filter(opt =>
                                        globalDiscountPercent === '' || opt.toString() !== globalDiscountPercent
                                      )
                                      .map(opt => (
                                        <div
                                          key={opt}
                                          className="px-3 py-2 text-[14px] text-[#333] hover:bg-gray-100 cursor-pointer"
                                          onMouseDown={() => setGlobalDiscountPercent(opt.toString())}
                                        >
                                          {opt}%
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                          <div className="col-span-12 sm:col-span-3">
                            <label className="block text-[14px] font-bold text-[#333333] mb-1.5">
                              <span className="text-red-500">*</span> Harga Diskon</label>
                            <div className="flex rounded-[5px] border border-[#AAAAAA] bg-white">
                              <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                              <input type="text" placeholder="Harga Diskon" className="flex-1 block w-full rounded-none rounded-[5px] focus:outline-none border-gray-300 px-3 py-2 placeholder:text-[#AAAAAA]" value={formatRupiahNoRP(globalDiscount)}
                                readOnly />
                            </div>
                          </div>
                        </div>
                      </>
                  }
                </div>
              </div>
              {
                isVariant &&
                <div className="mb-2 mt-2">
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
                        <input type="number" placeholder="Stock" className="w-24 px-3 py-2 border-0 focus:ring-0 focus:outline-none placeholder:text-[#AAAAAA]" value={globalStock} onChange={(e) => setGlobalStock(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-3">
                      <label className="block text-[14px] font-bold text-[#333333] mb-1.5">
                        Persen Diskon</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Diskon (%)"
                          className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] focus:outline-none h-[42px]"
                          value={globalDiscountPercent}
                          onChange={(e) => setGlobalDiscountPercent(e.target.value)}
                          onFocus={() => setShowPercentSuggest(true)}
                          onBlur={() => setTimeout(() => setShowPercentSuggest(false), 200)}
                        />
                        {showPercentSuggest && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-[150px] overflow-auto">
                            {discountOptions
                              .filter(opt =>
                                globalDiscountPercent === '' || opt.toString() !== globalDiscountPercent
                              )
                              .map(opt => (
                                <div
                                  key={opt}
                                  className="px-3 py-2 text-[14px] text-[#333] hover:bg-gray-100 cursor-pointer"
                                  onMouseDown={() => setGlobalDiscountPercent(opt.toString())}
                                >
                                  {opt}%
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                    </div>
                    <div className="col-span-12 sm:col-span-2">
                      <label className="block text-[14px] font-bold text-[#333333] mb-1.5 w-[200px]">
                        Harga Setelah Diskon</label>
                      <div className='flex items-center gap-3'>
                        <div className="flex rounded-[5px] border border-[#AAAAAA] bg-white">
                          <span className="inline-flex items-center px-3 text-[#555555] text-[14px]">Rp |</span>
                          <input type="text" placeholder="Harga Diskon" className="flex-1 block w-full rounded-none rounded-[5px] focus:outline-none border-gray-300 px-3 py-2 placeholder:text-[#AAAAAA]" value={formatRupiahNoRP(globalDiscount)} readOnly />
                        </div>
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
              {errors.globalPrice && errors.globalStock ? (
                <div className="text-red-500 text-sm mt-1">Harga dan Stok wajib diisi</div>
              ) : errors.globalPrice ? (
                <div className="text-red-500 text-sm mt-1">{errors.globalPrice}</div>
              ) : errors?.globalStock && (
                <div className="text-red-500 text-sm mt-1">{errors.globalPrice}</div>
              )}

              <div className="overflow-x-auto"
                id="variant"
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
                          Persen Diskon
                        </th>
                        <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider text-center align-middle">
                          Harga Setelah Diskon
                        </th>
                      </tr>
                    </thead>


                    <tbody className="bg-white divide-y divide-gray-200">
                      {combinations.map((variation, vIndex) =>
                        variation.sizes.map((size, sIndex) => {
                          const index = vIndex * variation.sizes?.length + sIndex;
                          const rowData = variantData[index] || { price: '', stock: '', discount: '', discountPercent: '' };

                          return (
                            <tr key={`${vIndex}-${sIndex}`} className="border border-[#AAAAAA]">
                              {sIndex === 0 &&
                                variation.color !== '' && (
                                  <td
                                    className="px-4 py-4 whitespace-nowrap align-top"
                                    rowSpan={variation.sizes?.length}
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
                                                src={typeof rowData.image === 'string' ? rowData.image : URL.createObjectURL(rowData.image)}
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
                                      {errors[`variantImage_${index}`] && (
                                        <div className="text-red-500 text-sm mt-1">
                                          {errors[`variantImage_${index}`]}
                                        </div>
                                      )}
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
                                      const priceValue = parseFloat(String(e.target.value).replace(/[^0-9]/g, '')) || 0;
                                      const percentValue = parseInt(newData[index]?.discountPercent, 10) || 0;
                                      let newDiscountPrice = '';

                                      if (priceValue > 0 && percentValue > 0) {
                                        newDiscountPrice = String(priceValue - (priceValue * (percentValue / 100)));
                                      }

                                      newData[index] = { ...rowData, price: e.target.value, discount: newDiscountPrice };
                                      setVariantData(newData);
                                    }}
                                  />
                                </div>
                                {errors[`variantPrice_${index}`] && (
                                  <div className="text-red-500 text-sm mt-1">
                                    {errors[`variantPrice_${index}`]}
                                  </div>
                                )}
                              </td>

                              <td className="px-4 py-4 border border-[#AAAAAA] text-center align-middle" width={100}>
                                <input
                                  type="number"
                                  placeholder="Stock"
                                  className="w-full p-1 border border-[#AAAAAA] rounded-[5px] placeholder:text-[#AAAAAA] text-[15px] text-center focus:outline-none focus:ring-0"
                                  value={rowData.stock}
                                  onChange={(e) => {
                                    const newData = [...variantData];
                                    newData[index] = { ...rowData, stock: e.target.value };
                                    setVariantData(newData);
                                  }}
                                />
                                {errors[`variantStock_${index}`] && (
                                  <div className="text-red-500 text-sm mt-1">
                                    {errors[`variantStock_${index}`]}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-4 border border-[#AAAAAA] text-center align-middle" width={155}>
                                {/* Wrapper untuk input, tidak perlu 'relative' lagi tapi tidak apa-apa jika ada */}
                                <div>
                                  <input
                                    type="number"
                                    placeholder="Diskon (%)"
                                    className="w-full p-2 border border-[#AAAAAA] rounded-[5px] text-[14px] text-center focus:outline-none"
                                    value={rowData.discountPercent || ''}
                                    onChange={(e) => {
                                      // Logika onChange Anda tetap sama, tidak perlu diubah
                                      const value = e.target.value;
                                      const newData = [...variantData];
                                      const percentValue = parseInt(value, 10) || 0;
                                      const priceValue = parseFloat(String(newData[index]?.price).replace(/[^0-9]/g, '')) || 0;
                                      let newDiscountPrice = '';

                                      if (priceValue > 0 && percentValue > 0) {
                                        newDiscountPrice = String(priceValue - (priceValue * (percentValue / 100)));
                                      }

                                      newData[index] = { ...rowData, discountPercent: value, discount: newDiscountPrice };
                                      setVariantData(newData);
                                    }}
                                    // UBAH onFocus untuk MENGHITUNG POSISI
                                    onFocus={(e) => {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setDropdownPosition({
                                        top: rect.bottom, // Posisi bawah input (relatif ke layar)
                                        left: rect.left,  // Posisi kiri input (relatif ke layar)
                                        width: rect.width, // Lebar dropdown sama dengan input
                                      });
                                      setShowPercentSuggestIndex(index);
                                    }}
                                    onBlur={() => setTimeout(() => setShowPercentSuggestIndex(null), 200)}
                                  />

                                  {/* Dropdown sekarang dirender via Portal. 
      Tidak ada output visual di sini, tapi akan muncul di <body>
    */}
                                  {showPercentSuggestIndex === index && createPortal(
                                    <div
                                      className="bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                                      style={{
                                        position: 'fixed', // Gunakan 'fixed' agar benar-benar melayang
                                        top: `${dropdownPosition.top + 4}px`, // +4px untuk memberi sedikit jarak
                                        left: `${dropdownPosition.left}px`,
                                        width: `${dropdownPosition.width}px`,
                                        zIndex: 9999, // z-index super tinggi untuk memastikan di paling atas
                                      }}
                                    >
                                      {discountOptions
                                        .filter(opt =>
                                          rowData.discountPercent === '' || opt.toString() !== rowData.discountPercent
                                        )
                                        .map(opt => (
                                          <div
                                            key={opt}
                                            className="px-3 py-2 text-[14px] text-[#333] hover:bg-gray-100 cursor-pointer"
                                            // event onMouseDown untuk memilih opsi
                                            onMouseDown={() => {
                                              const newData = [...variantData];
                                              const priceValue = parseFloat(String(newData[index]?.price).replace(/[^0-9]/g, '')) || 0;
                                              const newDiscountPrice = priceValue > 0 ? String(priceValue - (priceValue * (opt / 100))) : '';

                                              newData[index] = { ...rowData, discountPercent: opt.toString(), discount: newDiscountPrice };
                                              setVariantData(newData);
                                              setShowPercentSuggestIndex(null); // Langsung tutup dropdown setelah dipilih
                                            }}
                                          >
                                            {opt}%
                                          </div>
                                        ))}
                                    </div>,
                                    document.body // Ini adalah target Portal
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4 border border-[#AAAAAA]">
                                <div className="flex items-center border border-[#AAAAAA] rounded-[5px] px-1">
                                  <span className="text-[15px] text-[#555555] mr-2">Rp</span>
                                  <input
                                    type="text"
                                    placeholder="Harga"
                                    className="w-full p-1 placeholder:text-[#AAAAAA] text-[15px] focus:outline-none focus:ring-0 focus:border-none"
                                    value={formatRupiahNoRP(rowData.discount)}
                                    readOnly
                                  />
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>



                  </table>
                }
                {errors.variant && (
                  <div className="text-red-500 text-sm mt-1">{errors.variant}</div>
                )}
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
                    <input type="number" defaultValue="1" className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] text-[17px] text-[#333333] mt-4" value={minOrder} onChange={(e) => setMinOrder(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-[#333333] font-bold text-[14px]">
                      <span className="text-red-500">*</span>  Maks. Jumlah Pembelian
                    </label>
                    <input type="number" defaultValue="1000" className="w-full px-3 py-2 border border-[#AAAAAA] rounded-[5px] text-[17px] text-[#333333] mt-4" value={maxOrder} onChange={(e) => setMaxOrder(Number(e.target.value))} />
                  </div>
                </div>

                <div className='mt-[-15px]'
                  id="globalDelivry"
                  onMouseEnter={() => setTipKey('weightDimension')}
                  onMouseLeave={() => setTipKey('default')}>
                  <label className="text-[#333333] font-bold text-[14px]">
                    Berat dan Dimensi Produk
                  </label>
                  <div className="flex items-center gap-3 mt-4">
                    <div className='border rounded-[5px] px-4 border-[#AAAAAA] h-[40px]'>
                      <input type="number" placeholder="Berat" className="w-24 p-2 placeholder:text-[#AAAAAA] text-[15px]  focus:outline-none focus:ring-0 focus:border-none" value={globalWeight}
                        onChange={(e) => setGlobalWeight(e.target.value)} />
                      <span className="text-[15px] text-[#555555]">Gr</span>
                    </div>
                    <div className='border rounded-[5px] px-4 border-[#AAAAAA] h-[40px]'>
                      <input type="number" placeholder="Lebar" className="w-24 p-2 placeholder:text-[#AAAAAA] text-[15px] w-[70px] focus:outline-none focus:ring-0 focus:border-none"
                        value={globalWidth} onChange={(e) => setGlobalWidth(e.target.value)} />
                      <span className="text-[15px] text-[#AAAAAA] mr-[20px]">|</span>
                      <input type="number" placeholder="Panjang" className="w-24 p-2 placeholder:text-[#AAAAAA] text-[15px] w-[70px] focus:outline-none focus:ring-0 focus:border-none"
                        value={globalLength} onChange={(e) => setGlobalLength(e.target.value)} />
                      <span className="text-[15px] text-[#AAAAAA] mr-[20px]">|</span>
                      <input type="number" placeholder="Tinggi" className="w-24 p-2 placeholder:text-[#AAAAAA] text-[15px] w-[70px] focus:outline-none focus:ring-0 focus:border-none  focus:outline-none focus:ring-0 focus:border-none"
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
                  {errors.globalDelivry && (
                    <div className="text-red-500 text-sm mt-1">{errors?.globalDelivry}</div>
                  )}
                </div>
                {variations[0]?.name && showDimensionTable && isVariant && (
                  <div className="overflow-x-auto mt-4"
                    onMouseEnter={() => setTipKey('weightDimension')}
                    onMouseLeave={() => setTipKey('default')}>
                    <table className="w-full">
                      <thead className="bg-[#EEEEEE] border border-[#AAAAAA]">
                        <tr>
                          {variations[0]?.options.filter(opt => opt.trim() !== '')?.length > 0 && (
                            <th className="px-4 py-3 text-[14px] font-bold text-[#333333] uppercase tracking-wider border-r border-[#AAAAAA] text-center align-middle">
                              {variations[0]?.name || 'Variasi 1'}
                            </th>
                          )}

                          {variations[1]?.options.filter(opt => opt.trim() !== '')?.length > 0 && (
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
                        {combinations.map((variation, vIndex) =>
                          variation.sizes.map((size, sIndex) => {
                            const index = vIndex * variation.sizes?.length + sIndex;
                            const rowData = variantData[index] || {};

                            return (
                              <tr key={`${vIndex}-${sIndex}`} className="border border-[#AAAAAA]">
                                {sIndex === 0 && variation.color !== '' && (
                                  <td
                                    className="px-4 py-4 align-middle border border-[#AAAAAA] align-top text-center"
                                    rowSpan={variation.sizes?.length}
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
                                      type="number"
                                      placeholder="Berat"
                                      value={rowData.weight || ''}
                                      onChange={(e) => {
                                        const updated = [...variantData];
                                        updated[index] = { ...rowData, weight: e.target.value };
                                        setVariantData(updated);
                                      }}
                                      className="w-full p-1.5 text-[14px] focus:outline-none focus:ring-0 focus:border-none"
                                    />
                                    <span className="text-[14px] text-gray-500 ml-2">gr</span>
                                  </div>
                                  {errors[`variantWeight_${index}`] && (
                                    <div className="text-red-500 text-sm mt-1">
                                      {errors[`variantWeight_${index}`]}
                                    </div>
                                  )}
                                </td>

                                {/* Dimensi */}
                                <td className="px-4 py-4 border border-[#AAAAAA]">
                                  <div className="border rounded-[5px] px-4 border-[#AAAAAA] h-[40px] flex items-center justify-between gap-2">
                                    <input
                                      type="number"
                                      placeholder="Lebar"
                                      className="w-16 placeholder:text-[#AAAAAA] text-[14px] focus:outline-none placeholder:text-center"
                                      value={rowData.width || ''}
                                      onChange={(e) => {
                                        const updated = [...variantData];
                                        updated[index] = { ...rowData, width: e.target.value };
                                        setVariantData(updated);
                                      }}
                                    />
                                    <p className="text-[#AAAAAA]">|</p>
                                    <input
                                      type="number"
                                      placeholder="Panjang"
                                      className="w-16 placeholder:text-[#AAAAAA] text-[14px] focus:outline-none placeholder:text-center"
                                      value={rowData?.length || ''}
                                      onChange={(e) => {
                                        const updated = [...variantData];
                                        updated[index] = { ...rowData, length: e.target.value };
                                        setVariantData(updated);
                                      }}
                                    />
                                    <p className="text-[#AAAAAA]">|</p>
                                    <input
                                      type="number"
                                      placeholder="Tinggi"
                                      className="w-16 placeholder:text-[#AAAAAA] text-[14px] focus:outline-none placeholder:text-center"
                                      value={rowData.height || ''}
                                      onChange={(e) => {
                                        const updated = [...variantData];
                                        updated[index] = { ...rowData, height: e.target.value };
                                        setVariantData(updated);
                                      }}
                                    />
                                    <p className="text-[#AAAAAA]">|</p>
                                    <p className="text-[#555555]">Cm</p>
                                  </div>
                                  <div>
                                    {errors[`variantWidth_${index}`] && (
                                      <span className="text-red-500 text-sm mt-1">
                                        {errors[`variantWidth_${index}`]},
                                      </span>
                                    )}
                                    {errors[`variantLength_${index}`] && (
                                      <span className="text-red-500 text-sm mt-1  ml-1">
                                        {errors[`variantLength_${index}`]},
                                      </span>
                                    )}
                                    {errors[`variantHeight_${index}`] && (
                                      <span className="text-red-500 text-sm mt-1 ml-1">
                                        {errors[`variantHeight_${index}`]}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}

                      </tbody>

                    </table>
                    {errors.variant && (
                      <div className="text-red-500 text-sm mt-1">{errors.variant}</div>
                    )}
                  </div>
                )}
                <div onMouseEnter={() => setTipKey('dangerousGoods')}
                  onMouseLeave={() => setTipKey('default')}>
                  <RadioGroup
                    label="Pre Order"
                    name="preorder"
                    options={['Tidak', 'Ya']}
                    defaultValue={isProductPreOrder === '1' ? 'Ya' : 'Tidak'}
                    onChange={(value) => setIsProductPreOrder(value === 'Ya' ? '1' : '0')}
                  />
                </div>
                <div onMouseEnter={() => setTipKey('preorder')}
                  onMouseLeave={() => setTipKey('default')}>
                  <RadioGroup
                    label="Pre Order"
                    name="preorder"
                    options={['Tidak', 'Ya']}
                    defaultValue={isProductPreOrder === '1' ? 'Ya' : 'Tidak'}
                    onChange={(value) => setIsProductPreOrder(value === 'Ya' ? '1' : '0')}
                  />
                </div>
                <div onMouseEnter={() => setTipKey('condition')}
                  onMouseLeave={() => setTipKey('default')}>

                  <RadioGroup
                    label="Kondisi"
                    name="condition"
                    options={['Baru', 'Bekas Dipakai']}
                    required
                    defaultValue={isUsed === '1' ? 'Bekas Dipakai' : 'Baru'}
                    onChange={(value) => setIsUsed(value === 'Bekas Dipakai' ? '1' : '0')}
                  />
                </div>

                <div onMouseEnter={() => setTipKey('sku')}
                  onMouseLeave={() => setTipKey('default')}>
                  <label className="text-[#333333] font-bold text-[14px]">
                    SKU Induk
                  </label>
                  <input type="text" placeholder="Masukkan kode unik untuk setiap produk agar mudah dilacak dan dikelola di sistem." className="w-full px-3 py-2 border border-gray-300 rounded-md" value={sku} onChange={(e) => setSku(e?.target?.value)} />
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
                      <input id="cod" type="checkbox" defaultChecked className="h-5 w-5 accent-[#52357B] text-white focus:ring-[#52357B]" checked={isCodEnabled === '1'}
                        onChange={(e) => setIsCodEnabled(e.target.checked ? '1' : '0')} />
                      <div className='mt-[-5px]'>
                        <label htmlFor="cod" className="font-bold text-[14px] text-[#333333]">Aktifkan COD</label>
                        <p className="text-[14px] text-[#333333]">Izinkan pembeli untuk membayar secara tunai saat produk diterima. Dengan mengaktifkan COD, Anda setuju dengan syarat & ketentuan yang berlaku.</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative"
                    id="schedule"
                    onMouseEnter={() => setTipKey('schedule')}
                    onMouseLeave={() => setTipKey('default')}>
                    <label className="text-[#333333] font-bold text-[14px]">
                      Jadwal Ditampilkan
                    </label>
                    <div className='mt-2'>
                      <DateTimePicker
                        value={new Date(schedule.toString())}
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
                  {errors.schedule && (
                    <div className="text-red-500 text-sm mt-1">{errors?.schedule}</div>
                  )}
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="bg-white flex justify-between items-center sticky bottom-0 p-4" style={{
                boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.25)'
              }}>
                <button className="text-[#52357B] text-[14px] font-semibold h-[32px] rounded-[5px] border w-[124px] border-[#52357B] font-medium hover:underline" onClick={() => window.location.href = '/my-store/product'}>Kembali</button>
                <div className="flex items-center space-x-2">
                  <button className="text-[#52357B] text-[14px] font-semibold h-[32px] rounded-[5px] border w-[160px] border-[#52357B] font-medium hover:underline" onClick={() => handleSave('ARCHIVED')}>Simpan & Arsipkan</button>
                  <button className="text-white bg-[#52357B] text-[14px] font-semibold h-[32px] rounded-[5px] border w-[160px] border-[#52357B] font-medium hover:bg-purple-800 transition duration-200" onClick={() => handleSave('PUBLISHED')}>Simpan & Tampilkan</button>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div >
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
      <ModalError
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Input Belum Lengkap"
        hideCloseButton={true} // Sembunyikan tombol 'X' agar user fokus pada tombol 'Mengerti'
      >
        <div className="flex flex-col items-center text-center">
          {/* Ikon Peringatan */}
          <div className="mb-5">
            <AlertTriangle className="w-20 h-20 text-yellow-400" />
          </div>

          {/* Pesan Error */}
          <p className="text-base text-gray-600 mb-6">
            {errorModalMessage}
          </p>

          {/* Tombol Aksi */}
          <button
            onClick={() => setIsErrorModalOpen(false)}
            className="bg-[#52357B] text-white font-bold w-full py-3 px-8 rounded-lg hover:bg-[#483AA0] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200"
          >
            Saya Mengerti
          </button>
        </div>
      </ModalError>
    </MyStoreLayout >
  );
};

export default AddProductPage;
