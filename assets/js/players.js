import {
  preventEvent,
  hideControls,
  enableEvent,
  appearControls,
  resetCanvas
} from "./paint";

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
notifs.appendChild(ex);

const setNotifs = text => {
  ex.innerText = "";
  ex.innerText = text;
};

export const handleGameStart = () => {
  setNotifs("");
  preventEvent();
  hideControls();
};

export const handleLeader = ({ word }) => {
  setNotifs(`u draw : ${word}`);
  enableEvent();
  appearControls();
};

export const handleGameEnded = () => {
  setNotifs("game Ended!!");
  preventEvent();
  hideControls();
  resetCanvas();
};
