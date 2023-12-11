import './App.scss';
import Header from './features/header/Header';
import {
  BrowserRouter, Route, Routes
} from 'react-router-dom';
import Game from './features/game/Game';
import GameList from './features/game-list/GameList';
import { Fragment } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Fragment>
            <Header></Header>
            <GameList></GameList>
          </Fragment>}></Route>
          <Route path="/play/:gameId" element={<Game></Game>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
