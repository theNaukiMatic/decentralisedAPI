import React, { useState } from "react";
import { Request_Type, Spores } from "./library";
//initiallising
const peerList = ["http://localhost:5000/gun"];
const dataBaseName = "testDataBaseOffice2";
const spores = new Spores(peerList, dataBaseName);

const myId = "testId1";

function App() {
	const [attendance, setAttendance] = useState<Array<string>>([]);

	function onConnect() {
		spores.CALL({
			type: Request_Type.POST,
			createdBy: "naukesh.goyal",
			message: {
				id: myId,
				time: new Date().toString(),
				type: "connected",
			},
			query: null,
			tableName: "attendance",
		});
	}

	function onDisconnect() {
		spores.CALL({
			type: Request_Type.POST,
			createdBy: "naukesh.goyal",
			message: {
				id: myId,
				time: new Date().toString(),
				type: "disconnected",
			},
			query: null,
			tableName: "attendance",
		});
	}

	function onGetClick() {
		const res = spores.CALL({
			type: Request_Type.GET,
			createdBy: "naukesh.goyal",
			message: null,
			query: null,
			tableName: "attendance",
		});
		console.log();
		setAttendance(res);
	}
	return (
		<div style={{ backgroundColor: "lightgrey" }}>
			<div>
				<button onClick={onConnect}>connect </button>
				<button onClick={onDisconnect}>disconnect</button>
				<button onClick={onGetClick} style={{ marginBottom: 40 }}>
					refresh
				</button>
			</div>
			{attendance.map((value: any) => (
				<div
					key={value.time}
					style={{
						border: "2px solid",
						width: 300,
						marginBottom: 10,
						marginLeft: 30,
						padding: 30,
            backgroundColor: "white"
					}}
				>
					ID : {value.id}
					<br />
					Time : {value.time}
					<br />
					<div
						style={
							value.type == "connected"
								? { color: "green" }
								: { color: "red" }
						}
					>
						Type : {value.type}
					</div>
				</div>
			))}
		</div>
	);
}

export default App;
