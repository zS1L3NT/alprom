import admin from "firebase-admin"
import config from "./config.json"
import cors from "cors"
import express from "express"
import path from "path"
import withErrorHandling from "./functions/withErrorHandling"
import { readdirSync } from "fs"

const PORT = 8945
const app = express()

app.use(cors())
app.use(express.json())

admin.initializeApp({
	credential: admin.credential.cert(config.firebase.service_account),
})

const readRouteFolder = (folderName: string) => {
	const folderPath = path.join(__dirname, "routes", folderName)

	for (const entityName of readdirSync(folderPath)) {
		const [fileName, extensionName] = entityName.split(".")
		const pathName = `${folderName}/${fileName}`

		if (extensionName) {
			// Entity is a file
			const file = require(path.join(folderPath, entityName)) as Record<any, any>
			for (const [method, handler] of Object.entries(file)) {
				app[method.toLowerCase() as "get" | "post" | "put" | "delete"](
					pathName.replace(/\[(\w+)\]/g, ":$1"),
					withErrorHandling(handler)
				)
			}
		} else {
			readRouteFolder(pathName)
		}
	}
}

readRouteFolder("")

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))