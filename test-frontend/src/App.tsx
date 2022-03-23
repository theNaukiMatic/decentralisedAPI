import React, { useEffect, useReducer, useState } from "react";
import Gun from "gun";

interface SessionData {
	messages: Array<SampleMessage>;
}
interface SampleMessage {
	name: string;
	message: string;
	createdAt: Date;
}

//initiallising gun and connecting to peers
const peerList = ["http://localhost:5000/gun", "http://localhost:3002/gun"];
const gun = Gun({
	peers: peerList,
});

//this will store all the data communicated between clients in this session
const initialState = {
	messages: [],
};

// reducer to update the messages array
function reducer(state: SessionData, message: SampleMessage) {
	return {
		messages: [message, ...state.messages],
	};
}

function App() {
	const [formState, setFormState] = useState({
		name: "",
		message: "",
	});

	const [state, dispatch] = useReducer(reducer, initialState);

	//when the app first loads
	useEffect(() => {
		const messages = gun.get("messages");
		messages.map().on((m) => {
			dispatch({
				name: m.name,
				message: m.message,
				createdAt: m.createdAt,
			});
		});
	}, []);

	//send a new message
	function saveMessage() {
		const messages = gun.get("messages");
		messages.set({
			name: formState.name,
			message: formState.message,
			createdAt: Date.now(),
		});

		//clear the form
		setFormState({
			name: "",
			message: "",
		});
	}
	var count = 0;
	// update the form state as the user types
	function onChange(e: any) {
		setFormState({ ...formState, [e.target.name]: e.target.value });
	}

	return (
		<div style={{ padding: 30 }}>
			<input
				onChange={onChange}
				placeholder="Name"
				name="name"
				value={formState.name}
			/>
			<input
				onChange={onChange}
				placeholder="Message"
				name="message"
				value={formState.message}
			/>
			<button onClick={saveMessage}>Send Message</button>
			{state.messages.map((message) => {
				count++;
				return (
					<div key={count}>
						<h2 style={{ color: "blue" }}>{message.message}</h2>
						<h3>From: {message.name}</h3>
						<p>Date: {message.createdAt}</p>
						<br />
					</div>
				);
			})}
		</div>
	);
}

export default App;
