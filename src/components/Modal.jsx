import React from 'react';
import{useDispatch, useSelector} from 'react-redux';
import { closeModal } from '../redux/reducers/poke-reducer';

const Modal = () => {
  const dispatch = useDispatch();
  const {selectedPokemon, isModalOpen} = useSelector((state) => state.list);


  if(!isModalOpen || !selectedPokemon) return null;
  return (
    <section className='my-modal'>

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

      <button className='btn btn-danger' onClick={() => dispatch(closeModal())}>Go back</button>
    </div>
    </section>
  )
}

export default Modal