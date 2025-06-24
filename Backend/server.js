const express = require("express")
const mongoose = require("mongoose")
const app = express()
const routes = require("./routes/user-route")
const taskRoute = require("./routes/taskRoute")
const cors = require("cors")
require("dotenv").config()

const PORT = process.env.PORT;
const URI = process.env.MONGO_URI;

app.use(cors())
app.use(express.json())
app.use("/api", routes)
app.use("/api", taskRoute)

mongoose.connect(URI)
.then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})
.catch(() => {
    console.log("Failed to connect")
})
