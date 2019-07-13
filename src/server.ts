import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import {
  SessionNewModel,
  SessionJoinModel,
  SessionLeaveModel,
  CardsUpdateModel,
  PlayersUpdateModel,
} from './interfaces';
import {
  CONNECTION,
  PLAYER_START,
  PLAYER_JOIN,
  PLAYER_LEAVE,
  CARDS_UPDATE,
  PLAYERS_UPDATE,
  GAME_SESSIONS,
} from './events';

const PORT = process.env.PORT || 4444;
const SEND_GAME_SESSIONS_INTERVAL = 3000;

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
const sessions: any = {};

setInterval(() => {
  console.log(`EMITTING GAME SESSIONS\n${JSON.stringify(sessions, null, 2)}`);
  io.emit(GAME_SESSIONS, sessions);
}, SEND_GAME_SESSIONS_INTERVAL);

app.get('/', (req, res) => {
  res.send(`<h1>Memory Game Server listening on port ${PORT}...</h1>`);
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

io.on(CONNECTION, (socket) => {
  let previousId: string;

  const safeJoin = (currentId: string) => {
    socket.leave(previousId);
    socket.join(currentId);
    previousId = currentId;
  };

  socket.on(PLAYER_START, (session: SessionNewModel) => {
    safeJoin(session.id);
    sessions[session.id] = session;
    io.emit(GAME_SESSIONS, sessions);
    socket.emit(PLAYER_START, session);
  });

  socket.on(PLAYER_JOIN, (session: SessionJoinModel) => {
    sessions[session.id] = {
      id: session.id,
      status: 'joined',
      senderPlayerIndex: session.senderPlayerIndex,
      players: session.players,
    };
    safeJoin(session.id);
    io.emit(GAME_SESSIONS, sessions);
    socket.emit(PLAYER_JOIN, session);
  });

  socket.on(PLAYER_LEAVE, (session: SessionLeaveModel) => {
    if (session.players.length === 0) {
      delete sessions[session.id];
    } else {
      sessions[session.id] = {
        id: session.id,
        status: 'left',
        senderPlayerIndex: session.senderPlayerIndex,
        players: session.players,
      };
    }
    io.emit(PLAYER_LEAVE, session);
    io.emit('gameSessions', sessions);
    socket.emit(PLAYER_LEAVE, session); // TODO is this useful?
  });

  socket.on(CARDS_UPDATE, (cardsUpdate: CardsUpdateModel) => {
    io.emit(CARDS_UPDATE, cardsUpdate);
    socket.to(cardsUpdate.sessionId).emit(CARDS_UPDATE, cardsUpdate);
  });

  socket.on(PLAYERS_UPDATE, (playersUpdate: PlayersUpdateModel) => {
    io.emit(PLAYERS_UPDATE, playersUpdate);
    socket.to(playersUpdate.sessionId).emit(PLAYERS_UPDATE, playersUpdate);
  });

  io.emit(GAME_SESSIONS, sessions);
});

httpServer.listen(PORT);
console.log(`Listening on port ${PORT}...`);
