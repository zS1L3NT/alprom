import admin from "firebase-admin"
import wordlist from "../wordlist.json"
import { NUMBER, OBJECT, STRING, validate } from "validate-any"
import { RequestHandler } from "../functions/withErrorHandling"

const db = admin.firestore()

export const POST: RequestHandler = async (req) => {
	const { success, errors, data } = validate(req.body, OBJECT({
		code: NUMBER(),
		username: STRING()
	}), "body")

	if (!success) {
		return {
			status: 400,
			data: errors
		}
	}

	const { code, username } = data!

	const doc = await db.collection("rooms").where("code", "==", code).get()
	if (doc.docs.length !== 1) {
		return {
			status: 400,
			data: {
				message: `Could not find one room with the code: ${code}`
			}
		}
	}

	const roomData = doc.docs[0]!.data() as InfiniteRoom
	if (!(username in roomData.scores)) {
		return {
			status: 400,
			data: {
				message: `Could not find any user in the room with the username: ${username}`
			}
		}
	}

	const newWord = wordlist[Math.floor(Math.random() * wordlist.length)]
	const roomDoc = db.collection("rooms").doc(doc.docs[0]!.id)

	const userData = roomData.scores[username]!
	if (roomData.words.length === 0) {
		await roomDoc.set({
			words: [newWord],
			scores: {
				[username]: {
					points: 0,
					round: 1,
					guesses: Array(30).fill(0)
				}
			}
		}, { merge: true })
		return {
			status: 200,
			data: {}
		}
	}

	const guesses = Array(6).fill(0).map((_, i) => userData.guesses.slice(i * 5, i * 5 + 5)).filter(g => !g.every(l => l === 0))
	if (!guesses.at(-1)?.every(l => l === 3)) {
		return {
			status: 400,
			data: {
				message: `The last guess by the user was an incorrect guess, cannot move on`
			}
		}
	}

	if (guesses.length === roomData.words.length) {
		await roomDoc.set({
			words: admin.firestore.FieldValue.arrayUnion(newWord),
			scores: {
				[username]: {
					points: admin.firestore.FieldValue.increment(6 - guesses.length),
					round: admin.firestore.FieldValue.increment(1),
					guesses: Array(30).fill(0)
				}
			}
		}, { merge: true })
		return {
			status: 200,
			data: {}
		}
	}

	await roomDoc.set({
		scores: {
			[username]: {
				points: admin.firestore.FieldValue.increment(6 - guesses.length),
				round: admin.firestore.FieldValue.increment(1),
				guesses: Array(30).fill(0)
			}
		}
	}, { merge: true })
	return {
		status: 200,
		data: {}
	}
}