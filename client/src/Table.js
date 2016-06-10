
class Table {
    constructor(tableId, newCellColor)
    {
        this.tableId = tableId;
        this.newCellColor = newCellColor || '#ffff99';
        this.headerKeys = null;
    }

    populate(data)
    {

        let table = document.getElementById(this.tableId);

        let rows = {};

        let targetId = 0;
        data.forEach(elem =>
        {
            if(this.headerKeys === null){
                this.headerKeys = [];
                let header = document.createElement('tr');
                header.setAttribute('id', this.prefix('header'));

                for (let key in elem) {
                    if (!elem.hasOwnProperty(key)) {
                        continue;
                    }
                    if (key == 'id'){
                        continue;
                    }
                    header.appendChild(this.createTd(key))
                    this.headerKeys.push(key);
                }


                this.headerObj = header;
            }


            let tr = document.createElement('tr');

            for (let key in elem) {
                if (!elem.hasOwnProperty(key)) {
                    continue;
                }
                if (key == 'id'){
                    continue;
                }
                tr.appendChild(this.createTd(elem[key], targetId + key, 'cell'));
            }
            rows[elem.id] = tr;

            targetId++;
        });

        table.appendChild(this.headerObj);

        for (let key in rows) {
            if (!rows.hasOwnProperty(key)) {
                continue;
            }
            table.appendChild(rows[key]);
        }
    }

    updateTable(payload)
    {
        this.clearAllCellColor();
        let numNotUpdated = 0;
        payload.forEach(diff =>
        {
            if (!this.updateElementOnTable(diff)) {
                numNotUpdated++;
            }
        });
        console.log((payload.length - numNotUpdated+1)+ '/' + payload.length + ' updated');
    }


    updateElementOnTable(diff)
    {
        let wasUpdated = false;

        this.headerKeys.forEach(key => {
            wasUpdated |= this.changeCellIfDifferent(this.prefix(diff.target + key), diff.change[key]);
        });

        return wasUpdated;
    }

    clearAllCellColor()
    {
        let cellsList = document.getElementsByClassName(this.prefix('cell'));
        let cellsArray = Array.from(cellsList);
        cellsArray.forEach(cell =>
        {
            if (cell.hasAttribute('bgcolor')) {
                cell.removeAttribute('bgcolor');
            }
        });

    }


    changeCellIfDifferent(id, newValue)
    {
        let element = document.getElementById(id);

        if (typeof element === 'undefined' || element === null) {
            return false;
        }

        let newValStr = newValue.toString();
        let currValueStr = element.innerText || element.textContent;
        if (currValueStr != newValStr) {
            element.innerHTML = newValStr;
            element.setAttribute('bgcolor', this.newCellColor);
            return true;
        }
        return false;
    }

    createTd(data, idVal, classVal)
    {
        idVal = this.prefix(idVal);
        classVal = this.prefix(classVal);

        let cell = document.createTextNode(data.toString());
        let td = document.createElement('td');
        td.appendChild(cell);

        if (typeof idVal !== 'undefined' && idVal !== null) {
            td.setAttribute('id', idVal);
        }

        if (typeof classVal !== 'undefined' && classVal !== null) {
            td.setAttribute('class', classVal);
        }

        return td;
    }

    prefix(id){
        return this.tableId + id;
    }

}


export default Table;