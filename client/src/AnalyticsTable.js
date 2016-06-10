
class AnalyticsTable {
    constructor(tableId, newCellColor)
    {
        this.tableId = tableId;
        this.newCellColor = newCellColor || '#ffff99';
        // this.populate(sample_data.payload, 'test');
    }

    populate(data, labelString)
    {
        let rows = {};
        let colNames = {};
        let totalRow = {};
        let totalRowArray = [];
        let totalCol = {};

        let labelStr = labelString || '';

        let table = document.getElementById(this.tableId);


        totalCol.total = this.createTd('Total');
        colNames.label = this.createTd(labelStr, null, 'header');
        totalRow.label = this.createTd('Total', null, 'header');
        totalRowArray.push(totalRow.label);
        let targetId = 0;
        data.forEach(elem =>
        {

            if (!(elem.column_sum in totalCol)) {
                totalCol[elem.column_sum] = this.createTd(elem.column_sum, targetId + 'Col', 'cell');
            }

            if (!(elem.row_sum in totalRow)) {
                totalRow[elem.row_sum] = this.createTd(elem.row_sum, targetId + 'Row', 'cell');
                totalRowArray.push(totalRow[elem.row_sum]);
            }

            if (!(elem.product_name in colNames)) {
                colNames[elem.product_name] = this.createTd(elem.product_name);
            }

            if (!(elem.user_name in rows)) {
                let tr = document.createElement('tr');
                let td = this.createTd(elem.user_name, targetId + 'User', 'user');
                tr.appendChild(td);
                rows[elem.user_name] = tr;
            }

            rows[elem.user_name].appendChild(this.createTd(elem.cell_sum, targetId, 'cell'));

            targetId++;
        });

        totalRow.empty = this.createTd('');
        totalRowArray.push(totalRow.empty);

        let trProdTotal = document.createElement('tr');
        trProdTotal.setAttribute('id', this.prefixId('productTotalRow'));

        for (let key in totalCol) {
            if (!totalCol.hasOwnProperty(key)) {
                continue;
            }
            trProdTotal.appendChild(totalCol[key]);
        }

        rows.total = trProdTotal;

        let header = document.createElement('tr');
        header.setAttribute('id', this.prefixId('header'));

        for (let key in colNames) {
            if (!colNames.hasOwnProperty(key)) {
                continue;
            }
            header.appendChild(colNames[key]);
        }
        
        header.appendChild(totalRow.label);
        table.appendChild(header);

        let idx = 1;
        for (let key in rows) {
            if (!rows.hasOwnProperty(key)) {
                continue;
            }
            rows[key].appendChild(totalRowArray[idx]);
            table.appendChild(rows[key]);
            idx++;
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
        wasUpdated |= this.changeCellIfDifferent(this.prefixId(diff.target), diff.change.cell_sum);
        wasUpdated |= this.changeCellIfDifferent(this.prefixId(diff.target + 'Row'), diff.change.row_sum);
        wasUpdated |= this.changeCellIfDifferent(this.prefixId(diff.target + 'Col'), diff.change.column_sum);
        wasUpdated |= this.changeCellIfDifferent(this.prefixId(diff.target + 'User'), diff.change.user_name);

        return wasUpdated;
    }

    clearAllCellColor()
    {
        let cellsList = document.getElementsByClassName(this.prefixId('cell'));
        let cellsArray = Array.from(cellsList);
        cellsArray.forEach(cell =>
        {
            if (cell.hasAttribute('bgcolor')) {
                cell.removeAttribute('bgcolor');
            }
        });

        let usersList = document.getElementsByClassName(this.prefixId('user'));
        let usersArray = Array.from(usersList);
        usersArray.forEach(cell =>
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
        idVal = this.prefixId(idVal);
        classVal = this.prefixId(classVal);
        
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

    prefixId(id){
        return this.tableId + id;
    }

}


export default AnalyticsTable;