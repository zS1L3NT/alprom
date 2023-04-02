import { arrayUnion, DocumentReference, Timestamp, updateDoc } from "firebase/firestore"

import { generatedWords } from "../data"
import { iRoom } from "../models/Room"

export default async (roomRef: DocumentReference<iRoom>, room: iRoom, username: string) => {
	const newWord = generatedWords[Math.floor(Math.random() * generatedWords.length)]!.toUpperCase()
	const user = room.game[username]!

	if (room.words.length === 0) {
		for (const username in room.game) {
			room.game[username] = {
				[newWord]: []
			}
		}

		await updateDoc(roomRef, {
			words: [newWord],
			//@ts-ignore
			game: room.game,
			startedAt: Timestamp.now()
		})
	} else if (Object.keys(user).length === room.words.length) {
		// @ts-ignore
		await updateDoc(roomRef, {
			words: arrayUnion(newWord),
			[`game.${username}.${newWord}`]: []
		})
	} else {
		// @ts-ignore
		await updateDoc(roomRef, {
			[`game.${username}.${room.words[Object.keys(user).length]!}`]: []
		})
	}
}
