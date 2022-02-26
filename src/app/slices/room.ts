import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type RoomData = {
	username: string
	owner: string | null
	code: number | null
	word: string | null
	scores: Record<string, {
		points: number
		round: number
		guesses: Array<0 | 1 | 2 | 3>
	}> | null
}

const slice = createSlice({
	name: "room",
	initialState: {
		owner: null,
		code: null,
		username: "",
		scores: {}
	} as RoomData,
	reducers: {
		setWord: (state, action: PayloadAction<string>) => {
			return {
				...state,
				word: action.payload
			}
		},
		updateRoom: (state, action: PayloadAction<{ code: number | null; username: string }>) => {
			return {
				...state,
				...action.payload
			}
		},
		onRoomUpdate: (state, action: PayloadAction<any>) => {
			return {
				...state,
				owner: action.payload.owner,
				code: action.payload.code,
				scores: action.payload.scores
			}
		}
	}
})

export const { setWord, updateRoom, onRoomUpdate } = slice.actions
export default slice.reducer