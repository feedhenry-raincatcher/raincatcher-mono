export interface User {
	id : string;
	name : string;
	address : string;
}

export function add(o: User): User
export function list(): [User]
