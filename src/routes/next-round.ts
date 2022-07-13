import { FieldValue } from "firebase-admin/firestore"
import { NUMBER, OBJECT, STRING } from "validate-any"

import { roomsColl } from "../apis"
import { Guess } from "../models/Room"
import { Route } from "../setup"
import wordlist from "../wordlist.json"

export default class extends Route<{ code: number; username: string }, {}> {
	override bodyValidator = OBJECT({
		code: NUMBER(),
		username: STRING()
	})

	async handle() {
		if (this.req.method !== "POST") return

		const { code, username } = this.body

		const roomDoc = roomsColl.doc(`${code}`)
		const snap = await roomDoc.get()
		if (!snap.exists) {
			return this.throw(`Could not find one room with the code: ${code}`)
		}

		const room = snap.data()!
		if (!(username in room.scores)) {
			return this.throw(`Could not find any user in the room with the username: ${username}`)
		}

		const newWord = wordlist[Math.floor(Math.random() * wordlist.length)]!
		const user = room.scores[username]!

		if (room.words.length === 0) {
			for (const username in room.scores) {
				room.scores[username] = {
					points: 0,
					round: 1,
					guesses: Array(30).fill(Guess.Transparent)
				}
			}

			await roomDoc.update({
				words: [newWord],
				// @ts-ignore
				scores: room.scores
			})

			return this.respond({ word: newWord })
		}

		const guesses = Array(6)
			.fill(0)
			.map((_, i) => user.guesses.slice(i * 5, i * 5 + 5))
			.filter(g => !g.every(l => l === 0))
		if (!guesses.at(-1)?.every(l => l === 3)) {
			return this.throw(`The last guess by the user was an incorrect guess, cannot move on`)
		}

		if (guesses.length === room.words.length) {
			await roomDoc.update({
				words: FieldValue.arrayUnion(newWord),
				// @ts-ignore
				scores: {
					[username]: {
						points: FieldValue.increment(6 - guesses.length),
						round: FieldValue.increment(1),
						guesses: Array(30).fill(Guess.Transparent)
					}
				}
			})

			return this.respond({ word: newWord })
		}

		await roomDoc.update({
			// @ts-ignore
			scores: {
				[username]: {
					points: FieldValue.increment(6 - guesses.length),
					round: FieldValue.increment(1),
					guesses: Array(30).fill(Guess.Transparent)
				}
			}
		})

		return this.respond({ word: newWord })
	}
}
