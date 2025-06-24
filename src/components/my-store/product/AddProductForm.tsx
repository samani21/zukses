import React from 'react'
import FormProduct from './FormProduct';

type Props = {
    onSave: (formData: FormData) => void;
    onCancel: () => void;
};

const AddProductForm: React.FC<Props> = ({ onSave, onCancel }) => {
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

    return (
        <div className="bg-gray-100 w-full min-h-screen p-4 sm:p-8">
            <main className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Produk Baru</h1>
                <FormProduct onSave={handleSaveProduct} onCancel={handleCancelForm} />
            </main>
        </div>
    );
};
export default AddProductForm