import { faCog, faCrown, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Header.scss';
import { useSelector } from 'react-redux';
import { useEffect, useContext } from 'react';
import { SocketContext } from '../../context/socket';
import store from '../../store';
import lobbySlice from '../../lobbySlice';

const Header = (props) => {
  const loggedIn = useSelector((state) => state.lobby.loggedIn);
  const username = useSelector((state) => state.lobby.username);
  const balance = useSelector((state) => state.lobby.balance);

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit('balance', {
      key: localStorage.getItem('key'),
    });

    socket.on('balance', (balance) => {
      store.dispatch(lobbySlice.actions.updateBalance(balance));
    });
  }, []);

  return (
    <div className="Header">
      <div className="brand">
        <FontAwesomeIcon icon={faCrown} size="2x" className="logo"></FontAwesomeIcon>
        <span className="name">Sloticon</span>
      </div>

      <div className={`menu ${!loggedIn ? 'd-none' : ''}`}>
        <div className="account">
          <button className="btn-toggle-account-/* The `menu` class in the Header component is
          conditionally applied based on the `loggedIn` state.
          If the user is not logged in (`loggedIn` is false),
          the `menu` class is set to `d-none`, which hides the
          menu section in the header. This is achieved using
          the ternary operator in the className attribute of
          the div element containing the menu. */
          menu">
            <FontAwesomeIcon icon={faUserCircle} size="2x"></FontAwesomeIcon>
            <span>{username}</span>
          </button>
        </div>

        <button className="btn-settings">
          <FontAwesomeIcon icon={faCog} size="2x"></FontAwesomeIcon>
        </button>
      </div>

      <div className={`balance ${!loggedIn ? 'd-none' : ''}`}>
        <span className="label">Balance</span>
        <span className="value">€{balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}

export default Header;
