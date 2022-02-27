import Axios from "axios"
import crypto from "crypto-browserify"
import SimpleCrypto from "simple-crypto-js"
import { useTryAsync } from "no-try"

export default async (data: { code: number, username: string }): Promise<{ word: string }> => {
	const axios = Axios.create({ baseURL: "https://alprom.zectan.com" })

	const clientDh = crypto.createDiffieHellman("modp15")
	const clientKey = clientDh.generateKeys()

	let [err1, res1] = await useTryAsync(() => axios.post("/exchange-secrets", {
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

	const word = new SimpleCrypto(clientSecret).decrypt(res2.data.word) as string

	return {
		word: word.toUpperCase()
	}
}