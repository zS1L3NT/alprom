interface InfiniteRoom {
	owner: string
	code: number
	words: string[]
	scores: Record<string, {
		points: number
		round: number
		guesses: Array<0 | 1 | 2 | 3>
	}>
}
