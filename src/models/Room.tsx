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
	words: string[]
	game: Record<string, Record<string, Array<string>>>
}

export const roomConverter: FirestoreDataConverter<iRoom> = {
	toFirestore: room => ({
		owner: room.owner ?? null,
		code: room.code ?? null,
		words: room.words ?? null,
		game: room.game ?? null
	}),
	fromFirestore: snap => ({
		id: snap.id,
		owner: snap.get("owner"),
		code: snap.get("code"),
		words: snap.get("words"),
		game: snap.get("game")
	})
}
