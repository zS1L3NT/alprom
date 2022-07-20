import { cert, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

import { roomConverter } from "./models/Room"

export const firebaseApp = initializeApp({
	credential: cert({
		projectId: process.env.FIREBASE__SERVICE_ACCOUNT__PROJECT_ID,
		clientEmail: process.env.FIREBASE__SERVICE_ACCOUNT__CLIENT_EMAIL,
		privateKey: process.env.FIREBASE__SERVICE_ACCOUNT__PRIVATE_KEY
	})
})

export const firestore = getFirestore(firebaseApp)
export const roomsColl = firestore.collection("rooms").withConverter(roomConverter)
