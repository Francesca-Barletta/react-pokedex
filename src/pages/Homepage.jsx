import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addSingleItemToList,
  cleanList,
  openModal,
  removeFromList,
} from "../redux/reducers/poke-reducer";
import { FaTrash } from "react-icons/fa";
import { MdCatchingPokemon } from "react-icons/md";
import Modal from "../components/Modal";

const Homepage = () => {
  //per dispatchare le azioni del reducer
  const dispatch = useDispatch();
  //parola scritta nell'input
  const [query, setQuery] = useState("");
  //oggetto restituito dalla chiamata
  const [findPokemon, setFindPokemon] = useState(null);
  //immagine per mostrare il pokemon trovato 
  const [image, setImage] = useState(null);
  //costante per monitorare se la ricerca è stata eseguita o l'utente ha solo digitato la parola
  const [searchPerformed, setSearchPerformed] = useState(false);
  //useSelector serve per accedere allo stato globale e qui ne estrae una parte state.list è la porzione associata allo slice list, state .list.list accede alla proprietà list nello slice list
  const myPokemons = useSelector((state) => state.list.list);
  // console.log('State from useSelector:', myPokemons);
  //funzione che controlla se il pokemon trovato è già nella lista di quelli salvati
  //metodo degli array some che controlla se almeno un elemento dell'array soddisfa la condizione specificata se non lo trova restituisce false
  const isPokemonInList = findPokemon && myPokemons.some((pokemon) => pokemon.id === findPokemon.id);
  
  const [pokeList, setPokeList] = useState(null);

  const [baseNext, setBaseNext] = useState(0);
  const [page, setPage] = useState(`?offset=${baseNext}&limit=20`)

  const handleNextList = () => {
    if(baseNext < 1025){
    const newOffset = baseNext + 20
    setBaseNext(newOffset);
    console.log('newOffset', newOffset);
    setPage(`?offset=${newOffset}&limit=20`)
    console.log('page', page);
    }
 }

 const handlePrevList = () => {
  if(baseNext > 0){

    const newOffset = baseNext - 20
    setBaseNext(newOffset);
    console.log('newOffset', newOffset);
    setPage(`?offset=${newOffset}&limit=20`)
    console.log('page', page);
  }
}

 useEffect(() => {
  allPokemon()
 }, [page])

  //funzione al click per aggiungere pokemon alla lista
  const handleCapture = () => {
    if (findPokemon) {
      dispatch(addSingleItemToList(findPokemon));
      // console.log("pokemon catturato", findPokemon);
    }
  };

  // funzione asincrona di ricerca
  const searchPokemon =  useCallback(async () => {
     //setta la ricerac come attivata
    setSearchPerformed(true);
    try {
      //viene effetuata la chiamata api get con axios passandogli dinamicamente la parola inserita dall'utente in minuscolo
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      //viene settato il findpokemon con response.data
      setFindPokemon(response.data);
      //viene settata la prima immagine da vedere con quella front
      setImage(response.data.sprites["front_default"]);
      //viene riazzerata ala parola nella barra di ricerca
      setQuery("");
    } catch (error) {
      //se la chiamata ha qualche errore il findpokemon viene settato a null
      setFindPokemon(null);
    }
   }, [query]);

  //funzione searchPokemon richiamata anche cliccando enter oltre che al pulsante
  const handleKeyPress = (e) => {
    if (e.key == "Enter") {
      searchPokemon();
    }
  };

  const handlePokeButton = (name) => {
    const getPokemonFromList = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setFindPokemon(response.data);
        console.log(findPokemon);
        setImage(response.data.sprites["front_default"]);
      } catch (error) {
        setFindPokemon(null);
      }
    }
    getPokemonFromList();
   
  }
  
function allPokemon() {
  const getList = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${page}`);
      setPokeList(response.data.results);
      console.log('pokelist', response.data.results);
    } catch (error) {
      setPokeList(null)
    }
  };
  getList();
  
  
}


  //funzione che dato il numero di indez minore e maggiore dell'array che contiene tutti i pokemon ne prende uno casualmente
  function randomPoke() {
    setQuery("");
    const min = 0;
    const max = 1025;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    //generato il numero viene dichiarata la funzione che fa la chiamata questa volta utilizzado il numero come id
    const getRandom = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${randomNum}`
        );
        setFindPokemon(response.data);
        setImage(response.data.sprites["front_default"]);
      } catch (error) {
        console.error("Nessun Pokemon corrisponde alla ricerca", error);
        setFindPokemon(null);
      }
    };
    //viene invocata la funzione per la chiamata
    getRandom();
  }
  
  //funzione che azzera la ricerca
  function clear() {
    setQuery("");
    setFindPokemon(null);
    setSearchPerformed(false);
    setPokeList(null);
    setBaseNext(0);
    setPage(`?offset=${baseNext}&limit=20`);

  }
  //useEffect per gestire l'animazione dell'immagine
  useEffect(() => {
    let interval;
    //se il pokemon cercato esiste
    if (findPokemon) {
      //salvo in 2 costanti il percorso per ricavare immagine front e back
      const front = findPokemon.sprites["front_default"];
      const back = findPokemon.sprites["back_default"];
      //se le immagini ci sono
      if (front && back) {
        //interval  esegue un setInterval che setta l'immagine se è front diventa backe e viceversa
        interval = setInterval(() => {
          setImage((prevImage) => (prevImage === front ? back : front));
          //ogni 2 secondi
        }, 2000);
      } else {
        //sennò l'immagine resta o front o back
        setImage(front || back);
      }
    }
    //cleanup function per non eseguire all'infinito
    return () => clearInterval(interval);
    //useEffect viene eseguito quando cambia il pokemon cercato/trovato
  }, [findPokemon]);

  return (
    <Wrapper>
      <div className="container h-100 d-flex justify-content-center align-items-center">
        <div className="row app-bg gap-3 px-1 py-4 justify-content-center">
          <div className="col-8 d-flex justify-content-center">
            <img src="./pokedex.png" alt="pokedex" className="mx-auto" />
          </div>
          <div className="col-10 d-flex flex-wrap justify-content-between align-items-center gap-1 px-1 py-3">
            <div>

            <input
              className="rounded me-2"
              type="text"
              placeholder="Pokémon name"
              // al rilascio di enter viene eseguita la funzione
              onKeyUp={handleKeyPress}
              value={query}
              // quando cambia la query viene settata con quella nuova
              onChange={(e) => {
                setQuery(e.target.value);
                //mentre digito la query non sto facendo ancora la ricerca
                setSearchPerformed(false);
              }}
            />
            <button className="btn btn-blue" onClick={searchPokemon}>Search</button>
            </div>
            
            <button className="btn btn-blue" onClick={allPokemon}>Pokémon List</button>
            <button className="btn btn-blue" onClick={randomPoke}>Pokémon random</button>
            <button className="btn btn-orange" onClick={clear}>Clear</button>
            
          </div>
          <div className="col-10 col-md-6 border d-flex flex-column border-white rounded p-2">
            {pokeList ? (
              <div className="d-flex flex-column align-items-center gap-2 p-2 h-100 justify-content-center">
                 <h4 className="text-white fw-bold find">Pokémon List</h4>
                 <ul className="list-unstyled d-flex justify-content-center gap-2 bg-light p-2 shadow rounded flex-wrap">
                {pokeList.map((poke, index) => {
                  return (
                    <li key={index}><button className="btn btn-orange" onClick={() =>{handlePokeButton(poke.name)}}>{poke.name}</button></li>
                  )
                })}
                </ul>
               </div>
            ) : ("")}
            {pokeList ? (
                <div className="d-flex justify-content-between align-items-center m-2">
                <button className="btn btn-blue" onClick={handlePrevList}>Prev</button>
                  <button className="btn btn-blue" onClick={handleNextList}>Next</button>
                </div>
            ) : ("") }
            {findPokemon ? (
              <div className="d-flex flex-column align-items-center gap-2 h-100 justify-content-center">
                 <h4 className="text-white fw-bold find">Pokémon Find</h4>
                <div className="img-box">
                  <img src={image} alt={findPokemon.name} />
                </div>
                <div className="container bg-white flex-grow-1">
                  <div className="row  justify-content-between align-items-start g-0 py-2">
                    <div className="col-6">
                      <p><span className="fw-bold">Name: </span> {findPokemon.name}</p>
                      <p><span className="fw-bold">Type: </span> {findPokemon.types[0].type["name"]} </p>
                      <p><span className="fw-bold">Height: </span> {findPokemon.height}</p>
                      <p><span className="fw-bold">Weight: </span>{findPokemon.weight}</p>
                    </div>

                    <div className="col-4 d-flex row-reverse">
                      {!isPokemonInList && (
                        <button className="btn btn-orange ms-auto" onClick={handleCapture}>
                          <MdCatchingPokemon className="mb-1" /> Catch!</button>
                      )}
                    </div>

                    <div className="col-12 d-flex flex-column">
                      <h4 className="text-center fw-bold my-2 py-2 rounded my-bg-blue text-warning"> Stats </h4>
                      <ul className="list-unstyled">
                        {findPokemon.stats.map((el, index) => {
                          return (
                            <li key={index} className="d-flex align-items-center justify-content-between">
                              <span className="fw-bold">{el.stat["name"]}</span>
                              <div className="border border-dark box-state">
                                <div className="bg-dark" style={{width: `${el.base_stat}px`, height: "6px"}}></div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              searchPerformed && (
                <p className="text-center bg-white p-2"> No Pokémon found </p>
              )
            )}
          
          </div>
          <div className="col-10 col-md-5 d-flex flex-column border border-white rounded p-2">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-white fw-bold mb-2">My Pokémon</h4>
              {myPokemons.length > 0 ? (
                <button className="btn btn-orange" onClick={() => dispatch(cleanList())}>
                  <FaTrash className="mb-1"/> Delete list</button>
              ) : ("")} 
            
            </div>

            <div className="container pt-2 flex-grow-1 bg-white">
              {myPokemons.length > 0 ? (
                <table className="table">
                  <tbody className="border-0">
                    {myPokemons.map((el) => {
                      return (
                        <tr key={el.id}
                          className="row row-cols-2 mx-auto row-cols-lg-4 w-100 border shadow py-2 justify-content-center align-items-center">
                          <td className="col-6 col-lg-3 border-0 text-center">
                            <img src={el.sprites["front_default"]} alt={el.name}/>
                          </td>
                          <td className="col-6 col-lg-3 border-0 text-center fw-bold">{el.name}{" "}</td>
                          <td className="col-6 col-lg-3 border-0 text-center">
                            <button className=" btn btn-warning fw-bold" onClick={() => dispatch(openModal(el))}>{" "} Details{" "}</button>
                          </td>
                          <td className=" col-6 col-lg-3 border-0 text-center">
                            <button className=" btn btn-orange fw-bold" onClick={() => dispatch(removeFromList(el))}>{" "} X</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="text-center"> No Pokémon in the list</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal />
    </Wrapper>
  );
};

const Wrapper = styled.article`
  flex-grow: 1;
  background-image: url("./bg-image.jpg");
  background-size: cover;
  background-position: center;
  
  .box-state{
     width: 200px;
     height: 8px;
  }
  .img-box{
    width: 100%;
    height:100px;
    background-color: white;
    display:flex;
    justify-content: center;
  }
  .find{
    margin-bottom:25px;
  }
  .app-bg{
    background-image: linear-gradient(#ffc400, #ff5e00);
    /* background: linear-gradient(90deg,#000,#ccc); */
    opacity: .9;
    border: 12px solid #080855;
    border-radius: 18px;
  }
  .my-bg-blue{
    background-color: #070799;
  }
  .btn-orange{
    background-color: #ff5100;
    color:white; 
    &:hover{
      background-color: #ffc400;
    }
  }
  .btn-blue{
    background-color: #070799;
    color:white; 
    &:hover{
      background-color: #2828f3;
    }
  }

`;

export default Homepage;
