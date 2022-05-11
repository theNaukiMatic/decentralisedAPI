import React, { useEffect, useState } from "react";
import { Request_Type, Spores } from "./library";
//initiallising
const peerList = ["http://localhost:5000/gun"];
const dataBaseName = "testDataBaseOffice100";
const spores = new Spores(peerList, dataBaseName);

const dataBaseName2 = "presentationDatabase100";
const spores2 = new Spores(peerList, dataBaseName2);

const myId = "testId2";

function onlyUnique(value : any, index : number, self : any) {
	return self.map((x:any) => x.time).indexOf(value.time) === index;
  }
function App() {
	const [attendance, setAttendance] = useState<Array<any>>([]);
	const [comments, setComments] = useState<Array<any>>([]);
	const [message, setMessage] = useState<string>("");

	useEffect(() =>{
		onConnect()
	  },[])

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

	function onPostClick() {
		spores2.CALL({
			type: Request_Type.POST,
			createdBy: "naukesh.goyal",
			message: {
				title: "message From id2",
				time: new Date().toString(),
				comment: message,
			},
			query: null,
			tableName: "comments",
		});
	}

	function onGetClick2() {
		spores2
			.CALL({
				type: Request_Type.GET,
				createdBy: "naukesh.goyal",
				message: null,
				query: null,
				tableName: "comments",
			})
			.then((res: any) => {
				setComments(res);
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
		spores
			.CALL({
				type: Request_Type.GET,
				createdBy: "naukesh.goyal",
				message: null,
				query: null,
				tableName: "attendance",
			})
			.then((res: any) => {
				console.log();
				setAttendance(res);
			});
	}
	return (
		<div style={{ display: "flex" }}>
			<div style={{ backgroundColor: "lightgrey", width: "50%" , paddingTop:40}}>
				<div>
					<button onClick={onConnect}>connect </button>
					<button onClick={onDisconnect}>disconnect</button>
					<button onClick={onGetClick} style={{ marginBottom: 40 }}>
						refresh
					</button>
				</div>
				{ attendance
					.sort((it: any, it2: any) =>
						it2.time.localeCompare(it.time)
					).filter(onlyUnique)
					.map((value: any) => (
						<div
							key={value.time}
							style={{
								border: "2px solid",
								width: 300,
								marginBottom: 10,
								marginLeft: 30,
								padding: 30,
								backgroundColor:
										value.id === "testId1"
											? "white"
											: "lightblue",
							}}
						>
							ID : {value.id}
							<br />
							Time : {value.time}
							<br />
							<div
								style={
									value.type === "connected"
										? { color: "green" }
										: { color: "red" }
								}
							>
								Type : {value.type}
							</div>
						</div>
					))}
			</div>
			<div style={{ backgroundColor: "lightblue", width: "50%"  , paddingTop:40}}>
				<button onClick={onPostClick}>post</button>
				<button onClick={onGetClick2}>get</button>
				<input
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<div style={{ marginTop: 40 }}>
					{comments
						.sort((it: any, it2: any) =>
							it2.time.localeCompare(it.time)
						).filter(onlyUnique)
						.map((value: any) => (
							<div
								key={value.time}
								style={{
									border: "2px solid",
									width: 300,
									marginBottom: 10,
									padding: 30,
									marginLeft: 30,
									backgroundColor:
										value.title === "message From id1"
											? "white"
											: "lightgrey",
								}}
							>
								ID : {value.title}
								<br />
								Time : {value.time}
								<br />
								<div>Message : {value.comment}</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}

export default App;
