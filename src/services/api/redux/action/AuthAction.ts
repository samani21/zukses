export const getUserInfo = () => {
    try {
        const jsonValue = localStorage.getItem("user");
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error(e);
        return false;
    }
};