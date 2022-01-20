import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MessagePayload } from 'discord.js';
import * as process from 'process';

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
	let dbConnString = process.env.MONGO_CONN_STRING;
	if (!dbConnString) {
		const mongoServer = await MongoMemoryServer.create();
		dbConnString = mongoServer.getUri();
	}
	dbconn = await mongoose.connect(dbConnString, { dbName: 'verifyMASTER' });
	return dbconn;
}

interface IGuildContempt{
	id: string;
	guildId: string;
	contemptDays: number;
	contemptMax: number;
	contemptSpamDelay: number;
}

interface IGuildContemptModel extends mongoose.Model<IGuildContempt> {
	findGuildOrDefault(guildId: string): Promise<IGuildContempt>;
}

const guildContemptSchema = new mongoose.Schema<IGuildContempt>({
	guildId: String,
	contemptDays: Number,
	contemptMax: Number,
	contemptSpamDelay: Number,
});

guildContemptSchema.static('findGuildOrDefault', async function(guildId){
	const guildContempt = await GuildContempt.findOne({guildId: guildId}).exec();
	console.log(`guildContempt settings from DB: ${guildContempt}`);
	return guildContempt ?? generateDefault(guildId);
});

const GuildContempt = mongoose.model<IGuildContempt, IGuildContemptModel>('GuildContempt', guildContemptSchema);

function generateDefault(guildId){
	let defaultContempt:IGuildContempt = new GuildContempt();
	defaultContempt.id = guildId;
	defaultContempt.guildId = guildId;
	defaultContempt.contemptDays = 14;
	defaultContempt.contemptMax = 420;
	defaultContempt.contemptSpamDelay = 0;
	return defaultContempt;
}
// (<any>GuildContempt).generateDefault = generateDefault;


const userContemptSchema = new mongoose.Schema({
	guildId: String,
	userId: String,
	contemptCount: Number,
	userName: String,
	contempts: {
		type: Map,
		of: new mongoose.Schema({
			dailyContempt: Number,
		}, { id: false, _id: false }),
	},
});

function addContempt(userContempt){
	const now = new Date();
	const nowAsString = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
	console.log(`Current date: ${nowAsString}`);

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
}

async function getAllContempts(guildSettings){
	const now = new Date();
	let earliestDate:number = 0 - guildSettings.contemptDays;
	const ageLimit = addDays(now, earliestDate);

	let returnContempts = new Map();

	let allContempts = await UserContempt.find().exec();

	let totalContempt = 0;
	
	for (const docs of allContempts){
		totalContempt = 0;
		for (const [key, value] of docs.contempts.entries()){
			console.log(`${value.dailyContempt} contempts identified on ${key}.`);
			if (new Date(key) >= ageLimit){
				console.log (`${value.dailyContempt} contempts identified on ${key}.  Adding to total, now ${totalContempt + value.dailyContempt}`);
				totalContempt += value.dailyContempt;
			}
		}
		if (returnContempts.has(docs.userName)) {
			returnContempts.set(docs.userName, returnContempts.get(docs.userName) + totalContempt);	
		}
		else {
			returnContempts.set(docs.userName, totalContempt);	
		}
	}

	return returnContempts;

}

// get the number of contempts in the last 14 days
async function getContempts(targetUser, guildSettings){
	const now = new Date();
	let earliestDate:number = 0 - guildSettings.contemptDays;
	const ageLimit = addDays(now, earliestDate);
	
	const ageLimitAsString = `${ageLimit.getUTCFullYear()}-${ageLimit.getUTCMonth() + 1}-${ageLimit.getUTCDate()}`;
	console.log(`Earliest day to check back until: ${ageLimitAsString}`);
	// console.log(`Current date: '${nowAsString}`);

	// if targetUser doesn't exist or is invalid, there are no contempts
	if (!targetUser.contempts)
	{
		return 0;
	}
	
	let totalContempt = 0;
	for (const [key, value] of targetUser.contempts.entries()){
		console.log(`${value.dailyContempt} contempts identified on ${key}.`);
		if (new Date(key) >= ageLimit){
			console.log (`${value.dailyContempt} contempts identified on ${key}.  Adding to total, now ${totalContempt + value.dailyContempt}`);
			totalContempt += value.dailyContempt;
		}
	}

	return totalContempt;

}

userContemptSchema.methods.addContempt = function(){
	return addContempt(this);
}


userContemptSchema.methods.getContempts = function(guildSetting){
	if (!guildSetting){
		throw new Error();
	}
	return getContempts(this, guildSetting);
}

userContemptSchema.methods.getAllContempts = function(guildSetting){
	if (!guildSetting){
		throw new Error();
	}
	return getAllContempts(guildSetting);
}

const UserContempt = mongoose.model('UserContempt', userContemptSchema);

export {
	connectDb,
	getdbconn,
	UserContempt,
	GuildContempt,
	getContempts,
	addContempt,
};