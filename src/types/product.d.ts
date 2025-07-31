import { Category } from "services/api/product";

// Tipe untuk status validasi di sidebar
export type ValidationStatus = {
  produk: number | 'valid';
  penjualan: number | 'valid';
  pengiriman: number | 'valid';
  lainnya: number | 'valid';
};

// Tipe untuk item di checklist rekomendasi
export type TipsChecklist = {
  'Tambah min. 1 Foto': boolean;
  'Tambah 1 Foto Promosi': boolean;
  'Tambahkan Video': boolean;
  'Nama 25+ karakter': boolean;
  'Deskripsi 100+ karakter': boolean;
};

// Tipe untuk data variasi produk
export interface Variation {
  name: string;
  options: string[];
}

// Tipe untuk data setiap baris pada tabel varian
export interface VariantRowData {
  price: string;
  stock: string;
  discount: string;
  discountPercent: string;
  image?: File | null | string; // Bisa File, null, atau string URL saat edit
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
}

// Tipe untuk spesifikasi produk
export type Specification = {
  name: string;
  value: string;
};

// Tipe untuk kombinasi varian dari API
export type CombinationItem = {
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

// Tipe untuk media dari API
export type MediaItem = {
  url: string;
  type: string;
};

// Tipe untuk props kategori
export type CategoryProps = {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  onSelectCategory: (category: string) => void;
  setIdCategorie: (id: number | undefined) => void;
  initialCategory: string;
  handleConfirmCategory: () => void;
  setCategoryModalOpen: (isOpen: boolean) => void;
};