export const getItemFromLocalStorage = (key) => {
    if( localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key))
    }
    return null;
};

export const setLocalStorageItem = (key, item) => {
    if(item && typeof key === "string") {
        localStorage.setItem(key, JSON.stringify(item));
    }
};