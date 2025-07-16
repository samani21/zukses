import { ChevronDownIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
const locationData = [
    { name: 'BALI', cities: [{ name: 'KOTA DENPASAR', districts: ['Denpasar Selatan'] }] },
    { name: 'BANGKA BELITUNG', cities: [{ name: 'KOTA PANGKAL PINANG', districts: ['Pangkal Balam'] }] },
    { name: 'BANTEN', cities: [{ name: 'KAB. TANGERANG', districts: ['Cikupa', 'Balaraja'] }, { name: 'KOTA SERANG', districts: ['Serang', 'Cipocok Jaya'] }] },
    { name: 'BENGKULU', cities: [{ name: 'KOTA BENGKULU', districts: ['Gading Cempaka'] }] },
    { name: 'DI YOGYAKARTA', cities: [{ name: 'KOTA YOGYAKARTA', districts: ['Gondokusuman'] }] },
    { name: 'DKI JAKARTA', cities: [{ name: 'KOTA JAKARTA SELATAN', districts: ['Kebayoran Baru', 'Tebet'] }, { name: 'KOTA JAKARTA PUSAT', districts: ['Gambir', 'Menteng'] }] },
    { name: 'GORONTALO', cities: [{ name: 'KOTA GORONTALO', districts: ['Kota Tengah'] }] },
    { name: 'JAMBI', cities: [{ name: 'KOTA JAMBI', districts: ['Jambi Selatan'] }] },
    { name: 'JAWA BARAT', cities: [{ name: 'KOTA BANDUNG', districts: ['Coblong', 'Sukajadi'] }, { name: 'KOTA BEKASI', districts: ['Bekasi Timur', 'Bekasi Barat'] }] },
    { name: 'JAWA TENGAH', cities: [{ name: 'KOTA SEMARANG', districts: ['Semarang Tengah'] }] },
    { name: 'JAWA TIMUR', cities: [{ name: 'KOTA SURABAYA', districts: ['Gubeng'] }] },
    { name: 'KALIMANTAN BARAT', cities: [{ name: 'KOTA PONTIANAK', districts: ['Pontianak Kota'] }] },
    { name: 'KALIMANTAN SELATAN', cities: [{ name: 'KOTA BANJARMASIN', districts: ['Banjarmasin Barat', 'Banjarmasin Selatan', 'Banjarmasin Tengah', 'Banjarmasin Timur', 'Banjarmasin Utara'] }, { name: 'KOTA BANJARBARU', districts: ['Banjarbaru Utara', 'Banjarbaru Selatan'] }, { name: 'KAB. BANJAR', districts: ['Martapura', 'Gambut'] }] },
];
const TabButton: React.FC<{ text: string; isActive: boolean; onClick: () => void; disabled?: boolean }> = ({ text, isActive, onClick, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`flex-1 p-3 text-sm font-medium text-center whitespace-nowrap ${isActive ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500 hover:bg-gray-100'
            } disabled:text-gray-300 disabled:cursor-not-allowed`}
    >
        {text}
    </button>
);
const ItemButton: React.FC<{ text: string; onClick: () => void; isSelected?: boolean }> = ({ text, onClick, isSelected }) => (
    <button
        type="button"
        onClick={onClick}
        className={`text-left p-2 rounded-md text-sm whitespace-nowrap ${isSelected
                ? 'bg-teal-500 text-white'
                : 'text-gray-700 hover:bg-teal-100 focus:bg-teal-100'
            } focus:outline-none`}
    >
        {text}
    </button>
);
const LocationSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'province' | 'city' | 'district'>('province');
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const cities = locationData.find(p => p.name === selectedProvince)?.cities || [];
    const districts = cities.find(c => c.name === selectedCity)?.districts || [];

    const handleSelectProvince = (provinceName: string) => {
        setSelectedProvince(provinceName);
        setSelectedCity(null);
        setSelectedDistrict(null);
        setActiveTab('city');
    };

    const handleSelectCity = (cityName: string) => {
        setSelectedCity(cityName);
        setSelectedDistrict(null);
        setActiveTab('district');
    };

    const handleSelectDistrict = (districtName: string) => {
        setSelectedDistrict(districtName);
        setIsOpen(false);
    };

    const getDisplayValue = () => {
        if (!selectedProvince) return "Provinsi, Kota/Kabupaten, Kecamatan";
        const parts = [selectedProvince, selectedCity, selectedDistrict].filter(Boolean);
        return parts.join(' / ');
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);


    return (
        <div className="relative" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span className={selectedProvince ? 'text-gray-800' : 'text-gray-500'}>{getDisplayValue()}</span>
                <ChevronDownIcon />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="flex border-b">
                        <TabButton text="Provinsi" isActive={activeTab === 'province'} onClick={() => setActiveTab('province')} />
                        <TabButton text="Kota/Kabupaten" isActive={activeTab === 'city'} onClick={() => setActiveTab('city')} disabled={!selectedProvince} />
                        <TabButton text="Kecamatan" isActive={activeTab === 'district'} onClick={() => setActiveTab('district')} disabled={!selectedCity} />
                    </div>

                    <div className="p-2 max-h-60 overflow-y-auto">
                        <div className="flex flex-wrap gap-2">
                            {activeTab === 'province' && locationData.map(province => (
                                <ItemButton
                                    key={province.name}
                                    text={province.name}
                                    onClick={() => handleSelectProvince(province.name)}
                                    isSelected={province.name === selectedProvince}
                                />
                            ))}
                            {activeTab === 'city' && cities.map(city => (
                                <ItemButton
                                    key={city.name}
                                    text={city.name}
                                    onClick={() => handleSelectCity(city.name)}
                                    isSelected={city.name === selectedCity}
                                />
                            ))}
                            {activeTab === 'district' && districts.map(district => (
                                <ItemButton
                                    key={district}
                                    text={district}
                                    onClick={() => handleSelectDistrict(district)}
                                    isSelected={district === selectedDistrict}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default LocationSelector