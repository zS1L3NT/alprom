import { useDispatch } from "react-redux"

/**
 * The useDispatch() hook configured with the app's dispatch type
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()
