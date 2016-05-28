'use strict';
class Tables {
    constructor() {
        this.tables = {};
    }

    create(tName) {
        this.tables[tName] = {
            set query(q) {
                this.queries.push(q);
            },
            queries: []
        };

        Object.defineProperty(this, tName, {
            configurable: true,
            get () {
                return this.tables[tName];
            }
        });

        return this;
    }
    
    table(tName) {
        
        if (!this.tables[tName]) {
            return this.create(tName);
        }
        
        return this.tables[tName];
    }

}

module.exports = Tables;