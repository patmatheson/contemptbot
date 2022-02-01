const fs = require('fs');
const https = require('https')
const { clientId, guildId, token } = require('./config.json');

let hostname = `discord.com`;
let path = `/api/v8/applications/${clientId}/guilds/${guildId}/commands`;

console.log(`${ hostname + path }`);

let jsonData = fs.readFileSync('./commandjson/usercontempt.json');
let commands = JSON.parse(jsonData);
console.log(commands);

const data = JSON.stringify(commands);
console.log(data);

const options ={
    hostname: hostname,
    port: 443,
    path: path,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bot ${token}`
    }
}

const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      console.log(JSON.parse(d))
    })
  })

req.on('error', error => {
    console.error(error)
})

req.write(data)
req.end()