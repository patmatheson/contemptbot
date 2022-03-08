import * as contemptDBTools from './contemptDBTools';


let dbConnection;

beforeAll( async () => {
    dbConnection = await contemptDBTools.connectDb(true);
});

test('add contempt to contempt test', async() => {
    let testContempt = { 
        guildId: "001",
        target: { id: "002", name: "pat"},
        sender: { id: "003", name: "testpat"}
    }
    
    await contemptDBTools.newAddContempt(testContempt);
    let result = await contemptDBTools.newGetContempt(testContempt.target);

    expect(result).toBe(1);
});



test('open database connection to mongo', () => {
    expect(1+2).toBe(3);
});

afterAll( async () => {
    dbConnection.dbClose();
});