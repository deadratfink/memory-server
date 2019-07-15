import express, { Application } from 'express';
import http from 'http';
import os from 'os';
import socketIo, { Server } from 'socket.io';
import {
  SessionMessage,
  SessionJoinMessage,
  SessionLeaveMessage,
  SessionDeleteMessage,
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
  GAME_SESSION_DELETE,
  GAME_SESSIONS_UPDATE,
} from './game-events';
import {
  CONNECTION,
  CLOSE,
} from './io-events';

/**
 * The game socket server receiving and sending game and connection events.
 */
export class GameServer {
  /**
   * Timeout reference for the game sessions send interval.
   */
  private timeout: NodeJS.Timeout;

  /**
   * The underlying (express) HTTP server.
   */
  private httpServer: http.Server;

  /**
   * The socket game server.
   */
  private io: Server;

  /**
   * Whether stopping game server at the moment.
   */
  private stopping: boolean;

  /**
   * Creates an instance of game server and starts it with the given options.
   * @param options - The game server options.
   */
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

  /**
   * Handles event error (logging).
   * @param err - The error occurred.
   * @param event - The current event
   */
  private handleEventError(err: Error, event: string) {
    console.error(`SERVER: error caught on ${event}: ${err.stack}`);
  }

  /**
   * Inits the HTTP server routes.
   * @param app  - The express application (HTTP server).
   * @param port - The port the server is listening.
   */
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

  /**
   * Inits game sessions send interval for the socket server.
   * @param io      - The socket server.
   * @param options - The server options.
   * @returns The itervall timeout object for later reference when closing server gracefully.
   */
  private initGameSessionsSendInterval(io: Server, options: ServerOptions) {
    return setInterval(() => {
      const sessions = options.gameSessionsPersistence.readAll();
      // console.log(`SERVER: emitting game sessions =>\n${JSON.stringify(sessions, null, 2)}`);
      io.emit(GAME_SESSIONS_UPDATE, sessions);
    }, options.gameSessionsUpdateSendInterval);
  }

  /**
   * Inits socket event listeners.
   * @param io      - The socket server.
   * @param options - The server options.
   */
  private initSocketEventListeners(io: Server, options: ServerOptions) {
    const sessionsDB: GameSessionsPersistence = options.gameSessionsPersistence;
    io.on(CONNECTION, (socket) => {
      let previousId: string;

      // Join the right session.
      const safeJoin = (currentId: string) => {
        socket.leave(previousId);
        socket.join(currentId);
        previousId = currentId;
      };

      socket.on(PLAYER_START, (session: SessionMessage) => {
        try {
          // console.log(`SERVER: on PLAYER_START =>\n${JSON.stringify(session, null, 2)}`);
          safeJoin(session.id);
          sessionsDB.create(session);
          io.emit(GAME_SESSIONS_UPDATE, sessionsDB.readAll());
          socket.emit(PLAYER_START, session);
          // socket.to(session.id).emit(PLAYER_START, session); // TODO is this really necessary?
        } catch (err) {
          this.handleEventError(err, PLAYER_START);
        }
      });

      socket.on(PLAYER_JOIN, (session: SessionJoinMessage) => {
        try {
          // console.log(`SERVER: on PLAYER_JOIN =>\n${JSON.stringify(session, null, 2)}`);
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
        } catch (err) {
          this.handleEventError(err, PLAYER_JOIN);
        }
      });

      socket.on(PLAYER_LEAVE, (session: SessionLeaveMessage) => {
        try {
          // console.log(`SERVER: on PLAYER_LEAVE =>\n${JSON.stringify(session, null, 2)}`);
          let sessionToLeave;
          if (session.players.length === 0) {
            // console.log(`SERVER: on PLAYER_LEAVE => players count is 0 => delete sesssion:\n${JSON.stringify(session, null, 2)}`);
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
        } catch (err) {
          this.handleEventError(err, PLAYER_LEAVE);
        }
      });

      socket.on(CARDS_UPDATE, (update: CardsUpdateMessage) => {
        try {
          const id = update.sessionId;
          const currentSession = sessionsDB.read(id);
          sessionsDB.update(id, {
            id,
            name: currentSession.name,
            status: currentSession.status,
            sessionOwnerNetworkId: currentSession.sessionOwnerNetworkId,
            senderPlayerIndex: update.senderPlayerIndex,
            senderPlayerNetworkId: update.senderPlayerNetworkId,
            players: currentSession.players,
            cards: update.cards,
          });
          io.emit(CARDS_UPDATE, update);
          socket.to(update.sessionId).emit(CARDS_UPDATE, update);
          io.emit(GAME_SESSIONS_UPDATE, sessionsDB.readAll());
        } catch (err) {
          this.handleEventError(err, CARDS_UPDATE);
        }
      });

      socket.on(PLAYERS_UPDATE, (update: PlayersUpdateMessage) => {
        try {
          // console.log('PLAYERS_UPDATE');
          // console.log(`SERVER: on PLAYERS_UPDATE =>\n${JSON.stringify(update, null, 2)}`);
          const id = update.sessionId;
          const currentSession = sessionsDB.read(id);
          // console.log(`CURRENT SESSION: ${JSON.stringify(currentSession, null)}`)
          sessionsDB.update(id, {
            id,
            name: currentSession.name,
            status: currentSession.status,
            sessionOwnerNetworkId: currentSession.sessionOwnerNetworkId,
            senderPlayerIndex: update.senderPlayerIndex,
            senderPlayerNetworkId: update.senderPlayerNetworkId,
            players: update.players,
            cards: currentSession.cards,
          });
          io.emit(PLAYERS_UPDATE, update);
          socket.to(id).emit(PLAYERS_UPDATE, update);
          io.emit(GAME_SESSIONS_UPDATE, sessionsDB.readAll());
        } catch (err) {
          this.handleEventError(err, PLAYERS_UPDATE);
        }
      });

      socket.on(GAME_SESSION_DELETE, (session: SessionDeleteMessage) => {
        try {
          // console.log(`SERVER: on GAME_SESSION_DELETE =>\n${JSON.stringify(session, null, 2)}`);
          safeJoin(session.id);
          const currentSession = sessionsDB.read(session.id);
          if (currentSession.sessionOwnerNetworkId === session.senderPlayerNetworkId) {
            sessionsDB.delete(session.id);
            socket.emit(GAME_SESSION_DELETE, session);
            socket.to(session.id).emit(GAME_SESSION_DELETE, session);
            io.emit(GAME_SESSIONS_UPDATE, sessionsDB.readAll());
          } else {
            console.error(`SERVER: player with ID '${session.senderPlayerNetworkId}'` +
              ` is not allowed to delete session with ID '${session.id}'!`);
          }
        } catch (err) {
          this.handleEventError(err, GAME_SESSION_DELETE);
        }
      });

      try {
        io.emit(GAME_SESSIONS_UPDATE, sessionsDB.readAll());
      } catch (err) {
        this.handleEventError(err, GAME_SESSIONS_UPDATE);
      }
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

  /**
   * Starts game server.
   * @param port - The port the server starts on.
   */
  private start(port: number) {
    this.httpServer.listen(port);
    console.log(`SERVER: listening on http://${os.hostname()}:${port} ...`);
    try {
      const en0Ipv4 = os.networkInterfaces().en0.find((elem) => (elem.family === 'IPv4'));
      const ip = en0Ipv4 ? en0Ipv4.address : undefined;
      if (ip) {
        console.log(`SERVER: listening on http://${ip}:${port} ...`);
      }
    } catch (_) { } // Do not fail if we cannot detect!
  }

  /**
   * Stops game server gracefully.
   */
  public stop() {
    if (!this.stopping) { // Do not execute once it is called multiple times!
      this.stopping = true;
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
