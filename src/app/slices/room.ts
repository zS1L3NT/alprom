import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type RoomData = {
	username: string
	owner: string | null
	code: number | null
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
		updateRoom: (state, action: PayloadAction<{ code: number | null; username: string }>) => {
			return {
				...state,
				code: action.payload.code,
				username: action.payload.username
			}
		},
		onRoomUpdate: (state, action: PayloadAction<any>) => {
			return {
				owner: action.payload.owner,
				code: action.payload.code,
				username: state.username,
				scores: action.payload.scores
			}
		}
	}
})

export const { updateRoom, onRoomUpdate } = slice.actions
export default slice.reducer