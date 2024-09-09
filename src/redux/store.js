import { configureStore } from '@reduxjs/toolkit';
import apiReducer from './reducers/api-reducer';

export const store = configureStore({
  reducer: {
    pokemon:apiReducer,
  },
 
})

export default store;