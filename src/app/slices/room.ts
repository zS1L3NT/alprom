import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type RoomData = {
	owner: string
	code: number
	username: string
	scores: Record<string, {
		points: number
		round: number
		guesses: Array<0 | 1 | 2 | 3>
	}>
} | null

const slice = createSlice({
	name: "room",
	initialState: null as RoomData,
	reducers: {
		updateRoom: (state, action: PayloadAction<{ code: number; username: string }>) => {
			return state ? {
				...state,
				code: action.payload.code,
				username: action.payload.username
			} : {
				owner: "",
				code: action.payload.code,
				username: action.payload.username,
				scores: {}
			}
		},
		onRoomUpdate: (state, action: PayloadAction<any>) => {
			return state && {
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