import { GameServer } from './game-server';
import { SimpleGameSessionPersistence } from './simple-session-persistence';
import { ServerOptions } from './interfaces';

const PORT: number = Number(process.env.PORT) || 4444;
const SEND_GAME_SESSIONS_UPDATE_INTERVAL = 5000;

const options: ServerOptions = {
  port: PORT,
  gameSessionsUpdateSendInterval: SEND_GAME_SESSIONS_UPDATE_INTERVAL,
  gameSessionsPersistence: new SimpleGameSessionPersistence(),
};

const server = new GameServer(options);
