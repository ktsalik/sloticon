import { Link } from 'react-router-dom';
import './GameList.scss';
import rockClimberLogo from '../../assets/img/rock-climber-logo.png';
import { useSelector } from 'react-redux';

const GameList = (props) => {

  const loggedIn = useSelector((state) => state.lobby.loggedIn);

  return (
    <div className="GameList">
      <div className={`list ${!loggedIn ? 'd-none' : ''}`}>
        <div className="game">
          <img className="logo" src={rockClimberLogo} />

          <Link to="play/rock-climber" className="btn-play">
            Play
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GameList;
