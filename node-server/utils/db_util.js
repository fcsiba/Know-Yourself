const r = require('rethinkdb');

const fetchByID = (db, table, id) => {
    return new Promise ((resolve, reject) => {
        r.table(table).get(id).run(db, (err, result) => {
            if (!err) {
                if (!result) reject('failed at fetch by ID')
                else resolve(result)
            } else reject(err)
        });
    })
}
const insertDoc = (db, table, data, id = null) => {
    return new Promise ((resolve, reject) => {
        const newData = {...data}
        if (id !== null){
            newData.id = String(id);
        }
        r.table(table).insert(newData).run(db, (err, result) => {
            if (!err)
                resolve(true)
            else 
                reject(false)
        })
    })
}
const updateDocByID = (db, table, id, body) => {
    return new Promise ((resolve, reject) => {
        r.table(table).get(id).update(body).run(db, (err, result) => {
            if (!err) {
                if (result.skipped==0){   
                    resolve(body)
                } else {
                    reject('failed')
                }
            } else reject(err)

        })
    })
}

const appendChangeByID = (db, table, id, change) => {
    return new Promise ((resolve, reject) => {
        fetchByID(db, table, id)
        .then(data => {
            let newData = {...data, ...change};
            updateDocByID(db, table, id, newData)
            .then(x => {
                resolve("done");
            })
            .catch(error => {
                reject("failed");
            })
        })
        .catch(error => {
            reject("failed");
        })
    })
}

const fetchAll = (db, table) => {
    return new Promise ((resolve, reject) => {
        r.table(table).run(db, (err, cursor) => {
            if (err) throw err;
            cursor.toArray((err,result) => {
                if (err) reject(err);
                else resolve(result)
            })
        })
    })     
}


module.exports = {
    fetchByID,
    insertDoc,
    updateDocByID,
    fetchAll,
    appendChangeByID
}