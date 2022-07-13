import { FirestoreDataConverter } from "firebase/firestore"

export enum Guess {
	Incorrect = "incorrect",
	Partial = "partial",
	Correct = "correct"
}

export interface iRoom {
	id: string
	owner: string
	code: string
	game: Record<string, Record<string, Array<Array<Guess>>>>
}

export const roomConverter: FirestoreDataConverter<iRoom> = {
	toFirestore: room => ({
		owner: room.owner,
		code: room.code,
		game: room.game
	}),
	fromFirestore: snap => ({
		id: snap.id,
		owner: snap.get("owner"),
		code: snap.get("code"),
		game: snap.get("game")
	})
}
