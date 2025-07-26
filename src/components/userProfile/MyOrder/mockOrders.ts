// src/mocks/mockOrders.ts

export interface ProductVariant {
    variant: string;
    option: string;
}

export interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    variant: ProductVariant[];
}

export interface Order {
    id: string;
    storeName: string;
    status: 'SELESAI' | 'DIBATALKAN' | 'BELUM_BAYAR' | 'SEDANG_DIKEMAS' | 'DIKIRIM' | 'PENGEMBALIAN';
    products: Product[];
    totalPrice: number;
    receiver?: string;
    arrived?: boolean
}
export const mockOrders: Order[] = [
    {
        id: 'ORDER-200',
        storeName: 'Toko AF',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-200",
                "name": "Kursi Gaming Ergonomis",
                "image": "/image/image 13.png",
                "price": 1975316,
                "quantity": 4,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    },
                    {
                        "variant": "Warna",
                        "option": "Hijau"
                    }
                ]
            }
        ],
        totalPrice: 7901264,
    },
    {
        id: 'ORDER-201',
        storeName: 'Toko BG',
        status: 'DIKIRIM',
        products: [
            {
                "id": "PROD-201",
                "name": "Kursi Gaming Ergonomis",
                "image": "/image/image 13.png",
                "price": 2132891,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "Kecil"
                    }
                ]
            }
        ],
        arrived: false,
        totalPrice: 10664455,
    },
    {
        id: 'ORDER-202',
        storeName: 'Toko CH',
        status: 'PENGEMBALIAN',
        products: [
            {
                "id": "PROD-202",
                "name": "Kursi Gaming Ergonomis",
                "image": "/image/image 13.png",
                "price": 873863,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Kuning"
                    },
                    {
                        "variant": "Ukuran",
                        "option": "XXL"
                    }
                ]
            }
        ],
        totalPrice: 4369315,
    },
    {
        id: 'ORDER-203',
        storeName: 'Toko DI',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-203",
                "name": "Sepatu Sneakers Casual",
                "image": "/image/image 13.png",
                "price": 2148499,
                "quantity": 8,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Hitam"
                    },
                    {
                        "variant": "Ukuran",
                        "option": "Besar"
                    }
                ]
            }
        ],
        totalPrice: 17187992,
    },
    {
        id: 'ORDER-204',
        storeName: 'Toko EJ',
        status: 'BELUM_BAYAR',
        products: [
            {
                "id": "PROD-204",
                "name": "Tas Ransel Waterproof",
                "image": "/image/image 13.png",
                "price": 165492,
                "quantity": 7,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Plastik"
                    },
                    {
                        "variant": "Ukuran",
                        "option": "XL"
                    }
                ]
            }
        ],
        totalPrice: 1158444,
    },
    {
        id: 'ORDER-205',
        storeName: 'Toko FK',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-205",
                "name": "Rak Bumbu Dapur Multifungsi 2 susun",
                "image": "/image/image 13.png",
                "price": 2066167,
                "quantity": 3,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Plastik"
                    }
                ]
            }
        ],
        totalPrice: 6198501,
    },
    {
        id: 'ORDER-206',
        storeName: 'Toko GL',
        status: 'DIBATALKAN',
        products: [
            {
                "id": "PROD-206",
                "name": "Topi Baseball Polos",
                "image": "/image/image 13.png",
                "price": 1715188,
                "quantity": 1,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Hijau"
                    },
                    {
                        "variant": "Ukuran",
                        "option": "XXL"
                    }
                ]
            }
        ],
        totalPrice: 1715188,
    },
    {
        id: 'ORDER-207',
        storeName: 'Toko HM',
        status: 'PENGEMBALIAN',
        products: [
            {
                "id": "PROD-207",
                "name": "Meja Lipat Serbaguna",
                "image": "/image/image 13.png",
                "price": 1105337,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Biru"
                    },
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    }
                ]
            }
        ],
        totalPrice: 5526685,
    },
    {
        id: 'ORDER-208',
        storeName: 'Toko IN',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-208",
                "name": "Sepatu Sneakers Casual",
                "image": "/image/image 13.png",
                "price": 168324,
                "quantity": 1,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Biru"
                    },
                    {
                        "variant": "Bahan",
                        "option": "Kayu"
                    }
                ]
            }
        ],
        totalPrice: 168324,
    },
    {
        id: 'ORDER-209',
        storeName: 'Toko JO',
        status: 'BELUM_BAYAR',
        products: [
            {
                "id": "PROD-209",
                "name": "Headset Bluetooth Noise Cancelling",
                "image": "/image/image 13.png",
                "price": 1921362,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Plastik"
                    },
                    {
                        "variant": "Ukuran",
                        "option": "Sedang"
                    }
                ]
            }
        ],
        totalPrice: 9606810,
    },
    {
        id: 'ORDER-210',
        storeName: 'Toko KP',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-210",
                "name": "Sepatu Sneakers Casual",
                "image": "/image/image 13.png",
                "price": 1604848,
                "quantity": 7,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Hitam"
                    }
                ]
            }
        ],
        totalPrice: 11233936,
        receiver: 'Tari',
    },
    {
        id: 'ORDER-211',
        storeName: 'Toko LQ',
        status: 'PENGEMBALIAN',
        products: [
            {
                "id": "PROD-211",
                "name": "Jam Tangan Digital LED",
                "image": "/image/image 13.png",
                "price": 815764,
                "quantity": 10,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "Sedang"
                    },
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    }
                ]
            }
        ],
        totalPrice: 8157640,
        receiver: 'Siti',
    },
    {
        id: 'ORDER-212',
        storeName: 'Toko MR',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-212",
                "name": "Kemko Pendek Motif/Kemeja Qurta/Pakaian Muslim",
                "image": "/image/image 13.png",
                "price": 147121,
                "quantity": 6,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Logam"
                    },
                    {
                        "variant": "Warna",
                        "option": "Kuning"
                    }
                ]
            }
        ],
        totalPrice: 882726,
    },
    {
        id: 'ORDER-213',
        storeName: 'Toko NS',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-213",
                "name": "Headset Bluetooth Noise Cancelling",
                "image": "/image/image 13.png",
                "price": 883045,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "XXL"
                    }
                ]
            }
        ],
        totalPrice: 4415225,
    },
    {
        id: 'ORDER-214',
        storeName: 'Toko OT',
        status: 'DIKIRIM',
        products: [
            {
                "id": "PROD-214",
                "name": "Headset Bluetooth Noise Cancelling",
                "image": "/image/image 13.png",
                "price": 2657249,
                "quantity": 10,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "XL"
                    },
                    {
                        "variant": "Warna",
                        "option": "Biru"
                    }
                ]
            }
        ],
        arrived: true,
        totalPrice: 26572490,
        receiver: 'Budi',
    },
    {
        id: 'ORDER-215',
        storeName: 'Toko PU',
        status: 'DIKIRIM',
        products: [
            {
                "id": "PROD-215",
                "name": "Topi Baseball Polos",
                "image": "/image/image 13.png",
                "price": 2192718,
                "quantity": 2,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Hitam"
                    }
                ]
            }
        ],
        arrived: false,
        totalPrice: 4385436,
    },
    {
        id: 'ORDER-216',
        storeName: 'Toko QV',
        status: 'DIKIRIM',
        products: [
            {
                "id": "PROD-216",
                "name": "Blender Portable USB",
                "image": "/image/image 13.png",
                "price": 1568138,
                "quantity": 4,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Hitam"
                    }
                ]
            }
        ],
        arrived: true,
        totalPrice: 6272552,
        receiver: 'John Doe',
    },
    {
        id: 'ORDER-217',
        storeName: 'Toko RW',
        status: 'DIBATALKAN',
        products: [
            {
                "id": "PROD-217",
                "name": "Jam Tangan Digital LED",
                "image": "/image/image 13.png",
                "price": 2047401,
                "quantity": 7,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Putih"
                    },
                    {
                        "variant": "Ukuran",
                        "option": "XXL"
                    }
                ]
            }
        ],
        totalPrice: 14331807,
        receiver: 'John Doe',
    },
    {
        id: 'ORDER-218',
        storeName: 'Toko SX',
        status: 'PENGEMBALIAN',
        products: [
            {
                "id": "PROD-218",
                "name": "Kursi Gaming Ergonomis",
                "image": "/image/image 13.png",
                "price": 2929165,
                "quantity": 1,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "Kecil"
                    }
                ]
            }
        ],
        totalPrice: 2929165,
        receiver: 'John Doe',
    },
    {
        id: 'ORDER-219',
        storeName: 'Toko TY',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-219",
                "name": "Kursi Gaming Ergonomis",
                "image": "/image/image 13.png",
                "price": 1204329,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Biru"
                    },
                    {
                        "variant": "Ukuran",
                        "option": "XXL"
                    }
                ]
            }
        ],
        totalPrice: 6021645,
    },
    {
        id: 'ORDER-220',
        storeName: 'Toko UZ',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-220",
                "name": "Meja Lipat Serbaguna",
                "image": "/image/image 13.png",
                "price": 2766865,
                "quantity": 10,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Biru"
                    },
                    {
                        "variant": "Bahan",
                        "option": "Plastik"
                    }
                ]
            }
        ],
        totalPrice: 27668650,
        receiver: 'Tari',
    },
    {
        id: 'ORDER-221',
        storeName: 'Toko VA',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-221",
                "name": "Kemko Pendek Motif/Kemeja Qurta/Pakaian Muslim",
                "image": "/image/image 13.png",
                "price": 2349864,
                "quantity": 3,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Biru"
                    }
                ]
            }
        ],
        totalPrice: 7049592,
        receiver: 'John Doe',
    },
    {
        id: 'ORDER-222',
        storeName: 'Toko WB',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-222",
                "name": "Kursi Gaming Ergonomis",
                "image": "/image/image 13.png",
                "price": 2266978,
                "quantity": 7,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Kuning"
                    },
                    {
                        "variant": "Bahan",
                        "option": "Kayu"
                    }
                ]
            }
        ],
        totalPrice: 15868846,
    },
    {
        id: 'ORDER-223',
        storeName: 'Toko XC',
        status: 'DIBATALKAN',
        products: [
            {
                "id": "PROD-223",
                "name": "Rak Bumbu Dapur Multifungsi 2 susun",
                "image": "/image/image 13.png",
                "price": 2159881,
                "quantity": 8,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    },
                    {
                        "variant": "Ukuran",
                        "option": "Sedang"
                    }
                ]
            }
        ],
        totalPrice: 17279048,
    },
    {
        id: 'ORDER-224',
        storeName: 'Toko YD',
        status: 'DIKIRIM',
        products: [
            {
                "id": "PROD-224",
                "name": "Sepatu Sneakers Casual",
                "image": "/image/image 13.png",
                "price": 1301818,
                "quantity": 8,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kayu"
                    },
                    {
                        "variant": "Warna",
                        "option": "Biru"
                    }
                ]
            }
        ],
        arrived: true,
        totalPrice: 10414544,
    },
    {
        id: 'ORDER-225',
        storeName: 'Toko ZE',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-225",
                "name": "Kemko Pendek Motif/Kemeja Qurta/Pakaian Muslim",
                "image": "/image/image 13.png",
                "price": 2344442,
                "quantity": 7,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Logam"
                    },
                    {
                        "variant": "Warna",
                        "option": "Kuning"
                    }
                ]
            }
        ],
        totalPrice: 16411094,
    },
    {
        id: 'ORDER-226',
        storeName: 'Toko AF',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-226",
                "name": "Kemko Pendek Motif/Kemeja Qurta/Pakaian Muslim",
                "image": "/image/image 13.png",
                "price": 2128049,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Plastik"
                    },
                    {
                        "variant": "Ukuran",
                        "option": "Kecil"
                    }
                ]
            }
        ],
        totalPrice: 10640245,
    },
    {
        id: 'ORDER-227',
        storeName: 'Toko BG',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-227",
                "name": "Topi Baseball Polos",
                "image": "/image/image 13.png",
                "price": 954519,
                "quantity": 10,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "XL"
                    },
                    {
                        "variant": "Bahan",
                        "option": "Kayu"
                    }
                ]
            }
        ],
        totalPrice: 9545190,
    },
    {
        id: 'ORDER-228',
        storeName: 'Toko CH',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-228",
                "name": "Topi Baseball Polos",
                "image": "/image/image 13.png",
                "price": 1712578,
                "quantity": 3,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    }
                ]
            }
        ],
        totalPrice: 5137734,
        receiver: 'Siti',
    },
    {
        id: 'ORDER-229',
        storeName: 'Toko DI',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-229",
                "name": "Kursi Gaming Ergonomis",
                "image": "/image/image 13.png",
                "price": 2683753,
                "quantity": 4,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "Sedang"
                    },
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    }
                ]
            }
        ],
        totalPrice: 10735012,
        receiver: 'John Doe',
    },
    {
        id: 'ORDER-230',
        storeName: 'Toko EJ',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-230",
                "name": "Rak Bumbu Dapur Multifungsi 2 susun",
                "image": "/image/image 13.png",
                "price": 1953331,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    },
                    {
                        "variant": "Warna",
                        "option": "Putih"
                    }
                ]
            }
        ],
        totalPrice: 9766655,
        receiver: 'John Doe',
    },
    {
        id: 'ORDER-231',
        storeName: 'Toko FK',
        status: 'PENGEMBALIAN',
        products: [
            {
                "id": "PROD-231",
                "name": "Kursi Gaming Ergonomis",
                "image": "/image/image 13.png",
                "price": 2048157,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    },
                    {
                        "variant": "Warna",
                        "option": "Putih"
                    }
                ]
            }
        ],
        totalPrice: 10240785,
    },
    {
        id: 'ORDER-232',
        storeName: 'Toko GL',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-232",
                "name": "Rak Bumbu Dapur Multifungsi 2 susun",
                "image": "/image/image 13.png",
                "price": 1037217,
                "quantity": 3,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Kuning"
                    },
                    {
                        "variant": "Bahan",
                        "option": "Kayu"
                    }
                ]
            }
        ],
        totalPrice: 3111651,
        receiver: 'Irvan Mamala',
    },
    {
        id: 'ORDER-233',
        storeName: 'Toko HM',
        status: 'BELUM_BAYAR',
        products: [
            {
                "id": "PROD-233",
                "name": "Kursi Gaming Ergonomis",
                "image": "/image/image 13.png",
                "price": 400971,
                "quantity": 4,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Biru"
                    }
                ]
            }
        ],
        totalPrice: 1603884,
    },
    {
        id: 'ORDER-234',
        storeName: 'Toko IN',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-234",
                "name": "Tas Ransel Waterproof",
                "image": "/image/image 13.png",
                "price": 527087,
                "quantity": 4,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    },
                    {
                        "variant": "Warna",
                        "option": "Merah"
                    }
                ]
            }
        ],
        totalPrice: 2108348,
        receiver: 'Siti',
    },
    {
        id: 'ORDER-235',
        storeName: 'Toko JO',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-235",
                "name": "Meja Lipat Serbaguna",
                "image": "/image/image 13.png",
                "price": 2811162,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    }
                ]
            }
        ],
        totalPrice: 14055810,
        receiver: 'Irvan Mamala',
    },
    {
        id: 'ORDER-236',
        storeName: 'Toko KP',
        status: 'PENGEMBALIAN',
        products: [
            {
                "id": "PROD-236",
                "name": "Rak Bumbu Dapur Multifungsi 2 susun",
                "image": "/image/image 13.png",
                "price": 2307737,
                "quantity": 6,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Biru"
                    },
                    {
                        "variant": "Bahan",
                        "option": "Kayu"
                    }
                ]
            }
        ],
        totalPrice: 13846422,
    },
    {
        id: 'ORDER-237',
        storeName: 'Toko LQ',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-237",
                "name": "Kursi Gaming Ergonomis",
                "image": "/image/image 13.png",
                "price": 232940,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Logam"
                    },
                    {
                        "variant": "Warna",
                        "option": "Hitam"
                    }
                ]
            }
        ],
        totalPrice: 1164700,
        receiver: 'Irvan Mamala',
    },
    {
        id: 'ORDER-238',
        storeName: 'Toko MR',
        status: 'PENGEMBALIAN',
        products: [
            {
                "id": "PROD-238",
                "name": "Jam Tangan Digital LED",
                "image": "/image/image 13.png",
                "price": 1061599,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kayu"
                    }
                ]
            }
        ],
        totalPrice: 5307995,
    },
    {
        id: 'ORDER-239',
        storeName: 'Toko NS',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-239",
                "name": "Tas Ransel Waterproof",
                "image": "/image/image 13.png",
                "price": 1213719,
                "quantity": 4,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "Sedang"
                    },
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    }
                ]
            }
        ],
        totalPrice: 4854876,
    },
    {
        id: 'ORDER-240',
        storeName: 'Toko OT',
        status: 'DIBATALKAN',
        products: [
            {
                "id": "PROD-240",
                "name": "Jam Tangan Digital LED",
                "image": "/image/image 13.png",
                "price": 2759110,
                "quantity": 8,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "Besar"
                    }
                ]
            }
        ],
        totalPrice: 22072880,
    },
    {
        id: 'ORDER-241',
        storeName: 'Toko PU',
        status: 'DIBATALKAN',
        products: [
            {
                "id": "PROD-241",
                "name": "Tas Ransel Waterproof",
                "image": "/image/image 13.png",
                "price": 251054,
                "quantity": 8,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "Kecil"
                    },
                    {
                        "variant": "Warna",
                        "option": "Hijau"
                    }
                ]
            }
        ],
        totalPrice: 2008432,
    },
    {
        id: 'ORDER-242',
        storeName: 'Toko QV',
        status: 'PENGEMBALIAN',
        products: [
            {
                "id": "PROD-242",
                "name": "Rak Bumbu Dapur Multifungsi 2 susun",
                "image": "/image/image 13.png",
                "price": 2578215,
                "quantity": 1,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "XXL"
                    }
                ]
            }
        ],
        totalPrice: 2578215,
        receiver: 'Irvan Mamala',
    },
    {
        id: 'ORDER-243',
        storeName: 'Toko RW',
        status: 'DIBATALKAN',
        products: [
            {
                "id": "PROD-243",
                "name": "Rak Bumbu Dapur Multifungsi 2 susun",
                "image": "/image/image 13.png",
                "price": 138559,
                "quantity": 1,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "Sedang"
                    },
                    {
                        "variant": "Bahan",
                        "option": "Logam"
                    }
                ]
            }
        ],
        totalPrice: 138559,
        receiver: 'Siti',
    },
    {
        id: 'ORDER-244',
        storeName: 'Toko SX',
        status: 'DIKIRIM',
        products: [
            {
                "id": "PROD-244",
                "name": "Jam Tangan Digital LED",
                "image": "/image/image 13.png",
                "price": 1811009,
                "quantity": 1,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "Besar"
                    },
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    }
                ]
            }
        ],
        arrived: false,
        totalPrice: 1811009,
        receiver: 'Tari',
    },
    {
        id: 'ORDER-245',
        storeName: 'Toko TY',
        status: 'DIBATALKAN',
        products: [
            {
                "id": "PROD-245",
                "name": "Headset Bluetooth Noise Cancelling",
                "image": "/image/image 13.png",
                "price": 2801821,
                "quantity": 1,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    },
                    {
                        "variant": "Ukuran",
                        "option": "XXL"
                    }
                ]
            }
        ],
        totalPrice: 2801821,
    },
    {
        id: 'ORDER-246',
        storeName: 'Toko UZ',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-246",
                "name": "Kemko Pendek Motif/Kemeja Qurta/Pakaian Muslim",
                "image": "/image/image 13.png",
                "price": 300034,
                "quantity": 3,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "Besar"
                    }
                ]
            }
        ],
        totalPrice: 900102,
    },
    {
        id: 'ORDER-247',
        storeName: 'Toko VA',
        status: 'DIBATALKAN',
        products: [
            {
                "id": "PROD-247",
                "name": "Sepatu Sneakers Casual",
                "image": "/image/image 13.png",
                "price": 1749118,
                "quantity": 2,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Kuning"
                    },
                    {
                        "variant": "Ukuran",
                        "option": "Sedang"
                    }
                ]
            }
        ],
        totalPrice: 3498236,
        receiver: 'Siti',
    },
    {
        id: 'ORDER-248',
        storeName: 'Toko WB',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-248",
                "name": "Kemko Pendek Motif/Kemeja Qurta/Pakaian Muslim",
                "image": "/image/image 13.png",
                "price": 1345078,
                "quantity": 10,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Putih"
                    }
                ]
            }
        ],
        totalPrice: 13450780,
    },
    {
        id: 'ORDER-249',
        storeName: 'Toko XC',
        status: 'DIBATALKAN',
        products: [
            {
                "id": "PROD-249",
                "name": "Blender Portable USB",
                "image": "/image/image 13.png",
                "price": 406441,
                "quantity": 4,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "Kecil"
                    },
                    {
                        "variant": "Bahan",
                        "option": "Kayu"
                    }
                ]
            }
        ],
        totalPrice: 1625764,
        receiver: 'Budi',
    },
    {
        id: 'ORDER-250',
        storeName: 'Toko YD',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-250",
                "name": "Tas Ransel Waterproof",
                "image": "/image/image 13.png",
                "price": 2201271,
                "quantity": 10,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    },
                    {
                        "variant": "Warna",
                        "option": "Putih"
                    }
                ]
            }
        ],
        totalPrice: 22012710,
    },
    {
        id: 'ORDER-251',
        storeName: 'Toko ZE',
        status: 'BELUM_BAYAR',
        products: [
            {
                "id": "PROD-251",
                "name": "Headset Bluetooth Noise Cancelling",
                "image": "/image/image 13.png",
                "price": 1498917,
                "quantity": 3,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Logam"
                    },
                    {
                        "variant": "Warna",
                        "option": "Merah"
                    }
                ]
            }
        ],
        totalPrice: 4496751,
    },
    {
        id: 'ORDER-252',
        storeName: 'Toko AF',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-252",
                "name": "Headset Bluetooth Noise Cancelling",
                "image": "/image/image 13.png",
                "price": 2045166,
                "quantity": 2,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "XXL"
                    }
                ]
            }
        ],
        totalPrice: 4090332,
        receiver: 'John Doe',
    },
    {
        id: 'ORDER-253',
        storeName: 'Toko BG',
        status: 'DIBATALKAN',
        products: [
            {
                "id": "PROD-253",
                "name": "Headset Bluetooth Noise Cancelling",
                "image": "/image/image 13.png",
                "price": 2797762,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    }
                ]
            }
        ],
        totalPrice: 13988810,
        receiver: 'Irvan Mamala',
    },
    {
        id: 'ORDER-254',
        storeName: 'Toko CH',
        status: 'SEDANG_DIKEMAS',
        products: [
            {
                "id": "PROD-254",
                "name": "Jam Tangan Digital LED",
                "image": "/image/image 13.png",
                "price": 287347,
                "quantity": 5,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    }
                ]
            }
        ],
        totalPrice: 1436735,
        receiver: 'Budi',
    },
    {
        id: 'ORDER-255',
        storeName: 'Toko DI',
        status: 'PENGEMBALIAN',
        products: [
            {
                "id": "PROD-255",
                "name": "Topi Baseball Polos",
                "image": "/image/image 13.png",
                "price": 2741449,
                "quantity": 2,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Plastik"
                    }
                ]
            }
        ],
        totalPrice: 5482898,
        receiver: 'Budi',
    },
    {
        id: 'ORDER-256',
        storeName: 'Toko EJ',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-256",
                "name": "Headset Bluetooth Noise Cancelling",
                "image": "/image/image 13.png",
                "price": 739784,
                "quantity": 9,
                "variant": [
                    {
                        "variant": "Ukuran",
                        "option": "XXL"
                    },
                    {
                        "variant": "Warna",
                        "option": "Hitam"
                    }
                ]
            }
        ],
        totalPrice: 6658056,
    },
    {
        id: 'ORDER-257',
        storeName: 'Toko FK',
        status: 'SELESAI',
        products: [
            {
                "id": "PROD-257",
                "name": "Kemko Pendek Motif/Kemeja Qurta/Pakaian Muslim",
                "image": "/image/image 13.png",
                "price": 2200282,
                "quantity": 2,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Kain"
                    }
                ]
            }
        ],
        totalPrice: 4400564,
    },
    {
        id: 'ORDER-258',
        storeName: 'Toko GL',
        status: 'DIKIRIM',
        products: [
            {
                "id": "PROD-258",
                "name": "Sepatu Sneakers Casual",
                "image": "/image/image 13.png",
                "price": 1795620,
                "quantity": 9,
                "variant": [
                    {
                        "variant": "Bahan",
                        "option": "Plastik"
                    },
                    {
                        "variant": "Ukuran",
                        "option": "Besar"
                    }
                ]
            }
        ],
        arrived: true,
        totalPrice: 16160580,
        receiver: 'John Doe',
    },
    {
        id: 'ORDER-259',
        storeName: 'Toko HM',
        status: 'DIBATALKAN',
        products: [
            {
                "id": "PROD-259",
                "name": "Jam Tangan Digital LED",
                "image": "/image/image 13.png",
                "price": 1542119,
                "quantity": 9,
                "variant": [
                    {
                        "variant": "Warna",
                        "option": "Putih"
                    }
                ]
            }
        ],
        totalPrice: 13879071,
        receiver: 'Irvan Mamala',
    },
];
