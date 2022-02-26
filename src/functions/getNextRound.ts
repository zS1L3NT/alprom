import Axios from "axios"
import crypto from "crypto"
import { useTryAsync } from "no-try"

export default async (data: { code: number, username: string }): Promise<{ word: string }> => {
	const axios = Axios.create({ baseURL: "https://alprom.loca.lt" })

	//@ts-ignore
	const clientDh = crypto.createDiffieHellman("modp15")
	const clientKey = clientDh.generateKeys()

	let [err1, res1] = await useTryAsync(() => axios.post("/exchange-secret", {
		client_key_data: clientKey.toJSON().data
	}))
	if (err1) {
		console.error(err1)
		throw new Error("Failed to exchange secrets with the server")
	}

	const serverKey = Buffer.from(res1.data.server_key_data)
	const clientSecret = clientDh.computeSecret(serverKey).toString("hex")

	let [err2, res2] = await useTryAsync(() => axios.post("/next-round", {
		...data,
		client_key_data: clientKey.toJSON().data
	}))
	if (err2) {
		console.error(err2)
		throw new Error("Failed to get next round from the server")
	}

	const { aesWord } = res2.data

	const key = clientSecret.repeat(3).slice(0, 32)
	const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), Buffer.alloc(16, 0))

	let decrypted = decipher.update(Buffer.from(aesWord, "hex"))
	decrypted = Buffer.concat([decrypted, decipher.final()])
	return {
		word: decrypted.toString()
	}
}