import { FieldValue } from "firebase-admin/firestore"
import { OBJECT, STRING } from "validate-any"

import { roomsColl } from "../apis"
import { Route } from "../setup"
import wordlist from "../wordlist.json"

export class POST extends Route<{ code: string; username: string }, {}> {
	override bodyValidator = OBJECT({
		code: STRING(),
		username: STRING()
	})

	async handle() {
		const { code, username } = this.body

		const snaps = await roomsColl.where("code", "==", code).get()
		const snap = snaps.docs[0]
		if (!snap) {
			return this.throw(`Could not find one room with the code: ${code}`)
		}

		const roomDoc = snap.ref
		const room = snap.data()!
		if (!(username in room.game)) {
			return this.throw(`Could not find any user in the room with the username: ${username}`)
		}

		const newWord = wordlist[Math.floor(Math.random() * wordlist.length)]!
		const user = room.game[username]!

		if (room.words.length === 0) {
			for (const username in room.game) {
				room.game[username] = {
					[newWord]: []
				}
			}

			//@ts-ignore
			await roomDoc.update({
				words: [newWord],
				//@ts-ignore
				game: room.game
			})

			return this.respond({ word: newWord })
		}

		if (Object.keys(user).length === room.words.length) {
			// @ts-ignore
			await roomDoc.update({
				words: FieldValue.arrayUnion(newWord),
				[`game.${username}.${newWord}`]: []
			})

			return this.respond({ word: newWord })
		}

		// @ts-ignore
		await roomDoc.update({
			[`game.${username}.${room.words[Object.keys(user).length]!}`]: []
		})

		return this.respond({ word: newWord })
	}
}
