import { createSlice } from "@reduxjs/toolkit"
import produce from "immer"

type LettersData = { letter: string, state: number }[]

const slice = createSlice({
	name: "keys",
	initialState: Array(30).fill({ letter: "", state: 0 }) as LettersData,
	reducers: {
		backspace: (state) => {
			const nextEmpty = state.findIndex(l => l.state === 0)
			if (nextEmpty % 5 !== 0) {
				return produce(state, draft => {
					draft[nextEmpty - 1] = { letter: "", state: 0 }
				})
			}
			return state
		}
	}
})

export default slice.reducer