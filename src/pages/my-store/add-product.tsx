import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';


import Loading from 'components/Loading';
import { Modal } from 'components/Modal';
import { ModalError } from 'components/ModalError';
import CropModal from 'components/my-store/addProduct/CropModal';
import CategorySelector from 'components/my-store/product/CategorySelector';
import Snackbar from 'components/Snackbar';
import { useTipsStore } from 'components/stores/tipsStore';
import { AlertTriangle } from 'lucide-react';

// Impor utilitas dan tipe
import Get from 'services/api/Get';
import Post from 'services/api/Post';
import { Category } from 'services/api/product';
import { Response } from 'services/api/types';
import { Variation, VariantRowData, Specification, MediaItem, CombinationItem } from 'types/product'
import Sidebar from 'components/my-store/addProduct/Sidebar';
import ProductInfoSection from 'components/my-store/addProduct/ProductInfoSection';
import ProductSalesSection from 'components/my-store/addProduct/ProductSalesSection';
import ProductOtherInfoSection from 'components/my-store/addProduct/ProductOtherInfoSection';
import ProductDeliveryInfoSection from 'components/my-store/addProduct/ProductDeliveryInfoSection';
import { useShopProfile } from 'components/my-store/ShopProfileContext';


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


const AddProduct: NextPage = () => {
  const shopProfil = useShopProfile();
  const router = useRouter()
  const params = router?.query;
  const [productName, setProductName] = useState('');
  const [idProduct, setIdProduct] = useState<number>();
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
  const [sizeGuide, setSizeGuide] = useState<File | null>(null); //foto produk promosi
  const [urlpromoImage, setUrlPromoImage] = useState<string>(''); //foto produk promosi
  const [urlvideoFile, setUrlVideoFile] = useState<string | null>(null); //video produk
  const [videoFile, setVideoFile] = useState<File | null>(null); //video produk
  const [category, setCategory] = useState('');
  const discountOptions = Array.from({ length: 14 }, (_, i) => (i + 1) * 5);
  console.log('selectedImages', selectedImages)
  console.log('promoImage', urlpromoImage)
  console.log('videoFile', videoFile)
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

  // ++ START: Logika untuk Navigasi Sidebar ++
  const [activeSection, setActiveSection] = useState('informasi-produk-section');

  const sectionRefs = {
    'informasi-produk-section': useRef<HTMLDivElement>(null),
    'informasi-penjualan-section': useRef<HTMLDivElement>(null),
    'informasi-pengiriman-section': useRef<HTMLDivElement>(null),
    'informasi-lainnya-section': useRef<HTMLDivElement>(null), // Anchor untuk bagian "Lainnya"
  };
  const sectionIds = [
    'informasi-produk-section',
    'informasi-penjualan-section',
    'informasi-pengiriman-section',
    'informasi-lainnya-section'
  ];

  const [shippingCost, setShippingCost] = useState<string>('Normal')
  const [subsidy, setSubsidy] = useState<string>('')
  const [isVoucher, setIsVoucher] = useState<boolean>(false)
  const [voucher, setVoucher] = useState<string>('');
  const [courierServicesIds, setCourierServicesIds] = useState<number[]>([]);
  const [idAddress, setIdAddress] = useState<string>();
  console.log('courierServicesIds', courierServicesIds)
  useEffect(() => {
    // 1. Temukan kontainer yang bisa di-scroll berdasarkan ID
    const scrollContainer = document.getElementById('main-scroll-container');

    // 2. Jika kontainer tidak ditemukan, tampilkan error dan hentikan
    if (!scrollContainer) {
      console.error("PENTING: Elemen dengan id 'main-scroll-container' tidak ditemukan! Pastikan Anda sudah menambahkannya di file layout.");
      return;
    }

    const handleScroll = () => {
      // 3. Gunakan scrollTop dari kontainer, bukan window
      const scrollY = scrollContainer.scrollTop;
      let newActiveSection = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          // 4. Gunakan offsetTop elemen, yang kini akurat relatif terhadap kontainer
          // Tambahkan offset agar menu aktif saat seksi sudah terlihat
          if (element.offsetTop - 150 <= scrollY) {
            newActiveSection = id;
          }
        }
      }
      setActiveSection(newActiveSection);
    };

    // 5. Pasang listener ke KONTENINER, bukan window
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []); // Dependency array kosong sudah benar

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    setActiveSection(id)
    console.log('id', id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth', // Animasi scroll halus
        block: 'start',     // Posisikan bagian atas elemen di bagian atas viewport
        inline: 'nearest'
      });
    }
  };
  // Di dalam komponen AddProductPage

  const validationStatus = useMemo(() => {
    // Tambahkan tipe return 'number | "valid"' pada setiap fungsi check
    const checkProduk = (): number | "valid" => {
      let count = 0;
      if (selectedImages.length === 0 && !urlpromoImage) count++;
      if (!promoImage && !urlpromoImage) count++;
      if (!videoFile && !urlvideoFile) count++;
      if (!productName.trim()) count++;
      if (!category.trim()) count++;
      if (!description.trim()) count++;
      return count === 0 ? 'valid' : count;
    };

    const checkPenjualan = (): number | "valid" => {
      let count = 0;
      if (isVariant) {
        const hasVariantsDefined = variations.length > 0 && variations[0].name.trim() && variations[0].options.filter(opt => opt.trim()).length > 0;
        if (!hasVariantsDefined) {
          count++;
        }
        const expectedVariantCount = variations[0].options.filter(opt => opt.trim()).length;
        if (variantData.length < expectedVariantCount || variantData.some(d => !d.price || !d.stock)) {
          count++;
        }
      } else {
        if (!globalPrice.trim()) count++;
        if (!globalStock.trim()) count++;
      }
      if (minOrder < 1 || maxOrder < 1 || maxOrder < minOrder) count++;
      if (!globalWeight.trim() || !globalLength.trim() || !globalWidth.trim() || !globalHeight.trim()) {
        if (!isVariant || !showDimensionTable) count++;
      }
      return count === 0 ? 'valid' : count;
    };

    const checkPengiriman = (): number | "valid" => {
      let count = 0;
      if (courierServicesIds?.length < 1) {
        count++;
      }
      // Logika lain untuk pengiriman bisa ditambahkan di sini
      return count === 0 ? 'valid' : count;
    };

    const checkLainnya = (): number | "valid" => {
      let count = 0;
      if (!schedule.trim() || scheduleError) count++;
      return count === 0 ? 'valid' : count;
    };

    return {
      produk: checkProduk(),
      penjualan: checkPenjualan(),
      pengiriman: checkPengiriman(),
      lainnya: checkLainnya(),
    };
  }, [
    selectedImages, promoImage, urlpromoImage, productName, category, description, countryOrigin,
    isVariant, variations, variantData, globalPrice, globalStock, minOrder, maxOrder,
    showDimensionTable, globalWeight, globalLength, globalWidth, globalHeight,
    schedule, scheduleError
  ]);
  // ++ END: Logika untuk Navigasi Sidebar ++

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
    console.log('file', file)
    setVideoFile(file ?? null);
    setUrlVideoFile(null)
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
    // if (!brand.trim()) newErrors.brand = 'Merek wajib dipilih';
    // if (!countryOrigin.trim()) newErrors.countryOrigin = 'Negara asal wajib dipilih';
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
      console.log('tes', variantData?.length, totalVariant - 1)
      if (!variantData || variantData?.length < totalVariant - 1) {
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
    if (shippingCost === 'Ongkos kirim disubsidi Penjual') {
      if (!subsidy.trim()) newErrors.subsidy = 'Subsidi ongkir wajib diisi';
    }
    if (isVoucher) {
      if (!voucher.trim()) newErrors.voucher = 'Voucher wajib diisi';
    }
    if (courierServicesIds?.length < 1) newErrors.courier = 'Kurir wajib dipilih';
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
    selectedImages.forEach((img) => {
      if (typeof img === 'string') {
        // Media lama (URL)
        formData.append('existing_media[]', img);
      } else if (img instanceof File) {
        // Media baru (File upload)
        formData.append('productPhotos[]', img);
      }
    });

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
          image: variant.image instanceof File
            ? { preview: URL.createObjectURL(variant.image) }
            : null,
          weight: variant.weight,
          length: variant?.length,
          width: variant.width,
          height: variant.height,
          discount: discount,
          discountPercent: discontPercent,
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
      'Negara Asal': "indonesia",
    }));
    if (shippingCost === 'Ongkos kirim disubsidi Penjual') {
      formData.append('subsidy', subsidy.replace(/\./g, ''));
    } else {
      formData.append('subsidy', '0');

    }
    if (isVoucher) {
      formData.append('voucher', voucher.replace(/\./g, ''));
    } else {
      formData.append('voucher', '0');

    }
    formData.append('courierServicesIds', JSON.stringify(courierServicesIds));
    formData.append('id_address', idAddress ?? '');
    if (sizeGuide) {
      formData.append('image_guide', sizeGuide);
    }

    try {
      if (idProduct) {
        // selectedImages.forEach((photo, index) => {
        //   if (typeof photo === 'string') {
        //     formData.append(`productPhotosPreview[${index}]`, photo);
        //   }
        // });
        if (urlpromoImage) {
          formData.append('promoImage', urlpromoImage);
        }
        if (urlvideoFile) {
          formData.append('productVideoPreview', urlvideoFile);
        }

        const res = await Post<Response>('zukses', `product/${idProduct}`, formData);
        if (res?.data?.status === 'success') {
          setLoading(false);
          setSnackbar({ message: 'Produk berhasil diperbarui!', type: 'success', isOpen: true });
          // router.push('/my-store/product')
          // localStorage.removeItem('EditProduct');
        }
      } else {
        const res = await Post<Response>('zukses', `product`, formData);
        if (res?.data?.status === 'success') {
          setLoading(false);
          setSnackbar({ message: 'Produk berhasil disimpan!', type: 'success', isOpen: true });
          // router.push('/my-store/product');
          // localStorage.removeItem('EditProduct');
        }
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
          setIdProduct(data.id || '');
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
          setIsProductPreOrder(String(data.delivery?.is_pre_order || 0));
          setIsHazardous(String(data.delivery?.is_dangerous_product || 0));
          setCategory(data.category || '');
          setIdCategorie(data.category_id || undefined);
          setSelectedImages(
            data.media
              .filter((m: MediaItem) => m.type === 'image')
              .map((m: MediaItem) => m.url)
          );
          setVideoFile(
            data.media
              .filter((m: MediaItem) => m.type === 'video')
              .map((m: MediaItem) => m.url)
          );
          setUrlVideoFile(data.media
            .filter((m: MediaItem) => m.type === 'video')
            .map((m: MediaItem) => m.url))
          setPromoImage(data.image); // string
          setUrlPromoImage(data.image); // string
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
  // Letakkan fungsi ini di dekat handleVariantImageUpload
  const handleRemoveVariantImage = (clickedIndex: number) => {
    const updated = [...variantData];

    // Temukan warna yang sesuai dengan baris yang diklik
    let targetColor = '';
    let flatIdx = 0;
    for (const v of combinations) {
      const rowCount = v.sizes.length || 1;
      if (clickedIndex >= flatIdx && clickedIndex < flatIdx + rowCount) {
        targetColor = v.color;
        break;
      }
      flatIdx += rowCount;
    }

    if (!targetColor) return; // Keluar jika warna tidak ditemukan

    // Hapus (set ke null) gambar untuk semua varian dengan warna yang sama
    flatIdx = 0;
    for (const v of combinations) {
      const rowCount = v.sizes.length || 1;
      if (v.color === targetColor) {
        for (let i = 0; i < rowCount; i++) {
          const currentIndex = flatIdx + i;
          if (updated[currentIndex]) {
            updated[currentIndex].image = null;
          }
        }
      }
      flatIdx += rowCount;
    }

    setVariantData(updated);
  };
  return (
    <>
      <div className="min-h-screen font-sans mt-[-10px]">
        <main className="px-0">
          {/* <p className='text-[#52357B] font-bold text-[16px] mb-1'>Toko Saya</p> */}
          {/* <div className="flex items-center text-gray-500 mb-4">
            <span className='text-[14px] text-[#333333] cursor-pointer' onClick={() => router?.push('/my-store')}>Dashboard</span>
            <ChevronRight className="w-[25px] h-[25px] text-[#333333] mx-1" strokeWidth={3} />
            <span className='text-[14px] text-[#333333] cursor-pointer' onClick={() => router?.push('/my-store/product')}>Produk Saya</span>
            <ChevronRight className="w-[25px] h-[25px] text-[#333333] mx-1" strokeWidth={3} />
            <span className="font-bold text-[14px] text-[#333333] ">Tambah Produk</span>
          </div> */}

          <div className="flex items-start gap-4 relative mt-3">
            <Sidebar
              tipsChecklist={tipsChecklist}
              activeSection={activeSection}
              onNavigate={handleNavigate}
              validationStatus={validationStatus}
            />

            <div className="lg:col-span-2 space-y-8 ">
              <ProductInfoSection
                setTipKey={setTipKey}
                selectedImages={selectedImages}
                promoImage={promoImage}
                onSelectMainImage={handleSelectImage}
                onReplaceMainImage={handleReplaceMainImage}
                onRemoveMainImage={handleRemoveMainImage}
                onReplacePromoImage={handleReplacePromoImage}
                onRemovePromoImage={handleRemovePromoImage}
                errorPromo={errors.promo}
                errorImages={errors.images}
                videoFile={videoFile}
                urlvideoFile={urlvideoFile}
                onVideoChange={handleVideoChange}
                productName={productName}
                setProductName={setProductName}
                errors={errors}
                category={category}
                setTempCategory={setTempCategory}
                setCategoryModalOpen={setCategoryModalOpen}
                description={description}
                setDescription={setDescription}
                brand={brand}
                setBrand={setBrand}
                countryOrigin={countryOrigin}
                setCountryOrigin={setCountryOrigin}
              />
              <ProductSalesSection
                setTipKey={setTipKey}
                isVariant={isVariant}
                setIsVariant={setIsVariant}
                variations={variations}
                setVariations={setVariations}
                handleVariationNameChange={handleVariationNameChange}
                showSuggestionIndex={showSuggestionIndex}
                setShowSuggestionIndex={setShowSuggestionIndex}
                variationSuggestions={variationSuggestions}
                handleRemoveVariation={handleRemoveVariation}
                handleOptionChange={handleOptionChange}
                showOptionSuggestIndex={showOptionSuggestIndex}
                setShowOptionSuggestIndex={setShowOptionSuggestIndex}
                optionSuggestions={optionSuggestions}
                handleDragStart={handleDragStart}
                handleDrop={handleDrop}
                handleDeleteOption={handleDeleteOption}
                handleAddVariation={handleAddVariation}
                globalPrice={globalPrice}
                setGlobalPrice={setGlobalPrice}
                globalStock={globalStock}
                setGlobalStock={setGlobalStock}
                globalDiscountPercent={globalDiscountPercent}
                setGlobalDiscountPercent={setGlobalDiscountPercent}
                showPercentSuggest={showPercentSuggest}
                setShowPercentSuggest={setShowPercentSuggest}
                discountOptions={discountOptions}
                globalDiscount={globalDiscount}
                errors={errors}
                variantData={variantData}
                setVariantData={setVariantData}
                handleVariantImageUpload={handleVariantImageUpload}
                handleRemoveVariantImage={handleRemoveVariantImage}
                applyGlobalToAll={applyGlobalToAll}
                showPercentSuggestIndex={showPercentSuggestIndex}
                setShowPercentSuggestIndex={setShowPercentSuggestIndex}
                dropdownPosition={dropdownPosition}
                setDropdownPosition={setDropdownPosition}
                minOrder={minOrder}
                setMinOrder={setMinOrder}
                maxOrder={maxOrder}
                setMaxOrder={setMaxOrder}
                globalWeight={globalWeight}
                setGlobalWeight={setGlobalWeight}
                globalWidth={globalWidth}
                setGlobalWidth={setGlobalWidth}
                globalLength={globalLength}
                setGlobalLength={setGlobalLength}
                globalHeight={globalHeight}
                setGlobalHeight={setGlobalHeight}
                applyDimensionToAll={applyDimensionToAll}
                showDimensionTable={showDimensionTable}
                setShowDimensionTable={setShowDimensionTable}
                tempCategory={tempCategory}
                setSizeGuide={setSizeGuide}
              />
              <ProductDeliveryInfoSection
                setTipKey={setTipKey}
                isHazardous={isHazardous}
                setIsHazardous={setIsHazardous}
                isCodEnabled={isCodEnabled}
                setIsCodEnabled={setIsCodEnabled}
                isProductPreOrder={isProductPreOrder}
                setIsProductPreOrder={setIsProductPreOrder}
                sectionRefs={sectionRefs['informasi-pengiriman-section']}
                shopProfil={shopProfil}
                setCourierServicesIds={setCourierServicesIds}
                errors={errors}
                setIdAddress={setIdAddress}
              />
              <ProductOtherInfoSection
                setTipKey={setTipKey}
                isHazardous={isHazardous}
                setIsHazardous={setIsHazardous}
                isCodEnabled={isCodEnabled}
                setIsCodEnabled={setIsCodEnabled}
                isUsed={isUsed}
                setIsUsed={setIsUsed}
                sku={sku}
                setSku={setSku}
                schedule={schedule}
                scheduleDate={scheduleDate}
                setScheduleDate={setScheduleDate}
                validateScheduleDate={validateScheduleDate}
                scheduleError={scheduleError}
                errors={errors}
                sectionRefs={sectionRefs['informasi-lainnya-section']}
                setShippingCost={setShippingCost}
                shippingCost={shippingCost}
                subsidy={subsidy}
                setSubsidy={setSubsidy}
                isVoucher={isVoucher}
                setIsVoucher={setIsVoucher}
                voucher={voucher}
                setVoucher={setVoucher}
              />
              <div className="bg-white flex justify-between items-center sticky bottom-0 p-4" style={{
                boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.25)'
              }}>
                <button className="text-[#52357B] text-[14px] font-semibold h-[32px] rounded-[5px] border w-[124px] border-[#52357B] font-medium hover:underline" onClick={() => router?.push('/my-store/product')}>Kembali</button>
                <div className="flex items-center space-x-2">
                  <button className="text-[#52357B] text-[14px] font-semibold h-[32px] rounded-[5px] border w-[160px] border-[#52357B] font-medium hover:underline" onClick={() => handleSave('ARCHIVED')}>Simpan & Arsipkan</button>
                  <button className="text-white bg-[#52357B] text-[14px] font-semibold h-[32px] rounded-[5px] border w-[160px] border-[#52357B] font-medium hover:bg-purple-800 transition duration-200" onClick={() => handleSave('PUBLISHED')}>Simpan & Tampilkan</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ... Modal dan Notifikasi lainnya ... */}
      {cropModalImage && cropCallback && (
        <CropModal imageSrc={cropModalImage}
          onClose={() => setCropModalImage(null)}
          onCropComplete={(file) => {
            cropCallback(file);
            setCropModalImage(null);
          }} />
      )}
      <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)}>
        <CategorySelector onSelectCategory={setTempCategory} initialCategory={category} categories={apiCategories} isLoading={categoryLoading} error={categoryApiError} setIdCategorie={setIdCategorie} setCategoryModalOpen={setCategoryModalOpen} handleConfirmCategory={handleConfirmCategory} />
      </Modal>
      {snackbar.isOpen && (
        <Snackbar message={snackbar.message}
          type={snackbar.type}
          isOpen={snackbar.isOpen}
          onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))} />
      )}
      {loading && <Loading />}
      <ModalError
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Input Belum Lengkap"
        hideCloseButton={true}
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
    </>
  );
};


export default function AddProductPage() {
  return (
    <MyStoreLayout>
      <AddProduct />
    </MyStoreLayout>
  );
}