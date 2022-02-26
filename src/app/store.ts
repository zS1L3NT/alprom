import letters from "./slices/letters"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
	reducer: { letters },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
