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
	NOT_EQUALS,
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
	private peerList: Array<string> = [];
	private gun = Gun({
		peers: this.peerList,
	});
	private database: string = "";

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

	private applyQueryLineItem(
		message: Array<any>,
		queryLineItem: Query_Line_Item
	): Array<any> {
		// console.log("reached here")
		// console.log(message.length);
		return message.filter(function (value : any) {
			if (value === null) {
				return false;
			}
			switch (queryLineItem.comparisonType) {
				case Comparison_Type.EQUALS: {
					return (
						value[queryLineItem.property] === queryLineItem.value
					);
				}
				case Comparison_Type.NOT_EQUALS: {
					return (
						value[queryLineItem.property] !==
						queryLineItem.value
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
				default: {
					throw new Error(
						`The comparison type : ${
							Comparison_Type[queryLineItem.comparisonType]
						} is not allowed.`
					);
				}
			}
		});
	}

	private applyQuery(messages: Array<any>, query: Query | null): Array<any> {
		if (query == null) {
			return messages;
		}
		var returnObj: Array<Object>;
		returnObj = messages;
		// console.log(returnObj);
		for (var it of query.lineItems) {
			returnObj = this.applyQueryLineItem(returnObj, it);
			// console.log(returnObj);
		}
		return returnObj;
	}

	private logCall(req: Request_Arguments): void {
		let dateTime = new Date();
		console.log(
			`Processing a new ${Request_Type[req.type]} call. | [ ${dateTime} ]`
		);
	}

	//Make the distributed call with syntax of traditional http/https call
	 CALL(req: Request_Arguments): any {
		this.logCall(req);
		try{
			// const semaphore = new AsyncSemaphore(100)
			const gunMessages =  this.gun.get(this.database).get(req.tableName);
			var messages : Array<Object> = [];
			 gunMessages.map().on(async (data) => {
				if (data !== null) {
					messages.push(data)
				}
			});
			// console.log("line 175")
			// console.log({messages});

			switch (req.type) {
				case Request_Type.POST: {
					const id = Math.random().toString(36).substr(2, 9);
					gunMessages.get(id).put({
						...req.message,
						__id: id,
					});
					break;
				}
				case Request_Type.GET: {
					return this.applyQuery(messages, req.query);
				}
				case Request_Type.DELETE: {
					const items = this.applyQuery(messages, req.query);
					console.log(
						gunMessages.map().on((data, key) => {
							if (
								data != null &&
								items.some((it) => it.__id === data.__id) ===
									true
							) {
								gunMessages.get(data.__id.toString()).put(null);
							}
						})
					);
					break;
				}
				case Request_Type.PUT: {
					const items = this.applyQuery(messages, req.query);
					console.log(
						gunMessages.map().once((data, key) => {
							console.log(data);
							if (
								data != null &&
								items.some((it) => it.__id === data.__id) ===
									true
							) {
								gunMessages
									.get(data.__id.toString())
									.put(req.message);
							}
						})
					);
					break;
				}
				default: {
					throw new Error(
						`The request type : ${
							Request_Type[req.type]
						} is not allowed.`
					);
				}
			}
		} catch (e: any) {
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
