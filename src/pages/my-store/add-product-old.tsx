import { AxiosError } from 'axios';
import { Modal } from 'components/Modal';
import { variationNameRecommendations, variationOptionRecommendations } from 'components/my-store/addProduct/Constants';
import Header from 'components/my-store/addProduct/Header';
import { Calendar, Camera, CheckCircle, ChevronLeft, ChevronRight, Edit2Icon, Eye, LayersIcon, MessageCircleIcon, Move, Plus, ShoppingBag, ShoppingCartIcon, Trash2, Video, X } from 'components/my-store/addProduct/Icon';
import InfoLabel from 'components/my-store/addProduct/InfoLabel';
import Loading from 'components/my-store/addProduct/Loading';
import { ActiveDropdown, FileWithPreview, HighlightedSection, PackageDimensions, ProductVariant, Variation } from 'components/my-store/addProduct/Type';
import CategorySelector from 'components/my-store/product/CategorySelector';
import { formatRupiah, parseRupiah } from 'components/Rupiah';
import Snackbar from 'components/Snackbar';
import { ShopProfile } from 'components/types/ShopProfile';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Get from 'services/api/Get';
import Post from 'services/api/Post';
import { Category } from 'services/api/product';
import { Response } from 'services/api/types';

import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface Specification {
  name: string;
  value: string;
}

interface Delivery {
  weight: number;
  length: number;
  width: number;
  height: number;
  is_dangerous_product: number;
  is_pre_order: number;
  is_cost_by_seller: number;
}

interface Variant {
  variant: string;
  options: string[];
}
interface Combination {
  combination: string | Record<string, string>;
  price: number;
  stock: number;
  sku: string;
  image?: string;
  weight?: number | string;
  length?: number | string;
  width?: number | string;
  height?: number | string;
}

interface ProductEditData {
  id: number;
  name: string;
  desc: string;
  category: string;
  category_id: number;
  price: number;
  stock: number;
  sku: string;
  is_used: number;
  scheduled_date?: string;
  media: MediaItem[];
  specifications?: Specification[];
  delivery?: Delivery;
  variants?: Variant[];
  combinations: Combination[];
  is_cod_enabled?: number;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

const AddProductPage = () => {
  const router = useRouter()
  const params = router?.query;

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [idCategorie, setIdCategorie] = useState<number | undefined>();
  const [productPhotos, setProductPhotos] = useState<FileWithPreview[]>([]);
  const [productVideo, setProductVideo] = useState<FileWithPreview | null>(null);
  const [activeFormTab, setActiveFormTab] = useState('informasi-produk');
  const [price, setPrice] = useState('');
  const [variations, setVariations] = useState<Variation[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [specifications, setSpecifications] = useState<{ [key: string]: string }>({
    'Merek': '',
    'Negara Asal': '',
  });
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [previewMediaIndex, setPreviewMediaIndex] = useState(0);
  const [isVariationActive, setIsVariationActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown | null>(null);
  const [newOptionValues, setNewOptionValues] = useState<{ [key: number]: string }>({});
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkStock, setBulkStock] = useState('');
  const [bulkSku, setBulkSku] = useState('');
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [selectedPreviewOption, setSelectedPreviewOption] = useState<string | null>(null);
  const [shippingWeight, setShippingWeight] = useState('');
  const [packageDimensions, setPackageDimensions] = useState<PackageDimensions>({ length: '', width: '', height: '' });
  const [isHazardous, setIsHazardous] = useState(false);
  const [shippingPerVariation, setShippingPerVariation] = useState(false);
  const [isProductPreOrder, setIsProductPreOrder] = useState(false);
  const [shippingInsurance, setShippingInsurance] = useState(false);
  const [condition, setCondition] = useState('Baru');
  const [scheduledDate, setScheduledDate] = useState('');
  const [parentSku, setParentSku] = useState('');
  const [hoveredPhotoIndex, setHoveredPhotoIndex] = useState<number | null>(null);
  const [isPhotoSectionHovered, setIsPhotoSectionHovered] = useState(false);
  const [highlightedPreviewSection, setHighlightedPreviewSection] = useState<HighlightedSection>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [tempCategory, setTempCategory] = useState(category);
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [categoryApiError, setCategoryApiError] = useState<string | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);
  const [editingVariantImageIndex, setEditingVariantImageIndex] = useState<number | null>(null);
  const [stock, setStock] = useState<number>(1);
  const [isMobile, setIsMobile] = useState(false);
  const [dataEdit, setDataEdit] = useState<ProductEditData | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; type?: 'success' | 'error' | 'info'; isOpen: boolean; }>({ message: '', type: 'info', isOpen: false });
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [variantError, setVariantError] = useState<string | null>(null);

  const [isCodEnabled, setIsCodEnabled] = useState(false);

  // State untuk validasi error inline
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [productNameError, setProductNameError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [shippingWeightError, setShippingWeightError] = useState<string | null>(null);
  const [relisProduct, setRelisProduct] = useState<string | null>(null);


  // +++ STATE BARU UNTUK CROPPER +++
  const [isCropperModalOpen, setIsCropperModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const aspect = 1 / 1; // Rasio 1:1
  const imgRef = useRef<HTMLImageElement>(null);
  const cropContext = useRef<{ type: 'new' | 'replace' | 'variant'; index: number | null; } | null>(null);

  const productPhotoInputRef = useRef<HTMLInputElement>(null);
  const replacePhotoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const variationsRef = useRef<HTMLDivElement>(null);
  const variantImageInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const dragVariationId = useRef<number | null>(null);
  const daftarVariasiRef = useRef<HTMLHeadingElement>(null);
  const sectionRefs = {
    'informasi-produk': useRef<HTMLDivElement>(null),
    'spesifikasi': useRef<HTMLDivElement>(null),
    'informasi-penjualan': useRef<HTMLDivElement>(null),
    'pengiriman': useRef<HTMLDivElement>(null),
    'lainnya': useRef<HTMLDivElement>(null),
  };
  const [shopProfile, setShopProfile] = useState<ShopProfile | null>(null)

  // +++ FUNGSI UTILITAS BARU UNTUK MENGHASILKAN GAMBAR HASIL CROP +++
  function getCroppedImg(
    image: HTMLImageElement,
    crop: PixelCrop,
    fileName: string,
  ): Promise<FileWithPreview> {
    const canvas = document.createElement('canvas');

    const outputResolution = 1080;
    canvas.width = outputResolution;
    canvas.height = outputResolution;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;

    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0, 0,
      outputResolution, outputResolution
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          const file = new File([blob], fileName, { type: blob.type });
          const preview = URL.createObjectURL(blob);
          resolve({ file, preview, type: 'image' });
        },
        'image/jpeg',
        0.95
      );
    });
  }

  // -- MODIFIKASI PENTING --
  // useEffect untuk memuat data produk saat mode edit
  useEffect(() => {
    if (dataEdit && !isInitialLoadComplete) {
      setProductName(dataEdit.name);
      setDescription(dataEdit.desc);
      setCategory(dataEdit.category);
      setIdCategorie(dataEdit.category_id);
      setPrice(String(dataEdit.price));
      setStock(dataEdit.stock);
      setParentSku(dataEdit.sku);
      setCondition(dataEdit.is_used === 0 ? 'Baru' : 'Pernah Dipakai');
      setScheduledDate(dataEdit.scheduled_date ? dataEdit.scheduled_date.split(" ")[0] : '');

      // +++ PENGATURAN STATE COD DARI DATA EDIT +++
      if (typeof dataEdit.is_cod_enabled !== 'undefined') {
        setIsCodEnabled(dataEdit.is_cod_enabled === 1);
      }

      const photos = dataEdit.media
        .filter((m) => m.type === 'image')
        .map((img) => ({ file: null, preview: img.url, type: 'image' as const }));
      setProductPhotos(photos);
      const video = dataEdit.media.find((m) => m.type === 'video');
      if (video) {
        setProductVideo({ file: null, preview: video.url, type: 'video' as const });
      }
      if (dataEdit.specifications && Array.isArray(dataEdit.specifications)) {
        const formattedSpecs = dataEdit.specifications.reduce((acc: { [key: string]: string }, spec) => {
          if (spec.name && spec.value) {
            acc[spec.name] = spec.value;
          }
          return acc;
        }, {});
        setSpecifications(prevSpecs => ({ ...prevSpecs, ...formattedSpecs }));
      }
      if (dataEdit.delivery) {
        const d = dataEdit.delivery;
        setShippingWeight(String(d.weight));
        setPackageDimensions({ length: String(d.length), width: String(d.width), height: String(d.height) });
        setIsHazardous(d.is_dangerous_product == 1);
        setIsProductPreOrder(d.is_pre_order == 1);
        setShippingInsurance(d.is_cost_by_seller == 1);
      }
      if (dataEdit.variants && dataEdit.variants.length > 0) {
        setIsVariationActive(true);
        const formattedVariations = dataEdit.variants.map((v, index) => ({
          id: Date.now() + index,
          name: v.variant,
          options: v.options,
        }));
        setVariations(formattedVariations);

        // -- AWAL PERBAIKAN --
        // Cek apakah data variasi memiliki berat, jika ya, aktifkan toggle pengiriman per variasi
        if (dataEdit.combinations?.[0]?.weight) {
          setShippingPerVariation(true);
        }

        const formattedCombinations = dataEdit.combinations.map(
          (c: Combination, index: number) => ({
            id: Date.now() + index,
            combination:
              typeof c.combination === "string"
                ? JSON.parse(c.combination)
                : c.combination,
            price: String(c.price),
            stock: String(c.stock),
            sku: c.sku,
            image: c.image ? { file: null, preview: c.image, type: 'image' as const } : null,
            // Mengambil data berat dan dimensi dari 'c' (combination)
            weight: String(c.weight || ''),
            length: String(c.length || ''),
            width: String(c.width || ''),
            height: String(c.height || ''),
          })
        );
        // -- AKHIR PERBAIKAN --
        setProductVariants(formattedCombinations);
      }
      setIsInitialLoadComplete(true);
    }
  }, [dataEdit, isInitialLoadComplete]);

  useEffect(() => {
    const dataString = localStorage.getItem('shopProfile');
    if (dataString) {
      const parsedData = JSON.parse(dataString);
      setShopProfile(parsedData)
    }
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
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    if (params?.type === 'edit') {
      const dataString = localStorage.getItem('EditProduct');
      if (dataString) {
        const parsedData = JSON.parse(dataString);
        setDataEdit(parsedData)
      }
    }
  }, [params]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && variationsRef.current && !variationsRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setActiveTooltip(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      let currentTab: string | null = null;
      for (const key in sectionRefs) {
        const sectionId = key as keyof typeof sectionRefs;
        const ref = sectionRefs[sectionId];
        if (ref.current && scrollPosition >= ref.current.offsetTop) {
          currentTab = sectionId;
        }
      }
      if (currentTab) {
        setActiveFormTab(currentTab);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRefs]);
  const activeVariations = useMemo(() =>
    variations.filter(v => v.name.trim() !== '' && v.options.some(opt => opt.trim() !== '')),
    [variations]
  );
  useEffect(() => {
    if (dataEdit && !isInitialLoadComplete) {
      return;
    }
    if (!isVariationActive) {
      setProductVariants([]);
      return;
    }
    if (activeVariations.length === 0) {
      setProductVariants([]);
      return;
    }
    const getCombinations = (arrays: string[][]): string[][] => {
      if (arrays.length === 0) return [[]];
      const firstArr = arrays[0];
      const rest = getCombinations(arrays.slice(1));
      const result: string[][] = [];
      firstArr.forEach(item => {
        rest.forEach(r => {
          result.push([item, ...r]);
        });
      });
      return result;
    };
    const variationOptions = activeVariations.map(v => v.options.filter(opt => opt.trim() !== ''));
    const combinations = getCombinations(variationOptions);
    setProductVariants(prevVariants => {
      return combinations.map((combo, index) => {
        const combinationObject: Record<string, string> = {};
        activeVariations.forEach((v, i) => {
          combinationObject[v.name] = combo[i];
        });
        const comboStr = JSON.stringify(combinationObject);
        const existingVariant = prevVariants.find(p => JSON.stringify(p.combination) === comboStr);
        return {
          id: existingVariant?.id || Date.now() + index,
          combination: combinationObject,
          price: existingVariant?.price || '',
          stock: existingVariant?.stock || '',
          sku: existingVariant?.sku || '',
          image: existingVariant?.image || null,
          weight: existingVariant?.weight || '',
          length: existingVariant?.length || '',
          width: existingVariant?.width || '',
          height: existingVariant?.height || '',
        };
      });
    });
  }, [variations, activeVariations, isVariationActive, isInitialLoadComplete, dataEdit]);
  const previewMedia = useMemo(() => {
    if (hoveredPhotoIndex !== null) {
      const photo = productPhotos[hoveredPhotoIndex];
      if (photo) return [photo];
    }
    if (selectedPreviewOption) {
      const firstVarName = activeVariations[0]?.name;
      if (firstVarName) {
        const variant = productVariants.find(p => p.combination[firstVarName] === selectedPreviewOption);
        if (variant?.image) {
          return [variant.image];
        }
      }
    }
    const mediaList = [...productPhotos];
    if (productVideo) {
      mediaList.unshift(productVideo);
    }
    return mediaList;
  }, [selectedPreviewOption, productVariants, productPhotos, productVideo, activeVariations, hoveredPhotoIndex]);

  // UseEffect untuk menghapus error saat input diperbaiki
  useEffect(() => { if (productPhotos.length >= 3) setPhotoError(null); }, [productPhotos]);
  useEffect(() => { if (productVideo) setVideoError(null); }, [productVideo]);
  useEffect(() => { if (productName) setProductNameError(null); }, [productName]);
  useEffect(() => { if (category) setCategoryError(null); }, [category]);
  useEffect(() => { if (shippingWeight) setShippingWeightError(null); }, [shippingWeight]);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>, type: 'new' | 'replace' | 'variant', index: number | null = null) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setSnackbar({ message: 'Hanya file gambar yang diizinkan.', type: 'error', isOpen: true });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          if (img.naturalWidth < 800 || img.naturalHeight < 800) {
            setSnackbar({
              message: 'Info: Resolusi gambar kecil, hasil mungkin pecah. Disarankan min. 800x800 piksel.',
              type: 'info',
              isOpen: true
            });
          }
          cropContext.current = { type, index };
          setImageToCrop(img.src);
          setIsCropperModalOpen(true);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleConfirmCrop = async () => {
    if (!completedCrop || !imgRef.current || !cropContext.current) {
      setSnackbar({ message: 'Gagal memotong gambar, coba lagi.', type: 'error', isOpen: true });
      return;
    }
    try {
      const originalFile = (cropContext.current.type === 'new' ? productPhotoInputRef :
        cropContext.current.type === 'replace' ? replacePhotoInputRef :
          variantImageInputRef).current?.files?.[0];

      const croppedImage = await getCroppedImg(
        imgRef.current,
        completedCrop,
        originalFile?.name || 'cropped-image.jpg'
      );

      const { type, index } = cropContext.current;

      if (type === 'new') {
        setProductPhotos(prev => [...prev, croppedImage].slice(0, 9));
      } else if (type === 'replace' && index !== null) {
        setProductPhotos(currentPhotos => currentPhotos.map((photo, i) => {
          if (i === index) {
            if (photo.preview) URL.revokeObjectURL(photo.preview);
            return croppedImage;
          }
          return photo;
        }));
      } else if (type === 'variant' && index !== null) {
        const variantToUpdate = productVariants[index];
        const firstVarName = activeVariations[0]?.name;
        const firstVarOptionValue = variantToUpdate.combination[firstVarName];

        setProductVariants(prev => prev.map(v => {
          if (v.combination[firstVarName] === firstVarOptionValue) {
            if (v.image?.preview) {
              URL.revokeObjectURL(v.image.preview);
            }
            return { ...v, image: croppedImage };
          }
          return v;
        }));
      }

      setIsCropperModalOpen(false);
      setImageToCrop(null);
      setCrop(undefined);
      setCompletedCrop(undefined);
      cropContext.current = null;
    } catch (e) {
      console.error(e);
      setSnackbar({ message: 'Terjadi kesalahan saat memotong gambar.', type: 'error', isOpen: true });
    }
  };

  useEffect(() => {
    if (isVariationActive) {
      if (productVariants.length > 0 && productVariants.some(v => v.image)) {
        setVariantError(null);
      }
    }
  }, [productVariants, isVariationActive]);

  const triggerProductPhotoReplace = (index: number) => { setEditingPhotoIndex(index); replacePhotoInputRef.current?.click(); };
  const removeProductPhoto = (index: number) => { const photoToRemove = productPhotos[index]; if (photoToRemove.preview) URL.revokeObjectURL(photoToRemove.preview); setProductPhotos(productPhotos.filter((_, i) => i !== index)); };
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files || []); if (files.length > 0) { const file = files[0]; setProductVideo({ file, preview: URL.createObjectURL(file), type: 'video' }); setPreviewMediaIndex(0); } e.target.value = ''; };
  const handleRemoveVideo = () => { if (productVideo?.preview) { URL.revokeObjectURL(productVideo.preview) }; setProductVideo(null); setPreviewMediaIndex(0); };
  const handleConfirmCategory = () => { setCategory(tempCategory); setCategoryModalOpen(false); };

  const validateInputs = () => {
    // Reset semua error sebelum validasi
    setProductNameError(null);
    setCategoryError(null);
    setPhotoError(null);
    setVideoError(null);
    setShippingWeightError(null);

    let isValid = true;

    if (!productName) {
      setProductNameError('Nama produk wajib diisi.');
      isValid = false;
    }
    if (!category || !idCategorie) {
      setCategoryError('Kategori produk wajib dipilih.');
      isValid = false;
    }
    if (productPhotos.length < 1) {
      setPhotoError('Minimal 1 foto produk wajib diunggah.');
      isValid = false;
    }

    if (!scheduledDate) {
      setRelisProduct('Tanggal ditamplkan wajib diisi.');
      isValid = false;
    }
    if (!shippingPerVariation && !shippingWeight) {
      setShippingWeightError('Berat produk wajib diisi.');
      isValid = false;
    }
    if (isVariationActive) {
      if (productVariants.length === 0) {
        setVariantError('Harap tentukan minimal satu opsi untuk variasi Anda.');
        isValid = false;
      } else if (!productVariants.some(variant => variant.image)) {
        setVariantError('Harap unggah minimal satu gambar untuk salah satu variasi Anda.');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSave = async (status: 'PUBLISHED' | 'ARCHIVED') => {
    const isValid = validateInputs();
    if (!isValid) {
      const firstErrorRef =
        (productNameError || categoryError || photoError || videoError) ? sectionRefs['informasi-produk']
          : variantError ? sectionRefs['informasi-penjualan']
            : shippingWeightError ? sectionRefs['pengiriman']
              : null;

      firstErrorRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('description', description);
    formData.append('idCategorie', String(idCategorie));
    formData.append('parentSku', parentSku);
    formData.append('condition', condition);
    formData.append('scheduledDate', scheduledDate);
    formData.append('status', status);
    formData.append('isHazardous', isHazardous ? '1' : '0');
    formData.append('isProductPreOrder', isProductPreOrder ? '1' : '0');
    formData.append('shippingInsurance', shippingInsurance ? '1' : '0');
    formData.append('isVariationActive', isVariationActive ? '1' : '0');
    formData.append('shippingPerVariation', shippingPerVariation ? '1' : '0');

    formData.append('isCodEnabled', isCodEnabled ? '1' : '0');

    productPhotos.forEach((photo) => {
      if (photo.file) {
        formData.append('productPhotos[]', photo.file);
      } else {
        formData.append('existing_media[]', photo.preview);
      }
    });
    if (productVideo && productVideo.file) {
      formData.append('productVideo', productVideo.file);
    }
    if (isVariationActive) {
      formData.append('variations', JSON.stringify(variations));
      formData.append('productVariants', JSON.stringify(productVariants));
      productVariants.forEach((variant, index) => {
        if (variant.image && variant.image.file) {
          formData.append(`variant_images[${index}]`, variant.image.file);
        }
      });
    } else {
      formData.append('price', price);
      formData.append('stock', stock.toString());
    }
    if (!shippingPerVariation) {
      formData.append('shippingWeight', shippingWeight);
      formData.append('packageDimensions', JSON.stringify(packageDimensions));
      formData.append('height', packageDimensions?.height);
      formData.append('length', packageDimensions?.length);
      formData.append('width', packageDimensions?.width);
    }
    formData.append('specifications', JSON.stringify(specifications));
    try {
      if (dataEdit?.id) {
        productPhotos.forEach((photo, index) => {
          formData.append(`productPhotosPreview[${index}]`, photo.preview);
        });
        if (productVideo) {
          formData.append('productVideoPreview', productVideo.preview);
        }
        const res = await Post<Response>('zukses', `product/${dataEdit?.id}`, formData);
        if (res?.data?.status === 'success') {
          setSnackbar({ message: 'Produk berhasil diperbarui!', type: 'success', isOpen: true });
          // window.location.href = '/my-store/product'
          localStorage.removeItem('EditProduct');
        }
      } else {
        const res = await Post<Response>('zukses', `product`, formData);
        if (res?.data?.status === 'success') {
          setSnackbar({ message: 'Produk berhasil disimpan!', type: 'success', isOpen: true });
          // window.location.href = '/my-store/product'
          localStorage.removeItem('EditProduct');
        }
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string, errors?: Record<string, string[]> }>;
      let errorMessage = error.response?.data?.message || `Terjadi kesalahan saat ${params?.type === 'edit' ? 'memperbarui' : 'menyimpan'} produk.`;
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        errorMessage = Object.values(validationErrors)[0][0];
      }
      setSnackbar({ message: errorMessage, type: 'error', isOpen: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndPublish = () => handleSave('PUBLISHED');
  const handleSaveAndArchive = () => handleSave('ARCHIVED');
  const handleSpecChange = (name: string, value: string) => { setSpecifications(prev => ({ ...prev, [name]: value })); };
  const nextPreview = () => setPreviewMediaIndex(prev => (prev + 1) % previewMedia.length);
  const prevPreview = () => setPreviewMediaIndex(prev => (prev - 1 + previewMedia.length) % previewMedia.length);
  const addVariation = () => { if (variations.length < 2) { setVariations([...variations, { id: Date.now(), name: '', options: [] }]); } };
  const removeVariation = (id: number) => { setVariations(variations.filter(v => v.id !== id)); };
  const updateVariationName = (id: number, name: string) => { setVariations(variations.map(v => v.id === id ? { ...v, name } : v)); };
  const handleNewOptionChange = (id: number, value: string) => { setNewOptionValues(prev => ({ ...prev, [id]: value })); };
  const handleAddNewOption = (id: number) => {
    const value = newOptionValues[id];
    if (value && value.trim() !== '') {
      setVariations(variations.map(v => {
        if (v.id === id && !v.options.includes(value)) {
          return { ...v, options: [...v.options, value] };
        }
        return v;
      }));
      setNewOptionValues(prev => ({ ...prev, [id]: '' }));
    }
  };
  const updateVariationOption = (id: number, optionIndex: number, value: string) => {
    setVariations(variations.map(v => {
      if (v.id === id) {
        const newOptions = [...v.options];
        newOptions[optionIndex] = value;
        return { ...v, options: newOptions };
      }
      return v;
    }));
  };
  const removeVariationOption = (id: number, optionIndex: number) => {
    setVariations(variations.map(v => {
      if (v.id === id) {
        const newOptions = v.options.filter((_, i) => i !== optionIndex);
        return { ...v, options: newOptions };
      }
      return v;
    }));
  };
  const handleDragStart = (variationId: number, position: number) => { dragVariationId.current = variationId; dragItem.current = position; };
  const handleDragEnter = (variationId: number, position: number) => { if (variationId === dragVariationId.current) { dragOverItem.current = position; } };
  const handleDrop = (variationId: number) => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      dragVariationId.current = null;
      return;
    }
    setVariations(prev => {
      const newVariations = [...prev];
      const variationToUpdate = newVariations.find(v => v.id === variationId);
      if (variationToUpdate) {
        const updatedOptions = [...variationToUpdate.options];
        const dragItemContent = updatedOptions.splice(dragItem.current!, 1)[0];
        updatedOptions.splice(dragOverItem.current!, 0, dragItemContent);
        variationToUpdate.options = updatedOptions;
      }
      dragItem.current = null;
      dragOverItem.current = null;
      dragVariationId.current = null;
      return newVariations;
    });
  };
  const handleApplyToAll = () => {
    setProductVariants(prev => prev.map(variant => ({
      ...variant,
      price: bulkPrice !== '' ? parseRupiah(bulkPrice) : variant.price,
      stock: bulkStock !== '' ? bulkStock : variant.stock,
      sku: bulkSku !== '' ? bulkSku : variant.sku,
    })));
  };
  const handleVariantChange = (variantId: number, field: keyof ProductVariant, value: string) => {
    const processedValue = field === 'price' ? parseRupiah(value) : value;
    setProductVariants(prev => prev.map(v => v.id === variantId ? { ...v, [field]: processedValue } : v));
  };
  const triggerVariantImageUpload = (index: number) => {
    setEditingVariantImageIndex(index);
    variantImageInputRef.current?.click();
  };
  const PriceRangeWarning = () => {
    if (productVariants.length < 2) return null;
    const prices = productVariants.map(v => Number(parseRupiah(String(v.price)))).filter(p => p > 0);
    if (prices.length < 2) return null;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (maxPrice > minPrice * 7) {
      return (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm mt-4">
          Batas harga produk termahal dibagi harga produk termurah: 7
        </div>
      );
    }
    return null;
  }
  const handleShippingPerVariationToggle = (checked: boolean) => {
    setShippingPerVariation(checked);
    if (checked) {
      setTimeout(() => {
        daftarVariasiRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };
  const handleTabClick = (tabId: keyof typeof sectionRefs) => {
    const yOffset = -80;
    const element = sectionRefs[tabId].current;
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setActiveFormTab(tabId);
  };
  const renderSalesInformation = () => {
    if (!isVariationActive) {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-gray-700">Harga</h4>
            <input
              type="text"
              value={formatRupiah(price)}
              onChange={e => setPrice(parseRupiah(e.target.value))}
              className="w-full p-2 border rounded-md"
              placeholder="Rp"
            />
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-gray-700">Stok</h4>
            <input
              type="number"
              value={stock}
              onChange={e => setStock(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              placeholder="Jumlah"
            />
          </div>
          <button
            onClick={() => setIsVariationActive(true)}
            className="w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition"
          >
            + Aktifkan Varian Produk
          </button>
        </div>
      );
    }

    const usedVariationNames = variations.map(v => v.name);

    return (
      <div className="space-y-6" ref={variationsRef}>
        <input type="file" ref={variantImageInputRef} onChange={(e) => handleFileSelection(e, 'variant', editingVariantImageIndex)} accept="image/jpeg,image/png" style={{ display: 'none' }} />
        <div className="flex justify-between items-center">
          <InfoLabel label="Variasi" tooltipKey="variations" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} />
          <button onClick={() => setIsVariationActive(false)} className="text-sm text-blue-600 hover:underline">Ubah</button>
        </div>
        {variations.map((variation, vIndex) => {
          const filteredNameRecs = variationNameRecommendations.filter(
            rec => !usedVariationNames.includes(rec) || rec === variation.name
          );
          const availableOptionRecs = (variationOptionRecommendations[variation.name] || []).filter(
            rec => !variation.options.includes(rec)
          );
          return (
            <div key={variation.id} className="p-4 bg-gray-50 rounded-lg border space-y-4">
              <div className="flex items-center gap-4">
                <label className="w-16 text-sm text-gray-600 shrink-0">Variasi {vIndex + 1}</label>
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Ketik atau pilih"
                    maxLength={14}
                    value={variation.name}
                    onChange={(e) => {
                      updateVariationName(variation.id, e.target.value);
                      setActiveDropdown(null);
                    }}
                    onClick={() => setActiveDropdown({ type: 'name', id: variation.id })}
                    onFocus={() => setActiveDropdown({ type: 'name', id: variation.id })}
                    className="w-full p-2 border rounded-md pr-12"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">{variation.name.length}/14</span>
                  {activeDropdown?.type === 'name' && activeDropdown?.id === variation.id && (
                    <div className="absolute top-full left-0 w-full bg-white border rounded-md shadow-lg z-20 mt-1 max-h-48 overflow-y-auto">
                      <p className="text-xs text-gray-500 p-2 font-semibold">Nilai yang direkomendasikan</p>
                      {filteredNameRecs.map(rec => (
                        <button key={rec} type="button" onMouseDown={() => { updateVariationName(variation.id, rec); setActiveDropdown(null); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100">{rec}</button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => removeVariation(variation.id)} className="text-gray-400 hover:text-red-500">
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-start gap-4">
                <label className="w-16 text-sm text-gray-600 shrink-0 pt-2">Opsi</label>
                <div className="flex-grow flex flex-wrap gap-2">
                  {variation.options.map((option, oIndex) => (
                    <div
                      key={oIndex}
                      className="relative group"
                      draggable
                      onDragStart={() => handleDragStart(variation.id, oIndex)}
                      onDragEnter={() => handleDragEnter(variation.id, oIndex)}
                      onDragEnd={() => handleDrop(variation.id)}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <input
                        type="text"
                        maxLength={20}
                        value={option}
                        onChange={(e) => updateVariationOption(variation.id, oIndex, e.target.value)}
                        className="p-2 border rounded-md pr-24 w-48"
                      />
                      <div className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-400 space-x-1">
                        <span>{option.length}/20</span>
                        <button type="button" className="text-gray-400 cursor-grab group-hover:text-gray-700">
                          <Move size={16} />
                        </button>
                        <button type="button" onClick={() => removeVariationOption(variation.id, oIndex)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ketik atau pilih"
                      maxLength={20}
                      value={newOptionValues[variation.id] || ''}
                      onChange={(e) => {
                        handleNewOptionChange(variation.id, e.target.value);
                        setActiveDropdown(null);
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNewOption(variation.id); } }}
                      onBlur={() => handleAddNewOption(variation.id)}
                      onClick={() => setActiveDropdown({ type: 'option', id: variation.id })}
                      onFocus={() => setActiveDropdown({ type: 'option', id: variation.id })}
                      className="p-2 border rounded-md pr-10 w-48"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">
                      {(newOptionValues[variation.id] || '').length}/20
                    </span>
                    {activeDropdown?.type === 'option' && activeDropdown?.id === variation.id && (
                      <div className="absolute top-full left-0 w-full bg-white border rounded-md shadow-lg z-20 mt-1 max-h-48 overflow-y-auto">
                        <p className="text-xs text-gray-500 p-2 font-semibold">Nilai yang direkomendasikan</p>
                        {(availableOptionRecs.length > 0) && (
                          availableOptionRecs
                            .map(rec => (
                              <button key={rec} type="button" onMouseDown={() => { setNewOptionValues(prev => ({ ...prev, [variation.id]: rec })); handleAddNewOption(variation.id); setActiveDropdown(null); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100">{rec}</button>
                            ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {variations.length < 2 && (
          <button
            onClick={addVariation}
            className="w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Tambah Variasi {variations.length + 1}
          </button>
        )}

        {productVariants.length > 0 && (
          <div className="space-y-4 mt-6">
            <h4 ref={daftarVariasiRef} className="font-semibold text-gray-700">Daftar Variasi</h4>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 border rounded-md flex-grow">
                <input type="text" placeholder="Harga" value={formatRupiah(bulkPrice)} onChange={e => setBulkPrice(parseRupiah(e.target.value))} className="p-2 border-b sm:border-b-0 sm:border-r" />
                <input type="number" placeholder="Stok" value={bulkStock} onChange={e => setBulkStock(e.target.value)} className="p-2 border-b sm:border-b-0 sm:border-r" />
                <input type="text" placeholder="Kode Variasi" value={bulkSku} onChange={e => setBulkSku(e.target.value)} className="p-2" />
              </div>
              <button onClick={handleApplyToAll} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shrink-0">Terapkan Ke Semua</button>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="preOrder" checked={isPreOrder} onChange={e => setIsPreOrder(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label htmlFor="preOrder" className="text-sm">Atur Dikirim Dalam untuk variasi</label>
            </div>
            <h4 ref={daftarVariasiRef} className="font-semibold text-gray-700">Daftar Variasi</h4>
            {variantError && <p className="text-xs text-red-600 mt-2 mb-2">{variantError}</p>}
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    {activeVariations.map(v => <th key={v.id} scope="col" className="px-4 py-3">{v.name}</th>)}
                    <th scope="col" className="px-4 py-3">*Harga</th>
                    <th scope="col" className="px-4 py-3">*Stok</th>
                    {shippingPerVariation && <th scope="col" className="px-4 py-3">*Berat (gr)</th>}
                    {shippingPerVariation && <th scope="col" className="px-4 py-3">Ukuran Paket (cm)</th>}
                    <th scope="col" className="px-4 py-3">Kode Variasi</th>
                    {isPreOrder && <th scope="col" className="px-4 py-3">Dikirim Dalam</th>}
                  </tr>
                </thead>
                <tbody>
                  {productVariants.map((variant, index) => {
                    const firstVarName = activeVariations[0]?.name;
                    const showFirstVarCell = firstVarName && (index === 0 || variant.combination[firstVarName] !== productVariants[index - 1]?.combination[firstVarName]);

                    let rowSpan = 1;
                    if (showFirstVarCell) {
                      const firstVarValue = variant.combination[firstVarName];
                      for (let i = index + 1; i < productVariants.length; i++) {
                        if (productVariants[i].combination[firstVarName] === firstVarValue) {
                          rowSpan++;
                        } else {
                          break;
                        }
                      }
                    }

                    return (
                      <tr key={variant.id} className="bg-white border-b">
                        {activeVariations.map((v, vIndex) => {
                          if (vIndex === 0) {
                            if (showFirstVarCell) {
                              return (
                                <td key={`${variant.id}-${v.id}`} className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap align-top" rowSpan={rowSpan}>
                                  <div className="flex flex-col items-start gap-2">
                                    <span>{variant.combination[v.name]}</span>
                                    <button type="button" onClick={() => triggerVariantImageUpload(index)} className="w-20 h-20 border-2 border-dashed rounded-md flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500">
                                      {variant.image ? <img src={variant.image.preview} alt="variant" className="w-full h-full object-cover rounded-md" /> : <Camera size={24} />}
                                    </button>
                                  </div>
                                </td>
                              );
                            } else {
                              return null;
                            }
                          } else {
                            return (
                              <td key={`${variant.id}-${v.id}`} className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap align-middle">
                                {variant.combination[v.name]}
                              </td>
                            );
                          }
                        })}
                        <td className="px-2 py-2 align-middle">
                          <input type="text" value={formatRupiah(String(variant.price))} onChange={e => handleVariantChange(variant.id, 'price', e.target.value)} className="w-full p-2 border rounded-md" placeholder="Rp" />
                        </td>
                        <td className="px-2 py-2 align-middle">
                          <input type="number" value={variant.stock} onChange={e => handleVariantChange(variant.id, 'stock', e.target.value)} className="w-24 p-2 border rounded-md" />
                        </td>
                        {shippingPerVariation && (
                          <>
                            <td className="px-2 py-2 align-middle">
                              <input type="number" value={variant.weight} onChange={e => handleVariantChange(variant.id, 'weight', e.target.value)} className="w-24 p-2 border rounded-md" placeholder="gr" />
                            </td>
                            <td className="px-2 py-2 align-middle">
                              <div className="flex flex-col sm:flex-row gap-1">
                                <input type="number" value={variant.length} onChange={e => handleVariantChange(variant.id, 'length', e.target.value)} className="w-16 p-2 border rounded-md" placeholder="P" />
                                <input type="number" value={variant.width} onChange={e => handleVariantChange(variant.id, 'width', e.target.value)} className="w-16 p-2 border rounded-md" placeholder="L" />
                                <input type="number" value={variant.height} onChange={e => handleVariantChange(variant.id, 'height', e.target.value)} className="w-16 p-2 border rounded-md" placeholder="T" />
                              </div>
                            </td>
                          </>
                        )}
                        <td className="px-2 py-2 align-middle">
                          <input type="text" value={variant.sku} onChange={e => handleVariantChange(variant.id, 'sku', e.target.value)} className="w-full p-2 border rounded-md" />
                        </td>
                        {isPreOrder && (
                          <td className="px-2 py-2 align-middle">
                            <input type="text" value={(variant).dikirimDalam || ''} onChange={e => handleVariantChange(variant.id, 'dikirimDalam', e.target.value)} className="w-full p-2 border rounded-md" />
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <PriceRangeWarning />
          </div>
        )}
      </div>
    )
  };
  const renderShippingInformation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Berat & Dimensi berbeda untuk tiap variasi</span>
        <label htmlFor="shipping-per-variation-toggle" className="inline-flex relative items-center cursor-pointer">
          <input type="checkbox" checked={shippingPerVariation} onChange={e => handleShippingPerVariationToggle(e.target.checked)} id="shipping-per-variation-toggle" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
      </div>

      {!shippingPerVariation && (
        <>
          <div>
            <InfoLabel label="* Berat" tooltipKey="shipping" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} />
            <div className="relative mt-1">
              <input
                id="weight"
                type="number"
                value={shippingWeight}
                onChange={e => setShippingWeight(e.target.value)}
                className={`w-full p-2 border rounded-md pr-12 ${shippingWeightError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Mohon masukkan"
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">gr</span>
            </div>
            {shippingWeightError && <p className="text-xs text-red-600 mt-1">{shippingWeightError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran Paket</label>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative">
                <input type="number" placeholder="P" value={packageDimensions.length} onChange={e => setPackageDimensions(p => ({ ...p, length: e.target.value }))} className="w-full p-2 border rounded-md pr-10" />
                <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">cm</span>
              </div>
              <div className="relative">
                <input type="number" placeholder="L" value={packageDimensions.width} onChange={e => setPackageDimensions(p => ({ ...p, width: e.target.value }))} className="w-full p-2 border rounded-md pr-10" />
                <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">cm</span>
              </div>
              <div className="relative">
                <input type="number" placeholder="T" value={packageDimensions.height} onChange={e => setPackageDimensions(p => ({ ...p, height: e.target.value }))} className="w-full p-2 border rounded-md pr-10" />
                <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">cm</span>
              </div>
            </div>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">* Produk Berbahaya</label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center">
            <input id="hazardous-no" name="hazardous" type="radio" checked={!isHazardous} onChange={() => setIsHazardous(false)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
            <label htmlFor="hazardous-no" className="ml-2 block text-sm text-gray-900">Tidak</label>
          </div>
          <div className="flex items-center">
            <input id="hazardous-yes" name="hazardous" type="radio" checked={isHazardous} onChange={() => setIsHazardous(true)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
            <label htmlFor="hazardous-yes" className="ml-2 block text-sm text-gray-900">Mengandung baterai/magnet/cairan/bahan mudah terbakar</label>
          </div>
        </div>
      </div>

      <hr />

      <div>
        <InfoLabel label="Pre-Order" tooltipKey="preorder" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} />
        <div className="flex items-center gap-6 mt-1">
          <div className="flex items-center">
            <input id="preorder-no" name="preorder" type="radio" checked={!isProductPreOrder} onChange={() => setIsProductPreOrder(false)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
            <label htmlFor="preorder-no" className="ml-2 block text-sm text-gray-900">Tidak</label>
          </div>
          <div className="flex items-center">
            <input id="preorder-yes" name="preorder" type="radio" checked={isProductPreOrder} onChange={() => setIsProductPreOrder(true)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
            <label htmlFor="preorder-yes" className="ml-2 block text-sm text-gray-900">Ya</label>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Kirimkan produk dalam 2 hari (tidak termasuk hari Sabtu, Minggu, libur nasional dan non-operasional jasa kirim).</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Asuransi Pengiriman</label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md">
          <div className="mb-2 sm:mb-0">
            <h5 className="font-semibold">Enroll Insurance</h5>
            <p className="text-xs text-gray-600">100% penggantian untuk barang hilang/rusak saat proses pengiriman</p>
          </div>
          <label htmlFor="insurance-toggle" className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" checked={shippingInsurance} onChange={e => setShippingInsurance(e.target.checked)} id="insurance-toggle" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">Dengan mendaftar, Penjual setuju untuk membayar premi sebesar 0.5% untuk pesanan yang diasuransikan</p>
      </div>
    </div>
  );
  const renderLainnyaInformation = () => (
    <div className="space-y-6">
      <div>
        <InfoLabel label="Kondisi" tooltipKey="condition" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} />
        <select id="condition" value={condition} onChange={e => setCondition(e.target.value)} className="w-full p-2 border rounded-md bg-white mt-1">
          <option>Baru</option>
          <option>Pernah Dipakai</option>
        </select>
      </div>
      <div className="relative">
        <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 mb-1">Jadwal Ditampilkan</label>
        <input
          id="schedule-date"
          type="date"
          value={scheduledDate}
          onChange={e => setScheduledDate(e.target.value)}
          className="w-full p-2 border rounded-md pr-10"
        />
        <Calendar size={18} className="absolute right-3 top-9 text-gray-400" />
        {relisProduct && <p className="text-xs text-red-600 mt-2 mb-2">{relisProduct}</p>}
      </div>
      <div>
        <InfoLabel label="SKU Induk" tooltipKey="parentSku" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} />
        <input id="parent-sku" type="text" value={parentSku} onChange={e => setParentSku(e.target.value)} className="w-full p-2 border rounded-md mt-1" />
      </div>

      {/* +++ INPUTAN COD BARU +++ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pembayaran di Tempat (COD)</label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md">
          <div className="mb-2 sm:mb-0">
            <h5 className="font-semibold">Aktifkan COD</h5>
            <p className="text-xs text-gray-600">Izinkan pembeli untuk membayar secara tunai saat produk diterima.</p>
          </div>
          <label htmlFor="cod-toggle" className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isCodEnabled}
              onChange={e => setIsCodEnabled(e.target.checked)}
              id="cod-toggle"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">Dengan mengaktifkan COD, Anda setuju dengan syarat & ketentuan yang berlaku.</p>
      </div>
    </div>
  );
  const renderPreviewContent = () => (
    <>
      <div className="p-3">
        <div className={`relative bg-gray-200 aspect-square rounded-md mb-3 flex items-center justify-center overflow-hidden border-2 transition-colors ${(hoveredPhotoIndex !== null || isPhotoSectionHovered) ? 'border-blue-500' : 'border-transparent'}`}>
          {previewMedia.length > 0 ? (
            <>
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full z-10">{previewMediaIndex + 1}/{previewMedia.length}</div>
              <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${previewMediaIndex * 100}%)` }}>
                {previewMedia.map((media, index) => (
                  <div key={index} className="w-full h-full flex-shrink-0">
                    {media.type === 'video' ? (
                      <video src={media.preview} className="w-full h-full object-cover" controls />) : (
                      <img src={media.preview} alt="Preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
              {previewMedia.length > 1 && (
                <>
                  <button onClick={prevPreview} className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-0.5 hover:bg-black/70 z-10"><ChevronLeft size={18} /></button>
                  <button onClick={nextPreview} className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-0.5 hover:bg-black/70 z-10"><ChevronRight size={18} /></button>
                </>
              )}
            </>
          ) : (
            <ShoppingBag size={48} className="text-gray-400" />
          )}
        </div>
        <p className={`font-semibold truncate text-sm transition-all p-1 rounded ${highlightedPreviewSection === 'name' ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}>
          {productName || 'Nama Produk Anda'}
        </p>
        {activeVariations.length > 0 ? (
          <div className="mt-2">
            <p className="text-sm text-gray-600">{productVariants.length} Variasi Tersedia</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {activeVariations[0].options.filter(opt => opt.trim() !== '').map(option => {
                const variant = productVariants.find(p => p.combination[activeVariations[0].name] === option);
                return (
                  <button
                    key={option}
                    onClick={() => setSelectedPreviewOption(selectedPreviewOption === option ? null : option)}
                    className={`w-10 h-10 rounded-md border-2 flex items-center justify-center ${selectedPreviewOption === option ? 'border-blue-500' : 'border-gray-300'}`}
                  >
                    {variant?.image ? (
                      <img src={variant.image.preview} alt={option} className="w-full h-full object-cover rounded-sm" />
                    ) : (
                      <LayersIcon size={20} className="text-gray-400" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-1">
              <img src={shopProfile?.logo_url} className='w-5 h-5 rounded-full bg-gray-300' />
              <p className="font-semibold text-xs text-gray-600">{shopProfile?.shop_name}</p>
            </div>
            <button className="px-3 py-1 border border-blue-500 text-blue-500 text-xs font-semibold rounded-sm hover:bg-blue-50">Kunjungi</button>
          </div>
        )}
        <hr className="my-3" />
        <div className={`transition-all p-1 rounded ${highlightedPreviewSection === 'specifications' ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}>
          <h4 className="font-semibold text-sm mb-2">Spesifikasi</h4>
          <div className="space-y-1">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-gray-500">{key}</span>
                <span className="text-gray-800 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-3" />
        <div className={`transition-all p-1 rounded ${highlightedPreviewSection === 'description' ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}>
          <h4 className="font-semibold text-sm mb-2">Deskripsi</h4>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{description || 'Deskripsi produk akan tampil di sini.'}</p>
        </div>
      </div>
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <button className="flex-1 py-2 border border-teal-500 text-teal-600 rounded-md text-sm hover:bg-teal-50 flex items-center justify-center gap-1"><MessageCircleIcon size={16} /> Chat</button>
          <button className="px-4 py-2 border border-teal-500 text-teal-600 rounded-md hover:bg-teal-50"><ShoppingCartIcon size={18} /></button>
          <button className="flex-1 py-2 bg-blue-500 text-white font-semibold rounded-md text-sm hover:bg-blue-600">Beli Sekarang</button>
        </div>
      </div>
    </>
  );
  const renderSection = (title: string, content: React.ReactNode, ref: React.Ref<HTMLDivElement>) => (
    <div ref={ref} className="p-4 sm:p-6 space-y-6 border-b last:border-b-0">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      {content}
    </div>
  );
  const renderDisabledSection = (title: string, ref: React.Ref<HTMLDivElement>) => (
    <div ref={ref} className="p-4 sm:p-6 space-y-6 border-b last:border-b-0">
      <h3 className="text-xl font-bold text-gray-400">{title}</h3>
      <p className="text-sm text-gray-400">Tersedia setelah memilih kategori produk</p>
    </div>
  );
  const renderProductPhotoInputs = (isMobileView: boolean) => (
    <div>
      <div className="flex flex-wrap gap-4 items-center">
        {productPhotos.map((photo, index) => (
          <div
            key={photo.preview}
            className="relative w-24 h-24 flex-shrink-0 group"
            onMouseEnter={() => !isMobileView && setHoveredPhotoIndex(index)}
            onMouseLeave={() => !isMobileView && setHoveredPhotoIndex(null)}
          >
            <button type="button" onClick={() => triggerProductPhotoReplace(index)} className="w-full h-full rounded-md border-2 border-transparent hover:border-blue-500 overflow-hidden p-0 bg-gray-100">
              <img src={photo.preview} alt={`preview ${index}`} className="w-full h-full object-cover" />
            </button>
            <button onClick={() => removeProductPhoto(index)} className="absolute -top-1.5 -right-1.5 bg-gray-700 text-white rounded-full p-0.5 hover:bg-red-600 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={12} />
            </button>
          </div>
        ))}
        {productPhotos.length < 9 && (
          <button onClick={() => productPhotoInputRef.current?.click()} className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-md bg-gray-50 text-center hover:bg-gray-100 transition-colors border-gray-300 text-gray-500">
            <Camera className="h-7 w-7 text-red-500" strokeWidth={1.5} />
            <span className="text-xs mt-1">Tambahkan Foto ({productPhotos.length}/9)</span>
          </button>
        )}
      </div>
      {photoError && <p className="text-xs text-red-600 mt-2">{photoError}</p>}
    </div>
  );

  return (
    <div className="font-sans">
      {
        shopProfile &&
        <Header shopProfile={shopProfile} />
      }

      <div className="bg-gray-100 min-h-screen pb-32">
        <input type="file" ref={productPhotoInputRef} onChange={(e) => handleFileSelection(e, 'new')} accept="image/jpeg,image/png" style={{ display: 'none' }} />
        <input type="file" ref={replacePhotoInputRef} onChange={(e) => handleFileSelection(e, 'replace', editingPhotoIndex)} accept="image/jpeg,image/png" style={{ display: 'none' }} />
        <input type="file" ref={videoInputRef} onChange={handleVideoChange} accept="video/mp4" style={{ display: 'none' }} />

        <Modal isOpen={isCropperModalOpen} onClose={() => {
          setIsCropperModalOpen(false);
          setImageToCrop(null);
        }} title="Potong Gambar (1:1)">
          <div className="p-4">
            {imageToCrop && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                minHeight={100}
                minWidth={100}
                className="max-h-[60vh]"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imageToCrop}
                  style={{ transform: `scale(1) rotate(0deg)` }}
                  onLoad={(e) => {
                    const { width, height } = e.currentTarget;
                    setCrop(centerAspectCrop(width, height, aspect));
                  }}
                />
              </ReactCrop>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsCropperModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-white hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmCrop}
                disabled={!completedCrop?.width || !completedCrop?.height}
                className="px-4 py-2 bg-blue-500 border border-transparent text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              >
                Potong & Simpan
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)}>
          <CategorySelector onSelectCategory={setTempCategory} initialCategory={category} categories={apiCategories} isLoading={categoryLoading} error={categoryApiError} setIdCategorie={setIdCategorie} setCategoryModalOpen={setCategoryModalOpen} handleConfirmCategory={handleConfirmCategory} />
        </Modal>

        <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} title="Preview Produk">
          <div className="bg-white rounded-lg shadow-sm">
            {renderPreviewContent()}
          </div>
        </Modal>

        {isMobile ? (
          <div className="max-w-4xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-8">
            <div className="flex flex-col gap-6">
              <div className="w-full bg-white rounded-lg shadow-sm">
                <div className="sticky top-[61px] bg-white z-10 border-b border-gray-200">
                  <nav className="flex space-x-1 sm:space-x-6 px-2 sm:px-6 overflow-x-auto">
                    {(Object.keys(sectionRefs) as Array<keyof typeof sectionRefs>).map(tabId => {
                      const tabName = tabId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      return (
                        <button
                          key={tabId}
                          onClick={() => handleTabClick(tabId)}
                          className={`py-4 px-1 text-sm font-semibold whitespace-nowrap transition-colors duration-150 ${activeFormTab === tabId ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                          {tabName}
                        </button>
                      )
                    })}
                  </nav>
                </div>
                <div>
                  {renderSection("Informasi Produk", (
                    <>
                      <div onMouseEnter={() => setIsPhotoSectionHovered(true)} onMouseLeave={() => setIsPhotoSectionHovered(false)}>
                        <InfoLabel label="Foto Produk *" tooltipKey="photo" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} />
                        <div className="mt-1">{renderProductPhotoInputs(true)}</div>
                      </div>
                      <div>
                        <InfoLabel label="Video Produk *" tooltipKey="video" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} />
                        <div className="flex items-start gap-4 mt-1">
                          {productVideo ? (
                            <div className="relative w-48 h-27 group">
                              <video src={productVideo.preview} className="w-full h-full object-cover rounded-md border" controls />
                              <button onClick={handleRemoveVideo} className="absolute -top-1.5 -right-1.5 bg-gray-700 text-white rounded-full p-0.5 hover:bg-red-600 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => videoInputRef.current?.click()} className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-md bg-gray-50 text-center hover:bg-gray-100 transition-colors border-gray-300 text-gray-500">
                              <Video className="h-7 w-7" strokeWidth={1.5} />
                              <span className="text-xs mt-1">Tambah Video</span>
                            </button>
                          )}
                        </div>
                        {videoError && <p className="text-xs text-red-600 mt-1">{videoError}</p>}
                      </div>
                      <hr />
                      <div>
                        <InfoLabel label="Nama Produk *" tooltipKey="productName" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} />
                        <div className="relative flex-grow mt-1">
                          <input type="text" value={productName} maxLength={255} onChange={(e) => setProductName(e.target.value)} placeholder="Merek + Tipe Produk + Keterangan" className={`w-full p-2 border rounded-md shadow-sm pr-16 ${productNameError ? 'border-red-500' : 'border-gray-300'}`} />
                          <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">{productName.length}/255</span>
                        </div>
                        {productNameError && <p className="text-xs text-red-600 mt-1">{productNameError}</p>}
                      </div>
                      <div>
                        <InfoLabel label="Kategori *" tooltipKey="category" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} />
                        <button onClick={() => { setTempCategory(category); setCategoryModalOpen(true); }} className={`w-full flex justify-between items-center text-left p-2 border rounded-md bg-white mt-1 ${categoryError ? 'border-red-500' : 'border-gray-300'}`}>
                          <span className={category ? 'text-gray-800' : 'text-gray-400'}>{category || "Pilih Kategori"}</span>
                          <Edit2Icon className="text-gray-400" size={16} />
                        </button>
                        {categoryError && <p className="text-xs text-red-600 mt-1">{categoryError}</p>}
                      </div>
                      <div>
                        <InfoLabel label="Deskripsi Produk *" tooltipKey="description" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} />
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full p-2 border rounded-md shadow-sm border-gray-300 mt-1" placeholder="Jelaskan deskripsi produkmu di sini..."></textarea>
                      </div>
                    </>
                  ), sectionRefs['informasi-produk'])}

                  {idCategorie ? renderSection("Spesifikasi", (
                    <>
                      <p className="text-sm text-gray-500 mb-4">Lengkap: 5 / 5 Lengkapi atribut produkmu agar dapat lebih banyak dilihat oleh Pembeli. <a href="#" className="text-blue-600">Cara mengatur atribut.</a></p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Merek <span className="text-red-500">*</span></label>
                          <input value={specifications['Merek']} onChange={e => handleSpecChange('Merek', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Negara Asal</label>
                          <input value={specifications['Negara Asal']} onChange={e => handleSpecChange('Negara Asal', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                      </div >
                    </>
                  ), sectionRefs['spesifikasi']) : renderDisabledSection("Spesifikasi", sectionRefs['spesifikasi'])}

                  {idCategorie ? renderSection("Informasi Penjualan", renderSalesInformation(), sectionRefs['informasi-penjualan']) : renderDisabledSection("Informasi Penjualan", sectionRefs['informasi-penjualan'])}

                  {idCategorie ? renderSection("Pengiriman", renderShippingInformation(), sectionRefs['pengiriman']) : renderDisabledSection("Pengiriman", sectionRefs['pengiriman'])}

                  {idCategorie ? renderSection("Lainnya", renderLainnyaInformation(), sectionRefs['lainnya']) : renderDisabledSection("Lainnya", sectionRefs['lainnya'])}
                </div>
              </div>
            </div >
          </div>
        ) : (
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-blue-600 p-3">
                    <h3 className="font-semibold text-white">Rekomendasi</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-gray-600 p-4">
                    <li className="flex items-center gap-2"><CheckCircle className={productPhotos.length >= 3 ? "text-green-500" : "text-gray-400"} /> Tambah min. 1 foto</li>
                    {/* <li className="flex items-center gap-2"><CheckCircle className={productVideo ? "text-green-500" : "text-gray-400"} /> Tambah video</li> */}
                    <li className="flex items-center gap-2"><CheckCircle className={productName.length >= 25 ? "text-green-500" : "text-gray-400"} /> Nama 25+ karakter</li>
                    <li className="flex items-center gap-2"><CheckCircle className={description.length >= 100 && productPhotos.length > 0 ? "text-green-500" : "text-gray-400"} /> Deskripsi 100+ karakter</li>
                    <li className="flex items-center gap-2"><CheckCircle className={Object.values(specifications).some(v => v) ? "text-green-500" : "text-gray-400"} /> Tambah info merek</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="sticky top-[61px] bg-white z-10 border-b border-gray-200">
                  <nav className="flex space-x-6 px-6 overflow-x-auto">
                    {(Object.keys(sectionRefs) as Array<keyof typeof sectionRefs>).map(tabId => {
                      const tabName = tabId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      return (
                        <button
                          key={tabId}
                          onClick={() => handleTabClick(tabId)}
                          className={`py-4 px-1 text-sm font-semibold whitespace-nowrap transition-colors duration-150 ${activeFormTab === tabId ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'}`}>
                          {tabName}
                        </button>
                      )
                    })}
                  </nav>
                </div>

                <div

                >
                  {renderSection("Informasi Produk", (
                    <>
                      <div >
                        <h4 className="font-semibold mb-2 text-gray-700">Foto Produk <span className="text-red-500">*</span></h4>
                        {renderProductPhotoInputs(false)}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-700">Video Produk <span className="text-red-500">*</span></h4>
                        <div className="flex items-start gap-4">
                          {productVideo ? (
                            <div className="relative w-48 h-27 group">
                              <video src={productVideo.preview} className="w-full h-full object-cover rounded-md border" controls />
                              <button onClick={handleRemoveVideo} className="absolute -top-1.5 -right-1.5 bg-gray-700 text-white rounded-full p-0.5 hover:bg-red-600 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => videoInputRef.current?.click()} className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-md bg-gray-50 text-center hover:bg-gray-100 transition-colors border-gray-300 text-gray-500">
                              <Video className="h-7 w-7" strokeWidth={1.5} />
                              <span className="text-xs mt-1">Tambah Video</span>
                            </button>
                          )}
                        </div>
                        {videoError && <p className="text-xs text-red-600 mt-2">{videoError}</p>}
                      </div>
                      <hr />
                      <div onMouseEnter={() => setHighlightedPreviewSection('name')} onMouseLeave={() => setHighlightedPreviewSection(null)}>
                        <h4 className="font-semibold mb-2 text-gray-700">Nama Produk <span className="text-red-500">*</span></h4>
                        <div className="relative flex-grow">
                          <input type="text" value={productName} maxLength={255} onChange={(e) => setProductName(e.target.value)} placeholder="Nama Merek + Tipe Produk (Bahan, Warna, Ukuran, Variasi)" className={`w-full p-2 border rounded-md shadow-sm pr-16 ${productNameError ? 'border-red-500' : 'border-gray-300'}`} onFocus={() => setHighlightedPreviewSection('name')} onBlur={() => setHighlightedPreviewSection(null)} />
                          <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">{productName.length}/255</span>
                        </div>
                        {productNameError && <p className="text-xs text-red-600 mt-1">{productNameError}</p>}
                      </div>
                      <div onMouseEnter={() => setHighlightedPreviewSection('specifications')} onMouseLeave={() => setHighlightedPreviewSection(null)}>
                        <h4 className="font-semibold mb-2 text-gray-700">Kategori <span className="text-red-500">*</span></h4>
                        <button onClick={() => { setTempCategory(category); setCategoryModalOpen(true); }} className={`w-full flex justify-between items-center text-left p-2 border rounded-md bg-white ${categoryError ? 'border-red-500' : 'border-gray-300'}`}>
                          <span className={category ? 'text-gray-800' : 'text-gray-400'}>{category || "Pilih Kategori"}</span>
                          <Edit2Icon className="text-gray-400" size={16} />
                        </button>
                        {categoryError && <p className="text-xs text-red-600 mt-1">{categoryError}</p>}
                      </div>
                      <div onMouseEnter={() => setHighlightedPreviewSection('description')} onMouseLeave={() => setHighlightedPreviewSection(null)}>
                        <h4 className="font-semibold mb-2 text-gray-700">Deskripsi Produk <span className="text-red-500">*</span></h4>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full p-2 border rounded-md shadow-sm border-gray-300" placeholder="Jelaskan deskripsi produkmu di sini..." onFocus={() => setHighlightedPreviewSection('description')} onBlur={() => setHighlightedPreviewSection(null)}></textarea>
                      </div>
                    </>
                  ), sectionRefs['informasi-produk'])}

                  {idCategorie ? renderSection("Spesifikasi", (
                    <div>
                      <p className="text-sm text-gray-500 mb-4">Lengkap: 5 / 5 Lengkapi atribut produkmu agar dapat lebih banyak dilihat oleh Pembeli. <a href="#" className="text-blue-600">Cara mengatur atribut.</a></p>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Merek <span className="text-red-500">*</span></label>
                          <input value={specifications['Merek']} onChange={e => handleSpecChange('Merek', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Negara Asal</label>
                          <input value={specifications['Negara Asal']} onChange={e => handleSpecChange('Negara Asal', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                      </div>
                    </div>
                  ), sectionRefs['spesifikasi']) : renderDisabledSection("Spesifikasi", sectionRefs['spesifikasi'])}

                  {idCategorie ? renderSection("Informasi Penjualan", renderSalesInformation(), sectionRefs['informasi-penjualan']) : renderDisabledSection("Informasi Penjualan", sectionRefs['informasi-penjualan'])}

                  {idCategorie ? renderSection("Pengiriman", renderShippingInformation(), sectionRefs['pengiriman']) : renderDisabledSection("Pengiriman", sectionRefs['pengiriman'])}

                  {idCategorie ? renderSection("Lainnya", renderLainnyaInformation(), sectionRefs['lainnya']) : renderDisabledSection("Lainnya", sectionRefs['lainnya'])}
                  <div className="relative bottom-0 left-0 w-full bg-white border-t border-gray-200 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex justify-between items-center py-3 gap-3">
                        {isMobile && (
                          <button onClick={() => setIsPreviewModalOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-white hover:bg-gray-100 transition-colors">
                            <Eye size={16} />
                            <span className="hidden sm:inline">Lihat Preview</span>
                          </button>
                        )}
                        <div className="flex items-center gap-3 w-full justify-end">
                          <button className="px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-gray-800 bg-white hover:bg-gray-100 transition-colors" onClick={() => {
                            window.location.href = '/my-store/product'
                            localStorage.removeItem('EditProduct');

                          }}>Kembali</button>
                          <button onClick={handleSaveAndArchive} className="px-4 sm:px-6 py-2 border border-blue-500 rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">Arsipkan</button>
                          <button onClick={handleSaveAndPublish} className="px-4 sm:px-6 py-2 bg-blue-500 border border-transparent text-white rounded-md hover:bg-blue-600 transition-colors">
                            {params?.type === 'edit' ? 'Perbarui' : 'Tampilkan'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="sticky top-24 bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Preview</h3>
                  <p className="text-sm text-gray-500">Rincian Produk</p>
                </div>
                {renderPreviewContent()}
                <p className="text-center text-xs text-gray-400 p-3 pt-0">Hanya untuk referensi saja.</p>
              </div>
            </div>
          </div>
        )}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3 gap-3">
              {isMobile && (
                <button onClick={() => setIsPreviewModalOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-white hover:bg-gray-100 transition-colors">
                  <Eye size={16} />
                  <span className="hidden sm:inline">Lihat Preview</span>
                </button>
              )}
              <div className="flex items-center gap-3 w-full justify-end">
                <button className="px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-gray-800 bg-white hover:bg-gray-100 transition-colors" onClick={() => {
                  window.location.href = '/my-store/product'
                  localStorage.removeItem('EditProduct');

                }}>Kembali</button>
                <button onClick={handleSaveAndArchive} className="px-4 sm:px-6 py-2 border border-blue-500 rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">Arsipkan</button>
                <button onClick={handleSaveAndPublish} className="px-4 sm:px-6 py-2 bg-blue-500 border border-transparent text-white rounded-md hover:bg-blue-600 transition-colors">
                  {params?.type === 'edit' ? 'Perbarui' : 'Tampilkan'}
                </button>
              </div>
            </div>
          </div>
        </div>
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
      </div>
    </div >
  );
};

export default AddProductPage;