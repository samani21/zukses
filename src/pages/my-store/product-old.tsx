import { AxiosError } from 'axios';
import Loading from 'components/Loading';
import DeleteProductModal from 'components/my-store/product/DeleteProductModal';
import FilterBar from 'components/my-store/product/FilterBar';
import PageHeader from 'components/my-store/product/PageHeader';
import ProductGrid from 'components/my-store/product/ProductGrid';
import ProductTable from 'components/my-store/product/ProductTable';
import UpgradeBanner from 'components/my-store/product/UpgradeBanner';
import Snackbar from 'components/Snackbar';
import { Grid, List } from 'lucide-react';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import React, { useEffect, useState } from 'react';
import Delete from 'services/api/Delete';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';

// ... (Definisi tipe Media, VarianPrice, Value, Variant, Product tetap sama) ...
type Media = { id: string; url: string; type: string; };
type VarianPrice = { id: number; product_id: number; image: string; price: number | string; stock: number; variant_code?: string; };
type Value = { id: number; variant_id: number; value: string; ordinal: number; }
type Variant = { id: number; product_id: number; ordinal: number; values?: Value[] | null; };
type Product = { id: number; saller_id: number; name: string; category_id: number; category_name: string; is_used: number; price: number; stock: number; sales: number; desc: string; sku: string; min_purchase: number; max_purchase: string | number; image: string; media?: Media[] | null; status: string; variant_prices?: VarianPrice[] | null; variants?: Variant[]; variant_group_names?: string[]; is_cod_enabled?: number };


const ProductPage = () => {
    const [activeTab, setActiveTab] = useState<string>('Semua');
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    // --- STATE BARU UNTUK MODAL DELETE ---
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    // ------------------------------------

    const tabs = [
        { name: 'Semua', count: products?.length || 0 },
        { name: 'Tambah Stok', count: 0 },
        { name: 'Tinjau Rincian Produk', count: 0 },
    ];

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

    // --- FUNGSI UNTUK MENGELOLA MODAL ---
    const handleOpenDeleteModal = (product: Product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

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
            <div className="bg-gray-50 min-h-screen font-sans">
                <PageHeader />
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm w-full">
                        <div className="border-b border-gray-200">
                            <nav className="flex flex-wrap -mb-px space-x-4 sm:space-x-6 px-4 sm:px-6">
                                {/* ... (Kode Nav Tabs) ... */}
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.name}
                                        onClick={() => setActiveTab(tab.name)}
                                        className={`py-4 px-1 text-sm font-medium transition-colors duration-200 ${activeTab === tab.name ? 'border-b-2 border-blue-500 text-blue-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {tab.name} ({tab.count})
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <UpgradeBanner />

                        <div className="p-4 sm:p-6 space-y-6">
                            <FilterBar />

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-700 font-medium mb-2 sm:mb-0">
                                    {products?.length || 0} Produk
                                </p>
                                <div className="flex items-center space-x-2">
                                    {/* ... (Tombol View Mode) ... */}
                                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`} aria-label="List view"> <List size={20} /> </button>
                                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`} aria-label="Grid view"> <Grid size={20} /> </button>
                                </div>
                            </div>

                            {/* --- PASSING PROPS KE KOMPONEN ANAK --- */}
                            {viewMode === 'list' ? (
                                <ProductTable products={products} onDeleteClick={handleOpenDeleteModal} />
                            ) : (
                                <ProductGrid products={products} onDeleteClick={handleOpenDeleteModal} />
                            )}
                            {/* ------------------------------------ */}

                        </div>
                    </div>
                </div>
            </div>

            {/* --- RENDER MODAL DAN SNACKBAR --- */}
            {snackbar.isOpen && (
                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    isOpen={snackbar.isOpen}
                    onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
                />
            )}
            {loading && <Loading />}

            <DeleteProductModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteProduct}
                productName={productToDelete?.name || ''}
            />
            {/* ---------------------------------- */}
        </MyStoreLayout>
    );
};

export default ProductPage;