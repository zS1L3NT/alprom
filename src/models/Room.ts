import { FirestoreDataConverter } from "firebase-admin/firestore"

export enum Guess {
	Transparent,
	Absent,
	Present,
	Correct
}

export default class Room {
	constructor(
		public owner: string,
		public code: number,
		public words: string[],
		public scores: Record<
			string,
			{
				points: number
				round: number
				guesses: Guess[]
			}
		>
	) {}

	static converter: FirestoreDataConverter<Room> = {
		toFirestore: room => ({
			owner: room.owner,
			code: room.code,
			words: room.words,
			scores: room.scores
		}),
		fromFirestore: snap =>
			new Room(snap.get("owner"), snap.get("code"), snap.get("words"), snap.get("scores"))
	}
}
