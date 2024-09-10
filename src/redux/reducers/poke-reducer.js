import { createSlice,  createAction, isAnyOf } from "@reduxjs/toolkit";
import { getItemFromLocalStorage, setLocalStorageItem } from "../../localStorage";

const isAddToListAction = (action) => {
    return action.type.endsWith("/addToList")
};

const isListClean = (action) => {
    return action.type.endsWith("/cleanList")
}

const isRemovedFromList = (action) => {
    return action.type.endsWith("remove-from-list")
};


const isListAction = (action) => {
    return isAnyOf(isAddToListAction, isRemovedFromList, isListClean)(action);
};

const removeFromList = createAction("remove-from-list");

const localStorageList = getItemFromLocalStorage("list")
const totalFromLocalStorage = getItemFromLocalStorage("total")

const initialValue = {
   list: localStorageList && localStorageList.length > 0 ? localStorageList : [],
   total: totalFromLocalStorage || 0,
}

const pokeSlice = createSlice({
    name: 'list',
    initialState:initialValue,
    reducers: {
        addToList: (state, action) =>{
            state.list.push(action.payload)
            
            
        },
        cleanList: (state) => {
            state.list = []
            state.total = 0
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(removeFromList, (state, action) => {
            state.list = state.list.filter((el) => el.id !== action.payload.id);
        })
        .addMatcher(isAddToListAction, (state, action) => {
            state.total += action.payload.likes;
        })
        .addMatcher(isRemovedFromList, (state, action) => {
            state.total -= action.payload.likes;
        })
        .addMatcher(isListAction, (state) => {
            setLocalStorageItem("list", state.list);
            console.log('lista', state.list);
            
            setLocalStorageItem("total", state.total)
        })
        .addDefaultCase((state) => {
            return state;
        });
    },
});
const addSingleItemToList = (item) => (dispatch, getState) => {
    const {list} = getState().list;
    if(list.find(x =>x.id === item.id)){
        return;
    }
    dispatch(addToList(item));
};



export const {addToList, cleanList} = pokeSlice.actions;
export { addSingleItemToList, removeFromList };

const {reducer} = pokeSlice;
export default reducer;