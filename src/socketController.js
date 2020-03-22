import events from "./events";
import { chooseWord } from "./words";

let sockets = [];
let inProgress = false;
let word = null;
let leader = null;
let timeOut = null;
let timeSet = null;
let countTime = 10000;
const oneSecond = 1000;

const chooseLeader = () => sockets[Math.floor(Math.random() * sockets.length)];

const socketController = (socket, io) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data);
  const superBroadcast = (event, data) => io.emit(event, data);
  const sendPlayerUpdate = () =>
    superBroadcast(events.playerUpdate, { sockets });
  const timeNotifi = (countTime, oneSecond) =>
    superBroadcast(events.timeSet, { time: countTime, oneSecond });
  const countDown = () => {
    timeSet = setInterval(() => {
      timeNotifi(countTime, oneSecond);
      countTime -= oneSecond;
    }, oneSecond);
  };
  const startGame = () => {
    if (sockets.length > 1) {
      if (inProgress === false) {
        inProgress = true;
        leader = chooseLeader();
        word = chooseWord();
        superBroadcast(events.gameStarting);
        setTimeout(() => {
          superBroadcast(events.gameStart);
          io.to(leader.id).emit(events.leaderNotfi, { word });
          countDown();
          timeOut = setTimeout(() => {
            gameEnd();
          }, 10000);
        }, 5000);
      }
    }
  };
  const gameEnd = () => {
    inProgress = false;
    clearInterval(timeSet);
    clearTimeout(timeOut);
    superBroadcast(events.gameEnded);
    countTime = 10000;
    setTimeout(() => startGame(), 5000);
  };
  const addPoints = id => {
    sockets = sockets.map(socket => {
      if (socket.id === id) {
        socket.points += 10;
      }
      return socket;
    });
    sendPlayerUpdate();
    gameEnd();
  };

  socket.on(events.setNickname, ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push({
      id: socket.id,
      points: 0,
      nickname
    });
    broadcast(events.newUser, { nickname });
    sendPlayerUpdate();
    startGame();
  });

  socket.on(events.disconnect, () => {
    sockets = sockets.filter(aSocket => aSocket.id !== socket.id);
    if (sockets.length === 1) {
      gameEnd();
    } else if (leader) {
      if (leader.id === socket.id) {
        gameEnd();
      }
    }
    broadcast(events.disconnected, { nickname: socket.nickname });
    sendPlayerUpdate();
  });

  socket.on(events.sendMsg, ({ message }) => {
    if (message === word) {
      superBroadcast(events.correctAnswer, {
        nickname: socket.nickname,
        message
      });
      addPoints(socket.id);
    } else {
      broadcast(events.newMsg, { message, nickname: socket.nickname });
    }
  });

  socket.on(events.beginPath, ({ x, y }) =>
    broadcast(events.beganPath, { x, y })
  );

  socket.on(events.strokePath, ({ x, y, color }) => {
    broadcast(events.strokedPath, { x, y, color });
  });

  socket.on(events.fill, ({ color }) => {
    broadcast(events.filled, { color });
  });
};

export default socketController;
