import { faCog, faCrown, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Header.scss';
import { useSelector } from 'react-redux';

const Header = (props) => {

  const loggedIn = useSelector((state) => state.lobby.loggedIn);
  const username = useSelector((state) => state.lobby.username);

  return (
    <div className="Header">
      <div className="brand">
        <FontAwesomeIcon icon={faCrown} size="2x" className="logo"></FontAwesomeIcon>
        <span className="name">Sloticon</span>
      </div>

      <div className={`menu ${!loggedIn ? 'd-none' : ''}`}>
        <div className="account">
          <button className="btn-toggle-account-menu">
            <FontAwesomeIcon icon={faUserCircle} size="2x"></FontAwesomeIcon>
            <span>{username}</span>
          </button>
        </div>

        <button className="btn-settings">
          <FontAwesomeIcon icon={faCog} size="2x"></FontAwesomeIcon>
        </button>
      </div>
    </div>
  );
}

export default Header;
