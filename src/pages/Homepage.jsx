import React, { useEffect, useState } from "react";
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
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [findPokemon, setFindPokemon] = useState(null);
  const [image, setImage] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const myPokemons = useSelector((state) => state.list.list);
  const isPokemonInList = findPokemon && myPokemons.some((pokemon) => pokemon.id === findPokemon.id);

  const handleCapture = () => {
    if (findPokemon) {
      dispatch(addSingleItemToList(findPokemon));
      console.log("pokemon catturato", findPokemon);
    }
  };

  const searchPokemon = async () => {
    setSearchPerformed(true);
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      setFindPokemon(response.data);
      setImage(response.data.sprites["front_default"]);
      setQuery("");
    } catch (error) {
      setFindPokemon(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key == "Enter") {
      searchPokemon();
    }
  };

  function randomPoke() {
    setQuery("");
    const min = 0;
    const max = 1025;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
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
    getRandom();
  }

  function clear() {
    setQuery("");
    setFindPokemon(null);
    setSearchPerformed(false);
  }

  useEffect(() => {
    let interval;

    if (findPokemon) {
      const front = findPokemon.sprites["front_default"];
      const back = findPokemon.sprites["back_default"];

      if (front && back) {
        interval = setInterval(() => {
          setImage((prevImage) => (prevImage === front ? back : front));
        }, 2000);
      } else {
        setImage(front || back);
      }
    }
    return () => clearInterval(interval);
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
              onKeyUp={handleKeyPress}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchPerformed(false);
              }}
            />
            <button className="btn btn-blue" onClick={searchPokemon}>Search</button>
            </div>
            

            <button className="btn btn-blue" onClick={randomPoke}>Pokémon random</button>
            <button className="btn btn-orange" onClick={clear}>Clear</button>
            
          </div>
          <div className="col-10 col-md-6 border d-flex flex-column border-white rounded p-2">
            <h4 className="text-white fw-bold find">Pokémon find:</h4>
            {findPokemon ? (
              <div className="d-flex flex-column align-items-center gap-2 h-100 justify-content-center">
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
     width: 150px;
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
