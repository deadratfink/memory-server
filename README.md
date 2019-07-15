# memory-server (v1.0.0)

A websocket implementation for [memory-ui](https://github.com/jhkruse/memory-ui) remote players.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## TOC

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
  - [1. Install Node.js](#1-install-nodejs)
  - [2. Install Dependencies](#2-install-dependencies)
- [Start Server](#start-server)
  - [Dev-Mode](#dev-mode)
  - [Prod-Mode](#prod-mode)
- [Usage](#usage)
  - [Instantiate Server](#instantiate-server)
  - [Use own Persistence Layer](#use-own-persistence-layer)
- [Development](#development)
  - [Transpile](#transpile)
  - [Run the Linter](#run-the-linter)
  - [Executes Tests](#executes-tests)
  - [Create Readme](#create-readme)
- [Further information](#further-information)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Introduction

This project provides the server to run network games within [memory-ui](https://github.com/jhkruse/memory-ui)
application.

## Prerequisites

Pls ensure that the following requirements are fulfilled before you go ahead.

### 1. Install Node.js

To use node.js it is recomended to have [nvm](https://github.com/nvm-sh/nvm) installed. Afterwards, you can
install node, e.g.:

```text
$ nvm install 10
```

### 2. Install Dependencies

```text
$ make install
```

## Start Server

You can start a simple server with a plain memory persistence of the game session(s).

### Dev-Mode

Starting the `ts` code with `ts-node`:

```text
$ make start
```

or for excecting the transpiled `js` code;

```text
$ make start-js
```

### Prod-Mode

```text
$ make prod
```

## Usage

The following shows an example how use the server programmatically.

### Instantiate Server

```typescript
import {
  GameServer,
  SimpleGameSessionPersistence,
  ServerOptions,
} from 'memory-server';

const PORT: number = Number(process.env.PORT) || 4444;
const SEND_GAME_SESSIONS_UPDATE_INTERVAL = 5000;

const options: ServerOptions = {
  port: PORT,
  gameSessionsUpdateSendInterval: SEND_GAME_SESSIONS_UPDATE_INTERVAL,
  gameSessionsPersistence: new SimpleGameSessionPersistence(),
};

const server = new GameServer(options);

// ...

server.stop();
```

> HINT: once started the server prints out some useful information:
>
> ```text
> SERVER: listening on http://mycomputername:4444 ...
> SERVER: listening on http://192.168.0.14:4444 ...
> ```

### Use own Persistence Layer

The `GameSessionPersistence` provides an interface to inject own persistence code into the server
to hold game session information.

Here a simple memory persistence example as used in the code above:

```typescript
import {
  GameSessionPersistence,
  SessionMessage,
} from 'memory-server';

export class SimpleGameSessionPersistence implements GameSessionsPersistence {
  private sessions: any;

  constructor() {
    this.sessions = {};
  }

  public create(session: SessionMessage): string {
    this.sessions[session.id] = session;
    return session.id;
  }

  public read(id: string): SessionMessage {
    return this.sessions[id];
  }

  public readAll(): SessionMessage[] {
    return Object.values(this.sessions);
  }

  public update(id: string, session: SessionMessage): SessionMessage {
    this.sessions[id] = session;
    return session;
  }
}
```

The remaining interfaces you need to know:

```typescript
interface SessionMessage {
  id: string;
  name: string;
  status: string;
  sessionOwnerNetworkId: string;
  senderPlayerIndex: number;
  senderPlayerNetworkId: string;
  players: PlayerModel[];
  cards: CardModel[];
}

interface PlayerModel {
  networkId: string;
  name: string;
  score: number;
  active: boolean;
}

interface CardModel {
  pairId: string;
  url: string;
  uncovered: boolean;
  removed: boolean;
}
```

## Development

Tasks usable to go ahead with further development of this module.

### Transpile

To transpile `ts` code to `js` into _./dist_:

```text
$ make build
```

### Run the Linter

```text
$ make lint
```

### Executes Tests

```text
$ make lint
```

### Create Readme

```text
$ make readme
```


## Further information

- [Module Details](./PACKAGE.md)

- [Api Reference](./API.md)

- [Makefile Reference](./MAKE.md)

- [Changelog](./CHANGELOG.md)

- [License](./LICENSE.md)

