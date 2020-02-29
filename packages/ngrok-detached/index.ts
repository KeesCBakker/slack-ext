// imports
const fs = require('fs');
const path = require('path');
const { platform } = require('os');
const { exec } = require('child_process');

// settings
const pollInterval = 500;
const ngrokConfig = path.resolve('ngrok.yml');

// needed for spawning NGROK
let ngrokBin = '';
let ngrokDir = '';
let ngrokProc = '';
try {
	const ext = platform() === 'win32' ? '.exe' : '';
	ngrokDir = path.dirname(require.resolve('ngrok')) + '/bin';
	ngrokProc = 'ngrok' + ext;
	ngrokBin = ngrokDir + '/' + ngrokProc;
}
catch { }

export async function getUrl()
{
	const ngrokEnabled = isNgrokEnabled();
	if(!ngrokEnabled) return null;
	return getNgrokUrl();
}

export async function ensureConnection(callback): Promise<boolean> {
	const ngrokEnabled = isNgrokEnabled();
	if (!ngrokEnabled) {
		console.log(`Not running Ngrok because of environment setup: ENVIRONMENT=${process.env.BLAZE_ENV}, NGROK=${process.env.NGROK}.`);
		return false;
	}

	if (!fs.existsSync(ngrokConfig)) {
		console.log(`Can't run ngrok - missing ${ngrokConfig}.`);
		return false;
	}

	if (ngrokBin == '') {
		console.log("Can't run ngrok - are dev dependencies installed?");
		return false;
	}

	console.log("Ensuring ngrok...");
	const url = await connect();
	if (url == null) return false;

	callback(url);
	return true;
}

export function isNgrokEnabled() {
	return process.env.NGROK === "true" || process.env.NGROK === "True";
}

async function connect() {
	let url = await getNgrokUrl();
	if (url) {
		console.log("ngrok already running.");
		return url;
	}
	console.log('ngrok url:', url)
	console.log("Starting ngrok...");
	startProcess();

	while (true) {
		url = await getNgrokUrl();
		if (url) return url;
		await delay(pollInterval);
	}
}

async function getNgrokUrl(): Promise<string | null> {
	const axios = require('axios');
	const ping = 'http://127.0.0.1:4040/api/tunnels';
	let url = "";
	try {
		const response = await axios.get(ping);
		url = <string>response.data.tunnels[0].public_url;
		if (url.startsWith("http://")) {
			url = "https://" + url.substr("http://".length);
		}
	}
	catch (ex) {
		return null;
	}

	try {
		await axios.get(url);
	}
	catch (ex) {
		if (ex && ex.response && ex.response.status == "402") {
			console.log("Killing expired tunnel...");
			stopProcess();
			await delay(2000);
			return null;
		}
	}

	return url;
}

function startProcess() {

	let line = [ngrokBin, 'start', '-config=' + ngrokConfig, "app"].join(" ");

	if (platform() == "win32")
		line = "cmd.exe /C start /B " + line;
	else
		line += " > /dev/null &";

	exec(line);
}


function stopProcess() {
	const fkill = require('fkill');
	fkill(ngrokProc, { force: true });
}

function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}