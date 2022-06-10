const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db
exports.mongoConnect = callback => {MongoClient.connect('mongodb+srv://bhautik:iKVxMr1hfuEz6StK@cluster0.l0p55.mongodb.net/?retryWrites=true&w=majority')
.then(client=>{
    console.log('connected')
    _db = client.db()
    callback()
}).catch(err=>{
    console.log(err)
    throw err
})
}

exports.getDB = ()=>{
    if(_db){
        return
    }
    throw 'no database found'
}
