// components/ProductLinkModal.tsx
import { useState, useMemo } from "react";
import Image from "next/image";
import { Check, Search, X } from "lucide-react";

interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
}

interface ProductLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
}

export default function ProductLinkModal({
    isOpen,
    onClose,
    products,
}: ProductLinkModalProps) {
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const maxSelect = 5;

    const filteredProducts = useMemo(() => {
        return products.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, products]);

    const toggleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((pid) => pid !== id));
        } else if (selectedIds.length < maxSelect) {
            setSelectedIds([...selectedIds, id]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl w-[646px] max-h-[505px] flex flex-col rounde-[20px]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-[#DDDDDD] px-8">
                    <h2 className="font-bold text-[20px] text-[#000] tracking-[0]">Tambahkan Link Produk</h2>
                    <button onClick={onClose} className="text-gray-500 text-xl">
                        <X size={21} color="#1D1B20" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4  px-8 ">
                    <div className="w-full border h-[50px] border-[#ccc] bg-white gap-2 rounded-md px-3 py-2 text-sm outline-none flex items-center rounded-[8px]">
                        <Search size={20} strokeWidth={2} color="#888888" />
                        <input
                            type="text"
                            placeholder="Cari Produk"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className=""
                        />
                    </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-1">
                    {filteredProducts.map((p) => (
                        <div
                            key={p.id}
                            className="flex items-center gap-3 px-8 py-3  cursor-pointer hover:bg-gray-50 "
                            onClick={() => toggleSelect(p.id)}
                        >
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(p.id)}
                                    className="peer hidden"
                                    id="cod"
                                />
                                <span className={`${selectedIds.includes(p.id) ? 'w-[18px] h-[18px] rounded-[4px] border-2 border-[#52357B] bg-[#E7D6FF]' : 'w-[18px] h-[18px] border-2 border-[#888]'} flex items-center justify-center`}>
                                    {selectedIds.includes(p.id) ? <Check size={16} strokeWidth={4} /> : ''}

                                </span>
                            </label>
                            <Image
                                src={p.image}
                                alt={p.name}
                                width={40}
                                height={40}
                                className="rounded-[5px] border border-[#AAAAAA]"
                            />
                            <div className="flex flex-col text-sm">
                                <span className=" truncate w-full text-[#333333] text-[14px] tracking-[0]">{p.name}</span>
                                <span className="font-bold text-[14px]  text-black">
                                    Rp{parseInt(p.price).toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-8 ">
                    <button
                        className={`w-full py-3 rounded-[8px] text-black font-bold text-[16px] tracking-[0] ${selectedIds.length > 0
                            ? "bg-yellow-400 hover:bg-yellow-500"
                            : "bg-[#FFD400] "
                            }`}
                        disabled={selectedIds.length === 0}
                    >
                        Kirim Link Produk {selectedIds.length} / {maxSelect}
                    </button>
                </div>
            </div>
        </div>
    );
}
