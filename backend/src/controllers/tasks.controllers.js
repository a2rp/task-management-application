const pool = require("../utils/db");

module.exports.createATask = async (req, res) => {
    try {
        console.log(req.body, "req.body");
        if (!req.body.title
            || !req.body.description
            || !req.body.status
            || !req.body.due_date) {
            throw new Error("All fields are required");
        }

        if (!req.body.title.trim().match(/^[a-z0-9 ]{3,50}$/i)) {
            throw new Error("Title must contain only alphabets, numbers and spaces between 3 to 50 charactres");
        }

        if (req.body.description.trim().length < 10 || req.body.description.trim().length > 255) {
            throw new Error("Description must be between 10 to 255 charactres");
        }

        if (req.body.status !== "Added" && req.body.status !== "In progress" && req.body.status !== "Cancelled" && req.body.status !== "Completed") {
            throw new Error("Invalid status value");
        }

        const data = {
            title: req.body.title.trim(),
            description: req.body.description.trim(),
            status: "Added",
            due_date: req.body.due_date.trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        const newTask = await pool.query("INSERT INTO TASKS (title, description, status, due_date, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [data.title, data.description, data.status, data.due_date, data.created_at, data.updated_at]);
        res.json({ success: true, message: "Task created successfully", task: { ...newTask.rows } });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};

module.exports.getAllTasks = async (req, res) => {
    try {
        const allTasks = await pool.query("select * from tasks order by id desc");
        if (allTasks.rows.length === 0) {
            throw new Error("Tasks not found.");
        }
        console.log(allTasks.rows, "taskskrows");
        res.json({ success: true, message: "All tasks fetched successfully", tasks: allTasks.rows });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};

module.exports.getATask = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error("Id is required");
        }
        const task = await pool.query("select * from tasks where id = $1", [req.params.id]);
        if (task.rows.length === 0) {
            throw new Error("Task not found");
        }
        res.json({ success: true, message: "Task fetched successfully", task: { ...task.rows } });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};

module.exports.updateATask = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error("Id is required");
        }
        if (!req.body.status) {
            throw new Error("Status is required");
        }
        const updatedTask = await pool.query("update tasks set status = $1, updated_at = $2 where id = $3", [req.body.status, new Date().toISOString(), req.params.id]);
        // console.log(updatedTask, "updatedTask");
        if (updatedTask.rowCount === 0) {
            throw new Error("No row updated")
        }
        res.json({ success: true, message: "Task updated successfully" });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};

module.exports.deleteATask = async (req, res) => {
    try {
        console.log(req.params.id, "params");
        if (!req.params) {
            throw new Error("Missing parameters.");
        }
        const deleteTask = await pool.query("delete from tasks where id = $1", [req.params.id]);
        // console.log(deleteTask, "response");
        if (deleteTask.rowCount === 0) {
            throw new Error("No row deleted")
        }
        res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.log(error, "delete task error");
        res.json({ success: false, error: error.message });
    }
};




