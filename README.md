# forward135
Repo for the forward research group's WebSocket Framework

## Basic Application Flow
![Socket Flow](https://github.com/bfalk8/forward135/raw/master/docs/images/webSocketFlow.png "Socket Flow Image")

## Structure


## API
### SocketIO messages
#### Client -> Server
* "init query" - `{query: <QUERY>}`

#### Server -> Client
* "init query" - `{result: <QUERY RESULT>}`
* "diff query" - `{op: <FUNCTION>, target: <id>, payload: {<KEY>: <VALUE>}}`
