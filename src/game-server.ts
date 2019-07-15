import express, { Application } from 'express';
import http from 'http';
import os from 'os';
import socketIo, { Server } from 'socket.io';
import {
  SessionMessage,
  SessionJoinMessage,
  SessionLeaveMessage,
  CardsUpdateMessage,
  PlayersUpdateMessage,
  ServerOptions,
  GameSessionsPersistence,
} from './interfaces';
import {
  PLAYER_START,
  PLAYER_JOIN,
  PLAYER_LEAVE,
  CARDS_UPDATE,
  PLAYERS_UPDATE,
  GAME_SESSIONS_UPDATE,
} from './game-events';
import {
  CONNECTION,
  CLOSE,
} from './io-events';

export class GameServer {
  timeout: NodeJS.Timeout;
  httpServer: http.Server;
  io: Server;
  stopping: boolean;

  constructor(options: ServerOptions) {
    this.stopping = false;
    const expressApp: Application = express();
    this.httpServer = http.createServer(expressApp);
    this.io = socketIo(this.httpServer);

    this.initHttpServerRoutes(expressApp, options.port);
    this.timeout = this.initGameSessionsSendInterval(this.io, options);
    this.initSocketEventListeners(this.io, options);

    this.start(options.port);
  }

  private initHttpServerRoutes(app: Application, port: number) {
    app.get('/', (req, res) => {
      res.send(`
        <h1>Memory Game Server listening on port ${port}...</h1>
        <button onclick="window.location.href='/stop'" type="button">Stop Server</button>
      `);
    });

    app.get('/ping', (req, res) => {
      console.log('SERVER: sending "pong"');
      res.send('pong');
    });

    app.get('/stop', (req, res) => {
      this.stop();
      this.stopping = true;
      res.send(`
        <script>
          window.onload = function() {
            setTimeout(function() {
              // similar behavior as clicking on a link
              window.location.href = "/";
            }, 5000);
          }
        </script>
        <h1>Stopping Memory Game Server...</h1>
      `);
    });
  }

  private initGameSessionsSendInterval(io: Server, options: ServerOptions) {
    return setInterval(() => {
      const sessions = options.gameSessionsPersistence.readAll();
      // console.log(`SERVER: emitting game sessions =>\n${JSON.stringify(sessions, null, 2)}`);
      io.emit(GAME_SESSIONS_UPDATE, sessions);
    }, options.gameSessionsUpdateSendInterval);
  }

  private initSocketEventListeners(io: Server, options: ServerOptions) {
    const sessionsDB: GameSessionsPersistence = options.gameSessionsPersistence;
    io.on(CONNECTION, (socket) => {
      let previousId: string;

      const safeJoin = (currentId: string) => {
        socket.leave(previousId);
        socket.join(currentId);
        previousId = currentId;
      };

      socket.on(PLAYER_START, (session: SessionMessage) => {
        console.log(`SERVER: on PLAYER_START =>\n${JSON.stringify(session, null, 2)}`);
        safeJoin(session.id);
        sessionsDB.create(session);
        io.emit(GAME_SESSIONS_UPDATE, sessionsDB.readAll());
        socket.emit(PLAYER_START, session);
      });

      socket.on(PLAYER_JOIN, (session: SessionJoinMessage) => {
        console.log(`SERVER: on PLAYER_JOIN =>\n${JSON.stringify(session, null, 2)}`);
        safeJoin(session.id);
        const currentSession = sessionsDB.read(session.id);
        sessionsDB.update(session.id, {
          id: session.id,
          name: currentSession.name,
          status: 'joined',
          sessionOwnerNetworkId: currentSession.sessionOwnerNetworkId,
          senderPlayerIndex: session.senderPlayerIndex,
          senderPlayerNetworkId: session.senderPlayerNetworkId,
          players: session.players,
          cards: currentSession.cards,
        });

        io.emit(GAME_SESSIONS_UPDATE, sessionsDB.readAll());
        socket.emit(PLAYER_JOIN, session);
        socket.to(session.id).emit(PLAYER_JOIN, session);
      });

      socket.on(PLAYER_LEAVE, (session: SessionLeaveMessage) => {
        console.log(`SERVER: on PLAYER_LEAVE =>\n${JSON.stringify(session, null, 2)}`);
        let sessionToLeave;
        if (session.players.length === 0) {
          console.log('PLAYERS 0 =============================')
          sessionToLeave = sessionsDB.delete(session.id);
        } else {
          const currentSession = sessionsDB.read(session.id);
          sessionToLeave = sessionsDB.update(session.id, {
            id: session.id,
            name: currentSession.name,
            status: session.players.length === 1 ? 'open' : 'joined', // enables more than 2 players!
            sessionOwnerNetworkId: currentSession.sessionOwnerNetworkId,
            senderPlayerIndex: session.senderPlayerIndex,
            senderPlayerNetworkId: session.senderPlayerNetworkId,
            players: session.players,
            cards: currentSession.cards,
          });
        }
        io.emit(PLAYER_LEAVE, sessionToLeave);
        io.emit(GAME_SESSIONS_UPDATE, sessionsDB.readAll());
        socket.emit(PLAYER_LEAVE, session); // TODO is this useful?
        socket.to(session.id).emit(PLAYER_LEAVE, session);
      });

      socket.on(CARDS_UPDATE, (update: CardsUpdateMessage) => {
        const id = update.sessionId;
        const currentSession = sessionsDB.read(id);
        sessionsDB.update(id, {
          id,
          name: currentSession.name,
          status: 'joined',
          sessionOwnerNetworkId: currentSession.sessionOwnerNetworkId,
          senderPlayerIndex: update.senderPlayerIndex,
          senderPlayerNetworkId: update.senderPlayerNetworkId,
          players: currentSession.players,
          cards: update.cards,
        });
        io.emit(CARDS_UPDATE, update);
        socket.to(update.sessionId).emit(CARDS_UPDATE, update);
        io.emit(GAME_SESSIONS_UPDATE, sessionsDB.readAll());
      });

      socket.on(PLAYERS_UPDATE, (update: PlayersUpdateMessage) => {
        console.log(`SERVER: on PLAYERS_UPDATE =>\n${JSON.stringify(update, null, 2)}`);
        const id = update.sessionId;
        const currentSession = sessionsDB.read(id);
        sessionsDB.update(id, {
          id,
          name: currentSession.name,
          status: 'joined',
          sessionOwnerNetworkId: currentSession.sessionOwnerNetworkId,
          senderPlayerIndex: update.senderPlayerIndex,
          senderPlayerNetworkId: update.senderPlayerNetworkId,
          players: update.players,
          cards: currentSession.cards,
        });
        io.emit(PLAYERS_UPDATE, update);
        socket.to(id).emit(PLAYERS_UPDATE, update);
        io.emit(GAME_SESSIONS_UPDATE, sessionsDB.readAll());
      });

      io.emit(GAME_SESSIONS_UPDATE, sessionsDB.readAll());
    });

    io.on(CLOSE, () => {
      setTimeout(() => {
        console.log('SOCKET-SERVER: websockets closed!');
        this.httpServer.close((err?: Error) => {
          if (err) {
            console.error(`SERVER: closed HTTP server with error: ${err.stack}!`);
          } else {
            console.log('SERVER: HTTP server closed!');
          }
        });
      }, 500);
    });
  }

  private start(port: number) {
    this.httpServer.listen(port);
    console.log(`SERVER: listening on http://${os.hostname()}:${port} ...`);
    try {
      const en0Ipv4 = os.networkInterfaces().en0.find((elem) => (elem.family === 'IPv4'));
      const ip = en0Ipv4 ? en0Ipv4.address : undefined;
      if (ip) {
        console.log(`SERVER: listening on http://${ip}:${port} ...`);
      }
    } catch (_) { }
  }

  public stop() {
    if (!this.stopping) {
      console.log('SERVER: server is stopping gracefully...');
      console.log('SERVER: server is cleaning up...');
      console.log('SOCKET-SERVER: clearing session send interval...');
      clearInterval(this.timeout);
      console.log('SOCKET-SERVER: closing websockets...');
      this.io.close();
      console.log('SERVER: server has been stopped!');
    }
  }
}
