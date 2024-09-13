
//createSlice crea uno slice/porzione di stato con reducers e azioni per gestirlo
//creatAction funzione redux toolkit per creare azioni
//isAnyOf funzione redux toolkit che consente di creare un matcher per piu azioni
import { createSlice,  createAction, isAnyOf } from "@reduxjs/toolkit";
//prendere e esalvare nel dati localStorage 
import { getItemFromLocalStorage, setLocalStorageItem } from "../../localStorage";

// matchers che determinano se l'azione corrisponde ad una certa azione con endsWith(/nome Azione)
const isAddToListAction = (action) => {
    return action.type.endsWith("/addToList")
};

const isListClean = (action) => {
    return action.type.endsWith("/cleanList")
}

const isRemovedFromList = (action) => {
    return action.type.endsWith("remove-from-list")
};

//un matcher con isAnyOf che quindi verifica se un'azione corrisponde a più matcher
const isListAction = (action) => {
    return isAnyOf(isAddToListAction, isRemovedFromList, isListClean)(action);
};

//creazioni di azioni per togliere dalla lista dei preferiti ed aprire o chiudere il modale
const removeFromList = createAction("remove-from-list");
const openModal = createAction("open-modal");
const closeModal = createAction("close-modal");
//recupero dei dati dal localStorage
const localStorageList = getItemFromLocalStorage("list")
// const totalFromLocalStorage = getItemFromLocalStorage("total")


//definizione dello stato iniziale dello slice 
const initialValue = {
    //utilizza i dati recuperati dal local Storage se presenti sennò imposta valori predefiniti
   list: localStorageList && localStorageList.length > 0 ? localStorageList : [],

   selectedPokemon: null,
   isModalOpen: false,
}

//creazione dello slice
const pokeSlice = createSlice({
    //nome dello slice usato nello store
    name: 'list',
    //stato iniziale dello slice
    initialState:initialValue,
    //funzioni del reduce che modificano lo stato basato su azioni specifiche
    reducers: {
        //aggiunge un el alla lista, state è l'attuale stato dello slice, action fornisce i dati per aggiornare lo stato
        // è un oggetto che ha type che è il nome  es addTolist e payload che è l'oggetto o dato passato
        addToList: (state, action) =>{
            state.list.push(action.payload)
         
        },
        //azzera la lista
        cleanList: (state) => {
            state.list = []
          
        },
    },
    //gestisce azioni e i metchers esterni allo slice definisce come lo stato dovrebbe reagire a diverse azioni
    extraReducers: (builder) => {
        //builder passato come parametro è un oggetto che fornisce metodi per aggiungere gestori di azioni e matcher come .addcase e addMatcher
        builder
        //aggiunge un gestore per un'azione specifica, gli addcase vanno messi prima degli addMatcher
        .addCase(removeFromList, (state, action) => {
            state.list = state.list.filter((el) => el.id !== action.payload.id);
        })
        .addCase(openModal, (state, action) => {
            state.selectedPokemon = action.payload;
            state.isModalOpen = true;
        })
        .addCase(closeModal, (state) => {
            state.selectedPokemon = null;
            state.isModalOpen = false
        })
        //gestore basato su un matcher, verifica se un'azione soddisfa una condizione, dunque il reducer associato verrà eseguito
        .addMatcher(isAddToListAction, (state, action) => {
            // console.log('Received isAddToListAction matcher:', action);
            // console.log('Payload:', action.payload);
            state.total += action.payload;
        })
        .addMatcher(isRemovedFromList, (state, action) => {
            state.total -= action.payload;
        })
        .addMatcher(isListAction, (state) => {
            setLocalStorageItem("list", state.list);
            // console.log('lista', state.list);
            
        })
        //comportamento di fallback nel caso ci siano azioni che non corrispondono ai case o matcher definiti
        .addDefaultCase((state) => {
            return state;
        });
    },
});

//funzione che accetta un oggetto come parametro e restituisce una funzione che accetta 2 argomenti: dispatch e getstate
//verifica se un elemento item è già nella lista
//getstate è una funzione redux che permette di accedere all'intero stato dell'applicazione
const addSingleItemToList = (item) => (dispatch, getState) => {
    //get state viene destrutturato per accedere alla proprietà list
    const {list} = getState().list;
    //qui si controlla che l'elemento nella lista "x" con lo stesso id del'item
    if(list.find(x =>x.id === item.id)){
        //se viene trovatola funzione esce
        return;
    }
    //altrimenti viene inviata (dispatch) l'azione addToListe viene aggiornato lo stato aggiungendo l'elemento alla lista
    dispatch(addToList(item));
};


//esportazione delle azioni create dallo slice
export const {addToList, cleanList} = pokeSlice.actions;
// esporta azioni create con createactione fuori dallo slice
export { addSingleItemToList, removeFromList, openModal, closeModal };
//destruttura lo slice ed estrae il reducer
const {reducer} = pokeSlice;
// esporta il reducer
export default reducer;

//con export default non serve importare con lo stesso nome e posso esportare solo un valore
//con export const {} posso esportare piu valori e devo usare i nomi esatti nell'import