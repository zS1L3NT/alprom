import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type LettersData = [{ letter: string, state: number }[]]

const slice = createSlice({
	name: "letters",
	initialState: { data: Array(6).fill(Array(5).fill({ letter: "", state: 0 })) as LettersData, row: 0},
	reducers: {
		popLetter: (state) => {
			const currentRow = state.row
			const nextEmpty = state.data[currentRow].findIndex(index => index.letter === "")

			console.log(nextEmpty)
			if (nextEmpty === -1) {
				state.data[currentRow][4] = { letter: "", state: 0}
			} else {
				state.data[currentRow][nextEmpty-1] = { letter: "", state: 0}
			}
			
		},
		pushLetter: (state, action: PayloadAction<{letter: string, state: 0 | 1 | 2 | 3}>) => {
			const currentRow = state.row
			const nextEmpty = state.data[currentRow].findIndex(index => index.letter === "")

			if (currentRow <= 5 && (nextEmpty % 5 !== 0 || nextEmpty === 0)) {
				state.data[currentRow][nextEmpty] = action.payload
			}
		},
		nextRow: (state) => {
			if (state.row < 5) {
				state.row += 1
			}
		}
	}
})

export const { popLetter, pushLetter, nextRow } = slice.actions
export default slice.reducer