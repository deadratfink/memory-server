import { AbstractPlayerClient } from './abstract-player-client';
import {
  SessionModel,
  SessionJoinModel,
  SessionLeaveModel,
  CardsUpdateModel,
  PlayersUpdateModel,
  ClientOptions,
} from './interfaces';

export class LoggingPlayerClient extends AbstractPlayerClient {
  constructor(options: ClientOptions) {
    super(options);
  }

  public onPlayerStartedGame(session: SessionModel, connected: boolean): void {
    console.log(`CLIENT (PLAYER ${this.playerIndex + (session.senderPlayerIndex === this.playerIndex ? ' It was me!' : '')} connected: ${connected}): onPlayerStartedGame =>\n${JSON.stringify(session, null, 2)}`);
  }

  public onPlayerJoinedGame(session: SessionJoinModel, connected: boolean): void {
    console.log(`CLIENT (PLAYER ${this.playerIndex + 1} connected: ${connected}): onPlayerJoinedGame =>\n${JSON.stringify(session, null, 2)}`);
  }

  public onPlayerLeftGame(session: SessionLeaveModel, connected: boolean): void {
    console.log(`CLIENT (PLAYER ${this.playerIndex + 1} connected: ${connected}): onPlayerLeftGame =>\n${JSON.stringify(session, null, 2)}`);
  }

  public onCardsUpdate(update: CardsUpdateModel): void {
    console.log(`CLIENT (PLAYER ${this.playerIndex + 1}): onCardsUpdate =>\n${JSON.stringify(update, null, 2)}`);
  }

  public onPlayersUpdate(update: PlayersUpdateModel): void {
    console.log(`CLIENT (PLAYER ${this.playerIndex + 1}): onPlayersUpdate =>\n${JSON.stringify(update, null, 2)}`);
  }

  public onGameSessionsUpdate(sessions: SessionModel[], connected: boolean): void {
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
