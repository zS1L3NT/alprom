import { TypedUseSelectorHook, useSelector } from "react-redux"

/**
 * An enhanced selector configured for the app's state.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
