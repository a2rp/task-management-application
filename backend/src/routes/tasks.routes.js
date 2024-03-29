const express = require("express");
const { createATask, getAllTasks, getATask, updateATask, deleteATask } = require("../controllers/tasks.controllers");
const router = express.Router();

router.post("/", createATask);
router.get("/", getAllTasks);
router.get("/:id", getATask);
router.patch("/:id", updateATask);
router.delete("/:id", deleteATask);

module.exports = router;

