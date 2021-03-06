const connectButton = document.getElementById("connect");
const sendButton = document.getElementById("send");

const deviceFilter = [{ usagePage:0xFF60, usage: 0x61}];
let device;

function sendData() {
	console.log("send to device");
	let reportData = new Uint8Array(32);
	for(let i=0;i<32;i++) {
		reportData[i] = i+1;
	}
	device.sendReport(0, reportData);
}

connectButton.addEventListener("click", async ()=> {
	console.log("start connecting");
	try {
		sendButton.disabled = "true";
		sendButton.removeEventListener("click",sendData)
		device = await navigator.hid.requestDevice({filters: deviceFilter});
		console.log("found device!");
		await device.open();

		console.log("connected!", device);
		sendButton.disabled = "";

		device.addEventListener("inputreport", event => {
			console.log("recieved from device", new Uint8Array(event.data.buffer));
		});

		sendButton.addEventListener("click", sendData);

		// let reportData = new Uint8Array(32);
		// reportData[0] = 1;
		// device.sendReport(0, reportData);

	} catch (error) {
		console.warn("no device", error);
		return;
	}
});