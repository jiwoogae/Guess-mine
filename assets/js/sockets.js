import { handleNewUser, handleDisconnected } from "./notifications";
import { handleNewMessage, handleAnwser } from "./chat";
import { handleBeganPath, handleStrokedPath, handleFilled } from "./paint";
import {
  handlePlayerUpdate,
  handleGameStart,
  handleLeader,
  handleGameEnded,
  handleGameStarting,
  handleTimeSet
} from "./players";

let socket = null;

export const getSocket = () => socket;

export const initSockets = aSocket => {
  const { events } = window;
  socket = aSocket;
  socket.on(events.newUser, handleNewUser);
  socket.on(events.disconnected, handleDisconnected);
  socket.on(events.newMsg, handleNewMessage);
  socket.on(events.beganPath, handleBeganPath);
  socket.on(events.strokedPath, handleStrokedPath);
  socket.on(events.filled, handleFilled);
  socket.on(events.playerUpdate, handlePlayerUpdate);
  socket.on(events.leaderNotfi, handleLeader);
  socket.on(events.gameStart, handleGameStart);
  socket.on(events.gameEnded, handleGameEnded);
  socket.on(events.gameStarting, handleGameStarting);
  socket.on(events.correctAnswer, handleAnwser);
  socket.on(events.timeSet, handleTimeSet);
};
