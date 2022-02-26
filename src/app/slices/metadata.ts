import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type MetaData = { code: number, username: string } | null

const slice = createSlice({
	name: "metadata",
	initialState: null as MetaData,
	reducers: {
		setMetadata: (_, action: PayloadAction<MetaData>) => action.payload,
	}
})

export const { setMetadata } = slice.actions
export default slice.reducer