export interface PlayerModel {
  name: string;
  score: number;
  active: boolean;
}

export interface CardModel {
  pairId: string;
  url: string;
  uncovered: boolean;
  removed: boolean;
}

export interface SessionModel {
  id: string;
  name: string;
  status: string;
  senderPlayerIndex: number;
  players: PlayerModel[];
  cards: CardModel[];
}

export interface SessionJoinModel {
  id: string;
  senderPlayerIndex: number;
  players: PlayerModel[];
}

export interface SessionLeaveModel {
  id: string;
  playerLeft: PlayerModel;
  senderPlayerIndex: number;
  players: PlayerModel[];
}

export interface CardsUpdateModel {
  sessionId: string;
  senderPlayerIndex: number;
  cards: CardModel[];
}

export interface PlayersUpdateModel {
  sessionId: string;
  senderPlayerIndex: number;
  players: PlayerModel[];
}

export interface GameSessionsPersistence {
  create(session: SessionModel): string;
  read(id: string): SessionModel;
  readAll(): SessionModel[];
  update(id: string, session: SessionModel): SessionModel;
  delete(id: string): SessionModel;
}

export interface ServerOptions {
  port: number;
  gameSessionsUpdateSendInterval: number;
  gameSessionsPersistence: GameSessionsPersistence;
}

export interface ClientOptions {
  playerIndex: number;
  socketUrl: string;
}
