import crypto from "crypto"

export default (serverSecret: string, word: string): string => {
	// We repeat and cut the key because AES-256 keys need to be 32 bytes long
	const key = serverSecret.repeat(3).slice(0, 32)

	const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), Buffer.alloc(16, 0))
	let encrypted = cipher.update(word)
	encrypted = Buffer.concat([encrypted, cipher.final()])
	const aesWord = encrypted.toString("hex")

	return aesWord
}