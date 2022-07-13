import axios from "axios"
import { useTryAsync } from "no-try"

export default async (data: {
	code: number
	username: string
}): Promise<{ word: string }> => {
	let [err, res] = await useTryAsync(() =>
		axios.post("http://alprom.zectan.com/api/next-round", data),
	)

	if (err) {
		console.error(err)
		throw new Error("Failed to get next round from the server")
	}

	return res.data
}
