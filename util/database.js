const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbCredentials = require('./dbCredentials');

MongoClient.connect(`mongodb+srv://${dbCredentials.user}:${dbCredentials.password}@cluster0-f8kmd.gcp.mongodb.net/test?retryWrites=true&w=majority`);