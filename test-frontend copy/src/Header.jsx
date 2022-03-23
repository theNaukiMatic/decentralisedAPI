import React from "react";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";

export default function Header( {userName, user, setUserName} ) {
	function handleSignOut() {
		user.leave();
		setUserName("");
	}
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						{userName}
					</Typography>
					{userName != "" ? (
						<Button onClick={handleSignOut} color="inherit">
							Sign Out
						</Button>
					) : null}
				</Toolbar>
			</AppBar>
		</Box>
	);
}
