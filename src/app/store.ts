import letters from "./slices/letters"
import room from "./slices/room"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
	reducer: { letters, room },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
