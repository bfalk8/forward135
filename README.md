# forward135
Repo for the Forward research group's WebSocket Framework. A Full-Stack Architectre for efficient change propogation from the server all the way to the client. 

## Basic Application Flow
![Socket Flow](https://github.com/bfalk8/forward135/raw/master/docs/images/webSocketFlow.png "Socket Flow Image")

## Structure
### Client --> Server: WebSockets

Communication is initialed by a client-side WebSocket module. After a connection has been established, the client will emit a message of type `("init query", <QUERY>)`. It will also start listening for messages of type *Query*.

When a message is retrieved by the server, the client's session will be added to the group *Query*. Groups are implemented using SocketIO's rooms: 

- If a *Query* room already exists, the new client will join the room. 
- If a *Query* does not exist, a new room will be created.

The *Query* will be evaluated and the result will be emitted to the client using a *Diff*.

### Diff
Diffs are objects that represent changes (differences) in the database. They follow the following format: 
```
diff = {
        op: <FUNCTION>
        target: <id>
        payload:  {<KEY>: <VALUE>}
       }
```
The following functions (`op`s) will eventually be supported:
- `insert(target: <id>, payload: {<KEY>: <VALUE> })`
- `delete(target: <id>)`
- `update(target: <id>, payload: {<KEY>: <VALUE> })`
- `construct(payload: {<KEY>: <VALUE> })`

For the purposes of our project, however, we only intend to handle insertions.

### Server --> Client: IVM
IVM is short for Incremental View Maintenance. It's a module that generates Diffs based on changes in the database. At some point, the IVM will generate a diff for a given *Query*. When this happens, the IVM will communicate with the SocketHandler module to propagage a diff to the right room (eager propagation).

Upon retrieval, the client will add the diff to a log. The client keeps separate logs for each type of diff (insert, update, and delete). In the future, a batching modal can be implemented to support lazy propagation.

### Snowflake Schema
Our data is modeled with a Snowflake schema design: We have a central fact table (orders) and other tables that provide dimensions to the data in the fact table. This allows for efficient aggregation and analytics calculation. 

For the purposes of our project, we only aim to implement summation aggregation as a proof of concept for more complex analytics. 

![Snowflake Schema](https://github.com/bfalk8/forward135/blob/master/docs/images/snowflakeDB.png "Snowflake Schema")

## API
### SocketIO messages (used internally within SocketModule)
#### Client --> Server
* "init query" - `{query: <QUERY>}`

#### Server --> Client
* "init query" - `{result: <QUERY RESULT>}`
* "diff query" - `{op: <FUNCTION>, target: <id>, payload: {<KEY>: <VALUE>}}`

[](### WrappedComponent Module)
[](The WrappedComponent module is the module that the end user interacts with. The developer will pass this component a 'query' (relational algebra expression end_paran along with an object that provides a query results -> component elements mapping. The WrappedComponent module is responsible for creating an appropriate SocketModule, interpreting the diffs, and updating the views.)

[](When a WrappedComponent module is instantiated, it is passed a string containing the relational algebra in the syntax we support. Also, a reference to the selector `id` of the component being wrapped will be passed in so the module can find the component in the html tree. Finally, an object containing a mapping of query result to selector to let our module know where to insert the data returned from the database i.e. for a query of the form `select * from SOMETABLE where age > 21` and we knew beforehand that our query result would return columns 'name', 'age', and 'email', our mapping object would look like `{name: '#name', age: '#age', email: '#email'}`)

[](`... new WrappedComponent(<query>, <id>, <mapping object> end_paran`)

