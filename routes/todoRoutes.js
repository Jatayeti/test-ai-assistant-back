const express = require("express");
const router = express.Router();
const { connection } = require("../migrate"); // Подключаем MySQL-пул соединений

// Получить все тудушки (Read)
router.get("/", async (req, res) => {
    try {
        const [todos] = await connection.query("SELECT * FROM todos ORDER BY created_at DESC");
        res.json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

// Создать новую тудушку (Create)
router.post("/", async (req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    try {
        const [result] = await connection.query(
            "INSERT INTO todos (title, description) VALUES (?, ?)",
            [title, description]
        );
        res.status(201).json({ id: result.insertId, title, description, completed: false });
    } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ error: "Failed to create todo" });
    }
});

// Обновить тудушку (Update)
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    try {
        const [existingTodo] = await connection.query("SELECT * FROM todos WHERE id = ?", [id]);
        if (existingTodo.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        // Если title и description не переданы, используем старые данные
        const newTitle = title || existingTodo[0].title;
        const newDescription = description || existingTodo[0].description;
        const newCompleted = completed !== undefined ? completed : existingTodo[0].completed;

        await connection.query(
            "UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ?",
            [newTitle, newDescription, newCompleted, id]
        );

        res.json({ message: "Todo updated successfully" });
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ error: "Failed to update todo" });
    }
});

// Удалить тудушку (Delete)
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await connection.query("DELETE FROM todos WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ error: "Failed to delete todo" });
    }
});

module.exports = router;
