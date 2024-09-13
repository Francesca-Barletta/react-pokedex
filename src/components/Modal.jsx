import React from 'react';
import{useDispatch, useSelector} from 'react-redux';
import { closeModal } from '../redux/reducers/poke-reducer';
import styled from "styled-components"

const Modal = () => {
  const dispatch = useDispatch();
  const {selectedPokemon, isModalOpen} = useSelector((state) => state.list);


  if(!isModalOpen || !selectedPokemon) return null;
  return (
    <Wrapper className='my-modal'>

    <div className='bg-white rounded p-3 d-flex flex-column justify-content-center align-items-center'>

       <img src={selectedPokemon.sprites["front_default"]} alt={selectedPokemon.name}/>
       <p>
          <span className="fw-bold">Name: </span>
          {selectedPokemon.name}
        </p>
        <p>
          <span className="fw-bold">Type: </span>
          {selectedPokemon.types[0].type["name"]}
        </p>
        <p>
          <span className="fw-bold">Height: </span>
          {selectedPokemon.height}
        </p>
        <p>
          <span className="fw-bold">Weight: </span>
          {selectedPokemon.weight}
        </p>
        <ul className="list-unstyled">
            {selectedPokemon.stats.map((el, index) => {
              return (
                <li
                  key={index}
                  className="d-flex align-items-center gap-3 justify-content-between"
                >
                  <span className="fw-bold">{el.stat["name"]}</span>
                  <div className="border border-dark box-state" >
                    <div className="bg-dark h-100" style={{width: `${el.base_stat}px`,}}></div>
                  </div>
                </li>
              );
            })}
        </ul>

      <button className='btn btn-danger' onClick={() => dispatch(closeModal())}>Go back</button>
    </div>
    </Wrapper>
  )
}

const Wrapper = styled.article`
  position: fixed;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  .box-state{
    width:200px;
    height:8px;
  }
`

export default Modal