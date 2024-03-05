/**
 * Header component displays site branding, user account menu,
 * settings menu, and user balance. It uses Redux to get current
 * user state and Socket.io to update balance in realtime.
 */
import {
  faCog,
  faCrown,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Header.scss";
import { useSelector } from "react-redux";
import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../../context/socket";
import store from "../../store";
import lobbySlice from "../../lobbySlice";

/**
 * Header component displays branding, user menu, settings,
 * and balance. Gets user state from Redux and updates
 * balance via Socket.io.
 */
const Header = (props) => {
  const loggedIn = useSelector((state) => state.lobby.loggedIn);
  const username = useSelector((state) => state.lobby.username);
  const balance = useSelector((state) => state.lobby.balance);

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!loggedIn) {
      setShowLoginPopup(true);
    }

    socket.emit("balance", {
      key: localStorage.getItem("key"),
    });

    socket.on("balance", (balance) => {
      store.dispatch(lobbySlice.actions.updateBalance(balance));
    });
  }, [socket, loggedIn]);

  const handleLoginClick = () => {
    // initiate login flow
    setShowLoginPopup(false);
  };

  const handleGuestClick = () => {
    setShowLoginPopup(false);
  };

  return (
    <>
      {showLoginPopup && (
        <Popup>
          <p>Would you like to sign in?</p>
          <button onClick={handleLoginClick}>Yes, sign in</button>
          <button onClick={handleGuestClick}>No, continue as guest</button>
        </Popup>
      )}

      <div className="Header">
        <div className="brand">
          <FontAwesomeIcon
            icon={faCrown}
            size="2x"
            className="logo"
          ></FontAwesomeIcon>
          <span className="name">719Slots</span>
        </div>

        <div className={`menu ${!loggedIn ? "d-none" : ""}`}>
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

        <div className={`balance ${!loggedIn ? "d-none" : ""}`}>
          <span className="label">Balance</span>
          <span className="value">
            €
            {balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </>
  );
};

export default Header;
