import * as http from "http";

export function addDays(date: Date, days: number) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

export function nowString(date: Date): String
{
	const nowAsString = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
	return nowAsString;
}

export function aliveProbe(): void{
	http.createServer(function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('I am still alive\n');
	}).listen(80, "0.0.0.0");
	console.log('Server listening to port 80.');
}
