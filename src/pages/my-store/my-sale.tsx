import type { NextPage } from 'next';
// import Image from 'next/image'; // Dihapus karena tidak didukung di lingkungan ini
import { Search, ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'; // Menambahkan import React untuk JSX
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';
import Delete from 'services/api/Delete';
import { AxiosError } from 'axios';
import Snackbar from 'components/Snackbar';
import Loading from 'components/Loading';
import DeleteProductModal from 'components/my-store/product/DeleteProductModal';
import { formatRupiah } from 'components/Rupiah';

// Mendefinisikan tipe data untuk setiap produk untuk keamanan tipe (TypeScript)
type Media = { id: string; url: string; type: string; };
type VarianPrice = { id: number; product_id: number; image: string; price: number | string; stock: number; variant_code?: string; };
type Value = { id: number; variant_id: number; value: string; ordinal: number; }
type Variant = { id: number; product_id: number; ordinal: number; values?: Value[] | null; };
type Product = { id: number; saller_id: number; name: string; category_id: number; category_name: string; is_used: number; price: number; stock: number; sales: number; desc: string; sku: string; min_purchase: number; max_purchase: string | number; image: string; media?: Media[] | null; status: string; variant_prices?: VarianPrice[] | null; variants?: Variant[]; variant_group_names?: string[]; is_cod_enabled?: number };

// Komponen Halaman Produk
const MySalePage: NextPage = () => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });
    const getProduct = async () => {
        setLoading(true);
        const res = await Get<Response>('zukses', `product/show`);
        if (res?.status === 'success' && Array.isArray(res.data)) {
            const data = res?.data as Product[];
            setProducts(data);
        } else {
            console.warn('Produk tidak ditemukan atau gagal diambil');
        }
        setLoading(false);
    };

    useEffect(() => {
        getProduct();
    }, []);

    const handleCloseDeleteModal = () => {
        setProductToDelete(null);
        setDeleteModalOpen(false);
    };

    const handleDeleteProduct = async (): Promise<void> => {
        try {
            if (!productToDelete) return;
            setLoading(true);
            const res = await Delete<Response>('zukses', `product/${productToDelete?.id}`);
            setLoading(false);

            if (res?.data?.status === 'success') {
                getProduct()
                setSnackbar({ message: `Produk "${productToDelete.name}" berhasil dihapus.`, type: 'success', isOpen: true });
                handleCloseDeleteModal();
            }
        } catch (err) {
            setLoading(false);
            const error = err as AxiosError<{ message?: string }>;
            setSnackbar({ message: error.response?.data?.message || 'Terjadi kesalahan', type: 'error', isOpen: true });
        }
    };
    return (
        <MyStoreLayout>
            <div className=" min-h-screen py-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header Halaman */}
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h1 className="text-[20px] font-bold text-[#333333]">Penjualan Saya</h1>
                    </header>
                    <main className="">

                        <div className="border-b border-gray-200">
                            <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
                                <a href="#" className="whitespace-nowrap py-4 px-3 sm:px-4 border-b-2 font-bold text-[16px] text-[#483AA0] border-[#483AA0]">
                                    Semua
                                </a>
                                <a href="#" className="whitespace-nowrap py-4 px-3 sm:px-4 border-b-2 border-[#333333]/80  text-[14px] hover:text-gray-700 hover:border-gray-300 border-transparent">
                                    Belum Bayar
                                </a>
                                <a href="#" className="whitespace-nowrap py-4 px-3 sm:px-4 border-b-2 border-[#333333]/80 text-[14px] hover:text-gray-700 hover:border-gray-300 border-transparent">
                                    Perlu Dikirim
                                </a>
                                <a href="#" className="whitespace-nowrap py-4 px-3 sm:px-4 border-b-2 border-[#333333]/80 text-[14px] hover:text-gray-700 hover:border-gray-300 border-transparent">
                                    Dikirim
                                </a>
                                <a href="#" className="whitespace-nowrap py-4 px-3 sm:px-4 border-b-2 border-[#333333]/80 text-[14px] hover:text-gray-700 hover:border-gray-300 border-transparent">
                                    Selesai
                                </a>
                                <a href="#" className="whitespace-nowrap py-4 px-3 sm:px-4 border-b-2 border-[#333333]/80 text-[14px] hover:text-gray-700 hover:border-gray-300 border-transparent">
                                    Dibatalkan
                                </a>
                                <a href="#" className="whitespace-nowrap py-4 px-3 sm:px-4 border-b-2 border-[#333333]/80 text-[14px] hover:text-gray-700 hover:border-gray-300 border-transparent">
                                    Pengembalian
                                </a>
                            </nav>
                        </div>

                        {/* Bar Pencarian */}
                        <div className="mt-6 flex items-center gap-4">
                            <select className='border border-[#AAAAAA] w-[259px] h-[35px] text-[14px] text-[#333333] px-2 rounded-[5px]'>
                                <option value="Nama Produk">Nama Produk</option>
                            </select>
                            <div className="relative flex-grow w-1/2 border border-[#AAAAAA] rounded-[5px]">
                                <div className="absolute inset-y-0 right-0 flex items-center pl-3 pointer-events-none pr-4">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder=""
                                    className="pl-4 py-2 h-[35px] focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <button className="w-[101px] h-[35px] bg-[#52357B] rounded-[5px] text-white text-[14px] font-bold">
                                Cari
                            </button>
                        </div>
                        <div className="mt-3 flex items-center gap-4">
                            <div className="relative flex-grow border border-[#AAAAAA] rounded-[5px] flex justify-left items-center gap-4 px-4">
                                <div className='w-[88px] text-[#AAAAAA]'>
                                    Jasa Kirim
                                </div>
                                <select className='w-full h-[37px] text-[15px]'>
                                    <option>Semua Jasa Kirim</option>
                                </select>
                            </div>
                            <button className="w-[101px] h-[35px] border border-[#52357B] rounded-[5px] text-[#333333] text-[14px] font-bold">
                                Reset
                            </button>
                        </div>
                        <p className='text-[15px] text-[#333333] mt-2'>Pencarian berdasarkan Nama Produk atau SKU</p>

                        {/* Tabel Produk */}
                        <div className="mt-8 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 ">

                                    {/* Header Tabel untuk Desktop */}
                                    <div className="hidden md:grid grid-cols-11 gap-4 border-b border-gray-200 pb-4 text-sm font-semibold text-gray-600">
                                        <div className="col-span-5 flex items-center">
                                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-4" />
                                            <span className='text-[15px] text-dark'>Produk</span>
                                        </div>
                                        <div className="col-span-2 text-center text-[15px] text-dark">Harga</div>
                                        <div className="col-span-1 text-center text-[15px] text-dark">Stok</div>
                                        <div className="col-span-2 text-center text-[15px] text-dark">Jumlah Variasi</div>
                                        <div className="col-span-1 text-center text-[15px] text-dark">Aksi</div>
                                    </div>

                                    {/* Body Tabel */}
                                    <div className="divide-y divide-gray-200">
                                        {products?.map((product) => (
                                            <div key={product.id} className="py-4 grid grid-cols-1 md:grid-cols-11 gap-4 items-center text-sm">
                                                {/* Kolom Produk */}
                                                <div className="md:col-span-5 flex items-start">
                                                    {/* Checkbox tetap dengan ukuran tetap */}
                                                    <div className="flex-none mt-1 mr-4">
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                    </div>

                                                    {/* Kontainer isi produk */}
                                                    <div className="flex items-center space-x-4 overflow-hidden">
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                src={product.image}
                                                                alt={product.image}
                                                                className="w-16 h-16 object-cover rounded-md"
                                                            />
                                                        </div>
                                                        <div className="flex-grow min-w-0">
                                                            {/* Min-w-0 untuk menghindari overflow teks */}
                                                            <p className="text-[14px] text-[#333333] truncate">{product.name}</p>
                                                            <p className="text-[14px] font-bold text-[#333333] mt-1">Jumlah : 1</p>
                                                        </div>
                                                    </div>
                                                </div>


                                                {/* Kolom lainnya */}
                                                <div className="md:col-span-2 text-center text-[14px]">{formatRupiah(product.price)}</div>
                                                <div className="md:col-span-1 text-center text-[14px]">{product?.id % 2 ? "Selesai" : "Belum Selesai"}</div>
                                                <div className="md:col-span-2 text-center text-[14px]">{product?.id % 2 ? "JNE" : "Lion Parcel"}</div>

                                                {/* Kolom Aksi */}
                                                <div className="text-[#333333] text-[14px] font-semibold text-center">
                                                    Detil
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Paginasi */}
                        <div className="mt-6 flex items-center justify-center sm:justify-center gap-2 text-sm font-medium text-gray-600">
                            <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors" >
                                <ArrowLeft size={16} />
                                <span className='text-[#1E1E1E]'>Previous</span>
                            </button>
                            <div className='h-5 border' />
                            <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                                <span className='text-[#1E1E1E]'>Next</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>

                    </main>
                </div>
            </div >
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

            <DeleteProductModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteProduct}
                productName={productToDelete?.name || ''}
            />
        </MyStoreLayout >
    );
};

export default MySalePage;
