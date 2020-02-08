const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbCredentials = require('./dbCredentials');

let _db;

const mongoConnect = cb => {
    MongoClient.connect(`mongodb+srv://${dbCredentials.user}:${dbCredentials.password}@cluster0-f8kmd.gcp.mongodb.net/shop?retryWrites=true&w=majority`)
        .then(client => {
            console.log('connected');
            _db = client.db();
            cb(client);
        })
        .catch(err => {
            console.log(err)
            throw err;
        });
};


const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found"';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
