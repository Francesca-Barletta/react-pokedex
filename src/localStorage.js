
//recupera un valore dal localStorage KEY è il nome del dato da recuperare
export const getItemFromLocalStorage = (key) => {
    if( localStorage.getItem(key)) {
        //lo converte da JSON a oggetto js e restituisce il risultato
        return JSON.parse(localStorage.getItem(key))
    }
    //ritorna null se il valore non esiste
    return null;
};
//salva un vaolre nel LocalStorage ITEM è l'oggetto o il valore da salvare
export const setLocalStorageItem = (key, item) => {
    //verifica che i parametri siano validi ( se item esiste e ekey è una stringa)
    if(item && typeof key === "string") {
        //dopo aver convertito il JSON in stringa salva il valore
        localStorage.setItem(key, JSON.stringify(item));
    }
};