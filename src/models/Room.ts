import { FirestoreDataConverter } from "firebase-admin/firestore"

export enum Guess {
	Incorrect = "incorrect",
	Partial = "partial",
	Correct = "correct"
}

export interface iRoom {
	id: string
	owner: string
	code: string
	words: string[]
	game: Record<string, Record<string, Array<Array<Guess>>>>
}

export const roomConverter: FirestoreDataConverter<iRoom> = {
	toFirestore: room => ({
		owner: room.owner,
		code: room.code,
		words: room.words,
		game: room.game
	}),
	fromFirestore: snap => ({
		id: snap.id,
		owner: snap.get("owner"),
		code: snap.get("code"),
		words: snap.get("words"),
		game: snap.get("game")
	})
}
