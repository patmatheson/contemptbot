const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let dbconn = null;

function getdbconn() {
	return dbconn;
}

function addDays(date, days) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
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



// get the number of contempts in the last 14 days
async function getContempts(targetUser){
	const now = new Date();
	const ageLimit = addDays(now, -14);
	const ageLimitAsString = `${ageLimit.getUTCFullYear()}-${ageLimit.getUTCMonth()}-${ageLimit.getUTCDate()}`;

	// console.log(`Current date: '${nowAsString}`);

	// if targetUser doesn't exist or is invalid, there are no contempts
	if (!targetUser.contempts)
	{
		return 0;
	}
	
	let totalContempt = 0;
	for (const [key, value] of targetUser.contempts.entries()){
		if (key >= ageLimitAsString){
			console.log (`${value.dailyContempt} contempts identified on ${key}.  Adding to total, now ${totalContempt + 1}`);
			totalContempt += value.dailyContempt;

		}
	}

	return totalContempt;

}

// add a single contempt to today
async function addContempt(userContempt){
	const now = new Date();
	const nowAsString = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;
	console.log(`Current date: '${nowAsString}`);

	if (!userContempt.contempts) {
		userContempt.contempts = new Map();
	}

	const existingMapItem = userContempt.contempts.get(nowAsString);

	if (existingMapItem) {
		existingMapItem.dailyContempt = existingMapItem.dailyContempt + 1;
	}
	else {
		const newMapItem = { dailyContempt: 1 };
		userContempt.contempts.set(nowAsString, newMapItem);
	}

	// save user to database with updated contempt count
	userContempt.save();

}


module.exports = {
	connectDb,
	getdbconn,
	UserContempt,
	getContempts,
	addContempt,
};