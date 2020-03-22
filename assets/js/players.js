import {
  preventEvent,
  hideControls,
  enableEvent,
  appearControls,
  resetCanvas
} from "./paint";
import { disableChat, enableChat } from "./chat";

const board = document.getElementById("jsPBoard");

const playerBoard = players => {
  board.innerText = "";
  players.forEach(player => {
    const boardElement = document.createElement("span");
    boardElement.innerText = `${player.nickname} , ${player.points} `;
    board.appendChild(boardElement);
  });
};

export const handlePlayerUpdate = ({ sockets }) => playerBoard(sockets);

const notifs = document.getElementById("jsNotifs");
const ex = document.createElement("span");
const timeOver = document.createElement("span");
notifs.appendChild(ex);
notifs.appendChild(timeOver);

const setNotifs = text => {
  ex.innerText = "";
  ex.innerText = text;
};

const timeReset = () => {
  timeOver.innerText = "";
};

const timeNotification = time => {
  timeReset();
  timeOver.innerText = `${time}s left!!`;
};

export const handleGameStart = () => {
  enableChat();
  setNotifs("");
};

export const handleLeader = ({ word }) => {
  disableChat();
  setNotifs(`u draw : ${word}`);
  enableEvent();
  appearControls();
};

export const handleGameEnded = () => {
  timeReset();
  setNotifs("game Ended!!");
  preventEvent();
  hideControls();
  resetCanvas();
};

export const handleGameStarting = () => {
  preventEvent();
  hideControls();
  setNotifs("game will start soon!!");
};

export const handleTimeSet = ({ time, _ }) => {
  const timeLeft = time / 1000;
  timeNotification(timeLeft);
};
