import admin from "firebase-admin"
import crypto from "crypto"
import { LIST, NUMBER, OBJECT, validate } from "validate-any"
import { RequestHandler } from "../functions/withErrorHandling"
import { useTry } from "no-try"

const db = admin.firestore()

export const POST: RequestHandler = async (req) => {
	const { success, errors, data } = validate(req.body, OBJECT({ client_key_data: LIST(NUMBER()) }))

	if (!success) {
		return {
			status: 400,
			data: errors
		}
	}

	const clientKey = Buffer.from(data!.client_key_data)

	// @ts-ignore
	const serverDH = crypto.createDiffieHellman("modp15")
	const serverKeys = serverDH.generateKeys()

	const [err, serverSecret] = useTry(() => serverDH.computeSecret(clientKey).toString("hex"))
	if (err) {
		return {
			status: 400,
			data: {
				message: err.message
			}
		}
	}

	await db.collection("keys").add({
		client_key: clientKey.toString("hex"),
		server_secret: serverSecret,
	})

	return {
		status: 200,
		data: { server_key_data: serverKeys.toJSON().data }
	}
}