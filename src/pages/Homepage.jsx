import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addSingleItemToList,
  cleanList,
  removeFromList,
} from "../redux/reducers/poke-reducer";
import { FaTrash } from "react-icons/fa";
import { MdCatchingPokemon } from "react-icons/md";
import { TiDelete } from "react-icons/ti";


const Homepage = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [findPokemon, setFindPokemon] = useState(null);
  const myPokemons = useSelector((state) => state.list.list);

  const handleCapture = () => {
    if (findPokemon) {
      dispatch(addSingleItemToList(findPokemon));
      console.log("pokemon catturato", findPokemon);
    }
  };

  const searchPokemon = async () => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      setFindPokemon(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Nessun Pokemon corrisponde alla ricerca", error);
      setFindPokemon(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key == "Enter") {
      searchPokemon();
    }
  };

  function randomPoke() {
    const min = 0;
    const max = 1025;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandom = async () =>{
    try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${randomNum}`
        );
        setFindPokemon(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Nessun Pokemon corrisponde alla ricerca", error);
        setFindPokemon(null);
      }
    };
    getRandom()
  }


  return (
    <section className="flex-grow-1 bg-dark">
      <div className="container h-100 d-flex justify-content-center align-items-center ">
        <div className="row bg-primary bg-gradient p-2 justify-content-around rounded shadow">
          <div className="col-12">
            <h1 className="text-warning bg-white rounded text-center fw-bold">
              Pokedex
            </h1>
          </div>
          <div className="col-12 d-flex justify-content-center gap-3 p-3">
            <input
             className="rounded"
              type="text"
              placeholder="cerca un pokemon"
              onKeyUp={handleKeyPress}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            <button className="btn btn-warning" onClick={searchPokemon}>
              Cerca
            </button>
            <button className="btn btn-danger ms-3" onClick={randomPoke}>
              random
            </button>
          </div>
          <div className="col-12 col-md-6 border d-flex flex-column border-white rounded p-2">
          
           
              {findPokemon ? (
                <div className="d-flex flex-column align-items-center gap-2 h-100 justify-content-center">
                  <div
                    className="img-box bg-white d-flex justify-content-center"
                    style={{ width: "100%", height: "100px" }}
                  >
                    <img
                      src={findPokemon.sprites["front_default"]}
                      alt={findPokemon.name}
                    />
                  </div>
                  <div className="container bg-white flex-grow-1">
                  <div className="row  justify-content-between align-items-start g-0 p-2">
                    <div className="col-6"
                  >
                      <p>
                        <span className="fw-bold">Nome: </span>
                        {findPokemon.name}
                      </p>
                      <p>
                        <span className="fw-bold">Type: </span>
                        {findPokemon.types[0].type["name"]}
                      </p>
                      <p>
                        <span className="fw-bold">Height: </span>
                        {findPokemon.height}
                      </p>
                      <p>
                        <span className="fw-bold">Weight: </span>
                        {findPokemon.weight}
                      </p>
                    </div>
                   
                      <button
                        className="btn btn-danger w-25"
                        onClick={handleCapture}><MdCatchingPokemon className="mb-1" />Cattura</button>
                    
                    <div className="col-12 d-flex flex-column">
                      <h4 className="text-center fw-bold my-2 py-2 rounded bg-primary text-warning">
                        Stats
                      </h4>
                      <ul className="list-unstyled">
                        {findPokemon.stats.map((el, index) => {
                          return (
                            <li
                              key={index}
                              className="d-flex align-items-center justify-content-between"
                            >
                              <span className="fw-bold">{el.stat["name"]}</span>
                              <div
                                className="border border-dark"
                                style={{ width: "150px", height: "8px" }}
                              >
                                <div
                                  className="bg-dark"
                                  style={{
                                    width: `${el.base_stat}px`,
                                    height: "6px",
                                  }}
                                ></div>
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
                query && <p> nessun pokemon trovato </p>
              )}
            
          </div>
          <div className="col-12 d-flex flex-column col-md-6 border border-white rounded p-2">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-white fw-bold mb-2">I miei pokemon</h4>
              <button
                className="btn btn-danger"
                onClick={() => dispatch(cleanList())}
              >
                {" "}
                <FaTrash className="mb-1" />
                Svuota la lista
              </button>
            </div>

            <div className="container flex-grow-1 bg-white">
                {myPokemons.length > 0 ? (
            <table className="table">
                <tbody className="border-0">
                     {myPokemons.map((el) => {
                  return (
                    <tr key={el.id} className="d-flex w-100 justify-content-between align-items-center ">
                      <td className="border-0"><img src={el.sprites["front_default"]} alt={el.name} /></td>
                      <td className="border-0">{el.name}</td>
                      <td className="text-end border-0">       
                        <button
                        className=" btn btn-danger fw-bold"
                        onClick={() => dispatch(removeFromList(el))}
                      >
                        x
                      </button></td>
                    
                    </tr>
                          );
                        })}
                  </tbody>
                </table>
                ) : (
                    <p>Nessun pokemon nella lista</p>
                )}
            </div>
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
