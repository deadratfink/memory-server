import {
  GameSessionsPersistence,
  SessionMessage,
} from './interfaces';

/**
 * @classdesc A simple game session in-memory persistence example.
 */
export class SimpleGameSessionPersistence implements GameSessionsPersistence {
  private sessions: any;

  /**
   * Creates an instance of simple game session persistence na initalizes the basic session object.
   */
  constructor() {
    this.sessions = {};
  }

  /**
   * Creates a game session.
   * @param session - The session to persist.
   * @returns The ID of the created session.
   */
  public create(session: SessionMessage): string {
    this.sessions[session.id] = session;
    // console.log(`DB: session created => ${JSON.stringify(session, null, 2)}`);
    // console.log(`DB: latest state after CREATE => ${JSON.stringify(this.sessions, null, 2)}`);
    return session.id;
  }

  /**
   * Reads a game session.
   * @param id - The ID of the session to read.
   * @returns The read session.
   */
  public read(id: string): SessionMessage {
    // console.log(`DB: session read => ${JSON.stringify(id, null, 2)}`);
    return this.sessions[id];
  }

  /**
   * Reads all game sessions.
   * @returns All sessions.
   */
  public readAll(): SessionMessage[] {
    // console.log(`DB: session readAll => ${JSON.stringify(this.sessions, null, 2)}`);
    return Object.values(this.sessions);
  }

  /**
   * Updates a game session.
   * @param id - The ID of the session to update.
   * @returns The passed update session.
   */
  public update(id: string, session: SessionMessage): SessionMessage {
    this.sessions[id] = session;
    // console.log(`DB: session update => ${JSON.stringify(session, null, 2)}`);
    // console.log(`DB: latest state after UPDATE => ${JSON.stringify(this.sessions, null, 2)}`);
    return session;
  }

  /**
   * Deletes a game session.
   * @param id - The ID of the session to delete.
   * @returns The deleted session.
   */
  public delete(id: string): SessionMessage {
    const toDelete: SessionMessage = this.sessions[id];
    // console.log(`DB: session delete => ${JSON.stringify(toDelete, null, 2)}`);
    delete this.sessions[id];
    console.log(`DB: latest state after DELETE => ${JSON.stringify(this.sessions, null, 2)}`);
    return toDelete;
  }
}
