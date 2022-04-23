import React, { useEffect } from "react";
import { Request_Type, Spores } from "./library";

//initiallising
const peerList = ["http://localhost:5000/gun"];
const dataBaseName = "testDataBase";
const spores = new Spores(peerList, dataBaseName);

function App() {

  function onPostClick () {
    spores.CALL({
			type: Request_Type.POST,
			createdBy: "naukesh.goyal",
			message: {
				title: "test title",
				comment: "test comment",
			},
			query: null,
			tableName: "comments",
		});
  }

  function onGetClick () {
    console.log(spores.CALL({
			type: Request_Type.GET,
			createdBy: "naukesh.goyal",
			message: null,
			query: null,
			tableName: "comments",
		}));
  }

	return <div>
    <button onClick={onPostClick}>post call</button>
    <button onClick={onGetClick}>get call</button>
  </div>;
}

export default App;
