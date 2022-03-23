import React from "react";
import { Button, Card, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

export default function Login({ user }) {
	const [username, setUserName] = useState("");
	const [password, setPassword] = useState("");

	function handleLogin() {
		user.auth(username, password, (err) => err && alert(err));
	}
	function handleSignUp() {
		user.create(username, password, (err) => {
			err ? alert(err) : handleLogin();
		});
	}
	return (
		<Box>
			<Card>
				<TextField
					label="username"
					value={username}
					onChange={(e) => setUserName(e.target.value)}
				/>
				<TextField
					label="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button onClick={handleLogin}>Login</Button>
				<Button onClick={handleSignUp}>Sign Up</Button>
			</Card>
		</Box>
	);
}
