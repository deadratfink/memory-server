# memory-server

A websocket implementation for [memory-ui](https://github.com/jhkruse/memory-ui) remote players.

## Installation

This is a [Node.js](https://nodejs.org/) module available through the 
[npm registry](https://www.npmjs.com/). It can be installed using the 
[`npm`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)
or 
[`yarn`](https://yarnpkg.com/en/)
command line tools.

```sh
npm install memory-server --save
```

## Tests

```sh
npm install
npm test
```

## Dependencies

- [express](https://ghub.io/express): Fast, unopinionated, minimalist web framework
- [socket.io](https://ghub.io/socket.io): node.js realtime framework server
- [uuid](https://ghub.io/uuid): RFC4122 (v1, v4, and v5) UUIDs

## Dev Dependencies

- [@babel/core](https://ghub.io/@babel/core): Babel compiler core.
- [@types/express](https://ghub.io/@types/express): TypeScript definitions for Express
- [@types/node](https://ghub.io/@types/node): TypeScript definitions for Node.js
- [@types/socket.io](https://ghub.io/@types/socket.io): TypeScript definitions for socket.io
- [@types/socket.io-client](https://ghub.io/@types/socket.io-client): TypeScript definitions for socket.io-client
- [@types/uuid](https://ghub.io/@types/uuid): TypeScript definitions for uuid
- [doctoc](https://ghub.io/doctoc): Generates TOC for markdown files of local git repo.
- [jsdoc-babel](https://ghub.io/jsdoc-babel): A JSDoc plugin that transforms ES6 source files with Babel before they are processsed.
- [jsdoc-to-markdown](https://ghub.io/jsdoc-to-markdown): Generates markdown API documentation from jsdoc annotated source code
- [package-json-to-readme](https://ghub.io/package-json-to-readme): Generate a README.md from package.json contents
- [socket.io-client](https://ghub.io/socket.io-client): [![Build Status](https://secure.travis-ci.org/socketio/socket.io-client.svg?branch=master)](http://travis-ci.org/socketio/socket.io-client) [![Dependency Status](https://david-dm.org/socketio/socket.io-client.svg)](https://david-dm.org/socketio/socket.io-client) [![devDependency Status](https://david-dm.org/socketio/socket.io-client/dev-status.svg)](https://david-dm.org/socketio/socket.io-client#info=devDependencies) [![NPM version](https://badge.fury.io/js/socket.io-client.svg)](https://www.npmjs.com/package/socket.io-client) ![Downloads](http://img.shields.io/npm/dm/socket.io-client.svg?style=flat) [![](http://slack.socket.io/badge.svg?)](http://slack.socket.io)
- [ts-node](https://ghub.io/ts-node): TypeScript execution environment and REPL for node.js, with source map support
- [tslint](https://ghub.io/tslint): An extensible static analysis linter for the TypeScript language
- [typescript](https://ghub.io/typescript): TypeScript is a language for application scale JavaScript development

## License

MIT
