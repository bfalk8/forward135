let sample_data = {
    payload: [
        { 
            cell_sum: 60754.79,
            col_sum: 81562.59,
            product_name: 'JrJHhr0u5L',
            row_sum: 66438.1600000001,
            user_name: 'ktyswaZMNv'
        },
        {
            cell_sum: 1846.1,
            col_sum: 33054.07,
            product_name: 'MHcHy9iA3o',
            row_sum: 66438.1600000001, 
            user_name: 'ktyswaZMNv'
        },
        {
            cell_sum: 0,
            col_sum: 33054.07,
            product_name: 'ISaFlQBHt6',
            row_sum: 66438.1600000001,
            user_name: 'ktyswaZMNv'
        },
        {
            cell_sum: 0,
            col_sum: 33054.07,
            product_name: 'oxZw7egyKd',
            row_sum: 66438.1600000001,
            user_name: 'ktyswaZMNv'
        },
        {
            cell_sum: 60754.79,
            col_sum: 81562.59,
            product_name: 'JrJHhr0u5L',
            row_sum: 66438.1600000001,
            user_name: 'ToIeqwCCwu'
        },
        {
            cell_sum: 1846.1,
            col_sum: 33054.07,
            product_name: 'MHcHy9iA3o',
            row_sum: 66438.1600000001,
            user_name: 'ToIeqwCCwu'
        },
        {
            cell_sum: 0,
            col_sum: 33054.07,
            product_name: 'ISaFlQBHt6',
            row_sum: 66438.1600000001,
            user_name: 'ToIeqwCCwu'
        },
        {
            cell_sum: 0,
            col_sum: 33054.07,
            product_name: 'oxZw7egyKd',
            row_sum: 66438.1600000001,
            user_name: 'ToIeqwCCwu'
        }
    ]
};

class AnalyticsTable {
    constructor(tableId){
        this.tableId = tableId;
        // this.populate(sample_data.payload, 'test');
    }

    populate(data, labelString){
        let trs = {};
        let colNames = {};
        let totalUser = {};
        let totalProd = {};
        totalProd.total = this.createTd('Total');

        let labelStr = labelString || '';

        let table = document.getElementById(this.tableId);

        colNames['label'] = this.createTd(labelStr);
        
        data.forEach(elem => {

            if(!(elem.col_sum in totalProd)){
                totalProd[elem.col_sum] = this.createTd(elem.col_sum.toString());
            }

            if(!(elem.row_sum in totalUser)){
                totalUser[elem.row_sum] = this.createTd(elem.row_sum.toString());
            }

            if(!(elem.product_name in colNames)){
                colNames[elem.product_name] = this.createTd(elem.product_name.toString());
            }

            if(!(elem.user_name in trs)){
                let tr = document.createElement('tr');
                let td = this.createTd(elem.user_name.toString());
                tr.appendChild(td);
                trs[elem.user_name] = tr;
            }

            trs[elem.user_name].appendChild(this.createTd(elem.cell_sum.toString()));
        });

        let trProdTotal = document.createElement('tr');

        for(let key in totalProd){
            if(!totalProd.hasOwnProperty(key)){
                continue;
            }
            trProdTotal.appendChild(totalProd[key]);
        }

        trs['total'] = trProdTotal;
        // colNames['total'] = this.createTd('Total');

        let header = document.createElement('tr');

        for(let key in colNames){
            if(!colNames.hasOwnProperty(key)){
                continue;
            }
            header.appendChild(colNames[key]);
        }

        table.appendChild(header);

        for(let key in trs){
            if(!trs.hasOwnProperty(key)){
                continue;
            }
            table.appendChild(trs[key]);
        }
    }

    createTd(data){
        let cell = document.createTextNode(data);
        let td = document.createElement('td');
        td.appendChild(cell);
        return td;
    }

}

export default AnalyticsTable;