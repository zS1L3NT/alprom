import cors from "cors"
import express from "express"
import admin from "firebase-admin"
import fs from "fs"
import path from "path"

import config from "./config.json"
import { iRoute } from "./setup"

const PORT = 8945
const app = express()

app.use(cors())
app.use(express.json())

admin.initializeApp({
	credential: admin.credential.cert(config.firebase.service_account)
})

const readRouteFolder = (folderName: string) => {
	const folderPath = path.join(__dirname, "routes", folderName)

	for (const entityName of fs.readdirSync(folderPath)) {
		const [fileName, extensionName] = entityName.split(".")
		const pathName = `${folderName}/${fileName}`

		if (extensionName) {
			// Entity is a file
			const file = require(path.join(folderPath, entityName)) as Record<string, iRoute>
			for (const [method, Route] of Object.entries(file)) {
				app[method.toLowerCase() as "get" | "post" | "put" | "delete"](
					"/api" + pathName.replace(/\[(\w+)\]/g, ":$1"),
					(req, res) => new Route(req, res).setup()
				)
			}
		} else {
			readRouteFolder(pathName)
		}
	}
}

readRouteFolder("")

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
