import { configureStore } from '@reduxjs/toolkit';
import pokeReducer from './reducers/poke-reducer';

export const store = configureStore({
  reducer: {
    list: pokeReducer
  },
 
})

export default store;