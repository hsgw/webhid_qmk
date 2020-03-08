const connectButton = document.getElementById("connect");
const sendButton = document.getElementById("send");

const deviceFilter = [{ usagePage:0xFF60, usage: 0x61}];
let device;

connectButton.addEventListener("click", async ()=> {
	console.log("start connecting");
	try {
		device = await navigator.hid.requestDevice({filters: deviceFilter});
		console.log("found device!");
		await device.open();

		console.log("connected!", device);
		sendButton.disabled = "";

		device.addEventListener("inputreport", event => {
			console.log("recieved from device", new Uint8Array(event.data.buffer));
		});

		sendButton.addEventListener("click", ()=> {
			console.log("send to device");
			let reportData = new Uint8Array([1,2,3,4,5,6,7,8]);
			device.sendReport(0, reportData);
		});

		let reportData = new Uint8Array(8);
		reportData[0] = 1;
		device.sendReport(0, reportData);

	} catch (error) {
		console.warn("no device", error);
		return;
	}
});