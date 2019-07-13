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

export interface SessionNewModel {
  id: string;
  name: string;
  status: string;
  senderPlayerIndex: number;
  players: PlayerModel[];
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
