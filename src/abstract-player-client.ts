import io from 'socket.io-client';
import uuidV4 from 'uuid/V4';
import {
  PlayerModel,
  CardModel,
  SessionMessage,
  SessionJoinMessage,
  SessionLeaveMessage,
  CardsUpdateMessage,
  PlayersUpdateMessage,
  ClientOptions,
} from './interfaces';
import {
  PLAYER_START,
  PLAYER_JOIN,
  PLAYER_LEAVE,
  CARDS_UPDATE,
  PLAYERS_UPDATE,
  GAME_SESSIONS_UPDATE,
} from './game-events';

export abstract class AbstractPlayerClient {
  protected playerIndex = 0;
  private socket: any;
  private connected: boolean;
  protected connectionRequested: boolean;
  protected playerNetworkId: string;

  constructor(options: ClientOptions) {
    this.connected = false;
    this.connectionRequested = false;

    this.playerIndex = options.playerIndex;
    this.playerNetworkId = options.playerNetworkId;
    this.socket = io(options.socketUrl); // TODO make configurable

    this.socket.on(PLAYER_START, (session: SessionMessage) => {
      if (session.senderPlayerIndex === this.playerIndex) {
        this.connected = true;
      }
      this.onPlayerStartedGame(session, this.connected);
    });

    this.socket.on(PLAYER_JOIN, (session: SessionJoinMessage) => {
      if (session.senderPlayerIndex === this.playerIndex) {
        this.connected = true;
        this.connectionRequested = false;
      }
      this.onPlayerJoinedGame(session, this.connected);
    });

    this.socket.on(PLAYER_LEAVE, (session: SessionLeaveMessage) => {
      if (session.senderPlayerIndex === this.playerIndex) {
        this.connected = false;
      } else if (session.senderPlayerIndex < this.playerIndex) {
        --this.playerIndex;
      }
      this.onPlayerLeftGame(session, this.connected);
    });

    this.socket.on(CARDS_UPDATE, (update: CardsUpdateMessage) => {
      this.onCardsUpdate(update);
    });

    this.socket.on(PLAYERS_UPDATE, (update: PlayersUpdateMessage) => {
      this.onPlayersUpdate(update);
    });

    this.socket.on(GAME_SESSIONS_UPDATE, (sessions: SessionMessage[]) => {
      this.onGameSessionsUpdate(sessions, this.connected);
    });
  }

  protected abstract onPlayerStartedGame(session: SessionMessage, connected: boolean): void;
  protected abstract onPlayerJoinedGame(session: SessionJoinMessage, connected: boolean): void;
  protected abstract onPlayerLeftGame(session: SessionLeaveMessage, connected: boolean): void;
  protected abstract onCardsUpdate(update: CardsUpdateMessage): void;
  protected abstract onPlayersUpdate(update: PlayersUpdateMessage): void;
  protected abstract onGameSessionsUpdate(sessions: SessionMessage[], connected: boolean): void;

  public getPlayerNetworkId() {
    return this.playerNetworkId;
  }

  public setPlayerNetworkId(playerNetworkId: string) {
    return this.playerNetworkId = playerNetworkId;
  }

  public getPlayerIndex() { // TODO could we remove this.playerIndex from this class?
    return this.playerIndex;
  }

  public setPlayerIndex(playerIndex: number) {
    return this.playerIndex = playerIndex;
  }

  public startGame(sessionName: string, player?: PlayerModel, cards: CardModel[] = []): SessionMessage {
    const session: SessionMessage = {
      id: uuidV4(),
      name: sessionName,
      status: 'open',
      sessionOwnerNetworkId: this.playerNetworkId,
      senderPlayerIndex: 0,
      senderPlayerNetworkId: this.playerNetworkId,
      players: [],
      cards,
    };
    this.socket.emit(PLAYER_START, session);
    return session;
  }

  /**
   * TODO
   * @param sessionId   - The game's session ID to leave.
   * @param playerIndex - The index of the player who will join.
   * @param players     - The current players array (already enriched by the new player!).
   */
  public joinGame(sessionId: string, playerIndex: number, players: PlayerModel[]): SessionJoinMessage {
    const session: SessionJoinMessage = {
      id: sessionId,
      senderPlayerIndex: playerIndex,
      senderPlayerNetworkId: this.playerNetworkId,
      players,
    };
    this.socket.emit(PLAYER_JOIN, session);
    this.connectionRequested = true;
    return session;
  }

  /**
   * TODO
   * @param sessionId   - The game's session ID to leave.
   * @param playerIndex - The index of the player who will leave.
   * @param players     - The current players array (unchanged!).
   */
  public leaveGame(sessionId: string, playerIndex: number, players: PlayerModel[]): SessionLeaveMessage {
    console.log(`CLIENT: execute leaveGame =>  playerIndex: ${playerIndex} and players.length - 1: ${players.length - 1}`)
    if (playerIndex < players.length - 1 && players[playerIndex].active) { // there is a successor
      players[playerIndex + 1].active = true;
    } else if (playerIndex > 0 && players[playerIndex].active) { // there is a predecessor
      players[playerIndex - 1].active = true;
    }

    const playerLeft: PlayerModel = players.splice(playerIndex, 1)[0];

    console.log(`XXXX ==== CLIENT: execute leaveGame =>  players:\n${JSON.stringify(players, null, 2)}`)
    const session: SessionLeaveMessage = {
      id: sessionId,
      playerLeft,
      senderPlayerIndex: playerIndex,
      senderPlayerNetworkId: this.playerNetworkId,
      players,
    };
    this.socket.emit(PLAYER_LEAVE, session);
    return session;
  }

  public updateCards(sessionId: string, playerIndex: number, cards: CardModel[]): CardsUpdateMessage {
    const update: CardsUpdateMessage = {
      sessionId,
      senderPlayerIndex: playerIndex,
      senderPlayerNetworkId: this.playerNetworkId,
      cards,
    };
    this.socket.emit(CARDS_UPDATE, update);
    return update;
  }

  public updatePlayers(sessionId: string, playerIndex: number, players: PlayerModel[]): PlayersUpdateMessage {
    const update: PlayersUpdateMessage = {
      sessionId,
      senderPlayerIndex: playerIndex,
      senderPlayerNetworkId: this.playerNetworkId,
      players,
    };
    this.socket.emit(PLAYERS_UPDATE, update);
    return update;
  }
}
