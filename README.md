# Forward135
A Full-Stack Architecture for efficient change propagation from the server all the way to the client.

http://forward.ucsd.edu/

## Basic Application Flow
![Socket Flow](https://github.com/bfalk8/forward135/raw/master/docs/images/webSocketFlow.png "Socket Flow Image")

## Structure
### Client --> Server: WebSockets

Communication is initialed by a client-side WebSocket module. After a connection has been established, the client will emit a message of type `("init query", <QUERY>)`. It will also start listening for messages of type *init query*.

When a message is retrieved by the server, the client's session will be added to the group *<QUERY>*. Groups are implemented using SocketIO's rooms:

- If a *<QUERY>* room already exists, the new client will join the room.
- If a *<QUERY>* does not exist, a new room will be created.

The *<QUERY>* will be evaluated and the result will be emitted to the client using an *init query* message.

The client will then start listening to for the *diff query* message.

### Diff
Diffs are objects that represent changes (differences) in the query results. They follow the following format:
```
diff = {
    op: <FUNCTION>,
    query: <Query>,
    payload: [ {target: <id>, change: {<KEY>: <VALUE>}}, ...]
}
```
The following functions (`op`) will eventually be supported:
- `insert(target: <id>, payload: {<KEY>: <VALUE> })`
- `delete(target: <id>)`
- `update(target: <id>, payload: {<KEY>: <VALUE> })`
- `construct(payload: {<KEY>: <VALUE> })`

For the purposes of our project, however, we only intend to handle insertions.

### Server --> Client: IVM
IVM is short for Incremental View Maintenance. It's a module that generates Diffs based on changes in the database. At some point, the IVM will generate a Diff for a given *<QUERY>*. When this happens, the IVM will communicate with the SocketHandler module to propagate a Diff to the right room (deferred maintenance / propagation).

Upon retrieval, the client will add the Diff to a log. The client keeps separate logs for each type of Diff (insert, update, and delete). In the future, a batching modal can be implemented to support lazy propagation.

### Snowflake Schema
Our data is modeled with a Snowflake schema design: We have a central fact table (orders) and other tables that provide dimensions to the data in the fact table. This allows for efficient aggregation and analytics calculation.

For the purposes of our project, we only aim to implement summation aggregation as a proof of concept for more complex analytics.

![Snowflake Schema](https://github.com/bfalk8/forward135/blob/master/docs/images/snowflakeDB1.png "Snowflake Schema")

## API
### SocketIO messages (used internally within SocketModule)
#### Client --> Server
* "init query" - `{query: <QUERY>}` <br>
  Example: <br>
`{query: 'select * from sometable join anothertable on somevalue = anothervalue...'}`

#### Server --> Client
* "init query" - `{query: <QUERY BEING TRACKED>, payload: <QUERY RESULT>}`
* "diff query" - `{op: <FUNCTION>, query: <QUERY>, payload: [{target: <id>, change: {<KEY>: <VALUE>}}, ...]}` <br>
  Example: <br>
```
{
    op: 'INSERT',
    query: 'SELECT * FROM geisel',
    payload: [
                { target: '3001', change: {name: 'Cat', meal: 'food', headware: 'Hat'} },
                { target: '3030', change: {name: 'Sam', meal: 'eggs and ham', headware: 'Grad Cap'} }
            ]
}
```
* "error message" - `{query: <QUERY BEING TRACKED>, error: <ERROR MESSAGE>}`

## References
[1] http://blog.zarifis.info/ivm-fullstack-proposal/
