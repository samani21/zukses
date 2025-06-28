import { AxiosError } from 'axios';
import Loading from 'components/Loading';
import AddProductForm from 'components/my-store/product/AddProductForm';
import FilterBar from 'components/my-store/product/FilterBar';
import PageHeader from 'components/my-store/product/PageHeader';
import ProductGrid from 'components/my-store/product/ProductGrid';
import ProductTable from 'components/my-store/product/ProductTable';
import UpgradeBanner from 'components/my-store/product/UpgradeBanner';
import Snackbar from 'components/Snackbar';
import { Grid, List } from 'lucide-react';
import MyStoreLayout from 'pages/layouts/MyStoreLayout';
import React, { useEffect, useState } from 'react'; // Menghapus useEffect karena tidak lagi diperlukan
import Get from 'services/api/Get';
import Post from 'services/api/Post';
import { Response } from 'services/api/types';

type Media = { id: string; url: string; type: string; };
type VarianPrice = { id: number; product_id: number; image: string; price: number | string; stock: number; variant_code?: string; };
type Value = { id: number; variant_id: number; value: string; ordinal: number; }
type Variant = { id: number; product_id: number; ordinal: number; values?: Value[] | null; };
type Product = { id: number; saller_id: number; name: string; category_id: number; category_name: string; is_used: number; price: number; stock: number; sales: number; desc: string; sku: string; min_purchase: number; max_purchase: string | number; image_url: string; media?: Media[] | null; status: string; variant_prices?: VarianPrice[] | null; variants?: Variant[]; variant_group_names?: string[]; };



// ============================================================================
// DATA DUMMY
// Data ini konstan dan tidak berubah, jadi bisa diletakkan di luar komponen.
// ============================================================================


// 1. Mengganti nama komponen dari 'product' menjadi 'ProductPage' (PascalCase)
//    Ini adalah konvensi standar untuk komponen React.
const ProductPage = () => {
    const [activeTab, setActiveTab] = useState<string>('Semua');
    const [view, setView] = useState<'list' | 'form'>('list');
    // 2. Inisialisasi state langsung dengan data dummy.
    //    Tidak perlu menggunakan useState(null) dan useEffect untuk data statis.
    const [products, setProducts] = useState<Product[] | null>(null);
    const [dataProduct, setDataProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{
        message: string;
        type?: 'success' | 'error' | 'info';
        isOpen: boolean;
    }>({ message: '', type: 'info', isOpen: false });
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const tabs = [
        // Menggunakan products.length langsung karena state sudah diinisialisasi
        { name: 'Semua', count: products?.length },
        { name: 'Tambah Stok', count: 0 },
        { name: 'Tinjau Rincian Produk', count: 0 },
    ];


    const handleSaveProduct = async (form: FormData) => {
        try {
            if (dataProduct) {
                const res = await Post<Response>('zukses', `product/${dataProduct?.id}`, form)
                if (res?.data?.status === 'success') {
                    setSnackbar({ message: 'Data berhasil disimpan!', type: 'success', isOpen: true })
                    getProduct()
                    setView('list');
                }
            } else {
                const res = await Post<Response>('zukses', `product`, form)
                if (res?.data?.status === 'success') {
                    setSnackbar({ message: 'Data berhasil disimpan!', type: 'success', isOpen: true })
                    getProduct()
                    setView('list');
                }
            }

        } catch (err) {
            setLoading(false)
            const error = err as AxiosError<{ message?: string }>
            setSnackbar({ message: error.response?.data?.message || 'Terjadi kesalahan', type: 'error', isOpen: true })
        }
    };
    const getProduct = async () => {
        setLoading(true)
        const res = await Get<Response>('zukses', `product/show`)
        console.log('res', res)
        if (res?.status === 'success' && Array.isArray(res.data)) {
            const data = res?.data as Product[];
            setProducts(data)
            setLoading(false)
        } else {
            console.warn('User profile tidak ditemukan atau gagal diambil')
        }
    }

    const handelEdit = (data: Product) => {
        setDataProduct(data)
        setView('form')
    }
    useEffect(() => {
        getProduct()
    }, [])
    return (
        <MyStoreLayout>
            {
                view == 'form' ? <AddProductForm onSave={handleSaveProduct} onCancel={() => setView('list')} dataProduct={dataProduct} /> :
                    <div className="bg-gray-50 min-h-screen font-sans">
                        <PageHeader setView={setView} />
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-white rounded-lg shadow-sm w-full">
                                <div className="border-b border-gray-200">
                                    <nav className="flex flex-wrap -mb-px space-x-4 sm:space-x-6 px-4 sm:px-6">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.name}
                                                onClick={() => setActiveTab(tab.name)}
                                                className={`py-4 px-1 text-sm font-medium transition-colors duration-200
                                        ${activeTab === tab.name
                                                        ? 'border-b-2 border-blue-500 text-blue-600'
                                                        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                {/* 3. Menghilangkan optional chaining (?) karena 'products' tidak akan pernah null */}
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
                                            {products?.length} Product
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                                                aria-label="List view"
                                            >
                                                <List size={20} />
                                            </button>
                                            <button
                                                onClick={() => setViewMode('grid')}
                                                className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                                                aria-label="Grid view"
                                            >
                                                <Grid size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* 4. Menghilangkan nullish coalescing (?? null) karena 'products' tidak pernah null */}
                                    {viewMode === 'list' ? (
                                        <ProductTable products={products} handelEdit={handelEdit} />
                                    ) : (
                                        <ProductGrid products={products} handelEdit={handelEdit} />
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
            }
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
            {
                loading && <Loading />
            }
        </MyStoreLayout>
    );
}

// Mengganti nama export default sesuai nama komponen
export default ProductPage;