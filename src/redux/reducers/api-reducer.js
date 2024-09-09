import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
const initialState = {
    loading : true,
    error: {
        status: false,
        message: "",
    },
    pokemon: [],
};

const apiSlice = createSlice({
    name: 'api',
    initialState,
    reducers: {
        startLoading: (state) =>{
            state.loading = true;
            state.pokemon = [];
        },
        stopLoading : state => {
            state.loading = false;
        },
        saveData: (state, action) =>{
            state.pokemon = action.payload;
        },
        saveQuery: (state, action) => {
            state.query = { ...action.payload };
        },
        catchError: (state, action) => {
            state.error.status = true;
            state.error.message = action.payload;
            state.pokemon = [];
        },
        cleanError: (state) => {
            state.error.status = false;
            state.error.message = "";
        }
    }
})

const {startLoading, stopLoading, saveData, catchError, cleanError} = apiSlice.actions;

const {reducer} = apiSlice;


//questo dispatch andrà a dispatchare le funzioni elencate sopra nell'apislice
export const fetchData = (path) => async (dispatch) => {
    dispatch(startLoading())
    dispatch(cleanError())
    try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon/");
        dispatch(saveData(response.data.results));
    } catch (error) {
        dispatch(catchError(error.message || "errore"))
    }
    dispatch(stopLoading())
}

export default reducer