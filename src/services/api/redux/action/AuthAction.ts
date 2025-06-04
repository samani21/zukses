export const getUserInfo = () => {
    try {
        const jsonValue = localStorage.getItem("user");
        return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error("Error parsing user:", e);
        return null; // gunakan null, bukan false
    }
};