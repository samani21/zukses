import { create } from 'zustand';

type TipKey =
    | 'default'
    | 'photo'
    | 'promoPhoto'
    | 'video'
    | 'name'
    | 'category'
    | 'description'
    | 'brand'
    | 'variation'
    | 'priceStock'
    | 'weightDimension'
    | 'purchaseLimit'
    | 'dangerousGoods'
    | 'preorder'
    | 'condition'
    | 'sku'
    | 'cod'
    | 'schedule';

interface TipsState {
    tipKey: TipKey;
    setTipKey: (key: TipKey) => void;
}

export const useTipsStore = create<TipsState>((set) => ({
    tipKey: 'default',
    setTipKey: (key) => set({ tipKey: key }),
}));
