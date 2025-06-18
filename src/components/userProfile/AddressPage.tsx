import React from 'react'

const AddressPage = () => {
    const addresses = [
        { id: 1, name: 'Irvan Mamala', phone: '(+62) 853 9433 3301', full: 'Jalan Rajawali 1 Lrg 10 (Lorong 10 No. 60)', area: 'MARISO, KOTA MAKASSAR, SULAWESI SELATAN, ID, 90123', isPrimary: true, tags: [] },
        { id: 2, name: 'Irvan Mamala', phone: '(+62) 853 9433 3301', full: 'Jalan Rajawali 1 Lorong 10 No. 60 Makassar', area: 'MARISO, KOTA MAKASSAR, SULAWESI SELATAN, ID, 90123', isPrimary: false, tags: ['Alamat Toko', 'Alamat pengembalian'] },
        { id: 3, name: 'Mamala Software', phone: '(+62) 853 9433 3301', full: 'Jalan Rajawali 1, Lrg 10 No 62 Makassar', area: 'MARISO, KOTA MAKASSAR, SULAWESI SELATAN, ID, 90121', isPrimary: false, tags: [] },
    ];

    return (
        <div className="w-full">
            <div className="flex justify-end mb-6">
                <button className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition font-semibold flex items-center gap-2">
                    <span className="text-xl">+</span> Tambah Alamat Baru
                </button>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Alamat</h3>
                <div className="space-y-4">
                    {addresses.map(address => (
                        <div key={address.id} className="border-t pt-4 flex flex-col md:flex-row gap-4">
                            <div className="flex-grow space-y-1 text-sm text-gray-700">
                                <div className="flex items-baseline">
                                    <span className="font-semibold text-gray-800">{address.name}</span>
                                    <div className="w-px h-4 bg-gray-300 mx-3"></div>
                                    <span>{address.phone}</span>
                                </div>
                                <p>{address.full}</p>
                                <p>{address.area}</p>
                                <div className="flex gap-2 mt-1">
                                    {address.isPrimary && <span className="text-red-500 border border-red-500 text-xs px-2 py-0.5 rounded-sm">Utama</span>}
                                    {address.tags.map(tag => <span key={tag} className="text-gray-500 border border-gray-300 text-xs px-2 py-0.5 rounded-sm">{tag}</span>)}
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-end gap-2">
                                <div className="flex gap-4">
                                    <button className="text-blue-600 text-sm hover:underline">Ubah</button>
                                    {!address.isPrimary && <button className="text-blue-600 text-sm hover:underline">Hapus</button>}
                                </div>
                                <button className="border border-gray-300 rounded px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition">Atur sebagai utama</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddressPage