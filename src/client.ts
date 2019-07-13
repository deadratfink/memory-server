import io from 'socket.io-client';
import uuidV4 from 'uuid/V4';
import {
  PlayerModel,
  CardModel,
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
} from './events';

export class AbstractMemoryClient {
  playerIndex: number = 0;
  socket: any;

  contructor(playerIndex!: number) {
    this.playerIndex = playerIndex;
    this.socket = io('http://localhost:4444');
    // this.socket.on('gameSessionCreated', (session: SessionNew) => {
    //   console.log('GAME_SESSION_CREATED:', JSON.stringify(session, null, 2));
    // });
    // this.socket.on('event', (data) => {

    // });
    // this.socket.on('disconnect', () => {

    // });
    PLAYER_START,
      PLAYER_JOIN,
      PLAYER_LEAVE,
      CARDS_UPDATE,
      PLAYERS_UPDATE,
    this.socket.on('disconnect', () => {

    });
      this.socket.on(PLAYER_JOIN, () => {

      });
    this.socket.on('disconnect', () => {

    });
    this.socket.on('disconnect', () => {

    });
    this.socket.on('disconnect', () => {

    });
    this.socket.on('disconnect', () => {

    });
    this.socket.on('disconnect', () => {

    });
  }

  startGame(sessionName: string, player: PlayerModel): SessionNewModel {
    const session: SessionNewModel = {
      id: uuidV4(),
      name: sessionName,
      status: 'open',
      senderPlayerIndex: 0,
      players: [player],
    };
    this.socket.emit(PLAYER_START, session);
    return session;
  }

  /**
   * TODO
   * @param sessionId - The game's session ID to leave.
   * @param playerIndex - The index of the player who will join.
   * @param players - The current players array (already enriched by the new player!).
   */
  joinGame(sessionId: string, playerIndex: number, players: PlayerModel[]): SessionJoinModel {
    const session: SessionJoinModel = {
      id: sessionId,
      senderPlayerIndex: playerIndex,
      players,
    };
    this.socket.emit(PLAYER_JOIN, session);
    return session;
  }

  /**
   * TODO
   * @param sessionId - The game's session ID to leave.
   * @param playerIndex - The index of the player who will leave.
   * @param players - The current players array (unchanged!).
   */
  leaveGame(sessionId: string, playerIndex: number, players: PlayerModel[]): SessionLeaveModel {
    const playerLeft: PlayerModel[] = players.splice(playerIndex, 1);
    const session: SessionLeaveModel = {
      id: sessionId,
      playerLeft: playerLeft[0],
      senderPlayerIndex: playerIndex,
      players,
    };
    this.socket.emit(PLAYER_LEAVE, session);
    return session;
  }

  updateCards(sessionId: string, playerIndex: number, cards: CardModel[]): CardsUpdateModel {
    const update: CardsUpdateModel = {
      sessionId,
      senderPlayerIndex: playerIndex,
      cards,
    };
    this.socket.emit(CARDS_UPDATE, update);
    return update;
  }

  updatePlayers(sessionId: string, playerIndex: number, players: PlayerModel[]): PlayersUpdateModel {
    const update: PlayersUpdateModel = {
      sessionId,
      senderPlayerIndex: playerIndex,
      players,
    };
    this.socket.emit(PLAYERS_UPDATE, update);
    return update;
  }
}
