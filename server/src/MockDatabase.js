
var N_obj = 5;
var objList = [];
for(var i = 0; i < N_obj; i++)
{
    var obj = {
        id: i,
        name: 'test_obj_' + i,
        updateCount: 0,
        timestamp: Date.now()
    };
    objList.push(obj);
}

console.log(objList);

var interval_cnt = 0;
var max_interval = 10;
var interval = setInterval(randomUpdate, 1000);

function randomUpdate()
{
    var N = objList.length;
    var randIdx = Math.floor(Math.random() * N);
    objList[randIdx].timestamp = Date.now();
    objList[randIdx].updateCount++;

    interval_cnt++;
    if(interval_cnt == max_interval)
    {
        clearInterval(interval);
    }
    console.log(objList);
}

