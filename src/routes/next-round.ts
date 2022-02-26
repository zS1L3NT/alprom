import admin from "firebase-admin"
import encryptAes from "../functions/encryptAes"
import wordlist from "../wordlist.json"
import { LIST, NUMBER, OBJECT, STRING, validate } from "validate-any"
import { RequestHandler } from "../functions/withErrorHandling"

const db = admin.firestore()
let doc: admin.firestore.QuerySnapshot<admin.firestore.DocumentData>

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

	doc = await db.collection("keys").where("client_key", "==", clientKey).get()
	if (doc.docs.length !== 1) {
		return {
			status: 400,
			data: {
				message: `Could not fin one key pair with the client_key: ${clientKey}`
			}
		}
	}
	const { serverSecret } = doc.docs[0]!.data()

	doc = await db.collection("rooms").where("code", "==", code).get()
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

	const newWord = wordlist[Math.floor(Math.random() * wordlist.length)]!
	const roomDoc = db.collection("rooms").doc(doc.docs[0]!.id)

	const userData = roomData.scores[username]!
	if (roomData.words.length === 0) {
		for (const username in roomData.scores) {
			roomData.scores[username]!.round = 1
		}

		await roomDoc.set({
			words: [newWord],
			scores: roomData.scores
		}, { merge: true })
		return {
			status: 200,
			data: {
				word: encryptAes(serverSecret, newWord)
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
				word: encryptAes(serverSecret, newWord)
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
			word: encryptAes(serverSecret, newWord)
		}
	}
}