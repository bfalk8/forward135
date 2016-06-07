class Log {
    constructor(listId){
        this.listId = listId;
    }
    
    appendLog(payload){
        var node = document.createElement("LI");                
        var pre = document.createElement("PRE");
        var content = document.createTextNode(payload);
        pre.appendChild(content);
        node.appendChild(pre);                            
        document.getElementById(this.listId).appendChild(node); 
    }
}

export default Log;