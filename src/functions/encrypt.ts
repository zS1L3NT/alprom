import SimpleCrypto from "simple-crypto-js"

export default (serverSecret: string, word: string): string => {
	return new SimpleCrypto(serverSecret).encrypt(word)
}