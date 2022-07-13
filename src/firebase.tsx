import { initializeApp } from "firebase/app"
import { collection, getFirestore } from "firebase/firestore"

import Room from "./models/Room"

export const firebase = initializeApp({
	apiKey: "AIzaSyAbgXTk0SHkf9qK5sBC4_GnvJGjZv2wkVU",
	authDomain: "innova-alprom.firebaseapp.com",
	projectId: "innova-alprom",
	storageBucket: "innova-alprom.appspot.com",
	messagingSenderId: "312790454055",
	appId: "1:312790454055:web:f7545731ade118cb29e302",
	measurementId: "G-PY1W5KFMTN"
})

export const firestore = getFirestore(firebase)
export const roomsColl = collection(firestore, "rooms").withConverter(Room.converter)
