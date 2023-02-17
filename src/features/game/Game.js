import { useEffect, useRef } from 'react';
import './Game.scss';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as PIXI from 'pixi.js';
import Reel from '../../slot/Reel';
window.PIXI = PIXI;
const Game = (props) => {
  const elRef = useRef(null);
  const params = useParams();

  useEffect(() => {
    let view;

    axios.get(`../gamescripts/${params.gameId}.js`).then((response) => {
      view = (new Function(`
        const gameId = arguments[0];
        const PIXI = arguments[1];
        const Reel = arguments[2];

        ${response.data}
      `))(params.gameId, PIXI, Reel);
      
      const gameCanvas = elRef.current.querySelector('canvas');
      
      if (gameCanvas) {
        gameCanvas.remove();
      }

      elRef.current.appendChild(view);
    });

    return () => {
      
    };
  }, []);

  return (
    <div
      className="Game"
      ref={elRef}
    >
      
    </div>
  );
}

export default Game;
