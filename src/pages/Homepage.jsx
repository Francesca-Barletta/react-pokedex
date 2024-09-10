import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addSingleItemToList, cleanList, removeFromList } from '../redux/reducers/poke-reducer'

const Homepage = () => {
const dispatch = useDispatch();
const [query, setQuery] = useState("");
const [findPokemon, setFindPokemon] = useState(null);
const myPokemons = useSelector(state => state.list.list);

const handleCapture = () => {
    if(findPokemon) {
        dispatch(addSingleItemToList(findPokemon));
        console.log('pokemon catturato', findPokemon )
    }
}
const searchPokemon = async () => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query}`);
        setFindPokemon(response.data);
        console.log(response.data);
        
    } catch (error) {
        console.error("Nessun Pokemon corrisponde alla ricerca", error);
        setFindPokemon(null);
    }
    
}


  return (
    <section className='flex-grow-1 bg-dark'>
        <div className="container h-100 d-flex justify-content-center align-items-center ">
            <div className="row bg-primary p-5 justify-content-around rounded shadow">
                <div className="col-12">
                    <h1 className='text-warning bg-white rounded text-center fw-bold'>Pokedex</h1>
                </div>
                <div className="col-12 d-flex justify-content-center gap-3 p-3">
                    <input type="text" placeholder='cerca un pokemon' value={query} onChange={(e) => {setQuery(e.target.value)}}/>
                    <button className='btn btn-warning' onClick={searchPokemon}>Cerca</button>
                </div>
                <div className="col-6 border border-white rounded p-2">
                    <p className='text-white text-center fw-bold mb-2'>I dati del pokemon cercato</p>
                    <div className="info-box" style={{width:"100%"}}>
                        {findPokemon ? (
                            <div className='d-flex flex-column align-items-center  gap-2 justify-content-center'>
                                <div className='img-box bg-white d-flex justify-content-center'  style={{width:"50%", height:"100px"}}>
                                         <img src={findPokemon.sprites['front_default']} alt={findPokemon.name} />
                                </div>
                                <button className='btn btn-danger' onClick={handleCapture}>Cattura</button>
                                <div className='bg-white w-100 p-2'>
                                    <p><span className='fw-bold'>Nome:</span>{findPokemon.name}</p>
                                    <p><span className='fw-bold'>Type:</span>{findPokemon.types[0].type['name']}</p>
                                    <p><span className='fw-bold'>Height:</span>{findPokemon.height}</p>
                                    <p><span className='fw-bold'>Weight:</span>{findPokemon.weight}</p>
                                <h4>Stats</h4>
                                <ul className='list-unstyled'>
                                    {findPokemon.stats.map((el, index) =>{
                                        return (
                                            <li key={index} className='d-flex align-items-center justify-content-between'><span className='fw-bold'>{el.stat['name']}</span>
                                            <div className='border border-dark'style={{width:"50%", height:"8px"}}>
                                                <div className='bg-dark' style={{width:`${el.base_stat}px`, height:"6px",}}></div>
                                            </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                                </div>
                           
                            
                            </div>
                        ) : (
                            <p>nessun pokemon trovato</p>
                        )}
                         
                  
                    </div>
                </div>
                <div className="col-5 border border-white rounded p-2">
                    <div className="d-flex">
                    <p className='text-white text-center fw-bold mb-2'>I miei pokemon</p>
                    <button className='btn btn-danger' onClick={() =>dispatch(cleanList())}>Elimina tutto</button>
                    </div>
                    
                    <div className="info-box bg-white" style={{width:"100%", height:""}}></div>
                    {myPokemons.length > 0 ? (
                        <ul>
                            {myPokemons.map((el) => {
                                return <li className='d-flex' key={el.id}>
                                    <p>{el.name}</p>
                                    <button className='btn btn-danger' onClick={() =>dispatch(removeFromList(el))}>x</button>
                                </li>
                            })}
                        </ul>
                    ) : (<p>nessun pokemon nella lista</p>)}
                </div>
            </div>
        </div>
    </section>
  )
}

export default Homepage