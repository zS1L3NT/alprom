import letters from "./slices/letters"
import { configureStore } from "@reduxjs/toolkit"
import { wordApi } from "./api/word"

export const store = configureStore({
	reducer: {
		[wordApi.reducerPath]: wordApi.reducer,
		letters
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
