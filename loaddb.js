const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let dbconn = null;

function getdbconn() {
	return dbconn;
}

async function connectDb() {
	const mongoServer = await MongoMemoryServer.create();
	dbconn = await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyMASTER' });
	return dbconn;
}

const userContemptSchema = new mongoose.Schema({
	guildId: String,
	userId: String,
	contemptCount: Number,
	contempts: {
		type: Map,
		of: new mongoose.Schema({
			dailyContempt: Number,
		}, { id: false, _id: false }),
	},
});

const UserContempt = mongoose.model('UserContempt', userContemptSchema);

module.exports = {
	connectDb,
	getdbconn,
	UserContempt,
};