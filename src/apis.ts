import { initializeApp } from "firebase-admin"
import { cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

import Room from "./models/Room"

export const firebaseApp = initializeApp({
	credential: cert({
		projectId: process.env.FIREBASE__SERVICE_ACCOUNT__PROJECT_ID,
		clientEmail: process.env.FIREBASE__SERVICE_ACCOUNT__CLIENT_EMAIL,
		privateKey: process.env.FIREBASE__SERVICE_ACCOUNT__PRIVATE_KEY
	})
})

export const firestore = getFirestore(firebaseApp)
export const roomCollection = firestore.collection("rooms").withConverter(Room.converter)
