require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 1198;
const tasksRoutes = require("./src/routes/tasks.routes");

app.use(cors());
app.use(express.json());

app.use("/api/v1/task", tasksRoutes);

app.listen(PORT, console.log(`server listening on port http://localhost:${PORT}`));

