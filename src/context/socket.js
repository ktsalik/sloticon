import io from "socket.io-client";
import React from 'react';
import store from '../store';
import lobbySlice from "../lobbySlice";

export const socket = io.connect('http://localhost:3001');
export const SocketContext = React.createContext();

socket.on('connect', () => {
  const localKey = localStorage.getItem('key');

  socket.emit('login', {
    key: localKey,
  });

  socket.on('login', (data) => {
    if (data.status === 'logged-in') {
      localStorage.setItem('key', data.key);
      store.dispatch(lobbySlice.actions.updateBalance(data.balance));
    }
  });
});