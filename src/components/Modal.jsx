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

    <div className='bg-white rounded p-3 d-flex flex-column justify-content-center align-items-center color-blue'>

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
                <li key={index} >
                  <span className="fw-bold color-blue">{el.stat["name"]}</span>
                  <div className="box-state rounded" >
                    <div className="state h-100" style={{width: `${el.base_stat}px`,}}></div>
                  </div>
                </li>
              );
            })}
        </ul>

      <button className='btn btn-orange' onClick={() => dispatch(closeModal())}>Go back</button>
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
     width: 200px;
     height: 12px;
     border:2px solid #06064e;
     .state{
      background-image: linear-gradient(#070799, #5151f6);
      border-radius: 3px 0 0 3px;
     }
  }
  .color-blue{
    color: #070799;
  }
`

export default Modal