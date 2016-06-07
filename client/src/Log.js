class Log {
    constructor(listId){
        this.tableId = listId;
    }
    
    appendLog(payload){
        var node = document.createElement("LI");                
        var pre = document.createElement("PRE");
        var content = document.createTextNode(JSON.stringify(payload));
        pre.appendChild(content);
        node.appendChild(pre);                            
        document.getElementById(this.tableId).appendChild(node); 
    }
}

export default Log;