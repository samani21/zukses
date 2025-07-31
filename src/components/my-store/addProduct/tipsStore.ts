import { create } from 'zustand';

// Pastikan tipe ini di-EXPORT
export type TipKey = 'default' | 'photo' | 'video' | 'name' | 'category' | 'description' | 'brand' | 'variation' | 'priceStock' | 'purchaseLimit' | 'weightDimension' | 'dangerousGoods' | 'cod' | 'preorder' | 'condition' | 'sku' | 'schedule';

interface TipsState {
    tipKey: TipKey;
    setTipKey: (key: TipKey) => void;
}

export const useTipsStore = create<TipsState>((set) => ({
    tipKey: 'default',
    setTipKey: (key) => set({ tipKey: key }),
}));