import { Link } from 'react-router-dom';
import './GameList.scss';
import rockClimberLogo from '../../assets/img/rock-climber-logo.png';

const GameList = (props) => {

  return (
    <div className="GameList">
      <div className="game">
        <img className="logo" src={rockClimberLogo} />

        <Link to="play/rock-climber" className="btn-play">
          Play
        </Link>
      </div>
    </div>
  );
}

export default GameList;
