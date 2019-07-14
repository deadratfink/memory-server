import {
  GameSessionsPersistence,
  SessionModel,
} from './interfaces';

export class SimpleGameSessionPersistence implements GameSessionsPersistence {
  sessions: any;

  constructor() {
    this.sessions = {};
  }

  public create(session: SessionModel): string {
    this.sessions[session.id] = session;
    console.log(`DB: session created => ${JSON.stringify(session, null, 2)}`);
    console.log(`DB: latest state after CREATE => ${JSON.stringify(this.sessions, null, 2)}`);
    return session.id;
  }

  public read(id: string): SessionModel {
    console.log(`DB: session read => ${JSON.stringify(id, null, 2)}`);
    return this.sessions[id];
  }

  public readAll(): SessionModel[] {
    // console.log(`DB: session readAll => ${JSON.stringify(this.sessions, null, 2)}`);
    return Object.values(this.sessions);
  }

  public update(id: string, session: SessionModel): SessionModel {
    this.sessions[id] = session;
    console.log(`DB: session update => ${JSON.stringify(session, null, 2)}`);
    console.log(`DB: latest state after UPDATE => ${JSON.stringify(this.sessions, null, 2)}`);
    return session;
  }

  public delete(id: string): SessionModel {
    const toDelete: SessionModel = this.sessions[id];
    console.log(`DB: session delete => ${JSON.stringify(toDelete, null, 2)}`);
    delete this.sessions[id];
    console.log(`DB: latest state after DELETE => ${JSON.stringify(this.sessions, null, 2)}`);
    return toDelete;
  }
}
