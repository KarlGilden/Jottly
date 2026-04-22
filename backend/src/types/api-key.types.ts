export interface ApiKeyRecord {
	id: number;
	userId: number;
	apikey: string;
	type: string;
	iv: string;
}

export enum ApiKeyStatus {
	NotConnected = 1,
	Connected = 2,
	InvalidKey = 3,
}
