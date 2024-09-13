
//funzione di redux toolkit che configura lo store di redux
import { configureStore } from '@reduxjs/toolkit';
//reducer
import pokeReducer from './reducers/poke-reducer';

//viene creato lo store redux e accetta un oggetto di configurazione come argomento
export const store = configureStore({
  //oggetto reducer che gestisce lo stato dell'applicazione con una chiave list e un valore pokeReducer
  reducer: {
    list: pokeReducer
  },
 
})

export default store;