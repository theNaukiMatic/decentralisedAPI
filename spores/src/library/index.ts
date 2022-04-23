import Gun from "gun";

/*
-------------------------------------------------------------------------------------------------
---------------------------------------- MODELS -------------------------------------------------
-------------------------------------------------------------------------------------------------
*/

export enum Request_Type {
	GET,
	POST,
	PUT,
	DELETE,
}

export interface Request_Arguments {
	type: Request_Type;
	message: any | null;
	createdBy: string | null;
	tableName: string;
	query: Query | null;
}

export enum Comparison_Type {
	EQUALS,
	LESS_THAN,
	GREATER_THAN,
	LESS_THAN_OR_EQUAL,
	GREATER_THAN_OR_EQUAL,
}

export interface Query_Line_Item {
	property: string;
	value: string;
	comparisonType: Comparison_Type;
}

export interface Query {
	lineItems: Array<Query_Line_Item>;
}

/*
-------------------------------------------------------------------------------------------------
---------------------------------------- LIBRARY ROOT CLASS -------------------------------------
-------------------------------------------------------------------------------------------------
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Spores {
	peerList :Array<string> = [];
	gun = Gun({
		peers: this.peerList,
	});
	database:string = "";

	constructor(peerList: Array<string>, database: string) {
		this.updatePeerList(peerList);
		this.changeDataBase(database);
	}

	getCurrentDataBase(): string {
		return this.database;
	}

	//change the current database name
	changeDataBase(dataBaseName: string): void {
		this.database = dataBaseName;
	}

	getPeerList(): Array<string> {
		return this.peerList;
	}

	//store peerlist and update the gun instance with the new peerlist
	updatePeerList(peerList: Array<string>): void {
		this.peerList = peerList;
		this.gun = Gun({
			peers: peerList,
		});
	}

	applyQueryLineItem(
		message: Array<any>,
		queryLineItem: Query_Line_Item
	): Array<any> {
		return message.filter((value, index, array) => {
			switch (queryLineItem.comparisonType) {
				case Comparison_Type.EQUALS: {
					return (
						value[queryLineItem.property] === queryLineItem.value
					);
				}
				case Comparison_Type.LESS_THAN: {
					return value[queryLineItem.property] < queryLineItem.value;
				}
				case Comparison_Type.GREATER_THAN: {
					return value[queryLineItem.property] > queryLineItem.value;
				}
				case Comparison_Type.LESS_THAN_OR_EQUAL: {
					return value[queryLineItem.property] <= queryLineItem.value;
				}
				case Comparison_Type.GREATER_THAN_OR_EQUAL: {
					return value[queryLineItem.property] >= queryLineItem.value;
				}
			}
		});
	}

	applyQuery(messages: Array<any>, query: Query | null): Array<any> {
		if (query == null) {
			return messages;
		}
		var returnObj: Array<any>;
        returnObj = messages;
		for (var it of query.lineItems) {
			returnObj = this.applyQueryLineItem(returnObj, it);
		}
		return returnObj;
	}

	logCall(req: Request_Arguments): void {
		let dateTime = new Date();
		console.log(`Processing a new ${Request_Type[req.type]} call. | [ ${dateTime} ]`);
	}

	//Make the distributed call with syntax of traditional http/https call
	CALL(req: Request_Arguments): any {
		this.logCall(req);
		try {
			const gunMessages = this.gun.get(this.database).get(req.tableName);
			var messages: Array<any>;
			messages = [];
			gunMessages.map().on((m) => {
				messages.push(m);
			});

			switch (req.type) {
				case Request_Type.POST: {
					gunMessages.set(req.message);
					break;
				}
				case Request_Type.GET: {
					return this.applyQuery(messages, req.query);
				}
				case Request_Type.DELETE: {
					//todo
					break;
				}
				case Request_Type.PUT: {
					//todo
					break;
				}
				default: {
					throw new Error(
						`The request type : ${req.type} is not allowed.`
					);
				}
			}
		} catch (e : any) {
			var errorMsg =
				"There was an error while processing your request :\n";
			errorMsg += e.toString();
			console.log(errorMsg);
			throw new Error(errorMsg);
		} finally {
			console.log("Request finished processing.");
		}
	}
}
