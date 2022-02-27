import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type LettersData = [{ letter: string, state: 0 | 1 | 2 | 3 }[]]

const slice = createSlice({
	name: "letters",
	initialState: { data: Array(6).fill(Array(5).fill({ letter: "", state: 0 })) as LettersData, row: 0 },
	reducers: {
		updateColors: (state, action: PayloadAction<Array<0 | 1 | 2 | 3>>) => {
			const { row } = state
			for (let i = 0; i < 5; i++) {
				state.data[row][i].state = action.payload[i]
			}
		},
		popLetter: (state) => {
			const { row } = state
			const nextEmpty = state.data[row].findIndex(index => index.letter === "")

			if (nextEmpty === -1) {
				state.data[row][4] = { letter: "", state: 0 }
			} else {
				state.data[row][nextEmpty - 1] = { letter: "", state: 0 }
			}
		},
		pushLetter: (state, action: PayloadAction<{ letter: string, state: 0 | 1 | 2 | 3 }>) => {
			const { row } = state
			const nextEmpty = state.data[row].findIndex(index => index.letter === "")

			if (row <= 5 && (nextEmpty % 5 !== 0 || nextEmpty === 0)) {
				state.data[row][nextEmpty] = action.payload
			}
		},
		nextRow: (state) => {
			if (state.row < 5) {
				state.row += 1
			}
		}
	}
})

export const { updateColors, popLetter, pushLetter, nextRow } = slice.actions
export default slice.reducer