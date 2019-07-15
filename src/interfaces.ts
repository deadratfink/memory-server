export interface PlayerModel {
  networkId: string;
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

export interface SessionMessage {
  id: string;
  name: string;
  status: string;
  sessionOwnerNetworkId: string;
  senderPlayerIndex: number;
  senderPlayerNetworkId: string;
  players: PlayerModel[];
  cards: CardModel[];
}

export interface SessionJoinMessage {
  id: string;
  senderPlayerIndex: number;
  senderPlayerNetworkId: string;
  players: PlayerModel[];
}

export interface SessionLeaveMessage {
  id: string;
  playerLeft: PlayerModel;
  senderPlayerIndex: number;
  senderPlayerNetworkId: string;
  players: PlayerModel[];
}

export interface CardsUpdateMessage {
  sessionId: string;
  senderPlayerIndex: number;
  senderPlayerNetworkId: string;
  cards: CardModel[];
}

export interface PlayersUpdateMessage {
  sessionId: string;
  senderPlayerIndex: number;
  senderPlayerNetworkId: string;
  players: PlayerModel[];
}

export interface GameSessionsPersistence {
  create(session: SessionMessage): string;
  read(id: string): SessionMessage;
  readAll(): SessionMessage[];
  update(id: string, session: SessionMessage): SessionMessage;
  delete(id: string): SessionMessage;
}

export interface ServerOptions {
  port: number;
  gameSessionsUpdateSendInterval: number;
  gameSessionsPersistence: GameSessionsPersistence;
}

export interface ClientOptions {
  playerIndex: number;
  playerNetworkId: string;
  socketUrl: string;
}
