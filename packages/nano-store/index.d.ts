import * as Promise from 'bluebird'
export interface User {
	id : string;
	name : string;
	address : string;
}

export function add(o: User): Promise<User>
export function list(): Promise<[User]>
