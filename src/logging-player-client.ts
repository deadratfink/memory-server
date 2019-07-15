import { AbstractPlayerClient } from './abstract-player-client';
import {
  SessionMessage,
  SessionJoinMessage,
  SessionLeaveMessage,
  SessionDeleteMessage,
  CardsUpdateMessage,
  PlayersUpdateMessage,
  ClientOptions,
} from './interfaces';

export class LoggingPlayerClient extends AbstractPlayerClient {
  constructor(options: ClientOptions) {
    super(options);
  }

  protected onPlayerStartedGame(session: SessionMessage, connected: boolean): void {
    console.log(`CLIENT (PLAYER ${this.playerIndex + (session.senderPlayerIndex === this.playerIndex ? ' It was me!' : '')} connected: ${connected}): onPlayerStartedGame =>\n${JSON.stringify(session, null, 2)}`);
  }

  protected onPlayerJoinedGame(session: SessionJoinMessage, connected: boolean): void {
    console.log(`CLIENT (PLAYER ${this.playerIndex + 1} connected: ${connected}): onPlayerJoinedGame =>\n${JSON.stringify(session, null, 2)}`);
  }

  protected onPlayerLeftGame(session: SessionLeaveMessage, connected: boolean): void {
    console.log(`CLIENT (PLAYER ${this.playerIndex + 1} connected: ${connected}): onPlayerLeftGame =>\n${JSON.stringify(session, null, 2)}`);
  }

  protected onCardsUpdate(update: CardsUpdateMessage): void {
    console.log(`CLIENT (PLAYER ${this.playerIndex + 1}): onCardsUpdate =>\n${JSON.stringify(update, null, 2)}`);
  }

  protected onPlayersUpdate(update: PlayersUpdateMessage): void {
    console.log(`CLIENT (PLAYER ${this.playerIndex + 1}): onPlayersUpdate =>\n${JSON.stringify(update, null, 2)}`);
  }

  protected onGameSessionDelete(session: SessionDeleteMessage, connected: boolean): void {
    console.log(`CLIENT (PLAYER ${this.playerIndex + 1}): onGameSessionDelete =>\n${JSON.stringify(session, null, 2)}`);
  }

  public onGameSessionsUpdate(sessions: SessionMessage[], connected: boolean): void {
    // console.log(`CLIENT (PLAYER ${this.playerIndex + 1} connected: ${connected}): onGameSessionsUpdate =>\n${JSON.stringify(sessions, null, 2)}`);
    // if (sessions.length > 0 && !(connected || this.connectionRequested)) {
    //   const session = sessions[0]; // simply chose first
    //   console.log(`session.senderPlayerIndex !== this.playerIndex => ${session.senderPlayerIndex !== this.playerIndex}`);
    //   session.players.push({
    //     name: 'PLAYER 2',
    //     score: 0,
    //     active: false,
    //   });
    //   const joinedSession = this.joinGame(session.id, this.playerIndex, session.players);
    //   console.log(`CLIENT (PLAYER ${this.playerIndex + 1}): player joined: onGameSessionsUpdate =>\n ${JSON.stringify(joinedSession, null, 2)}`);
  }
}
