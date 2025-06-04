import type { NextApiRequest, NextApiResponse } from 'next';

const mockAddresses = [
    {
        "nama": "Banjarmasin",
        "alamat": "Banjarmasin",
        "lokasi": {
            "lat": -3.3168684,
            "lng": 114.5901835
        }
    },
    {
        "nama": "Swiss-Belhotel Borneo Banjarmasin",
        "alamat": "Jalan P. Antasari No.86A, Pekapuran Laut",
        "lokasi": {
            "lat": -3.326694,
            "lng": 114.595864
        }
    },
    {
        "nama": "Blue Atlantic Hotel",
        "alamat": "Jalan P. Antasari No.18, Pekapuran Raya",
        "lokasi": {
            "lat": -3.3288865,
            "lng": 114.6018906
        }
    },
    {
        "nama": "Aquarius Hotel BJM",
        "alamat": "Jalan Lambung Mangkurat No.32 Kav. 1-3, Kertak Baru Ilir",
        "lokasi": {
            "lat": -3.3264846,
            "lng": 114.5904986
        }
    },
    {
        "nama": "Galaxy Hotel Banjarmasin",
        "alamat": "Jalan A. Yani KM 2,5 No.138, Sungai Baru",
        "lokasi": {
            "lat": -3.3244833,
            "lng": 114.6014561
        }
    },
    {
        "nama": "HOTEL VICTORIA Banjarmasin",
        "alamat": "Jalan Lambung Mangkurat No.48",
        "lokasi": {
            "lat": -3.3279608,
            "lng": 114.5898358
        }
    },
    {
        "nama": "Hotel Roditha Banjarmasin",
        "alamat": "Jalan P. Antasari No.41, Kelayan Luar",
        "lokasi": {
            "lat": -3.3274225,
            "lng": 114.5967373
        }
    },
    {
        "nama": "Harum Manis Toko",
        "alamat": "Jalan Pasar Baru No.71, Kertak Baru Ilir",
        "lokasi": {
            "lat": -3.32672,
            "lng": 114.593018
        }
    },
    {
        "nama": "OYO 2057 Hotel Kharisma",
        "alamat": "Jalan K. S. Tubun No.38 No.36",
        "lokasi": {
            "lat": -3.3298402,
            "lng": 114.5945261
        }
    },
    {
        "nama": "Gondola Inn",
        "alamat": "Jalan Lambung Mangkurat No.19 B, Kertak Baru Ilir",
        "lokasi": {
            "lat": -3.3273869,
            "lng": 114.5895427
        }
    },
    {
        "nama": "Kuripan Hotel",
        "alamat": "Jalan A. Yani No.40, Sungai Baru",
        "lokasi": {
            "lat": -3.323535,
            "lng": 114.599077
        }
    },
    {
        "nama": "@manx's Computer (Syifa Photo-Videography)",
        "alamat": "Kelayan Barat",
        "lokasi": {
            "lat": -3.3319392,
            "lng": 114.5947422
        }
    },
    {
        "nama": "PT. Panin Bank Tbk. KCP Pasar Baru",
        "alamat": "MHFR+2P9, Jalan Pasar Baru, Kertak Baru Ilir",
        "lokasi": {
            "lat": -3.3274609,
            "lng": 114.591858
        }
    },
    {
        "nama": "Cuci Sepeda Motor dan Helm H3",
        "alamat": "Jalan Kelayan A, Kelayan Dalam",
        "lokasi": {
            "lat": -3.3326855,
            "lng": 114.5966681
        }
    },
    {
        "nama": "Indomaret KS Tubun",
        "alamat": "MHCV+3X3, Kelayan Barat",
        "lokasi": {
            "lat": -3.3298554,
            "lng": 114.5949214
        }
    },
    {
        "nama": "J&T Express KS Tubun",
        "alamat": "Jalan K. S. Tubun No.2a, Kelayan Barat",
        "lokasi": {
            "lat": -3.329448299999999,
            "lng": 114.5955247
        }
    },
    {
        "nama": "Sekolah Dasar Negeri - Standar Nasional Kelayan Barat 2",
        "alamat": "Gang I Tentram Jalan K. S. Tubun No.8, Kelayan Barat",
        "lokasi": {
            "lat": -3.3312813,
            "lng": 114.5941038
        }
    },
    {
        "nama": "ATM BNI",
        "alamat": "MHCV+4R6, Jalan K. S. Tubun, Kelayan Barat",
        "lokasi": {
            "lat": -3.329704699999999,
            "lng": 114.5945075
        }
    },
    {
        "nama": "Daffa Pulsa",
        "alamat": "JL. Kelayan B Gang Baja, RT. 37 No. 49, 70247, Kelayan Tengah",
        "lokasi": {
            "lat": -3.333627,
            "lng": 114.595149
        }
    },
    {
        "nama": "ATM MANDIRI",
        "alamat": "MHCV+4Q6, Jalan K. S. Tubun, Kelayan Barat",
        "lokasi": {
            "lat": -3.3297178,
            "lng": 114.5943867
        }
    },
    {
        "nama": "Asosiasi Rieki Seluruh Indonesia (ARSI)",
        "alamat": "MJ65+82W, Pemurus Baru",
        "lokasi": {
            "lat": -3.339127,
            "lng": 114.607572
        }
    },
    {
        "nama": "Integrated Islamic Elementary School brotherhood Banjarmasin",
        "alamat": "Komplek Bumi Handayani 12A, Jalan Bumi Mas Raya No.RT.33 Km.4.5",
        "lokasi": {
            "lat": -3.3417512,
            "lng": 114.6074765
        }
    },
    {
        "nama": "UKHUWAH MART",
        "alamat": "MJ55+73C, Jl Tol Jalan Lingkar Dalam Selatan, Pemurus Baru",
        "lokasi": {
            "lat": -3.3418212,
            "lng": 114.6076275
        }
    },
    {
        "nama": "Nanda Natasya",
        "alamat": "Jalan Kelayan A No.28, Murung Raya",
        "lokasi": {
            "lat": -3.3434421,
            "lng": 114.5991276
        }
    },
    {
        "nama": "Megha Jam Ori",
        "alamat": "Jalan Pekapuran Raya Komplek Antasari Mandiri No.11, RT.024/RW.002, Pekapuran Raya",
        "lokasi": {
            "lat": -3.3354943,
            "lng": 114.6062403
        }
    },
    {
        "nama": "Faris Fried Chicken",
        "alamat": "Jalan Karya Sari No.70, Pekapuran Raya",
        "lokasi": {
            "lat": -3.3367789,
            "lng": 114.6076233
        }
    },
    {
        "nama": "Nadhifa Collection",
        "alamat": "MJ65+P9J, Jalan Prona 1, Pemurus Baru",
        "lokasi": {
            "lat": -3.338168,
            "lng": 114.608377
        }
    },
    {
        "nama": "Musholla Al Muhajirin",
        "alamat": "MJ45+Q33, Jalan Bumi Mas Raya, Pemurus Baru",
        "lokasi": {
            "lat": -3.3431081,
            "lng": 114.6076832
        }
    },
    {
        "nama": "Nix computer",
        "alamat": "Jalan Harmoni II",
        "lokasi": {
            "lat": -3.3372044,
            "lng": 114.60814
        }
    },
    {
        "nama": "Indomaret Fresh Pekapuran Raya",
        "alamat": "MJ75+M57, Pekapuran Raya",
        "lokasi": {
            "lat": -3.3358364,
            "lng": 114.6079205
        }
    },
    {
        "nama": "Pegadaian UPC Pekapuran",
        "alamat": "Jalan Harmoni II, Pekapuran Raya",
        "lokasi": {
            "lat": -3.335270999999999,
            "lng": 114.607639
        }
    },
    {
        "nama": "Adit Cell",
        "alamat": "MJ84+7HJ, Jalan Pekapuran Raya, Pekapuran Raya",
        "lokasi": {
            "lat": -3.3342767,
            "lng": 114.6064016
        }
    },
    {
        "nama": "Zara",
        "alamat": "MJ75+W2M, Jalan Bumi Mas Raya, Pekapuran Raya",
        "lokasi": {
            "lat": -3.3351567,
            "lng": 114.6075496
        }
    },
    {
        "nama": "Sekolah Menengah Atas Islam Terpadu Ukhuwah Banjarmasin",
        "alamat": "Komp. Bumi Handayani, Jalan Bumi Mas Raya 12A KM. 4.5, Pemurus Baru",
        "lokasi": {
            "lat": -3.345478200000001,
            "lng": 114.6070636
        }
    },
    {
        "nama": "Arminareka Perdana Banjarmasin",
        "alamat": "MJ84+9RM, Jalan Pekapuran Raya, Pekapuran Raya",
        "lokasi": {
            "lat": -3.3340367,
            "lng": 114.6070475
        }
    },
    {
        "nama": "ATM BNI RM.SEDERHANA BINTARO",
        "alamat": "Karang Mekar",
        "lokasi": {
            "lat": -3.3328734,
            "lng": 114.6044682
        }
    },
    {
        "nama": "ATM BNI YULIA MINI MARKET",
        "alamat": "Karang Mekar",
        "lokasi": {
            "lat": -3.3328734,
            "lng": 114.6044682
        }
    },
    {
        "nama": "ATM BNI PDAM Bandarmasih",
        "alamat": "Karang Mekar",
        "lokasi": {
            "lat": -3.3328734,
            "lng": 114.6044682
        }
    },
    {
        "nama": "Halim",
        "alamat": "Jalan Kelayan B No.42, Tanjung Pagar",
        "lokasi": {
            "lat": -3.3452117,
            "lng": 114.5977783
        }
    },
    {
        "nama": "Hotel Banjarmasin International",
        "alamat": "Jalan Ahmad Yani No.Km. 4, RW.5, Karang Mekar",
        "lokasi": {
            "lat": -3.3367631,
            "lng": 114.6163172
        }
    },
    {
        "nama": "G' Sign Hotel Banjarmasin",
        "alamat": "Jalan Ahmad Yani No.KM 4,5, RW.No.448, Pemurus Luar",
        "lokasi": {
            "lat": -3.3392222,
            "lng": 114.6189109
        }
    },
    {
        "nama": "LC Mini Market",
        "alamat": "Jalan Ahmad Yani No.5, Pemurus Baru",
        "lokasi": {
            "lat": -3.3385553,
            "lng": 114.617769
        }
    },
    {
        "nama": "Himpunan Pengusaha Muda Indonesia (HIPMI) - Banjarmasin",
        "alamat": "Graha WANINDO, JL. Bumi Mas Raya, No.7 Rt.6, Banjarmasin, South Kalimantan, Pemurus Baru",
        "lokasi": {
            "lat": -3.339212,
            "lng": 114.615812
        }
    },
    {
        "nama": "KFC Ahmad Yani Banjarmasin",
        "alamat": "Jalan A. Yani No.km4, Karang Mekar",
        "lokasi": {
            "lat": -3.334515,
            "lng": 114.614911
        }
    },
    {
        "nama": "ATM Mandiri",
        "alamat": "Jalan A. Yani No.4,5, Kebun Bunga",
        "lokasi": {
            "lat": -3.3369385,
            "lng": 114.6173355
        }
    },
    {
        "nama": "ATM Bank Kalsel",
        "alamat": "Rumah Sakit Khusus Bedah Siaga, JL. Jenderal Ahmad Yani, KM. 4. 5, No. 73, Kebun Bunga",
        "lokasi": {
            "lat": -3.3372334,
            "lng": 114.6175071
        }
    },
    {
        "nama": "ATM BANK BCA",
        "alamat": "MJ78+7W7, Jalan A. Yani, Kebun Bunga",
        "lokasi": {
            "lat": -3.3368279,
            "lng": 114.617304
        }
    },
    {
        "nama": "MEGA ATM",
        "alamat": "Jalan A. Yani No.4,5, Karang Mekar",
        "lokasi": {
            "lat": -3.336709299999999,
            "lng": 114.6172158
        }
    },
    {
        "nama": "BRI syariah",
        "alamat": "MJ78+6M3, Jalan A. Yani, Karang Mekar",
        "lokasi": {
            "lat": -3.336996099999999,
            "lng": 114.6166629
        }
    },
    {
        "nama": "Banjarmasin Siaga Surgery Hospital",
        "alamat": "Jalan Jenderal Ahmad Yani KM.4,5 No.73, Jalan A. Yani No.73, Kebun Bunga",
        "lokasi": {
            "lat": -3.336888699999999,
            "lng": 114.6177764
        }
    },
    {
        "nama": "Kemasindo Cepat Banjarmasin PT",
        "alamat": "JL. Ahmad Yani KM 4, 5, No.71, Kelurahan Kebun Bunga Kecamatan Banjar Timur, Kebun Bunga",
        "lokasi": {
            "lat": -3.336531,
            "lng": 114.6170675
        }
    },
    {
        "nama": "Pusat Alat Bantu Dengar Banjarmasin",
        "alamat": "Jalan Bumi Mas Raya, Pemurus Baru",
        "lokasi": {
            "lat": -3.338089899999999,
            "lng": 114.6174029
        }
    },
    {
        "nama": "ATM Danamon",
        "alamat": "MJ78+8H3, Jalan Ahmad Yani, Karang Mekar",
        "lokasi": {
            "lat": -3.3367303,
            "lng": 114.6164201
        }
    },
    {
        "nama": "ATM Maybank",
        "alamat": "Jalan A. Yani No.4,5, Karang Mekar",
        "lokasi": {
            "lat": -3.3369199,
            "lng": 114.616244
        }
    },
    {
        "nama": "J&T Express Bumi Mas",
        "alamat": "Jalan A. Yani No.KM 4.5, KEL RT.04/RW.02, Pemurus Baru",
        "lokasi": {
            "lat": -3.3382619,
            "lng": 114.6172068
        }
    },
    {
        "nama": "PLN ULP AHMAD YANI",
        "alamat": "Jalan A. Yani No.57, Pemurus Baru",
        "lokasi": {
            "lat": -3.3379295,
            "lng": 114.6180086
        }
    },
    {
        "nama": "Bumbu Cafe",
        "alamat": "Hotel Banjarmasin International Lt. Dasar, Jl. Jend. Ahmad Yani KM. 4,5, Karang Mekar",
        "lokasi": {
            "lat": -3.3364695,
            "lng": 114.6163704
        }
    },
    {
        "nama": "Dwi Jaya Variasi Mobil",
        "alamat": "MJ69+P32, Jalan Ahmad Yani, Pemurus Baru",
        "lokasi": {
            "lat": -3.338229,
            "lng": 114.6176335
        }
    },
    {
        "nama": "Efa Hotel Banjarmasin",
        "alamat": "Jl. Ahmad Yani Km. 6, 5, Pemurus Luar",
        "lokasi": {
            "lat": -3.350857,
            "lng": 114.6291515
        }
    },
    {
        "nama": "Rattan Inn Hotel Banjarmasin",
        "alamat": "Jalan Ahmad Yani No.KM. 5, RW.7, Pemurus Dalam",
        "lokasi": {
            "lat": -3.3471078,
            "lng": 114.6221239
        }
    },
    {
        "nama": "closed prop - takeover",
        "alamat": "Jalan Beruntung Jaya No.14, Pemurus Dalam",
        "lokasi": {
            "lat": -3.3519346,
            "lng": 114.6253533
        }
    },
    {
        "nama": "Hotel Delima",
        "alamat": "Jalan A. Yani KM. 7 Kertak Hanyar, Jalan Komplek Abu Dzar Al Ghifari No.6, Pemurus Luar",
        "lokasi": {
            "lat": -3.353686999999999,
            "lng": 114.6296867
        }
    },
    {
        "nama": "Satria Multimedia - Jasa Pembuatan Website - Aplikasi Web - Banjarmasin",
        "alamat": "Jalan Hikmah Banua Gang Budi Berlian No.Km.6, RT.3/RW.No.28, Pemurus Luar",
        "lokasi": {
            "lat": -3.3478783,
            "lng": 114.6306689
        }
    },
    {
        "nama": "Hyundai Banjarmasin Official",
        "alamat": "Jalan A. Yani No.499 KM 6, RT.10",
        "lokasi": {
            "lat": -3.3496296,
            "lng": 114.625806
        }
    },
    {
        "nama": "Askrindo. PT Persero - Banjarmasin",
        "alamat": "Jalan A. Yani No.KM 7, RW.No 3",
        "lokasi": {
            "lat": -3.3540118,
            "lng": 114.6292223
        }
    },
    {
        "nama": "Natasha Skin Clinic Center (Skin Care) Banjarmasin",
        "alamat": "Jalan A. Yani KM. 5.8, Pemurus Dalam",
        "lokasi": {
            "lat": -3.348443,
            "lng": 114.625085
        }
    },
    {
        "nama": "Dinas Perpustakaan dan Arsip Daerah Provinsi Kalimantan Selatan",
        "alamat": "Jl. A. Yani Km. 6,400 No. 6, Pemurus Luar",
        "lokasi": {
            "lat": -3.35023,
            "lng": 114.627163
        }
    },
    {
        "nama": "Tatalogam Lestari. PT - Outlet Roofmart Banjarmasin",
        "alamat": "Jalan Ahmad Yani I No.88 KM.6,5 No",
        "lokasi": {
            "lat": -3.351019999999999,
            "lng": 114.6271123
        }
    },
    {
        "nama": "Pertamina Gas Station",
        "alamat": "MJ2G+393, Jalan A. Yani, Pemurus Dalam",
        "lokasi": {
            "lat": -3.349874499999999,
            "lng": 114.6259209
        }
    },
    {
        "nama": "Alfamart",
        "alamat": "Pemurus Luar",
        "lokasi": {
            "lat": -3.350819500000001,
            "lng": 114.6276525
        }
    },
    {
        "nama": "PT. BPR Mitratama Arthabuana (BANK MITRA)",
        "alamat": "Jalan Ahmad Yani No.6 Km. 6, Tatah Belayung Baru",
        "lokasi": {
            "lat": -3.3514396,
            "lng": 114.6273218
        }
    },
    {
        "nama": "Depo Simantap",
        "alamat": "Jalan A. Yani No.6, Pemurus Luar",
        "lokasi": {
            "lat": -3.351197,
            "lng": 114.627938
        }
    },
    {
        "nama": "Treepark Hotel Banjarmasin",
        "alamat": "Jalan A. Yani No.Km 6 2",
        "lokasi": {
            "lat": -3.3506166,
            "lng": 114.6252299
        }
    },
    {
        "nama": "First Logistics Banjarmasin",
        "alamat": "Jalan Beruntung Jaya No.21, Pemurus Dalam",
        "lokasi": {
            "lat": -3.3517097,
            "lng": 114.6262158
        }
    },
    {
        "nama": "Organ Tunggal Banjarmasin",
        "alamat": "Jl. A. Yani km 6, Jl Hikmah Banua, Banjar timur kec pemurus, Pemurus Luar, Kecamatan Banjarmasin Timur, Pemurus Luar",
        "lokasi": {
            "lat": -3.3484383,
            "lng": 114.6268407
        }
    },
    {
        "nama": "Airy Ahmad Yani Bunyamin Permai 3 Banjarmasin",
        "alamat": "Jalan A. Yani No.Km 6, RW.5, Pemurus Luar",
        "lokasi": {
            "lat": -3.3514786,
            "lng": 114.628103
        }
    },
    {
        "nama": "Herbal Berizin",
        "alamat": "JJXG+78W, Pemurus Dalam",
        "lokasi": {
            "lat": -3.351774899999999,
            "lng": 114.6258297
        }
    },
    {
        "nama": "State Senior High School 13 Banjarmasin",
        "alamat": "Jalan Setia No.24-B, RT.37, Pemurus Dalam",
        "lokasi": {
            "lat": -3.3612428,
            "lng": 114.6207842
        }
    },
    {
        "nama": "Masjid Jami Subulassalam",
        "alamat": "JJMF+7R2, Jalan Simpang Empat Penggalaman, Tatah Pemangkih Laut",
        "lokasi": {
            "lat": -3.3668589,
            "lng": 114.6245214
        }
    },
    {
        "nama": "Komplek Fadilah Perdana 3",
        "alamat": "JJJ8+JGM, Tatah Layap",
        "lokasi": {
            "lat": -3.368404800000001,
            "lng": 114.6163119
        }
    },
    {
        "nama": "Rental Sewa Mobil Al Baqir",
        "alamat": "Jalan Tembikar Kanan Komp. Fadilah 3 No.1A",
        "lokasi": {
            "lat": -3.3686449,
            "lng": 114.6163731
        }
    },
    {
        "nama": "Toko sembako dan brilink ekananda",
        "alamat": "Jalan tembingkar kanan RT 12 RW 03 Nomor 38 Kecamatan kertak hanyar,Kabupaten Banjar, Pemurus Dalam",
        "lokasi": {
            "lat": -3.3690183,
            "lng": 114.6160299
        }
    },
    {
        "nama": "Farid Tailor Fadhillah 3",
        "alamat": "Jl. Tembikar Kanan Komplek Perumahan Fadhillah III No 20 Desa Simpang Empat, Tatah Layap",
        "lokasi": {
            "lat": -3.3688983,
            "lng": 114.6164484
        }
    },
    {
        "nama": "HAsan Pembakal Tembikar kanan",
        "alamat": "JJJ8+RHR, Jalan Tembikar Kanan, Pemurus Dalam",
        "lokasi": {
            "lat": -3.3678925,
            "lng": 114.6163798
        }
    },
    {
        "nama": "Komplek Pemurus Raya Utama",
        "alamat": "Jalan Tembikar Kanan No.Desa, Tatah Belayung Baru",
        "lokasi": {
            "lat": -3.3691314,
            "lng": 114.615819
        }
    },
    {
        "nama": "PayTren Berkah Banjarmasin",
        "alamat": "JJJ8+8CR, Jalan Tembikar Kanan RT./RW/RW.012/003, Pandan Sari",
        "lokasi": {
            "lat": -3.3691491,
            "lng": 114.6160088
        }
    },
    {
        "nama": "ZAHRO STORE",
        "alamat": "Jalan tembingkar kanan RT 12 RW 03 Nomor 38 Kecamatan kertak hanyar,Kabupaten Banjar, Pemurus Dalam",
        "lokasi": {
            "lat": -3.3691625,
            "lng": 114.6160091
        }
    },
    {
        "nama": "komplek Fadilah lll Tambikar kanan",
        "alamat": "JJJ8+FMR, Tatah Layap",
        "lokasi": {
            "lat": -3.368771,
            "lng": 114.6166387
        }
    },
    {
        "nama": "Abrina Studio",
        "alamat": "5, Blok A2, No, Jalan Tembikar Kanan Jalan Kompleks Fadilah Perdana No.1",
        "lokasi": {
            "lat": -3.369104,
            "lng": 114.6164537
        }
    },
    {
        "nama": "Sangkar burung KAISAR SANGKAR",
        "alamat": "JJJ8+X9Q, Desa bungur, Jalan Ahmad Yani RT.01/RW.01",
        "lokasi": {
            "lat": -3.3675307,
            "lng": 114.6159923
        }
    },
    {
        "nama": "CV borneo bungas",
        "alamat": "JJJ8+8HH, Jalan Tembikar Kanan, Pemurus Dalam",
        "lokasi": {
            "lat": -3.3691997,
            "lng": 114.6164895
        }
    },
    {
        "nama": "Ari Rizki",
        "alamat": "JJJ8+FQJ, Unnamed Road, Tatah Layap",
        "lokasi": {
            "lat": -3.3687904,
            "lng": 114.6168919
        }
    },
    {
        "nama": "Komplek Graha Tembikar Permai",
        "alamat": "Jalan Tembikar Kanan No.30 Blok A, Pemurus Dalam",
        "lokasi": {
            "lat": -3.3678947,
            "lng": 114.6168255
        }
    },
    {
        "nama": "Miyagallery",
        "alamat": "Jl. Tembikar Kanan, Komp. Fadilah Perdana 5 Blok.A2.8",
        "lokasi": {
            "lat": -3.3692442,
            "lng": 114.6167709
        }
    },
    {
        "nama": "Nia mm Ghany",
        "alamat": "Jl. Tembikar kanan. Komp Graha Tembikar Permai. Rt.11 Blok B1 No. 06, Simpang Empat",
        "lokasi": {
            "lat": -3.3681049,
            "lng": 114.6170978
        }
    },
    {
        "nama": "Toko Lutfi",
        "alamat": "JJJ8+XMW, Jalan Tembikar Kanan, Pemurus Dalam",
        "lokasi": {
            "lat": -3.3675043,
            "lng": 114.6166965
        }
    },
    {
        "nama": "SMAN 9 Banjarmasin",
        "alamat": "Jalan Tatah Bangkal No.1, RT.32/RW.02, Kelayan Timur",
        "lokasi": {
            "lat": -3.362371,
            "lng": 114.593231
        }
    },
    {
        "nama": "Blok Q No.7 , Komplek Bumi Wahyu Utama 9",
        "alamat": "JHJW+HW5, Handil Bujur",
        "lokasi": {
            "lat": -3.3678864,
            "lng": 114.5972135
        }
    },
    {
        "nama": "PenjahitFajar",
        "alamat": "JHJW+RVG, Handil Bujur",
        "lokasi": {
            "lat": -3.367946599999999,
            "lng": 114.5971961
        }
    },
    {
        "nama": "Asyifa Laundry",
        "alamat": "JHJW+HW5, Handil Bujur",
        "lokasi": {
            "lat": -3.3681126,
            "lng": 114.5971931
        }
    },
    {
        "nama": "Syifa Laundry",
        "alamat": "JHJW+HW5, Handil Bujur",
        "lokasi": {
            "lat": -3.3681076,
            "lng": 114.5972038
        }
    },
    {
        "nama": "Deco dan Repaint Motor dan Mobil",
        "alamat": "JHJW+HW5, Handil Bujur",
        "lokasi": {
            "lat": -3.3681167,
            "lng": 114.5972266
        }
    },
    {
        "nama": "Rumah Elma",
        "alamat": "Jalan Gerilya Jalan Kompleks Bumi Wahyu Utama IX Blok T No 19",
        "lokasi": {
            "lat": -3.3686046,
            "lng": 114.596717
        }
    },
    {
        "nama": "Abdul's home",
        "alamat": "JHJW+HW5, Handil Bujur",
        "lokasi": {
            "lat": -3.3682445,
            "lng": 114.5972595
        }
    },
    {
        "nama": "ACURRA Homes",
        "alamat": "S8, Jalan Kompleks Bumi Wahyu Utama IX",
        "lokasi": {
            "lat": -3.3683699,
            "lng": 114.5971693
        }
    },
    {
        "nama": "Blok Q no.2",
        "alamat": "JHJX+R29, Jalan Kompleks Bumi Wahyu Utama IX, Pandan Sari",
        "lokasi": {
            "lat": -3.367952,
            "lng": 114.5976058
        }
    },
    {
        "nama": "Rumah Aiza",
        "alamat": "Blok T No.10, Desa Pamangkih Laut",
        "lokasi": {
            "lat": -3.3686163,
            "lng": 114.597031
        }
    },
    {
        "nama": "Kios Fathiya/hafiz",
        "alamat": "Jl.gerilya kampung baru Rt 17 no.52, RT.no.52/RW.02, Handil Bujur",
        "lokasi": {
            "lat": -3.3669522,
            "lng": 114.5980098
        }
    },
    {
        "nama": "Jajanan mama hafiz",
        "alamat": "Jalan Gerilya RT.17/RW.No 52, kampung baru",
        "lokasi": {
            "lat": -3.3670783,
            "lng": 114.5980795
        }
    },
    {
        "nama": "Bumiwahyuutama9",
        "alamat": "JHJW+HW5, Handil Bujur",
        "lokasi": {
            "lat": -3.3685785,
            "lng": 114.5973513
        }
    },
    {
        "nama": "Rumah Misran and Yuna",
        "alamat": "JHJW+GV9, Handil Bujur",
        "lokasi": {
            "lat": -3.3687119,
            "lng": 114.597207
        }
    },
    {
        "nama": "Blok R27",
        "alamat": "JHJW+HW5, Handil Bujur",
        "lokasi": {
            "lat": -3.3686125,
            "lng": 114.5973594
        }
    },
    {
        "nama": "Rumah hafidz",
        "alamat": "JHJW+HW5, Handil Bujur",
        "lokasi": {
            "lat": -3.3686123,
            "lng": 114.5973644
        }
    },
    {
        "nama": "Bumi wahyu utama IX. Blok. T. 8",
        "alamat": "JHJW+GV9, Handil Bujur",
        "lokasi": {
            "lat": -3.368725,
            "lng": 114.5972329
        }
    },
    {
        "nama": "Mushalla Al Marfuah",
        "alamat": "Jalan Gerilya No.46, RT.27, Handil Bujur",
        "lokasi": {
            "lat": -3.3665133,
            "lng": 114.5982535
        }
    },
    {
        "nama": "Langgar Syi'arul Muslimin",
        "alamat": "JH8Q+8J4, Jalan Tatah Layap, Handil Bujur",
        "lokasi": {
            "lat": -3.3842398,
            "lng": 114.589081
        }
    },
    {
        "nama": "Penggilingan Padi Tatah Layap RT 02",
        "alamat": "JH8Q+MRX, Handil Bujur",
        "lokasi": {
            "lat": -3.3832616,
            "lng": 114.5896085
        }
    },
    {
        "nama": "Ahmad Junior",
        "alamat": "JH8Q+3C5, Handil Bujur",
        "lokasi": {
            "lat": -3.384874099999999,
            "lng": 114.5886248
        }
    },
    {
        "nama": "Warung Napis",
        "alamat": "JH8Q+HWM, Jalan Gubernur Soebardjo, Handil Bujur",
        "lokasi": {
            "lat": -3.3835337,
            "lng": 114.5897919
        }
    },
    {
        "nama": "g¤d@/^kh",
        "alamat": "Jl.Pandan Sari RT 01 RW I No.78, Handil Baru",
        "lokasi": {
            "lat": -3.3814758,
            "lng": 114.5822134
        }
    },
    {
        "nama": "Perumahan Teras Borneo",
        "alamat": "Jalan Tatah Bangkal Kel No.Rt 34, Kelayan Timur",
        "lokasi": {
            "lat": -3.379363,
            "lng": 114.5832668
        }
    },
    {
        "nama": "Lahan pekarangan Tatah Layap",
        "alamat": "JH8Q+3C5, Handil Bujur",
        "lokasi": {
            "lat": -3.3856499,
            "lng": 114.5882288
        }
    },
    {
        "nama": "TOKO IHSAN KERUD",
        "alamat": "JH9J+RWQ, Jalan Tatah Bangkal, Handil Baru",
        "lokasi": {
            "lat": -3.3804108,
            "lng": 114.5823546
        }
    },
    {
        "nama": "Kantor pemasaran perumahan CITRA BORNEO BANJARMASIN",
        "alamat": "JHCM+873, Jalan Tatah Bangkal, Handil Baru",
        "lokasi": {
            "lat": -3.3792393,
            "lng": 114.5831607
        }
    },
    {
        "nama": "TOKO ISMI",
        "alamat": "JHCM+65M, Jalan Tatah Bangkal, Handil Baru",
        "lokasi": {
            "lat": -3.3794239,
            "lng": 114.5829105
        }
    },
    {
        "nama": "LAPANGAN SD ISLAM SITI KHADIJAH",
        "alamat": "JH9J+MRH, Jalan Tatah Bangkal, Handil Baru",
        "lokasi": {
            "lat": -3.3808113,
            "lng": 114.582108
        }
    },
    {
        "nama": "Dubai Resident",
        "alamat": "JHCM+F9W, Jalan Tatah Bangkal, Handil Bujur",
        "lokasi": {
            "lat": -3.3787694,
            "lng": 114.5834546
        }
    },
    {
        "nama": "KANTOR DESA PANDAN SARI",
        "alamat": "JH9J+GMJ, Jalan Tatah Bangkal, Handil Baru",
        "lokasi": {
            "lat": -3.381170399999999,
            "lng": 114.5816279
        }
    },
    {
        "nama": "Sdi Siti Khadijah",
        "alamat": "Jalan Tatah Bangkal Jalan Handil Palung No.Kel, Kelayan Timur",
        "lokasi": {
            "lat": -3.380472799999999,
            "lng": 114.5816261
        }
    },
    {
        "nama": "Pangkalan Siti Khadijah",
        "alamat": "JH9J+RJ9, Jalan Tatah Bangkal, Handil Bujur",
        "lokasi": {
            "lat": -3.3804571,
            "lng": 114.5816115
        }
    },
    {
        "nama": "Julak ihak",
        "alamat": "JH7P+2M5, Handil Bujur",
        "lokasi": {
            "lat": -3.3869985,
            "lng": 114.5873018
        }
    },
    {
        "nama": "kios bayu",
        "alamat": "JH9R+CGV, Jalan Gubernur Soebardjo, Handil Bujur",
        "lokasi": {
            "lat": -3.3813968,
            "lng": 114.5912922
        }
    },
    {
        "nama": "Asrama Putra Barabai",
        "alamat": "JL Tatah Bangkal Luar, Gang 8, RT 40, Komplek Binabrata Manunggal 2, Handil Baru",
        "lokasi": {
            "lat": -3.377349,
            "lng": 114.58391
        }
    },
    {
        "nama": "Dapur jikri",
        "alamat": "JH7P+2M5, Handil Bujur",
        "lokasi": {
            "lat": -3.3874837,
            "lng": 114.5867341
        }
    },
    {
        "nama": "majelis ta`alim HUSNUL KHATIMAH",
        "alamat": "Jalan Tatah Bangkal No.RT.34/02, Handil Baru",
        "lokasi": {
            "lat": -3.376955399999999,
            "lng": 114.5843644
        }
    },
    {
        "nama": "HINO PARTS SHOP SARANA PRIMA LESTARI",
        "alamat": "Jl. Pramuka Km 6 Ruko Mitramas No 11 C, Kuin Besar",
        "lokasi": {
            "lat": -3.3801657,
            "lng": 114.5628711
        }
    },
    {
        "nama": "Mesjid Jami Al-Muhtadin",
        "alamat": "JHG8+JGM, Desa, Handil Bujur",
        "lokasi": {
            "lat": -3.3734121,
            "lng": 114.5663071
        }
    },
    {
        "nama": "Warung abah lana",
        "alamat": "JHG8+CQP, Kuin Besar",
        "lokasi": {
            "lat": -3.3739193,
            "lng": 114.5669522
        }
    },
    {
        "nama": "Warkop modern misra",
        "alamat": "JHG8+CQH, Unnamed Road, Kuin Besar",
        "lokasi": {
            "lat": -3.373925499999999,
            "lng": 114.5669785
        }
    },
    {
        "nama": "TPU",
        "alamat": "JHG8+MF7, Kuin Besar",
        "lokasi": {
            "lat": -3.373335699999999,
            "lng": 114.5661636
        }
    },
    {
        "nama": "Al Muhtadin",
        "alamat": "JHG8+VH7",
        "lokasi": {
            "lat": -3.3728319,
            "lng": 114.5664221
        }
    },
    {
        "nama": "ABAN",
        "alamat": "JL.TEMBUS MANTUIL BASIRIH DALAM RT/RW 003/ kel/desa BASIRIH DALAM, Handil Bujur",
        "lokasi": {
            "lat": -3.374205799999999,
            "lng": 114.5672693
        }
    },
    {
        "nama": "Warung Uwi",
        "alamat": "JHF8+R8G, Handil Bujur",
        "lokasi": {
            "lat": -3.3748527,
            "lng": 114.5660704
        }
    },
    {
        "nama": "Aliannor",
        "alamat": "JHG9+R4P, Jl.Tembus Mantuil Basirih Dalam, Kel Desa RT./RW/RW.025/002, Basirih Selatan",
        "lokasi": {
            "lat": -3.3729008,
            "lng": 114.5678162
        }
    },
    {
        "nama": "Tajudin",
        "alamat": "JHG9+R59, Kuin Besar",
        "lokasi": {
            "lat": -3.3729637,
            "lng": 114.5679744
        }
    },
    {
        "nama": "Desa Handil Bujur",
        "alamat": "JHF8+VPV, Dekat, Kuin Besar",
        "lokasi": {
            "lat": -3.3752594,
            "lng": 114.5668043
        }
    },
    {
        "nama": "Pabrik Penggilingan Padi 1",
        "alamat": "JHF8+R8G, Handil Bujur",
        "lokasi": {
            "lat": -3.375440199999999,
            "lng": 114.5658303
        }
    },
    {
        "nama": "Rumah",
        "alamat": "JHF8+R4Q, Dekat, Kuin Besar",
        "lokasi": {
            "lat": -3.3752581,
            "lng": 114.5653884
        }
    },
    {
        "nama": "Unaykoro",
        "alamat": "JHH9+88Q, Kuin Besar",
        "lokasi": {
            "lat": -3.3716544,
            "lng": 114.5683486
        }
    },
    {
        "nama": "Uji Bangkok Farm",
        "alamat": "Handil Bujur",
        "lokasi": {
            "lat": -3.3706871,
            "lng": 114.5689085
        }
    },
    {
        "nama": "RAFA OLSHOP",
        "alamat": "JHH9+JP2, Jalan basirih dalam RT.25/RW.2, handil bujur",
        "lokasi": {
            "lat": -3.3709977,
            "lng": 114.5692589
        }
    },
    {
        "nama": "PosKesDes Handil Bujur",
        "alamat": "Desa No.RT.01, Handil Bujur",
        "lokasi": {
            "lat": -3.3771623,
            "lng": 114.5646531
        }
    },
    {
        "nama": "Kantor Desa Handil Bujur",
        "alamat": "JHF7+3R, Kuin Besar",
        "lokasi": {
            "lat": -3.3772936,
            "lng": 114.5645728
        }
    },
    {
        "nama": "Rumah marni",
        "alamat": "JHC7+WJ8, Kuin Besar",
        "lokasi": {
            "lat": -3.3781813,
            "lng": 114.5653475
        }
    },
    {
        "nama": "SDN.Handil Bujur 1",
        "alamat": "Jl Handil Bujur No.RT 02, Kuin Besar",
        "lokasi": {
            "lat": -3.378015,
            "lng": 114.5646446
        }
    },
    {
        "nama": "SUNGAI HANDIL BUJUR",
        "alamat": "JHMC+53, Kuin Kecil",
        "lokasi": {
            "lat": -3.3670286,
            "lng": 114.5701698
        }
    },
    {
        "nama": "Basirih State Elementary School 4 of Banjarmasin",
        "alamat": "JHMC+J24, Basirih",
        "lokasi": {
            "lat": -3.3659868,
            "lng": 114.5700915
        }
    },
    {
        "nama": "warung mama zikri",
        "alamat": "JHMC+J24, Basirih",
        "lokasi": {
            "lat": -3.3660253,
            "lng": 114.5704489
        }
    },
    {
        "nama": "Said bain",
        "alamat": "JHMC+53, Kuin Kecil",
        "lokasi": {
            "lat": -3.3668836,
            "lng": 114.5710824
        }
    },
    {
        "nama": "Rumah A.yani",
        "alamat": "JHMC+53, Kuin Kecil",
        "lokasi": {
            "lat": -3.3667471,
            "lng": 114.5712601
        }
    },
    {
        "nama": "Jangkrik Basirih",
        "alamat": "Jalan Tembus Mantuil Jalan Handil Bamban RT.25/RW.02, kelurahan Basirih selatan",
        "lokasi": {
            "lat": -3.3652418,
            "lng": 114.5698015
        }
    },
    {
        "nama": "Habib Al-Anjiri",
        "alamat": "Pematang 1, Jalan Handil Bamban",
        "lokasi": {
            "lat": -3.364850799999999,
            "lng": 114.5693612
        }
    },
    {
        "nama": "Rumah Ali",
        "alamat": "Jalan Handil Bamban",
        "lokasi": {
            "lat": -3.364850799999999,
            "lng": 114.5693612
        }
    },
    {
        "nama": "Rumah akioalbirru",
        "alamat": "pais rt 25, Jalan Handil Bamban",
        "lokasi": {
            "lat": -3.364850799999999,
            "lng": 114.5693612
        }
    },
    {
        "nama": "KOMPLEK ASANG PERMAI\"",
        "alamat": "Jalan Handil Bamban, hilir",
        "lokasi": {
            "lat": -3.364850799999999,
            "lng": 114.5693612
        }
    },
    {
        "nama": "TPA AL MUNAWWARAH UNIT 285",
        "alamat": "Jalan Handil Bamban, Kuin Kecil",
        "lokasi": {
            "lat": -3.365671099999999,
            "lng": 114.5671995
        }
    },
    {
        "nama": "Nurul Huda Mosque",
        "alamat": "JHP9+G7F, Jalan Handil Bamban, Kuin Kecil",
        "lokasi": {
            "lat": -3.3636921,
            "lng": 114.5681807
        }
    },
    {
        "nama": "Sahraji",
        "alamat": "JHM8+WH4, Kuin Kecil",
        "lokasi": {
            "lat": -3.3652342,
            "lng": 114.5664493
        }
    },
    {
        "nama": "Rumah muhammad arsyad",
        "alamat": "JL TEMBUS MANTUIL BASIRIH Jalan Handil Bamban No.DALAM",
        "lokasi": {
            "lat": -3.3634881,
            "lng": 114.5677438
        }
    },
    {
        "nama": "Tewtew",
        "alamat": "Jalan Handil Bamban RT.25/RW.02, Kuin Kecil",
        "lokasi": {
            "lat": -3.3647354,
            "lng": 114.5665107
        }
    },
    {
        "nama": "Warung mama amel",
        "alamat": "Kuin Kecil",
        "lokasi": {
            "lat": -3.363213,
            "lng": 114.5675198
        }
    },
    {
        "nama": "Warung mama alfian",
        "alamat": "Jalan Handil Bamban No.285, RT.025/RW.02, Kuin Kecil",
        "lokasi": {
            "lat": -3.3634259,
            "lng": 114.5667208
        }
    },
    {
        "nama": "Toko Nisa",
        "alamat": "JHQ9+225, Jl.Basirih dalam RT.25/RW.2, Handil Bujur",
        "lokasi": {
            "lat": -3.3624847,
            "lng": 114.5676073
        }
    },
    {
        "nama": "Olshop Mikayla Nabil",
        "alamat": "JGGX+4WG, Kuin Besar",
        "lokasi": {
            "lat": -3.3746897,
            "lng": 114.549833
        }
    },
    {
        "nama": "Rumah mama hafiza",
        "alamat": "JHG2+68W, Jalan Kuin Kacil, Kuin Besar",
        "lokasi": {
            "lat": -3.374779,
            "lng": 114.549835
        }
    },
    {
        "nama": "Marwan",
        "alamat": "JGGX+F4H, Jl. Kuin kecil RT.15 rw01/RW.no. 100, kelurahan mantuil",
        "lokasi": {
            "lat": -3.3738115,
            "lng": 114.5478669
        }
    },
    {
        "nama": "Warung novita",
        "alamat": "JHG2+68W, Jalan Kuin Kacil, Kuin Besar",
        "lokasi": {
            "lat": -3.374383399999999,
            "lng": 114.5508225
        }
    },
    {
        "nama": "Bang Iful Bakambat",
        "alamat": "JHG2+68W, Jalan Kuin Kacil, Kuin Besar",
        "lokasi": {
            "lat": -3.3744343,
            "lng": 114.5508369
        }
    },
    {
        "nama": "Berkat motor",
        "alamat": "JHG2+QCW, Jalan Kuin Kacil, Kuin Besar",
        "lokasi": {
            "lat": -3.3730168,
            "lng": 114.551092
        }
    },
    {
        "nama": "MEJLIS NURUL AMIN KUIN KECIL",
        "alamat": "JGGW+2P5, Kuin Kecil",
        "lokasi": {
            "lat": -3.3749994,
            "lng": 114.5468569
        }
    },
    {
        "nama": "Puskesmas Handil Baru",
        "alamat": "JHF2+WFC, Kuin Besar",
        "lokasi": {
            "lat": -3.3751921,
            "lng": 114.5511523
        }
    },
    {
        "nama": "MIS Al Munawwarah",
        "alamat": "JHG2+6J2, Kuin Besar",
        "lokasi": {
            "lat": -3.3744899,
            "lng": 114.5515024
        }
    },
    {
        "nama": "Kantor Pembakal Desa Handil Baru",
        "alamat": "JHF2+WGV, Kuin Besar",
        "lokasi": {
            "lat": -3.3751449,
            "lng": 114.5512914
        }
    },
    {
        "nama": "Simpang ghaib kuin kecil",
        "alamat": "JGGW+672, Kuin Kecil",
        "lokasi": {
            "lat": -3.374398,
            "lng": 114.545946
        }
    },
    {
        "nama": "Warung rapi",
        "alamat": "JGGW+572, Unnamed Road, Kuin Kecil",
        "lokasi": {
            "lat": -3.3746041,
            "lng": 114.5456417
        }
    },
    {
        "nama": "Warung Mama Aqin",
        "alamat": "JGGW+74X, Kuin Kecil",
        "lokasi": {
            "lat": -3.3742737,
            "lng": 114.5453728
        }
    },
    {
        "nama": "TPA Al'Quran AL-HIKMAH",
        "alamat": "Jl. Halinau No.RT.02, Handil Baru",
        "lokasi": {
            "lat": -3.3751955,
            "lng": 114.5527006
        }
    },
    {
        "nama": "Rumah mm jam'an",
        "alamat": "JHG3+JH4, Kuin Besar",
        "lokasi": {
            "lat": -3.3734762,
            "lng": 114.5539621
        }
    },
    {
        "nama": "Catering Acil halim",
        "alamat": "JHG3+JH4, Kuin Besar",
        "lokasi": {
            "lat": -3.3734762,
            "lng": 114.5539621
        }
    },
    {
        "nama": "Abnaul Amin Banjarmasin Boarding School",
        "alamat": "Kuin Kecil RT. 15, Mantuil, Banjarmasin Selatan, Kuin Besar",
        "lokasi": {
            "lat": -3.3716668,
            "lng": 114.544132
        }
    },
    {
        "nama": "Jembatan Kayu Masjid Al Muhajirin",
        "alamat": "Kuin Besar",
        "lokasi": {
            "lat": -3.372299,
            "lng": 114.5437474
        }
    },
    {
        "nama": "Masjid Al Muhajirin",
        "alamat": "JGHV+6G8, Jalan Kuin Kacil, Kuin Besar",
        "lokasi": {
            "lat": -3.3719526,
            "lng": 114.5438255
        }
    },
    {
        "nama": "Puskesmas Pembantu Kuin Kecil",
        "alamat": "JGHV+9HX, Kuin Besar",
        "lokasi": {
            "lat": -3.3715134,
            "lng": 114.5439861
        }
    },
    {
        "nama": "SMAS Mawar Putih",
        "alamat": "JGJH+F3J, Kuin Kecil",
        "lokasi": {
            "lat": -3.3687998,
            "lng": 114.5276524
        }
    },
    {
        "nama": "LOGPOND",
        "alamat": "JGMH+727, Terapu",
        "lokasi": {
            "lat": -3.366942,
            "lng": 114.5274767
        }
    },
    {
        "nama": "Dermaga Desa Kuin Kecil",
        "alamat": "JGMH+753, Kuin Besar",
        "lokasi": {
            "lat": -3.3668515,
            "lng": 114.5279361
        }
    },
    {
        "nama": "Masjid Baitul Hassan",
        "alamat": "JGMH+54Q, Kuin Besar",
        "lokasi": {
            "lat": -3.3670274,
            "lng": 114.5278646
        }
    },
    {
        "nama": "Kios Mulia Pupuk Eceran Bersubsidi",
        "alamat": "JGMH+65P, Kuin Kecil",
        "lokasi": {
            "lat": -3.3669117,
            "lng": 114.5279496
        }
    },
    {
        "nama": "Poskesdes Kuin Kecil",
        "alamat": "JGMH+357, Kuin Besar",
        "lokasi": {
            "lat": -3.3673274,
            "lng": 114.5279331
        }
    },
    {
        "nama": "Kantor Desa Kuin Kecil",
        "alamat": "Jl.Kuin Kecil Rt.01 Kode Pos, Kuin Besar",
        "lokasi": {
            "lat": -3.3673997,
            "lng": 114.527919
        }
    },
    {
        "nama": "RUMAH ONTER",
        "alamat": "JGJH+J8Q, Kuin Besar",
        "lokasi": {
            "lat": -3.368419,
            "lng": 114.5283622
        }
    },
    {
        "nama": "Desa Kuin Kecil",
        "alamat": "JGJH+C5, Kuin Kecil",
        "lokasi": {
            "lat": -3.3689375,
            "lng": 114.5279375
        }
    },
    {
        "nama": "Rumah Amin",
        "alamat": "JGJH+C5, Kuin Besar",
        "lokasi": {
            "lat": -3.3691596,
            "lng": 114.5277245
        }
    },
    {
        "nama": "Warung ifit",
        "alamat": "JGJH+C5, Kuin Besar",
        "lokasi": {
            "lat": -3.369,
            "lng": 114.527921
        }
    },
    {
        "nama": "Pabrik Banih Murjani",
        "alamat": "JGJH+C5, Kuin Besar",
        "lokasi": {
            "lat": -3.368938,
            "lng": 114.528528
        }
    },
    {
        "nama": "Rumah Umar",
        "alamat": "JGJH+8FF, Kuin Kecil",
        "lokasi": {
            "lat": -3.369179,
            "lng": 114.5286589
        }
    },
    {
        "nama": "Warung Mama Kayla",
        "alamat": "JGJH+C5, Kuin Besar",
        "lokasi": {
            "lat": -3.369374,
            "lng": 114.5290287
        }
    },
    {
        "nama": "PT. BMSC (Karbon)",
        "alamat": "MG8V+47P, Tinggiran II",
        "lokasi": {
            "lat": -3.334662799999999,
            "lng": 114.5431955
        }
    },
    {
        "nama": "Feri SAKAKAJANG",
        "alamat": "MG9X+QGH, Unnamed Road, Tinggiran II",
        "lokasi": {
            "lat": -3.3305726,
            "lng": 114.5488453
        }
    },
    {
        "nama": "PT TLMI",
        "alamat": "Jl",
        "lokasi": {
            "lat": -3.3369379,
            "lng": 114.5540613
        }
    },
    {
        "nama": "austral byna",
        "alamat": "MH52+CPW, Mantuil",
        "lokasi": {
            "lat": -3.341384999999999,
            "lng": 114.551823
        }
    },
    {
        "nama": "Pelabuhan Sakakajang",
        "alamat": "MGCX+334, Tamban Kecil",
        "lokasi": {
            "lat": -3.3298694,
            "lng": 114.5476892
        }
    },
    {
        "nama": "Pangkalan Kapal Patroli KSOP Kelas I Banjarmasin",
        "alamat": "MH74+32, Basirih",
        "lokasi": {
            "lat": -3.3375031,
            "lng": 114.5547964
        }
    },
    {
        "nama": "Pangkalan Sarana Operasi Bea Cukai Banjarmasin.",
        "alamat": "MH74+32, Basirih",
        "lokasi": {
            "lat": -3.3372647,
            "lng": 114.5550682
        }
    },
    {
        "nama": "Warung Soto Abang Utam",
        "alamat": "Jalan Barito Hilir No.9, Basirih",
        "lokasi": {
            "lat": -3.3368619,
            "lng": 114.5552112
        }
    },
    {
        "nama": "Warung Ita",
        "alamat": "Jalan Barito Hilir No.3, Basirih",
        "lokasi": {
            "lat": -3.3367204,
            "lng": 114.5552616
        }
    },
    {
        "nama": "Mako Sat Pol Air Polresta Banjarmasin",
        "alamat": "MH74+33X, Basirih",
        "lokasi": {
            "lat": -3.3372675,
            "lng": 114.5552286
        }
    },
    {
        "nama": "Dok Kapal Sinar Sarana Samudera",
        "alamat": "MG4W+HFM, Mantuil",
        "lokasi": {
            "lat": -3.3435295,
            "lng": 114.5461872
        }
    },
    {
        "nama": "Australia bina",
        "alamat": "MH42+M6W, Jalan Austral Byna, Mantuil",
        "lokasi": {
            "lat": -3.3432605,
            "lng": 114.5505885
        }
    },
    {
        "nama": "Rumah Nur azizah",
        "alamat": "MGCW+9GV, Tinggiran II",
        "lokasi": {
            "lat": -3.329283,
            "lng": 114.5457047
        }
    },
    {
        "nama": "Pos Kesyahbandaran Martapura Baru",
        "alamat": "MH74+45J, Basirih",
        "lokasi": {
            "lat": -3.337164699999999,
            "lng": 114.5553848
        }
    },
    {
        "nama": "DEPOT KHALIFAH",
        "alamat": "Unnamed Road, Tinggiran II",
        "lokasi": {
            "lat": -3.3289998,
            "lng": 114.5463245
        }
    },
    {
        "nama": "Warung Jamilah",
        "alamat": "MGCV+5P2, Unnamed Road, Tinggiran II",
        "lokasi": {
            "lat": -3.3296123,
            "lng": 114.5442776
        }
    },
    {
        "nama": "RENTAL MOBIL DUA PUTRI",
        "alamat": "MGCW+FGP, Unnamed Road, Tinggiran II",
        "lokasi": {
            "lat": -3.3287951,
            "lng": 114.5463332
        }
    },
    {
        "nama": "Langgar Baitulrahman",
        "alamat": "MGCV+8R3, Tinggiran II",
        "lokasi": {
            "lat": -3.3292378,
            "lng": 114.5445577
        }
    },
    {
        "nama": "Terminal Peti Kemas Banjarmasin",
        "alamat": "Jalan Bina Karya Komp. Baruh Batuah RT.70 RW.04 NO. 30, Basirih",
        "lokasi": {
            "lat": -3.3335381,
            "lng": 114.5556429
        }
    },
    {
        "nama": "PT AKR Corporindo Tbk (Banjarmasin)",
        "alamat": "MH85+4GQ, Basirih",
        "lokasi": {
            "lat": -3.3346561,
            "lng": 114.558866
        }
    },
    {
        "nama": "\"Bagus\" Cell",
        "alamat": "MH86+G4V, Jalan Gubernur Soebardjo, Basirih",
        "lokasi": {
            "lat": -3.3336349,
            "lng": 114.5602858
        }
    },
    {
        "nama": "PT. Intan Wijaya Internasional, Tbk.",
        "alamat": "MH56+HVF, (Komplek UKA), Jalan Trisakti, Basirih",
        "lokasi": {
            "lat": -3.3410644,
            "lng": 114.5621795
        }
    },
    {
        "nama": "PT. Basirih industrial",
        "alamat": "Jalan Gubernur Soebardjo, Basirih",
        "lokasi": {
            "lat": -3.3380993,
            "lng": 114.5649797
        }
    },
    {
        "nama": "PT. Mitra Lintas Nusantara",
        "alamat": "Gedung Perkantoran, Jalan Gubernur Subarjo Komplek Yuka No.17B, RW.13, Telaga Biru",
        "lokasi": {
            "lat": -3.3316819,
            "lng": 114.5605413
        }
    },
    {
        "nama": "PT. Catur Sentosa Adiprana",
        "alamat": "JL Gubernur Subarjo/Lingkar Selatan, KM 8, Desa Tatah Pemangkih Tengah, Basirih",
        "lokasi": {
            "lat": -3.336411999999999,
            "lng": 114.566932
        }
    },
    {
        "nama": "Aerotrans Metropolitan Express. PT",
        "alamat": "Jalan Gubernur Soebardjo No.9, Basirih",
        "lokasi": {
            "lat": -3.3384925,
            "lng": 114.5677328
        }
    },
    {
        "nama": "Susu kambing banjarmasin",
        "alamat": "Gang 3 No.Ac.5, Basirih",
        "lokasi": {
            "lat": -3.3321285,
            "lng": 114.566983
        }
    },
    {
        "nama": "ATM BNI PT.PELINDO JL.BARITO H",
        "alamat": "Basirih",
        "lokasi": {
            "lat": -3.3287006,
            "lng": 114.5596609
        }
    },
    {
        "nama": "PT. Pelabuhan Indonesia III Limited Branch Banjarmasin",
        "alamat": "Jalan Barito Hilir No.6, Telaga Biru",
        "lokasi": {
            "lat": -3.328675,
            "lng": 114.5595976
        }
    },
    {
        "nama": "BANK BRI ATM",
        "alamat": "Jalan Barito Hilir No.83, Telaga Biru",
        "lokasi": {
            "lat": -3.3284192,
            "lng": 114.5599074
        }
    },
    {
        "nama": "Dept Listrik PT.wijaya",
        "alamat": "MH76+QCW, Basirih",
        "lokasi": {
            "lat": -3.3355121,
            "lng": 114.5610841
        }
    },
    {
        "nama": "Kantin PT. Wijaya Triutama",
        "alamat": "MH76+W9V, Basirih",
        "lokasi": {
            "lat": -3.335145100000001,
            "lng": 114.5609199
        }
    },
    {
        "nama": "Quality Control Deprt PT WTUPI",
        "alamat": "MH76+WG3, Gang 8, Basirih",
        "lokasi": {
            "lat": -3.3352268,
            "lng": 114.561286
        }
    },
    {
        "nama": "Dept. Log Pond PT.WTUPI",
        "alamat": "MH75+F7, Basirih",
        "lokasi": {
            "lat": -3.3362657,
            "lng": 114.5582484
        }
    },
    {
        "nama": "Elementary School Basirih 6",
        "alamat": "MH86+465, Jalan Komplek Yuka, Basirih",
        "lokasi": {
            "lat": -3.3347406,
            "lng": 114.5605975
        }
    },
    {
        "nama": "Powerplant Basirih 3MW",
        "alamat": "MH67+J4, Basirih",
        "lokasi": {
            "lat": -3.3384861,
            "lng": 114.5628403
        }
    },
    {
        "nama": "Kantor borneo jaya utama perkasa",
        "alamat": "MH86+465, Jalan Komplek Yuka, Basirih",
        "lokasi": {
            "lat": -3.3346422,
            "lng": 114.5606348
        }
    },
    {
        "nama": "Bengkel Rambo Garage",
        "alamat": "komplek yuka",
        "lokasi": {
            "lat": -3.3343987,
            "lng": 114.5610633
        }
    },
    {
        "nama": "Badan SAR Nasional Kantor SAR XVI Banjarmasin Pos Sar Tri Sakti",
        "alamat": "MH37+F2R, Jalan Pelabuhan Martapura Baru, Basirih",
        "lokasi": {
            "lat": -3.3462501,
            "lng": 114.5625079
        }
    },
    {
        "nama": "Kubah Al Habib Hamid Bin Abbas Bahasyim (Habib Basirih)",
        "alamat": "Jalan Keramat Basirih RT.09/RW.01, Basirih",
        "lokasi": {
            "lat": -3.3461278,
            "lng": 114.5645395
        }
    },
    {
        "nama": "Fajar Mantuil",
        "alamat": "Jalan Mantuil, Mantuil",
        "lokasi": {
            "lat": -3.349271099999999,
            "lng": 114.5620114
        }
    },
    {
        "nama": "PT MAHKOTA BORNEO MAKMUR",
        "alamat": "MH24+298, Kuin Kecil",
        "lokasi": {
            "lat": -3.3499599,
            "lng": 114.5559493
        }
    },
    {
        "nama": "SPBN AKR MANTUIL",
        "alamat": "MH4C+26V, Kelayan Selatan",
        "lokasi": {
            "lat": -3.3448978,
            "lng": 114.5705359
        }
    },
    {
        "nama": "PMB JALEHA",
        "alamat": "MH37+96F, Basirih",
        "lokasi": {
            "lat": -3.3465705,
            "lng": 114.5630437
        }
    },
    {
        "nama": "PT. Pelayaran FORTUNA Nusantara Megajaya",
        "alamat": "MH37+92W, Basirih",
        "lokasi": {
            "lat": -3.34655,
            "lng": 114.5626142
        }
    },
    {
        "nama": "Dermaga SAR Basirih. Kantor SAR Banjarmasin",
        "alamat": "MH37+92P, Basirih",
        "lokasi": {
            "lat": -3.3465282,
            "lng": 114.5625677
        }
    },
    {
        "nama": "Rumah Muhammad Baihaqi",
        "alamat": "MH27+QF7, Mantuil",
        "lokasi": {
            "lat": -3.3481126,
            "lng": 114.5636997
        }
    },
    {
        "nama": "kios NANA",
        "alamat": "jl. Tanjung Keramat No.01, RT.08/RW.01, Basirih",
        "lokasi": {
            "lat": -3.3464887,
            "lng": 114.5634061
        }
    },
    {
        "nama": "Bidan Jaleha Keramat Basirih",
        "alamat": "Jalan Keramat Basirih, Basirih",
        "lokasi": {
            "lat": -3.346255299999999,
            "lng": 114.5631306
        }
    },
    {
        "nama": "Musholla Hidayaturrahim",
        "alamat": "Jalan Mantuil No.16, Mantuil",
        "lokasi": {
            "lat": -3.3485751,
            "lng": 114.5635686
        }
    },
    {
        "nama": "Toko Rudi",
        "alamat": "Jalan Mantuil No.16, Mantuil",
        "lokasi": {
            "lat": -3.3485751,
            "lng": 114.5635686
        }
    },
    {
        "nama": "Toko Alat Bangunan",
        "alamat": "MH27+G83, Jalan Mantuil, Mantuil",
        "lokasi": {
            "lat": -3.3487352,
            "lng": 114.5632839
        }
    },
    {
        "nama": "TB bangunan ALFIN MANTUIL DAN TOKO CAT",
        "alamat": "Jalan Mantuil Raya No.02, Mantuil",
        "lokasi": {
            "lat": -3.3487337,
            "lng": 114.5632974
        }
    },
    {
        "nama": "Wp Plastik",
        "alamat": "Indonesia",
        "lokasi": {
            "lat": -3.34875,
            "lng": 114.5632206
        }
    },
    {
        "nama": "KEDAI JAMU RAJA",
        "alamat": "Indonesia",
        "lokasi": {
            "lat": -3.3487543,
            "lng": 114.5632239
        }
    },
    {
        "nama": "WARUNG MBAH MAN 2",
        "alamat": "MH27+G84, Mantuil",
        "lokasi": {
            "lat": -3.348729799999999,
            "lng": 114.5633382
        }
    },
    {
        "nama": "alya musik",
        "alamat": "Kelayan Selatan",
        "lokasi": {
            "lat": -3.3401006,
            "lng": 114.5759456
        }
    },
    {
        "nama": "Biro Psikologi Talenta Aditama",
        "alamat": "Jalan Antasan Raden Darat No.RT 19 No.22, RT.No.22/RW.02, Teluk Tiram",
        "lokasi": {
            "lat": -3.338303999999999,
            "lng": 114.5770602
        }
    },
    {
        "nama": "Masjid Al-Muhajirin",
        "alamat": "MH8G+3X7, Jalan Ampera Raya, Basirih",
        "lokasi": {
            "lat": -3.334834500000001,
            "lng": 114.5774255
        }
    },
    {
        "nama": "CINCIN NASRULLAH",
        "alamat": "Jalan. Purna Sakti, Jalur XI, Blok Kenanga, No. 06 RT.35 RW. 03 Kelurahan, Basirih, Kecamatan Banjarmasin Barat, 70245, Basirih, Banjarmasin Barat, Basirih",
        "lokasi": {
            "lat": -3.3349331,
            "lng": 114.5736601
        }
    },
    {
        "nama": "Moza ponsell (Teluk Tiram)",
        "alamat": "teluk tiram darat rt.26 no.12 rw.02 Kota Banjarmasin, Teluk Tiram",
        "lokasi": {
            "lat": -3.3359578,
            "lng": 114.5793762
        }
    },
    {
        "nama": "Pengrajin Cincin - Busra Ruslan - BR Jewelry",
        "alamat": "Gang Murni No.10, RT.27/RW.002",
        "lokasi": {
            "lat": -3.3349524,
            "lng": 114.5787589
        }
    },
    {
        "nama": "Distributor Independent",
        "alamat": "MH4F+5RH, Kelayan Selatan",
        "lokasi": {
            "lat": -3.3445676,
            "lng": 114.5746015
        }
    },
    {
        "nama": "Risoles Developer",
        "alamat": "MH6J+4JW, Jalan Bahagia, Teluk Tiram",
        "lokasi": {
            "lat": -3.3396485,
            "lng": 114.5815781
        }
    },
    {
        "nama": "FACE MASK ORGANIK",
        "alamat": "Gang Keluarga, Teluk Tiram",
        "lokasi": {
            "lat": -3.3401986,
            "lng": 114.5819509
        }
    },
    {
        "nama": "Hollow Labs Studio Music & Record",
        "alamat": "Jalan Raya Purnasakti, Basirih",
        "lokasi": {
            "lat": -3.333754,
            "lng": 114.5725057
        }
    },
    {
        "nama": "Kantor Kelurahan Basirih",
        "alamat": "MH79+HX7, Basirih",
        "lokasi": {
            "lat": -3.336091,
            "lng": 114.5699305
        }
    },
    {
        "nama": "PT. Kalimantan Fishery",
        "alamat": "Jalan Tanjung Berkat No.3, Teluk Tiram",
        "lokasi": {
            "lat": -3.3380118,
            "lng": 114.5823985
        }
    },
    {
        "nama": "ATM BANK BRI",
        "alamat": "MH8H+HQX, Jalan Teluk Tiram Darat, Telawang",
        "lokasi": {
            "lat": -3.3335077,
            "lng": 114.5794908
        }
    },
    {
        "nama": "ATM Mandiri",
        "alamat": "MH8H+JQG, Telawang",
        "lokasi": {
            "lat": -3.3334473,
            "lng": 114.5794601
        }
    },
    {
        "nama": "PT. Banjarmasin Bangkit",
        "alamat": "Roko, Jalan Gubernur Soebardjo Soebarjo Lingkar Selatan No.04 Blok. A, Basirih",
        "lokasi": {
            "lat": -3.3406671,
            "lng": 114.569053
        }
    },
    {
        "nama": "Advertising Banjarmasin | Agemedia",
        "alamat": "MH8C+WFW, Jalan Raya Purnasakti, Basirih",
        "lokasi": {
            "lat": -3.3326273,
            "lng": 114.5712054
        }
    },
    {
        "nama": "PT.Goautama Sinarbatuah",
        "alamat": "MH8J+5WV, Jalan Rantau Darat, Kelayan Selatan",
        "lokasi": {
            "lat": -3.334507,
            "lng": 114.5822969
        }
    },
    {
        "nama": "Diknaz Panajita",
        "alamat": "Jalan Tembus Mantuil No.2, Kelayan Sel., Banjarmasin Sel., Kota Banjarmasin, kelurahan 70234, Kelayan Selatan",
        "lokasi": {
            "lat": -3.3448026,
            "lng": 114.5863904
        }
    },
    {
        "nama": "Syifa Sewa Mobil Banjarmasin",
        "alamat": "Jalan Tembus Mantuil Lokasi III No.48, Kelayan Selatan",
        "lokasi": {
            "lat": -3.3452909,
            "lng": 114.5830766
        }
    },
    {
        "nama": "ATM BNI ALFIN WATERBOOM",
        "alamat": "Jalan Tembus Mantuil No. 18, Kuin Besar, Aluh-Aluh, Kelayan Selatan",
        "lokasi": {
            "lat": -3.3395272,
            "lng": 114.5884077
        }
    },
    {
        "nama": "Pegadaian UPC Cempaka",
        "alamat": "Jl. Mawar Kaca Piring, Cempaka Besar, RT.2/I, Kel. Kertak Baru Ilir, Kelayan Selatan",
        "lokasi": {
            "lat": -3.347366499999999,
            "lng": 114.5806885
        }
    },
    {
        "nama": "DMI Primagama",
        "alamat": "Ruko Kayutangi Blok.C No.2 C (samping BTN), Jl. Brigjend Hasan Basri, Kelayan Selatan",
        "lokasi": {
            "lat": -3.347366499999999,
            "lng": 114.5806885
        }
    },
    {
        "nama": "Pabrik Es Balok Nusantara Jaya",
        "alamat": "Jalan RK Ilir No.59, RT.22, Kelayan Selatan",
        "lokasi": {
            "lat": -3.3373971,
            "lng": 114.5846648
        }
    },
    {
        "nama": "ATM BNI BLG SYARIAH BANJARMASIN",
        "alamat": "Kelayan Selatan",
        "lokasi": {
            "lat": -3.347366,
            "lng": 114.580688
        }
    },
    {
        "nama": "ATM BNI RM ARWANA",
        "alamat": "Kelayan Selatan",
        "lokasi": {
            "lat": -3.347366,
            "lng": 114.580688
        }
    },
    {
        "nama": "Pegadaian UPS Kertak Baru",
        "alamat": "Jl. MT. Haryono No.107, RT.12/RW.05, Kelayan Selatan",
        "lokasi": {
            "lat": -3.347366499999999,
            "lng": 114.5806885
        }
    },
    {
        "nama": "ATM BNI",
        "alamat": "MH2M+3H4, Jalan Tembus Mantuil Lokasi III, Kelayan Selatan",
        "lokasi": {
            "lat": -3.349852,
            "lng": 114.583959
        }
    },
    {
        "nama": "MBDC Banjarmasin",
        "alamat": "Jl. Achmad Yani Km 2 No. 4 - 5, Kelayan Timur",
        "lokasi": {
            "lat": -3.3413224,
            "lng": 114.5910909
        }
    },
    {
        "nama": "Pegadaian UPS S Gardu",
        "alamat": "Jl. Veteran KM 5.4, RT.1/1 No.13, Kelayan Timur",
        "lokasi": {
            "lat": -3.3413223,
            "lng": 114.5910909
        }
    },
    {
        "nama": "\"DM Cell\"",
        "alamat": "MH7M+QRG, Jalan Teluk Tiram Darat, Kelayan Selatan",
        "lokasi": {
            "lat": -3.335574099999999,
            "lng": 114.584593
        }
    },
    {
        "nama": "Warung Acil Irus",
        "alamat": "MH5R+GPW, Gang Baja, Kelayan Timur",
        "lokasi": {
            "lat": -3.3411472,
            "lng": 114.5918273
        }
    },
    {
        "nama": "MTs Muhammadiyah 2 Banjarmasin (Masamuda Baja)",
        "alamat": "Gang Baja No.08 Kel, Kelayan Timur",
        "lokasi": {
            "lat": -3.3414631,
            "lng": 114.5920482
        }
    },
    {
        "nama": "Langgar Raudhatul Muslimin",
        "alamat": "komplek Ar-raudhah, Jalan Kelayan B No.13, RT.06/RW.02, Kelayan Timur",
        "lokasi": {
            "lat": -3.338984,
            "lng": 114.591911
        }
    },
    {
        "nama": "Amanah Anugerah Adi Mulia. PT",
        "alamat": "Jalan Dahlia II No.28, Mawar",
        "lokasi": {
            "lat": -3.3274831,
            "lng": 114.5805871
        }
    },
    {
        "nama": "Expedisi H Zarkasi",
        "alamat": "Jalan Teluk Tiram Darat No.25, Telawang",
        "lokasi": {
            "lat": -3.3313846,
            "lng": 114.5816869
        }
    },
    {
        "nama": "Depot Bakso Sidomulyo",
        "alamat": "Bar, Jalan Ampera Raya Jalan Teluk Tiram Darat, Telawang",
        "lokasi": {
            "lat": -3.3311495,
            "lng": 114.5818353
        }
    },
    {
        "nama": "AR TRUEMONEY",
        "alamat": "Jl. Teluk Tiram Darat Rt.13 Rw.01 No.45, Bar.,, Telawang",
        "lokasi": {
            "lat": -3.332236699999999,
            "lng": 114.5803669
        }
    },
    {
        "nama": "Yayasan Pendidikan Bina Islami \" Nurul ' Ulum \"",
        "alamat": "MH9J+HP2, Jalan Teluk Tiram Darat RT.20/RW.No. 3, Teluk Tiram",
        "lokasi": {
            "lat": -3.3311222,
            "lng": 114.5817724
        }
    },
    {
        "nama": "Yayasan Al Azhar Banjarmasin",
        "alamat": "Jalan Teluk Tiram Darat No.3 RT. 05, Telawang",
        "lokasi": {
            "lat": -3.3311012,
            "lng": 114.5818252
        }
    },
    {
        "nama": "Aaa",
        "alamat": "MH9J+66R, Jalan Teluk Tiram Darat, Telawang",
        "lokasi": {
            "lat": -3.3318984,
            "lng": 114.5805174
        }
    },
    {
        "nama": "ATM BCA",
        "alamat": "MH9M+R59, Jalan Teluk Tiram Darat, Telawang",
        "lokasi": {
            "lat": -3.330453,
            "lng": 114.582973
        }
    },
    {
        "nama": "BNI ATM",
        "alamat": "MH9M+R5W, Jalan Teluk Tiram Darat, Telawang",
        "lokasi": {
            "lat": -3.330397,
            "lng": 114.582957
        }
    },
    {
        "nama": "JNE",
        "alamat": "Jalan Teluk Tiram Darat No.8, RT.26, Telawang",
        "lokasi": {
            "lat": -3.3304162,
            "lng": 114.5830982
        }
    },
    {
        "nama": "Apotek Nazhan Farma",
        "alamat": "Jalan Teluk Tiram Darat No.16, RT.27, Telawang",
        "lokasi": {
            "lat": -3.3303034,
            "lng": 114.5838746
        }
    },
    {
        "nama": "Alfamart",
        "alamat": "Jalan Rantauan Darat Kel RT.8/RW.3, Kelayan Selatan",
        "lokasi": {
            "lat": -3.335022,
            "lng": 114.585056
        }
    },
    {
        "nama": "TIKI Gerai Dahlia",
        "alamat": "MHCM+8FJ, Jalan Dahlia, Telawang",
        "lokasi": {
            "lat": -3.3291563,
            "lng": 114.583627
        }
    }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { q } = req.query;
    const keyword = typeof q === 'string' ? q.toLowerCase() : '';

    if (!keyword) {
        return res.status(200).json([]);
    }

    const results = mockAddresses.filter((addr) =>
        addr.nama.toLowerCase().includes(keyword) ||
        addr.alamat.toLowerCase().includes(keyword)
    );

    res.status(200).json(results);
}
