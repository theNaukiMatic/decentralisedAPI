import React, { useState } from "react";
import { Request_Type, Spores, Comparison_Type } from "./library";
//initiallising
const peerList = ["http://localhost:5000/gun"];
const dataBaseName = "presentationDatabase2";
const spores = new Spores(peerList, dataBaseName);


function App() {

	function onPostClick() {
		spores.CALL({
			type: Request_Type.POST,
			createdBy: "naukesh.goyal",
			message: {
				title: "test title presentaion",
				comment: "test comment 2 present",
			},
			query: null,
			tableName: "comments",
		});
	}

	function onGetClick() {
		console.log(
			spores.CALL({
				type: Request_Type.GET,
				createdBy: "naukesh.goyal",
				message: null,
				// query: {
				// 	lineItems: [
				// 		{
				// 			property: "title",
				// 			value: "test title 768",
				// 			comparisonType: Comparison_Type.EQUALS,
				// 		},
				// 	],
				// },
				query: null,
				tableName: "comments",
			})
		);
	}
	function onDeleteClick() {
		console.log(
			spores.CALL({
				type: Request_Type.DELETE,
				createdBy: "naukesh.goyal",
				message: null,
				query: {
					lineItems: [
						{
							property: "title",
							value: "test title 768",
							comparisonType: Comparison_Type.EQUALS,
						},
					],
				},
				tableName: "comments",
			})
		);
	}
	function onPutCall() {
		console.log(
			spores.CALL({
				type: Request_Type.PUT,
				createdBy: "naukesh.goyal",
				message: {
					title: "test title changed",
					comment: "test comment 2",
				},
				query: {
					lineItems: [
						{
							property: "title",
							value: "test title 768",
							comparisonType: Comparison_Type.EQUALS,
						},
					],
				},
				tableName: "comments",
			})
		);
	}

	return (
		<div>
			<button onClick={onPostClick}>post</button>
			<button onClick={onGetClick}>get</button>
			<button onClick={onDeleteClick}>delete</button>
			<button onClick={onPutCall}>PUT</button>
		</div>
	);
}

export default App;
