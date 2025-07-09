export const getLatLngFromNominatim = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    const query = encodeURIComponent(`${address}, Indonesia`);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "YourAppName/1.0", // wajib untuk Nominatim
            },
        });
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
            };
        }
        return null;
    } catch (err) {
        console.error("Nominatim Error:", err);
        return null;
    }
};
