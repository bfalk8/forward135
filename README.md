# forward135
Repo for the forward research group's WebSocket Framework

## Basic Application Flow
![Socket Flow](https://github.com/bfalk8/forward135/raw/master/docs/images/webSocketFlow.png "Socket Flow Image")

## Structure


## API
### SocketIO messages (used internally within SocketModule)
#### Client -> Server
* "init query" - `{query: <QUERY>}`

#### Server -> Client
* "init query" - `{result: <QUERY RESULT>}`
* "diff query" - `{op: <FUNCTION>, target: <id>, payload: {<KEY>: <VALUE>}}`

### WrappedComponent Module
The WrappedComponent module is the module that the end user interacts with. The developer will pass this component a 'query' (relational algebra expression) along with an object that provides a query results -> component elements mapping. The WrappedComponent module is responsible for creating an appropriate SocketModule, interpreting the diffs, and updating the views.

When a WrappedComponent module is instantiated, it is passed a string containing the relational algebra in the syntax we support. Also, a reference to the selector `id` of the component being wrapped will be passed in so the module can find the component in the html tree. Finally, an object containing a mapping of query result to selector to let our module know where to insert the data returned from the database i.e. for a query of the form `select * from SOMETABLE where age > 21` and we knew beforehand that our query result would return columns 'name', 'age', and 'email', our mapping object would look like `{name: '#name', age: '#age', email: '#email'}` 

`... new WrappedComponent(<query>, <id>, <mapping object>)`
