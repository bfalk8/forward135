
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
        let totalUser = {};
        let totalUserArray = [];
        let totalProd = {};
        totalProd.total = this.createTd('Total');

        let labelStr = labelString || '';

        let table = document.getElementById(this.tableId);

        colNames.label = this.createTd(labelStr, null, 'header');
        totalUser.label = this.createTd('Total', null, 'header');
        totalUserArray.push(totalUser.label);
        let targetId = 0;
        data.forEach(elem =>
        {

            if (!(elem.column_sum in totalProd)) {
                totalProd[elem.column_sum] = this.createTd(elem.column_sum, targetId.toString() + 'Col', 'cell');
            }

            if (!(elem.row_sum in totalUser)) {
                totalUser[elem.row_sum] = this.createTd(elem.row_sum, targetId.toString() + 'Row', 'cell');
                totalUserArray.push(totalUser[elem.row_sum]);
            }

            if (!(elem.product_name in colNames)) {
                colNames[elem.product_name] = this.createTd(elem.product_name);
            }

            if (!(elem.user_name in rows)) {
                let tr = document.createElement('tr');
                let td = this.createTd(elem.user_name, targetId.toString() + 'User', 'user');
                tr.appendChild(td);
                // tr.setAttribute('id', elem.user_name.toString());
                rows[elem.user_name] = tr;
            }

            rows[elem.user_name].appendChild(this.createTd(elem.cell_sum, targetId.toString(), 'cell'));

            targetId++;
        });

        totalUser.empty2 = this.createTd('');
        totalUserArray.push(totalUser.empty2);

        let trProdTotal = document.createElement('tr');
        trProdTotal.setAttribute('id', 'productTotalRow');

        for (let key in totalProd) {
            if (!totalProd.hasOwnProperty(key)) {
                continue;
            }
            trProdTotal.appendChild(totalProd[key]);
        }

        rows.total = trProdTotal;
        // colNames['total'] = this.createTd('Total');

        let header = document.createElement('tr');
        header.setAttribute('id', 'header');

        for (let key in colNames) {
            if (!colNames.hasOwnProperty(key)) {
                continue;
            }
            header.appendChild(colNames[key]);
        }
        
        header.appendChild(totalUser.label);
        table.appendChild(header);

        let idx = 1;
        for (let key in rows) {
            if (!rows.hasOwnProperty(key)) {
                continue;
            }
            rows[key].appendChild(totalUserArray[idx]);
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
        wasUpdated |= this.changeCellIfDifferent(diff.target.toString(), diff.change.cell_sum);
        wasUpdated |= this.changeCellIfDifferent(diff.target.toString() + 'Row', diff.change.row_sum);
        wasUpdated |= this.changeCellIfDifferent(diff.target.toString() + 'Col', diff.change.column_sum);
        wasUpdated |= this.changeCellIfDifferent(diff.target.toString() + 'User', diff.change.user_name);

        return wasUpdated;
    }

    clearAllCellColor()
    {
        let cellsList = document.getElementsByClassName('cell');
        let cellsArray = Array.from(cellsList);
        cellsArray.forEach(cell =>
        {
            if (cell.hasAttribute('bgcolor')) {
                cell.removeAttribute('bgcolor');
            }
        });

        let usersList = document.getElementsByClassName('user');
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
        let cell = document.createTextNode(data.toString());
        let td = document.createElement('td');
        td.appendChild(cell);

        if (typeof idVal !== 'undefined' && idVal !== null) {
            td.setAttribute('id', idVal.toString());
        }

        if (typeof classVal !== 'undefined' && classVal !== null) {
            td.setAttribute('class', classVal.toString());
        }

        return td;
    }

}


export default AnalyticsTable;