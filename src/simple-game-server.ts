import { GameServer } from './game-server';
import { SimpleGameSessionPersistence } from './simple-session-persistence';
import { ServerOptions } from './interfaces';

/** The game server port, can also be obtained from `process.env.PORT`. */
const PORT: number = Number(process.env.PORT) || 4444;

/** The game session emit interval. */
const SEND_GAME_SESSIONS_UPDATE_INTERVAL = 5000;

/** The game server options. */
const options: ServerOptions = {
  port: PORT,
  gameSessionsUpdateSendInterval: SEND_GAME_SESSIONS_UPDATE_INTERVAL,
  gameSessionsPersistence: new SimpleGameSessionPersistence(),
};

/** The game server instance. */
const server = new GameServer(options);
