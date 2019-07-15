import {
  GameSessionsPersistence,
  SessionMessage,
} from './interfaces';

export class SimpleGameSessionPersistence implements GameSessionsPersistence {
  sessions: any;

  constructor() {
    this.sessions = {};
  }

  public create(session: SessionMessage): string {
    this.sessions[session.id] = session;
    // console.log(`DB: session created => ${JSON.stringify(session, null, 2)}`);
    // console.log(`DB: latest state after CREATE => ${JSON.stringify(this.sessions, null, 2)}`);
    return session.id;
  }

  public read(id: string): SessionMessage {
    // console.log(`DB: session read => ${JSON.stringify(id, null, 2)}`);
    return this.sessions[id];
  }

  public readAll(): SessionMessage[] {
    // console.log(`DB: session readAll => ${JSON.stringify(this.sessions, null, 2)}`);
    return Object.values(this.sessions);
  }

  public update(id: string, session: SessionMessage): SessionMessage {
    this.sessions[id] = session;
    // console.log(`DB: session update => ${JSON.stringify(session, null, 2)}`);
    // console.log(`DB: latest state after UPDATE => ${JSON.stringify(this.sessions, null, 2)}`);
    return session;
  }

  public delete(id: string): SessionMessage {
    const toDelete: SessionMessage = this.sessions[id];
    // console.log(`DB: session delete => ${JSON.stringify(toDelete, null, 2)}`);
    delete this.sessions[id];
    console.log(`DB: latest state after DELETE => ${JSON.stringify(this.sessions, null, 2)}`);
    return toDelete;
  }
}
