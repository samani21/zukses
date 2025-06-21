import React, { useEffect, useState } from 'react'
import UserProfile from '.'
import { ActionButtonContainer, ActionMobileContainer, ActionOrder, AmountMobile, ButtonAction, ButtonChat, ButtonColor, ButtonOutline, ButtonOutlineGray, ButtonViewShop, CardItemOrder, ContentItemOrder, ContentLeft, HeaderItemOrder, HeaderLeft, IconOrders, ImageItem, InfoItem, InformationOrder, InputSearch, ItemOrder, ListItemOrder, Menu, MenusContainer, Price, PriceAmount, PriceMobile, SatusMarket, SearchContainer, StatusOrders, Variant, VariaQty } from 'components/Profile/Orders'
import { useSearchParams } from 'next/navigation'

const menus = [
    'Semua',
    'Belum Bayar',
    'Sedang Dikemas',
    'Dikirim',
    'Selesai',
    'Dibatalkan',
    'Pengembalian Barang'
]
const itemOrder = [
    {
        'name_shop': 'WA SENDER BLAST PRO',
        'status': 5,
        'image': 'https://down-id.img.susercontent.com/file/id-11134207-7rbk0-m66okjp5j6vxdf',
        'name_item': 'ChatGPT Plus+ Premium 4.0 Private (Resmi OpenAI 1 Bulan)',
        'variant': '1 Bulan, Sharing 30 Hari',
        'qty': 1,
        'price_old': 374000,
        'price_new': 29000,
        'amount_price': 31000,
    },
    {
        'name_shop': 'ALFATH CLOTHES',
        'status_market': 'Star+',
        'status': 4,
        'image': 'https://down-id.img.susercontent.com/file/id-11134207-7r98z-lz4jpkap4r1kfa_tn',
        'name_item': 'Celana Pria Wanita UNISEX Panjang Jogger Training Trendy Trening Sport Running Olahraga Futsal Gym Badminton Kasual Santai Premium Joger Polos Bahan Babyterry Lari Jogging Jumbo Karet Tali Tebal Lembut Mewah Saku Fitnes Beby Terry',
        'variant': 'HITAM & ABU TUA,XXL',
        'qty': 1,
        'price_old': 80000,
        'price_new': 71250,
        'amount_price': 81697,
    },
    {
        'name_shop': 'Sport Galeri',
        'status_market': 'Mall',
        'status': 2,
        'image': 'https://down-id.img.susercontent.com/file/id-11134207-7r98s-ll4cc95qry3bab_tn',
        'name_item': 'SWEATPANTS JUMBO / JOGGER / SWEATPANTS / JOGGER PRIA DAN WANITA UKURAN JUMBO',
        'variant': 'GREYMARL',
        'qty': 1,
        'price_old': 97999,
        'price_new': 45000,
        'amount_price': 47300,
    }
]

const MyOrders = () => {
    const [menuActive, setMenuActive] = useState<string>('Semua');
    const formatRupiah = (value: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };
    const param = useSearchParams();
    useEffect(() => {
        if (param?.get('menu') === "Dikemas") {
            setMenuActive("Sedang Dikemas")
        } else if (param?.get('menu') === "Beri Penilaian") {
            setMenuActive("Selesai")
        } else {
            setMenuActive(param?.get('menu') || '')
        }
    }, [param])
    return (
        <UserProfile mode="my-orders">
            <MenusContainer>
                {
                    menus?.map((mn, i) => (
                        <Menu key={i} className={menuActive === mn ? 'active' : ''} onClick={() => setMenuActive(mn)}><p>{mn}</p></Menu>
                    ))
                }
            </MenusContainer>
            <SearchContainer>
                <IconOrders src='/icon-old/search-gray.svg' className='image-gray' />
                <IconOrders src='/icon-old/search-black.svg' className='image-black' />
                <InputSearch placeholder='Kamu bisa cari berdasarkan Nama Penjual, No. Pesanan atau Nama Produk' />
            </SearchContainer>
            <ListItemOrder>
                {
                    itemOrder?.map((io, index) => (
                        <CardItemOrder key={index}>
                            <ItemOrder>
                                <HeaderItemOrder>
                                    <HeaderLeft>
                                        {
                                            io?.status_market ?
                                                io?.status_market == 'Mall' ?
                                                    <IconOrders src='/icon-old/mall.svg' /> :
                                                    <SatusMarket>
                                                        {io?.status_market}
                                                    </SatusMarket> :
                                                <IconOrders src='/icon-old/market.svg' />
                                        }
                                        <b>{io?.name_shop}</b>
                                        <ButtonChat>
                                            <IconOrders src='/icon-old/entypo--chat.svg' width={20} />
                                            <span>Chat</span>
                                        </ButtonChat>
                                        <ButtonViewShop>
                                            <IconOrders src='/icon-old/market.svg' width={20} />
                                            <span>Kunjungi Toko</span>
                                        </ButtonViewShop>
                                    </HeaderLeft>
                                    <StatusOrders>
                                        {io?.status == 1 ? 'Belum Bayar' : io?.status == 2 ? 'Sedang Dikemas' : io?.status == 3 ? 'Dikirim' : io?.status == 4 ? 'Selesai' : io?.status == 5 ? 'Dibatalkan' : io?.status == 6 ? 'Pengembalian Barang' : ''}
                                    </StatusOrders>
                                </HeaderItemOrder>
                                <ContentItemOrder>
                                    <ContentLeft>
                                        <ImageItem src={io?.image} />
                                        <InfoItem>
                                            <span>{io?.name_item}</span>
                                            <VariaQty>
                                                <Variant>
                                                    Variasi: {io?.variant}
                                                </Variant>
                                                x{io?.qty}
                                            </VariaQty>
                                            <PriceMobile>
                                                <div className='price-old'>
                                                    {formatRupiah(io?.price_old)}
                                                </div>
                                                <div className='price-new'>
                                                    {formatRupiah(io?.price_new)}
                                                </div>
                                            </PriceMobile>
                                        </InfoItem>
                                    </ContentLeft>
                                    <Price>
                                        <div className='price-old'>
                                            {formatRupiah(io?.price_old)}
                                        </div>
                                        <div className='price-new'>
                                            {formatRupiah(io?.price_new)}
                                        </div>
                                    </Price>
                                </ContentItemOrder>
                                <AmountMobile>
                                    <p>Total {io?.qty} produk: </p>
                                    <span>{formatRupiah(io?.qty * io?.price_new)}</span>
                                </AmountMobile>
                                <ActionMobileContainer>
                                    <ButtonOutlineGray>
                                        Lihat Penilaian
                                    </ButtonOutlineGray>
                                    <ButtonOutline>
                                        Beli Lagi
                                    </ButtonOutline>
                                </ActionMobileContainer>
                            </ItemOrder>
                            <PriceAmount>
                                Total Pesanan: <span> {formatRupiah(io?.amount_price)}</span>
                            </PriceAmount>
                            <ActionOrder>
                                <InformationOrder>
                                    Dibatalkan secara otomatis oleh sistem Zukses
                                </InformationOrder>
                                <ActionButtonContainer>
                                    <ButtonColor>
                                        Beli Lagi
                                    </ButtonColor>
                                    <ButtonAction>
                                        Tampilkan Rinician Pembatalan
                                    </ButtonAction>
                                    <ButtonAction>
                                        Hubungi Penjual
                                    </ButtonAction>
                                </ActionButtonContainer>
                            </ActionOrder>
                        </CardItemOrder>
                    ))
                }
            </ListItemOrder>
        </UserProfile>
    )
}

export default MyOrders