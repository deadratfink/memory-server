<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## TOC

- [Classes](#classes)
- [Members](#members)
- [Constants](#constants)
- [GameServer](#gameserver)
- [SimpleGameSessionPersistence](#simplegamesessionpersistence)
- [PLAYER\_START](#player%5C_start)
- [PLAYER\_JOIN](#player%5C_join)
- [PLAYER\_LEAVE](#player%5C_leave)
- [CARDS\_UPDATE](#cards%5C_update)
- [PLAYERS\_UPDATE](#players%5C_update)
- [GAME\_SESSION\_DELETE](#game%5C_session%5C_delete)
- [CONNECTION](#connection)
- [PLAYER\_START](#player%5C_start-1)
- [CONNECTION](#connection-1)
- [PORT](#port)
- [SEND\_GAME\_SESSIONS\_UPDATE\_INTERVAL](#send%5C_game%5C_sessions%5C_update%5C_interval)
- [options](#options)
- [server](#server)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Classes

<dl>
<dt><a href="#GameServer">GameServer</a></dt>
<dd><p>The game socket server receiving and sending game and connection events.</p></dd>
<dt><a href="#SimpleGameSessionPersistence">SimpleGameSessionPersistence</a></dt>
<dd><p>A simple game session in-memory persistence example.</p></dd>
</dl>

## Members

<dl>
<dt><a href="#PLAYER_START">PLAYER_START</a></dt>
<dd><p>Game event when a player started an existing game session.</p></dd>
<dt><a href="#PLAYER_JOIN">PLAYER_JOIN</a></dt>
<dd><p>Game event when a player leaves a running game session.</p></dd>
<dt><a href="#PLAYER_LEAVE">PLAYER_LEAVE</a></dt>
<dd><p>Game event when the memory cards have been updated.</p></dd>
<dt><a href="#CARDS_UPDATE">CARDS_UPDATE</a></dt>
<dd><p>Game event when the memory players have been updated.</p></dd>
<dt><a href="#PLAYERS_UPDATE">PLAYERS_UPDATE</a></dt>
<dd><p>Game event when the game session needs to be deleted (only allowed by
session owner == the one who started the game session).</p></dd>
<dt><a href="#GAME_SESSION_DELETE">GAME_SESSION_DELETE</a></dt>
<dd><p>Game event emitted when the game sessions are updated by one of the other game events.</p></dd>
<dt><a href="#CONNECTION">CONNECTION</a></dt>
<dd><p>The socket.io close event.</p></dd>
</dl>

## Constants

<dl>
<dt><a href="#PLAYER_START">PLAYER_START</a></dt>
<dd><p>Game event when a player started a new game.</p></dd>
<dt><a href="#CONNECTION">CONNECTION</a></dt>
<dd><p>The socket.io connection event.</p></dd>
<dt><a href="#PORT">PORT</a></dt>
<dd><p>The game server port, can also be obtained from <code>process.env.PORT</code>.</p></dd>
<dt><a href="#SEND_GAME_SESSIONS_UPDATE_INTERVAL">SEND_GAME_SESSIONS_UPDATE_INTERVAL</a></dt>
<dd><p>The game session emit interval.</p></dd>
<dt><a href="#options">options</a></dt>
<dd><p>The game server options.</p></dd>
<dt><a href="#server">server</a></dt>
<dd><p>The game server instance.</p></dd>
</dl>

<a name="GameServer"></a>

## GameServer
<p>The game socket server receiving and sending game and connection events.</p>

**Kind**: global class  

* [GameServer](#GameServer)
    * [new GameServer(options)](#new_GameServer_new)
    * [.handleEventError(err, event)](#GameServer+handleEventError)
    * [.initHttpServerRoutes(app, port)](#GameServer+initHttpServerRoutes)
    * [.initGameSessionsSendInterval(io, options)](#GameServer+initGameSessionsSendInterval) ⇒
    * [.initSocketEventListeners(io, options)](#GameServer+initSocketEventListeners)
    * [.start(port)](#GameServer+start)
    * [.stop()](#GameServer+stop)

<a name="new_GameServer_new"></a>

### new GameServer(options)
<p>Creates an instance of game server and starts it with the given options.</p>


| Param | Description |
| --- | --- |
| options | <p>The game server options.</p> |

<a name="GameServer+handleEventError"></a>

### gameServer.handleEventError(err, event)
<p>Handles event error (logging).</p>

**Kind**: instance method of [<code>GameServer</code>](#GameServer)  

| Param | Description |
| --- | --- |
| err | <p>The error occurred.</p> |
| event | <p>The current event</p> |

<a name="GameServer+initHttpServerRoutes"></a>

### gameServer.initHttpServerRoutes(app, port)
<p>Inits the HTTP server routes.</p>

**Kind**: instance method of [<code>GameServer</code>](#GameServer)  

| Param | Description |
| --- | --- |
| app | <p>The express application (HTTP server).</p> |
| port | <p>The port the server is listening.</p> |

<a name="GameServer+initGameSessionsSendInterval"></a>

### gameServer.initGameSessionsSendInterval(io, options) ⇒
<p>Inits game sessions send interval for the socket server.</p>

**Kind**: instance method of [<code>GameServer</code>](#GameServer)  
**Returns**: <p>The itervall timeout object for later reference when closing server gracefully.</p>  

| Param | Description |
| --- | --- |
| io | <p>The socket server.</p> |
| options | <p>The server options.</p> |

<a name="GameServer+initSocketEventListeners"></a>

### gameServer.initSocketEventListeners(io, options)
<p>Inits socket event listeners.</p>

**Kind**: instance method of [<code>GameServer</code>](#GameServer)  

| Param | Description |
| --- | --- |
| io | <p>The socket server.</p> |
| options | <p>The server options.</p> |

<a name="GameServer+start"></a>

### gameServer.start(port)
<p>Starts game server.</p>

**Kind**: instance method of [<code>GameServer</code>](#GameServer)  

| Param | Description |
| --- | --- |
| port | <p>The port the server starts on.</p> |

<a name="GameServer+stop"></a>

### gameServer.stop()
<p>Stops game server gracefully.</p>

**Kind**: instance method of [<code>GameServer</code>](#GameServer)  
<a name="SimpleGameSessionPersistence"></a>

## SimpleGameSessionPersistence
<p>A simple game session in-memory persistence example.</p>

**Kind**: global class  

* [SimpleGameSessionPersistence](#SimpleGameSessionPersistence)
    * [new SimpleGameSessionPersistence()](#new_SimpleGameSessionPersistence_new)
    * [.create(session)](#SimpleGameSessionPersistence+create) ⇒
    * [.read(id)](#SimpleGameSessionPersistence+read) ⇒
    * [.readAll()](#SimpleGameSessionPersistence+readAll) ⇒
    * [.update(id)](#SimpleGameSessionPersistence+update) ⇒
    * [.delete(id)](#SimpleGameSessionPersistence+delete) ⇒

<a name="new_SimpleGameSessionPersistence_new"></a>

### new SimpleGameSessionPersistence()
<p>Creates an instance of simple game session persistence na initalizes the basic session object.</p>

<a name="SimpleGameSessionPersistence+create"></a>

### simpleGameSessionPersistence.create(session) ⇒
<p>Creates a game session.</p>

**Kind**: instance method of [<code>SimpleGameSessionPersistence</code>](#SimpleGameSessionPersistence)  
**Returns**: <p>The ID of the created session.</p>  

| Param | Description |
| --- | --- |
| session | <p>The session to persist.</p> |

<a name="SimpleGameSessionPersistence+read"></a>

### simpleGameSessionPersistence.read(id) ⇒
<p>Reads a game session.</p>

**Kind**: instance method of [<code>SimpleGameSessionPersistence</code>](#SimpleGameSessionPersistence)  
**Returns**: <p>The read session.</p>  

| Param | Description |
| --- | --- |
| id | <p>The ID of the session to read.</p> |

<a name="SimpleGameSessionPersistence+readAll"></a>

### simpleGameSessionPersistence.readAll() ⇒
<p>Reads all game sessions.</p>

**Kind**: instance method of [<code>SimpleGameSessionPersistence</code>](#SimpleGameSessionPersistence)  
**Returns**: <p>All sessions.</p>  
<a name="SimpleGameSessionPersistence+update"></a>

### simpleGameSessionPersistence.update(id) ⇒
<p>Updates a game session.</p>

**Kind**: instance method of [<code>SimpleGameSessionPersistence</code>](#SimpleGameSessionPersistence)  
**Returns**: <p>The passed update session.</p>  

| Param | Description |
| --- | --- |
| id | <p>The ID of the session to update.</p> |

<a name="SimpleGameSessionPersistence+delete"></a>

### simpleGameSessionPersistence.delete(id) ⇒
<p>Deletes a game session.</p>

**Kind**: instance method of [<code>SimpleGameSessionPersistence</code>](#SimpleGameSessionPersistence)  
**Returns**: <p>The deleted session.</p>  

| Param | Description |
| --- | --- |
| id | <p>The ID of the session to delete.</p> |

<a name="PLAYER_START"></a>

## PLAYER\_START
<p>Game event when a player started an existing game session.</p>

**Kind**: global variable  
<a name="PLAYER_JOIN"></a>

## PLAYER\_JOIN
<p>Game event when a player leaves a running game session.</p>

**Kind**: global variable  
<a name="PLAYER_LEAVE"></a>

## PLAYER\_LEAVE
<p>Game event when the memory cards have been updated.</p>

**Kind**: global variable  
<a name="CARDS_UPDATE"></a>

## CARDS\_UPDATE
<p>Game event when the memory players have been updated.</p>

**Kind**: global variable  
<a name="PLAYERS_UPDATE"></a>

## PLAYERS\_UPDATE
<p>Game event when the game session needs to be deleted (only allowed by
session owner == the one who started the game session).</p>

**Kind**: global variable  
<a name="GAME_SESSION_DELETE"></a>

## GAME\_SESSION\_DELETE
<p>Game event emitted when the game sessions are updated by one of the other game events.</p>

**Kind**: global variable  
<a name="CONNECTION"></a>

## CONNECTION
<p>The socket.io close event.</p>

**Kind**: global variable  
<a name="PLAYER_START"></a>

## PLAYER\_START
<p>Game event when a player started a new game.</p>

**Kind**: global constant  
<a name="CONNECTION"></a>

## CONNECTION
<p>The socket.io connection event.</p>

**Kind**: global constant  
<a name="PORT"></a>

## PORT
<p>The game server port, can also be obtained from <code>process.env.PORT</code>.</p>

**Kind**: global constant  
<a name="SEND_GAME_SESSIONS_UPDATE_INTERVAL"></a>

## SEND\_GAME\_SESSIONS\_UPDATE\_INTERVAL
<p>The game session emit interval.</p>

**Kind**: global constant  
<a name="options"></a>

## options
<p>The game server options.</p>

**Kind**: global constant  
<a name="server"></a>

## server
<p>The game server instance.</p>

**Kind**: global constant  
