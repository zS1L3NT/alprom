import admin from "firebase-admin"
import encrypt from "../functions/encrypt"
import wordlist from "../wordlist.json"
import { LIST, NUMBER, OBJECT, STRING, validate } from "validate-any"
import { RequestHandler } from "../functions/withErrorHandling"

const db = admin.firestore()

export const POST: RequestHandler = async (req) => {
	const { success, errors, data } = validate(req.body, OBJECT({
		code: NUMBER(),
		username: STRING(),
		client_key_data: LIST(NUMBER())
	}), "body")

	if (!success) {
		return {
			status: 400,
			data: errors
		}
	}

	const { code, username, client_key_data } = data!
	const clientKey = Buffer.from(client_key_data).toString("hex")

	const doc1 = await db.collection("keys").where("client_key", "==", clientKey).get()
	if (doc1.docs.length !== 1) {
		return {
			status: 400,
			data: {
				message: `Could not fin one key pair with the client_key: ${clientKey}`
			}
		}
	}
	const { server_secret } = doc1.docs[0]!.data()
	await db.collection("keys").doc(doc1.docs[0]!.id).delete()

	const doc2 = await db.collection("rooms").doc(`${code}`).get()
	if (!doc2.exists) {
		return {
			status: 400,
			data: {
				message: `Could not find one room with the code: ${code}`
			}
		}
	}

	const roomData = doc2.data() as InfiniteRoom
	if (!(username in roomData.scores)) {
		return {
			status: 400,
			data: {
				message: `Could not find any user in the room with the username: ${username}`
			}
		}
	}

	const newWord = wordlist[Math.floor(Math.random() * wordlist.length)]!
	const roomDoc = db.collection("rooms").doc(`${code}`)

	const userData = roomData.scores[username]!
	if (roomData.words.length === 0) {
		for (const username in roomData.scores) {
			roomData.scores[username] = {
				points: 0,
				round: 1,
				guesses: Array(30).fill(0)
			}
		}

		await roomDoc.set({
			words: [newWord],
			scores: roomData.scores
		}, { merge: true })
		return {
			status: 200,
			data: {
				word: encrypt(server_secret, newWord)
			}
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
			data: {
				word: encrypt(server_secret, newWord)
			}
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
		data: {
			word: encrypt(server_secret, newWord)
		}
	}
}