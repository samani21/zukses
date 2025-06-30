import React from 'react'
import FormProduct from './FormProduct';


type Media = { id: string; url: string; type: string; };
type VarianPrice = { id: number; product_id: number; image: string; price: number | string; stock: number; variant_code?: string; };
type Value = { id: number; variant_id: number; value: string; ordinal: number; }
type Variant = { id: number; product_id: number; ordinal: number; values?: Value[] | null; };
type Product = { id: number; saller_id: number; name: string; category_id: number; category_name: string; is_used: number; price: number; stock: number; sales: number; desc: string; sku: string; min_purchase: number; max_purchase: string | number; image: string; media?: Media[] | null; status: string; variant_prices?: VarianPrice[] | null; variants?: Variant[]; variant_group_names?: string[]; };


type Props = {
    onSave: (formData: FormData) => void;
    onCancel: () => void;
    dataProduct: Product | null;
};

const AddProductForm: React.FC<Props> = ({ onSave, onCancel, dataProduct }) => {
    const handleSaveProduct = (formData: FormData) => {
        console.log("--- FORM DATA SIAP DIKIRIM KE BACKEND ---");
        console.log("---------------------------------------");
        // Di aplikasi nyata, Anda akan mengirim formData ini menggunakan fetch atau axios
        // Contoh: await fetch('/api/products', { method: 'POST', body: formData });
        onSave(formData)
    };

    const handleCancelForm = () => {
        console.log("Form cancelled.");
        onCancel()
    };

    console.log('dataProduct', dataProduct);

    return (
        <div className="bg-gray-100 w-full min-h-screen p-4 sm:p-8">
            <main className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Produk Baru</h1>
                <FormProduct onSave={handleSaveProduct} onCancel={handleCancelForm} productData={dataProduct} />
            </main>
        </div>
    );
};
export default AddProductForm