const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

var dbconn= '';

function getdbconn(){
    return dbconn;
}

async function connectDb(){
    const mongoServer = await MongoMemoryServer.create();
    dbconn = await mongoose.connect(mongoServer.getUri(), { dbName: "verifyMASTER" });
    return dbconn;
}

module.exports = {
    connectDb,
    getdbconn
}
