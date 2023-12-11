import './App.scss';
import Header from './features/header/Header';
import {
  BrowserRouter, Route, Routes
} from 'react-router-dom';
import Game from './features/game/Game';
import GameList from './features/game-list/GameList';
import { Fragment } from 'react';
import SpeedInsights from "@vercel/speed-insights";
import App from './App'; // Ensure 'App' is correctly imported

function MyComponent() {
  return (
    <SpeedInsights>
      <div>
        <SpeedInsights url="https://slotchamps-realbrodiwhite.vercel.app/"/>
        <h1>My Component</h1>]
      </div>
    </SpeedInsights>
  );
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <link href="/" element={<Fragment>
            <Header></Header>
            <GameList></GameList>
          </Fragment>}></Route>
          <Route path="/play/:gameId" element={<Game></Game>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
}
export default App;
