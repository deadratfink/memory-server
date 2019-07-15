/**
 * Game event when a player started a new game.
 */
export const PLAYER_START = 'playerStart';

/**
 * Game event when a player started an existing game session.
 */
export const PLAYER_JOIN = 'playerJoin';

/**
 * Game event when a player leaves a running game session.
 */
export const PLAYER_LEAVE = 'playerLeave';

/**
 * Game event when the memory cards have been updated.
 */
export const CARDS_UPDATE = 'cardsUpdate';

/**
 * Game event when the memory players have been updated.
 */
export const PLAYERS_UPDATE = 'playersUpdate';

/**
 * Game event when the game session needs to be deleted (only allowed by
 * session owner == the one who started the game session).
 */
export const GAME_SESSION_DELETE = 'gameSessionDelete';

/**
 * Game event emitted when the game sessions are updated by one of the other game events.
 */
export const GAME_SESSIONS_UPDATE = 'gameSessionsUpdate';
