import { createSlice } from "@reduxjs/toolkit"

type LettersData = { letter: string, state: number }[]

const slice = createSlice({
	name: "letters",
	initialState: Array(30).fill({ letter: "", state: 0 }) as LettersData,
	reducers: {
		backspace: (state) => {
			const nextEmpty = state.findIndex(l => l.state === 0)
			if (nextEmpty % 5 !== 0) {
				state[nextEmpty - 1] = { letter: "", state: 0 }
			}
			return state
		}
	}
})

export const { backspace } = slice.actions
export default slice.reducer