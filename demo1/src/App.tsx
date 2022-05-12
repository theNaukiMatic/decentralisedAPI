import {
	AppBar,
	Box,
	Button,
	ButtonGroup,
	Card,
	Grid,
	TextField,
	Toolbar,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Request_Type, Spores } from "./library";
//initiallising
// const peerList = ["http://localhost:5000/gun"];
const peerList = ["http://192.168.29.57:5000/gun"];

const dataBaseName = "finalDatabase1";
const spores = new Spores(peerList, dataBaseName);

const dataBaseName2 = "finalDatabase1";
const spores2 = new Spores(peerList, dataBaseName2);

function onlyUnique(value: any, index: number, self: any) {
	return self.map((x: any) => x.time).indexOf(value.time) === index;
}

const myId = "testId1";

function App() {
	const [attendance, setAttendance] = useState<Array<any>>([]);
	const [comments, setComments] = useState<Array<any>>([]);
	const [message, setMessage] = useState<string>("");
	const [floorNumber, setFloorNumber] = useState<string>("");
	const [name, setName] = useState<string>("");

	function onConnect() {
		spores.CALL({
			type: Request_Type.POST,
			createdBy: "naukesh.goyal",
			message: {
				id: myId,
				name: name,
				floorNumber: floorNumber,
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
				title: "message From id1",
				time: new Date().toString(),
				comment: message,
				name: name,
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
				name: name,
				floorNumber: floorNumber,
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
		<div>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
						<Typography
							variant="h6"
							component="div"
							sx={{ flexGrow: 1 }}
						>
							Demo Application 1
						</Typography>
					</Toolbar>
				</AppBar>
			</Box>
			<Grid container>
				<Grid
					item
					xs={12}
					sm={6}
					style={{
						backgroundColor: "lightgrey",
						// width: "50%",
						paddingTop: 40,
					}}
				>
					<Card style={{ padding: 20, margin: 20 }}>
						<div style={{ marginBottom: 20 }}>
							<TextField
								label="Floor Number"
								variant="outlined"
								size="small"
								value={floorNumber}
								onChange={(e) => setFloorNumber(e.target.value)}
							/>
						</div>
						<div style={{ marginBottom: 20 }}>
							<TextField
								label="Name"
								variant="outlined"
								size="small"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<ButtonGroup
							variant="contained"
							aria-label="outlined primary button group"
						>
							<Button
								onClick={onConnect}
								variant="contained"
								color="success"
							>
								connect{" "}
							</Button>
							<Button
								onClick={onDisconnect}
								variant="contained"
								color="error"
							>
								disconnect
							</Button>
							<Button onClick={onGetClick} variant="contained">
								refresh
							</Button>
						</ButtonGroup>
					</Card>
					{attendance
						.sort((it: any, it2: any) =>
							it2.time.localeCompare(it.time)
						)
						.filter(onlyUnique)
						.map((value: any) => (
							<Card style={{ margin: 20, padding: 20 }}>
								Name : {value.name}
								<br />
								Floor Number : {value.floorNumber}
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
									{value.type}
								</div>
							</Card>
						))}
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					style={{
						backgroundColor: "lightblue",
						width: "50%",
						paddingTop: 40,
					}}
				>
					<Card style={{ margin: 20, padding: 20 }}>
						<ButtonGroup>
							<Button
								variant="contained"
								onClick={onPostClick}
								color="success"
							>
								Post message
							</Button>
							<Button variant="contained" onClick={onGetClick2}>
								refresh
							</Button>
						</ButtonGroup>
						<TextField
							value={message}
							size="small"
							onChange={(e) => setMessage(e.target.value)}
							style={{ marginLeft: 20 }}
						/>
					</Card>
					<Card
						style={{
							marginTop: 40,
							margin: 20,
							backgroundColor: "lightgray",
						}}
					>
						{comments
							.sort((it: any, it2: any) =>
								it2.time.localeCompare(it.time)
							)
							.filter(onlyUnique)
							.map((value: any) => (
								<Card
									key={value.time}
									style={{
										padding: 20,
										margin: 20,
										// backgroundColor:
										// 	value.title === "message From id1"
										// 		? "white"
										// 		: "lightgrey",
									}}
								>
									<br />
									<div>Message : {value.comment}</div>
									Name : {value.name}
									<br />
									Time : {value.time}
								</Card>
							))}
					</Card>
				</Grid>
			</Grid>
		</div>
	);
}

export default App;
