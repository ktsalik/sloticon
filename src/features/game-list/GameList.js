import { Link } from 'react-router-dom';
import './GameList.scss';
import rockClimberLogo from '../../assets/img/rock-climber-logo.png';
import egyptianTreasuresLogo from '../../assets/img/egyptian-treasures-logo.png';
import { useSelector } from 'react-redux';

const GameList = (props) => {

  const loggedIn = useSelector((state) => state.lobby.loggedIn);

  return (
    <div className="GameList">
      <div className={`list ${!loggedIn ? 'd-none' : ''}`}>
        <div className="game" style={{position: 'relative'}}>
          <img className="logo" src={egyptianTreasuresLogo} />
          
          <span>Egyptian Treasures</span>

          <Link to="play/egyptian-treasures" className="btn-play">
            Play
          </Link>
        </div>

        {/* <div className="game">
          <img className="logo" src={rockClimberLogo} />
          
          <span>Rock Climber</span>

          <Link to="play/rock-climber" className="btn-play">
            Play
          </Link>
        </div> */}
      </div>
    </div>
  );
}

export default GameList;
