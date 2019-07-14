import { LoggingPlayerClient } from '../src/logging-player-client';
import { ClientOptions, PlayerModel, CardModel } from '../src/interfaces';


const options1: ClientOptions = {
  playerIndex: 0,
  socketUrl: 'http://localhost:4444',
};

const options2: ClientOptions = {
  playerIndex: 1,
  socketUrl: 'http://localhost:4444',
};

const initialCards: CardModel[] = [
  {
    pairId: 'XXX',
    url: 'XXX',
    uncovered: false,
    removed: false,
  },
  {
    pairId: 'XXX',
    url: 'XXX',
    uncovered: false,
    removed: false,
  },
  {
    pairId: 'YYY',
    url: 'YYY',
    uncovered: false,
    removed: false,
  },
  {
    pairId: 'YYY',
    url: 'YYY',
    uncovered: false,
    removed: false,
  }
];

const player1 = new LoggingPlayerClient(options1);
const newSession = player1.startGame('PLAYER 1\'s session', {
  name: 'PLAYER 1',
  score: 0,
  active: true,
}, initialCards);

const player2 = new LoggingPlayerClient(options2);
setTimeout(() => {
  const joinedPlayers: PlayerModel[] = [
    {
      name: 'PLAYER 1',
      score: 0,
      active: true,
    },
    {
      name: 'PLAYER 2',
      score: 0,
      active: false,
    }
  ];
  player2.joinGame(newSession.id, options2.playerIndex, joinedPlayers);
}, 1000);

// switch players
setTimeout(() => {
  const switchedPlayers: PlayerModel[] = [
    {
      name: 'PLAYER 1',
      score: 0,
      active: false,
    },
    {
      name: 'PLAYER 2',
      score: 0,
      active: true,
    }
  ];
  player1.updatePlayers(newSession.id, options1.playerIndex, switchedPlayers);
  // player1.updatePlayers(newSession.id, options1.playerIndex, newSession.players);
}, 2000);

setTimeout(() => {
  const toLeave1Players: PlayerModel[] = [
    {
      name: 'PLAYER 1',
      score: 0,
      active: false,
    },
    {
      name: 'PLAYER 2',
      score: 0,
      active: true,
    }
  ];
  player2.leaveGame(newSession.id, options2.playerIndex, toLeave1Players);
}, 4000);


setTimeout(() => {
  const toLeave0Players: PlayerModel[] = [
    {
      name: 'PLAYER 1',
      score: 0,
      active: true,
    }
  ];
  player1.leaveGame(newSession.id, options1.playerIndex, toLeave0Players);
}, 6000);

setTimeout(() => {
  player1.startGame('PLAYER 1\'s 2nd session', {
    name: 'PLAYER 1 / 2nd',
    score: 0,
    active: true,
  }, initialCards);
}, 10000);





// public utilities = new class extends AbstractPlayerClient {
//   public onPlayerStartedGame(session: SessionModel, connected: boolean): void {
//     throw new Error("Method not implemented.");
//   }
//   public onPlayerJoinedGame(session: SessionJoinModel, connected: boolean): void {
//     throw new Error("Method not implemented.");
//   }
//   public onPlayerLeftGame(session: SessionLeaveModel, connected: boolean): void {
//     throw new Error("Method not implemented.");
//   }
//   public onCardsUpdate(update: CardsUpdateModel): void {
//     throw new Error("Method not implemented.");
//   }
//   public onPlayersUpdate(update: PlayersUpdateModel): void {
//     throw new Error("Method not implemented.");
//   }
//   public onGameSessionsUpdate(sessions: SessionModel[], connected: boolean): void {
//     throw new Error("Method not implemented.");
//   }
//   constructor(options: ClientOptions) {
//     super(options);
//   }

// }({
//   playerIndex: 1,
//   socketUrl: 'http://localhost:4444',
// });
