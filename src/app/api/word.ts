import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const wordApi = createApi({
	reducerPath: "word",
	baseQuery: fetchBaseQuery({ baseUrl: "https://alprom.loca.lt/" }),
	endpoints: (builder) => ({
		getNextRound: builder.mutation<{ word: string }, { code: number, username: string }>({
			query: (body) => ({
				url: `next-round`,
				method: "POST",
				body
			})
		})
	})
})