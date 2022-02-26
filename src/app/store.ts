import letters from "./slices/letters"
import metadata from "./slices/metadata"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
	reducer: { letters, metadata },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
